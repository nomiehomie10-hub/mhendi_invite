"use client";

import { mehndi } from "@/data/mehndi";
import { useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import { OccasionLockup } from "./OccasionLockup";
import styles from "./FormalInvitation.module.css";

/**
 * The formal wording, set the way it would be printed on the card: who is
 * invited, to what, and on whose behalf. This is the one chapter that is
 * almost entirely typographic — the artwork stays at the edges and lets the
 * two families hold the middle.
 */
export function FormalInvitation() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.2 });
  const { formal } = mehndi;

  type Party = { relation: string; parents: string };

  const side = (name: string, person: Party, delay: number, label: string) => (
    <div
      className={`${styles.person} reveal`}
      data-shown={shown}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      <p className={`serif ${styles.name}`}>{name}</p>
      <p className={`label ${styles.relation}`}>
        <span className="sr-only">{label} </span>
        {person.relation}
      </p>
      <p className={`serif ${styles.parents}`}>{person.parents}</p>
    </div>
  );

  return (
    <section
      ref={ref}
      className={`chapter chapter--ivory paper ${styles.section}`}
      aria-labelledby="formal-heading"
    >
      {/* Botanical sprays hold the two top corners of the card. */}
      <div className={`${styles.spray} ${styles.sprayLeft} wash`} data-shown={shown}>
        <Artwork
          src="/images/mehndi/botanical/corner-spray.webp"
          alt=""
          width={590}
          height={1280}
          sizes="150px"
          className={styles.sprayArt}
        />
      </div>
      <div
        className={`${styles.spray} ${styles.sprayRight} wash`}
        data-shown={shown}
        style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
      >
        <Artwork
          src="/images/mehndi/botanical/corner-spray.webp"
          alt=""
          width={590}
          height={1280}
          sizes="150px"
          className={styles.sprayArt}
        />
      </div>

      <div className={`stage ${styles.stage}`}>
        <h2 id="formal-heading" className={`label ${styles.lead} reveal`} data-shown={shown}>
          {formal.lead}
        </h2>

        <div
          className={`${styles.occasion} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          <OccasionLockup tone="ink" size="md" />
        </div>

        <p
          className={`${styles.of} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
        >
          {formal.of}
        </p>

        {side(mehndi.couple.bride, formal.bride, 280, "Bride,")}

        <p
          className={`amp ${styles.joiner} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
        >
          {formal.joiner}
        </p>

        {side(mehndi.couple.groom, formal.groom, 480, "Groom,")}
      </div>
    </section>
  );
}
