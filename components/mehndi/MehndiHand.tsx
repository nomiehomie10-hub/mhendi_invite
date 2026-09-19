"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion, useReveal } from "@/lib/mehndi/hooks";
import { HAND_SHAPES, buildHandMehndi } from "./handGeometry";
import styles from "./MehndiHand.module.css";

const STROKES = buildHandMehndi();
/** Each stroke overlaps its neighbours so the line flows instead of ticking. */
const OVERLAP = 8;

export function MehndiHand() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.35 });
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const raf = useRef(0);
  const last = useRef(0);
  const clipId = useId();

  const done = progress >= 1;

  // Holding down lets the henna flow; letting go stops it where it is.
  useEffect(() => {
    if (!drawing || reduced) return;
    last.current = performance.now();
    const step = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setProgress((p) => Math.min(1, p + dt / 4));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [drawing, reduced]);

  const fill = useCallback(() => setProgress(1), []);

  const shownProgress = reduced ? 1 : shown ? progress : 0;
  const n = STROKES.length;

  const handShapes = <path d={HAND_SHAPES.outline} />;

  return (
    <section
      ref={ref}
      className={`chapter chapter--full paper ${styles.section}`}
      aria-labelledby="hand-heading"
    >
      <div className={`stage ${styles.stage}`}>
        <h2 id="hand-heading" className={`display ${styles.heading}`}>
          Apply the mehndi
        </h2>

        <div
          className={styles.hand}
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
            viewBox={HAND_SHAPES.viewBox}
            className={styles.svg}
            role="img"
            aria-label="A hand that fills with bridal mehndi as you hold it"
          >
            <defs>
              {/* Henna cannot stray off the skin. */}
              <clipPath id={clipId}>{handShapes}</clipPath>
              <radialGradient id={`${clipId}-light`} cx="44%" cy="46%" r="58%">
                <stop offset="0%" stopColor="#f3d6b6" />
                <stop offset="100%" stopColor="#e3bd98" />
              </radialGradient>
            </defs>

            {/* the hand itself, lit softly from the palm outward */}
            <g className={styles.skin}>
              <path d={HAND_SHAPES.outline} fill={`url(#${clipId}-light)`} />
            </g>
            {/* an inner edge, clipped so only the inside half of it shows */}
            <g clipPath={`url(#${clipId})`}>
              <path d={HAND_SHAPES.outline} className={styles.edge} />
            </g>

            <g clipPath={`url(#${clipId})`}>
              {/* a faint stencil, so there is visibly something to fill in */}
              <g className={styles.guide} data-done={done}>
                {STROKES.map((s, i) => (
                  <path key={i} d={s.d} transform={s.transform} />
                ))}
              </g>

              <g className={styles.ink}>
                {STROKES.map((s, i) => {
                  const start = i / (n + OVERLAP);
                  const span = OVERLAP / (n + OVERLAP);
                  const local = Math.max(
                    0,
                    Math.min(1, (shownProgress - start) / span)
                  );
                  // A round line cap renders a zero-length dash as a dot, so
                  // a stroke that has not begun is left out entirely rather
                  // than speckling the stencil.
                  if (local <= 0) return null;
                  return (
                    <path
                      key={i}
                      d={s.d}
                      pathLength={1}
                      transform={s.transform}
                      style={{ strokeDashoffset: 1 - local }}
                    />
                  );
                })}
              </g>
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
            ? "Save this one for the night — the bride's hands will be busy."
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
