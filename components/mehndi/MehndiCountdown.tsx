"use client";

import { mehndi } from "@/data/mehndi";
import { useCountdown, useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./MehndiCountdown.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The countdown, set as painted poster numerals inside a botanical frame.
 * Until the first client tick it holds its layout with placeholder digits,
 * so nothing shifts and the server and client agree on the markup.
 */
export function MehndiCountdown() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.3 });
  const remaining = useCountdown(mehndi.startsAt);

  const units: Array<{ value: string; label: string }> = [
    { value: remaining ? String(remaining.days) : "—", label: "Days" },
    { value: remaining ? pad(remaining.hours) : "—", label: "Hours" },
    { value: remaining ? pad(remaining.minutes) : "—", label: "Minutes" },
    { value: remaining ? pad(remaining.seconds) : "—", label: "Seconds" },
  ];

  return (
    <section
      ref={ref}
      className={`chapter chapter--full chapter--deep pigment ${styles.section}`}
      aria-labelledby="countdown-heading"
    >
      <div className={`${styles.frame} wash`} data-shown={shown} aria-hidden="true">
        <Artwork
          src="/images/mehndi/ornament/mughal-arch-frame.webp"
          alt=""
          width={590}
          height={1280}
          sizes="(max-width: 640px) 100vw, 480px"
          className={styles.frameArt}
        />
      </div>

      <div className={`stage ${styles.stage}`}>
        <h2
          id="countdown-heading"
          className={`label ${styles.eyebrow} reveal`}
          data-shown={shown}
        >
          {remaining?.past ? "The courtyard is open" : "Until the courtyard opens"}
        </h2>

        {remaining?.past ? (
          <p className={`serif ${styles.past} reveal`} data-shown={shown}>
            Tonight
          </p>
        ) : (
          <ol
            className={styles.units}
            aria-live="off"
            aria-label="Time remaining until the Mehndi"
          >
            {units.map((unit, i) => (
              <li
                key={unit.label}
                className={`${styles.unit} reveal`}
                data-shown={shown}
                style={
                  { "--reveal-delay": `${120 + i * 90}ms` } as React.CSSProperties
                }
              >
                <span className={`display ${styles.number}`}>{unit.value}</span>
                <span className={`label ${styles.unitLabel}`}>{unit.label}</span>
              </li>
            ))}
          </ol>
        )}

      </div>
    </section>
  );
}
