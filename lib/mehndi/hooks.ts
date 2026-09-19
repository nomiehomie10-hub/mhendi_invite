"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** True once the user has asked their OS to keep motion to a minimum. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * Marks an element as shown the first time it reaches the viewport, so the
 * CSS reveal classes can take it from there. One observer, no scroll handler.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  const { threshold = 0.18, rootMargin = "0px 0px -8% 0px" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    // Deferred to the next frame: setting state straight from an effect body
    // forces a cascading render, and nothing here needs to be that eager.
    const show = () => {
      raf = requestAnimationFrame(() => setShown(true));
    };

    if (typeof IntersectionObserver === "undefined") {
      show();
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        // Reveal on arrival, but also for anything the viewport has already
        // passed: a jump-scroll can skip an element entirely, and content
        // must never be left permanently invisible.
        const passed = entry.boundingClientRect.bottom <= 0;
        if (entry.isIntersecting || passed) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);

    // Anything already scrolled past on mount is shown straight away.
    if (el.getBoundingClientRect().bottom <= 0) show();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, shown };
}

/**
 * Very slow parallax driven off a single scroll listener and one rAF frame.
 * `depth` is a fraction of the element's travel: 0.08 background, 0.22 fore.
 * Movement is written straight to a CSS variable to avoid re-rendering.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(depth: number) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    let visible = true;

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
            rootMargin: "20% 0px",
          })
        : null;
    io?.observe(el);

    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 when the element is just below the fold, +1 when just above it.
      // Clamped, because an element far off-screen would otherwise translate
      // further than its own overhang and expose the edge behind it.
      const raw = (rect.top + rect.height / 2 - vh / 2) / vh;
      const progress = Math.max(-1, Math.min(1, raw));
      el.style.setProperty("--parallax", `${(progress * depth * vh).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
    };
  }, [depth, reduced]);

  return ref;
}

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
};

const EMPTY: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0, past: false };

function remainingFrom(target: number, now: number): Remaining {
  const ms = target - now;
  if (ms <= 0) return { ...EMPTY, past: true };
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    past: false,
  };
}

/**
 * Live countdown to an absolute instant. The target carries its own UTC
 * offset, so the result is identical in every timezone.
 *
 * It returns null until the first client tick: the server has no idea what
 * "now" is for this guest, and rendering a guess would mismatch on hydration.
 */
export function useCountdown(isoTarget: string): Remaining | null {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  const target = useRef(new Date(isoTarget).getTime());

  const tick = useCallback(() => {
    setRemaining(remainingFrom(target.current, Date.now()));
  }, []);

  useEffect(() => {
    tick();
    // Land close to the top of each second so the digits don't drift.
    let timeout = 0;
    let interval = 0;
    timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [tick]);

  return remaining;
}
