"use client";

import { mehndi } from "@/data/mehndi";
import { useParallax, useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./VenueSection.module.css";

/**
 * The venue chapter. The painted scene at dusk fills the screen and the
 * address is set over it; the map is one small brass line of type, not an
 * embedded panel.
 */
export function VenueSection() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.25 });
  const art = useParallax<HTMLDivElement>(0.1);
  const { venue } = mehndi;

  return (
    <section
      ref={ref}
      className={`chapter chapter--full ${styles.section}`}
      aria-labelledby="venue-heading"
    >
      <div ref={art} className={styles.bg}>
        <Artwork
          src="/images/mehndi/venue/arch-evening.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 560px"
          className={styles.bgArt}
        />
        <span className={styles.veil} aria-hidden="true" />
      </div>

      <div className={`stage ${styles.stage}`}>
        <h2
          id="venue-heading"
          className={`label ${styles.eyebrow} reveal`}
          data-shown={shown}
        >
          The Venue
        </h2>

        <p
          className={`serif ${styles.name} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          {venue.name}
        </p>

        <address
          className={`${styles.address} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
        >
          <span>{venue.address}</span>
          <span>
            {venue.city}, {venue.country}
          </span>
        </address>

        <div
          className={`${styles.mapWrap} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "340ms" } as React.CSSProperties}
        >
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={`label tap-target ${styles.map}`}
            aria-label={`View ${venue.name} on Google Maps, opens in a new tab`}
          >
            <span>View map</span>
            <svg
              className={styles.arrow}
              viewBox="0 0 14 14"
              width="11"
              height="11"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 11L11 3M11 3H5M11 3v6"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
