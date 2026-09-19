"use client";

import { ICON_SOURCES, mehndi, type MehndiEvent } from "@/data/mehndi";
import { useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./MehndiTimeline.module.css";

/**
 * One moment in the evening. As it arrives the icon prints itself onto the
 * paper, the text lifts, and the botanical line grows a little further down.
 */
function TimelineEvent({ event, last }: { event: MehndiEvent; last: boolean }) {
  const { ref, shown } = useReveal<HTMLLIElement>({
    threshold: 0.4,
    rootMargin: "0px 0px -12% 0px",
  });

  return (
    <li ref={ref} className={styles.event} data-shown={shown}>
      <span className={styles.spine} aria-hidden="true">
        {!last && <span className={`${styles.line} draw`} data-shown={shown} />}
        <span className={styles.node} />
      </span>

      <span className={`${styles.iconWrap} wash`} data-shown={shown}>
        <Artwork
          src={ICON_SOURCES[event.icon]}
          alt=""
          width={360}
          height={540}
          sizes="86px"
          className={styles.icon}
        />
      </span>

      <span className={styles.text}>
        <span
          className={`label ${styles.time} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
        >
          {event.time}
        </span>
        <span
          className={`serif ${styles.title} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
        >
          {event.title}
        </span>
        {event.description && (
          <span
            className={`${styles.description} reveal`}
            data-shown={shown}
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
          >
            {event.description}
          </span>
        )}
      </span>
    </li>
  );
}

export function MehndiTimeline() {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`chapter chapter--ivory paper ${styles.section}`}
      aria-labelledby="timeline-heading"
    >
      <span className={styles.wallpaper} aria-hidden="true" />

      <div className={`stage ${styles.stage}`}>
        <header className={styles.head}>
          <p className={`label ${styles.eyebrow} reveal`} data-shown={shown}>
            {mehndi.timeline.eyebrow}
          </p>
          <h2
            id="timeline-heading"
            className={`display ${styles.title2} reveal`}
            data-shown={shown}
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            {mehndi.timeline.title}
          </h2>
        </header>

        <ol className={styles.list}>
          {mehndi.events.map((event, i) => (
            <TimelineEvent
              key={event.time + event.title}
              event={event}
              last={i === mehndi.events.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
