"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion, useReveal } from "@/lib/mehndi/hooks";
import { HAND_SHAPES, THUMB, buildHandMehndi } from "./handGeometry";
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

  const handShapes = (
    <>
      <path d={HAND_SHAPES.palm} />
      {HAND_SHAPES.fingers.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <path
        d={HAND_SHAPES.thumb}
        transform={`rotate(${THUMB.rotate} ${THUMB.originX} ${THUMB.originY})`}
      />
    </>
  );

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
            viewBox="0 0 400 620"
            className={styles.svg}
            role="img"
            aria-label="A hand that fills with bridal mehndi as you hold it"
          >
            <defs>
              {/* Henna cannot stray off the skin. */}
              <clipPath id={clipId}>{handShapes}</clipPath>
            </defs>

            {/* the hand itself */}
            <g className={styles.skin}>{handShapes}</g>

            <g clipPath={`url(#${clipId})`}>
              {/* a faint stencil, so there is visibly something to fill in */}
              <g className={styles.guide} data-done={done}>
                {STROKES.map((s, i) => (
                  <path
                    key={i}
                    d={s.d}
                    transform={
                      s.rotate ? `rotate(${s.rotate} ${s.cx} ${s.cy})` : undefined
                    }
                  />
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
                  return (
                    <path
                      key={i}
                      d={s.d}
                      pathLength={1}
                      transform={
                        s.rotate ? `rotate(${s.rotate} ${s.cx} ${s.cy})` : undefined
                      }
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
