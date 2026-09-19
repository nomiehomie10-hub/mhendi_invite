"use client";

import { mehndi } from "@/data/mehndi";

type Listener = (state: AudioState) => void;
export type AudioState = { available: boolean; playing: boolean };

/**
 * The ambient track.
 *
 * iOS only lets audio start inside a user gesture, and a `play()` called from
 * a React effect has already left that gesture behind. So this is a plain
 * module-level controller: `start()` is invoked synchronously from the entry
 * tap's own handler, which is the only moment iOS will honour.
 *
 * It is entirely optional. If no file is present every candidate source
 * fails, `available` stays false, and the control never appears.
 */
class MehndiAudio {
  private el: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private sourceIndex = 0;
  private fadeFrame = 0;
  private state: AudioState = { available: false, playing: false };

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.state);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit(next: Partial<AudioState>) {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((fn) => fn(this.state));
  }

  /** Called straight from the entry tap, inside the gesture. */
  start() {
    if (typeof window === "undefined" || this.el) return;
    this.el = new Audio();
    this.el.loop = true;
    this.el.preload = "auto";
    this.el.volume = 0;
    // Each candidate is tried in turn, so a guest can drop in an .mp3, .m4a
    // or .ogg without anyone editing code.
    this.el.addEventListener("error", () => this.tryNextSource());
    this.load();
    this.play();
  }

  private load() {
    const src = mehndi.audio.sources[this.sourceIndex];
    if (!this.el || !src) return;
    this.el.src = src;
  }

  private tryNextSource() {
    this.sourceIndex += 1;
    if (this.sourceIndex >= mehndi.audio.sources.length) {
      this.emit({ available: false, playing: false });
      return;
    }
    this.load();
    this.play();
  }

  private play() {
    if (!this.el) return;
    this.el
      .play()
      .then(() => {
        this.emit({ available: true, playing: true });
        this.fade(mehndi.audio.volume, 2600);
      })
      .catch(() => {
        // A refused autoplay still means the file is there to offer.
        this.emit({ playing: false });
      });
  }

  toggle() {
    const el = this.el;
    if (!el) return;
    if (this.state.playing) {
      this.fade(0, 480, () => el.pause());
      this.emit({ playing: false });
    } else {
      el.volume = 0;
      el
        .play()
        .then(() => {
          this.emit({ available: true, playing: true });
          this.fade(mehndi.audio.volume, 1300);
        })
        .catch(() => this.emit({ available: false, playing: false }));
    }
  }

  /** Music should arrive, not switch on. */
  private fade(to: number, ms: number, done?: () => void) {
    const el = this.el;
    if (!el) return;
    cancelAnimationFrame(this.fadeFrame);
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * (1 - (1 - t) ** 3)));
      if (t < 1) this.fadeFrame = requestAnimationFrame(step);
      else done?.();
    };
    this.fadeFrame = requestAnimationFrame(step);
  }
}

export const mehndiAudio = new MehndiAudio();
