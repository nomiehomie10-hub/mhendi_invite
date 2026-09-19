"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion, useReveal } from "@/lib/mehndi/hooks";
import styles from "./MehndiMandala.module.css";

/**
 * The geometry of a gol tikki — the round mehndi motif that goes on the palm.
 *
 * Built from the centre outward so it draws the way henna is actually
 * applied. Every path is pure geometry with no randomness, so the server and
 * the client generate exactly the same markup.
 */
type Stroke = { d: string; rotate: number };

function buildMandala(): Stroke[] {
  const paths: Stroke[] = [];
  const ring = (count: number, d: string) => {
    for (let i = 0; i < count; i++) {
      paths.push({ d, rotate: (360 / count) * i });
    }
  };

  // the seed at the centre
  paths.push({ d: "M 0 -9 A 9 9 0 1 1 0 9 A 9 9 0 1 1 0 -9 Z", rotate: 0 });
  ring(8, "M 0 -12 C 5 -18 8 -24 0 -30 C -8 -24 -5 -18 0 -12 Z");

  // first ring of lotus petals
  ring(12, "M 0 -34 C 9 -42 13 -54 0 -66 C -13 -54 -9 -42 0 -34 Z");
  ring(12, "M 0 -68 L 0 -76");

  // a band of paisley, the shape that makes it unmistakably mehndi
  ring(
    10,
    "M 0 -80 C 13 -88 20 -101 11 -114 C 4 -124 -10 -123 -14 -113 C -18 -104 -11 -96 -3 -99 C -9 -92 -7 -85 0 -80 Z"
  );
  ring(10, "M -5 -104 A 5 5 0 1 1 5 -104 A 5 5 0 1 1 -5 -104 Z");

  // vine and dots
  ring(20, "M 0 -122 A 4 4 0 1 1 0 -130 A 4 4 0 1 1 0 -122 Z");
  ring(
    12,
    "M 0 -136 C 10 -144 10 -158 0 -166 C -10 -158 -10 -144 0 -136 Z"
  );

  // the scalloped edge
  ring(18, "M -12 -172 A 13 13 0 0 1 12 -172");
  ring(18, "M 0 -186 L 0 -192");

  return paths;
}

const PATHS = buildMandala();
/** Each stroke overlaps its neighbours so the line flows instead of ticking. */
const OVERLAP = 6;

export function MehndiMandala() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.4 });
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const raf = useRef(0);
  const last = useRef(0);

  const done = progress >= 1;

  // Holding down lets the henna flow; letting go stops it where it is.
  useEffect(() => {
    if (!drawing || reduced) return;
    last.current = performance.now();
    const step = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setProgress((p) => Math.min(1, p + dt / 3.4));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [drawing, reduced]);

  // Nothing here should depend on being able to hold a finger down.
  const fill = useCallback(() => setProgress(1), []);

  const shownProgress = reduced || !shown ? (reduced ? 1 : 0) : progress;
  const n = PATHS.length;

  return (
    <section
      ref={ref}
      className={`chapter chapter--full paper ${styles.section}`}
      aria-labelledby="mandala-heading"
    >
      <div className={`stage ${styles.stage}`}>
        <h2 id="mandala-heading" className={`display ${styles.heading}`}>
          Apply the mehndi
        </h2>

        <div
          className={styles.palm}
          data-done={done}
          data-drawing={drawing}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrawing(true);
          }}
          onPointerUp={() => setDrawing(false)}
          onPointerCancel={() => setDrawing(false)}
          onPointerLeave={() => setDrawing(false)}
        >
          <svg
            viewBox="-210 -210 420 420"
            className={styles.svg}
            role="img"
            aria-label="A round mehndi motif that fills in as you hold it"
          >
            {/* A faint stencil of the finished motif, so the guest can see
                what there is to fill in before they touch anything. */}
            <g className={styles.guide} data-done={done}>
              {PATHS.map((stroke, i) => (
                <path
                  key={i}
                  d={stroke.d}
                  transform={`rotate(${stroke.rotate})`}
                />
              ))}
            </g>

            <g className={styles.ink}>
              {PATHS.map((stroke, i) => {
                // Each stroke owns a slice of the total, with its neighbours
                // overlapping, so the pattern grows outward in one motion.
                const start = i / (n + OVERLAP);
                const span = OVERLAP / (n + OVERLAP);
                const local = Math.max(
                  0,
                  Math.min(1, (shownProgress - start) / span)
                );
                // A round line cap renders a zero-length dash as a dot, so a
                // stroke that has not begun is left out rather than speckling
                // the stencil.
                if (local <= 0) return null;
                return (
                  <path
                    key={i}
                    d={stroke.d}
                    pathLength={1}
                    transform={`rotate(${stroke.rotate})`}
                    style={{ strokeDashoffset: 1 - local }}
                  />
                );
              })}
            </g>
          </svg>

          {!reduced && (
            <span className={styles.hint} aria-hidden="true">
              {done ? "Beautiful" : drawing ? "" : "Press and hold"}
            </span>
          )}
        </div>

        <p className={styles.caption}>
          {done
            ? "Save this one for the night \u2014 the bride's hands will be busy."
            : "A gol tikki, the way it goes on the palm."}
        </p>

        {!reduced && !done && (
          <button type="button" onClick={fill} className={`label ${styles.skip}`}>
            Fill it in
          </button>
        )}
      </div>
    </section>
  );
}
