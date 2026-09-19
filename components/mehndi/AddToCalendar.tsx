"use client";

import { useCallback, useState } from "react";
import { mehndi } from "@/data/mehndi";
import styles from "./AddToCalendar.module.css";

/** An ICS timestamp in UTC: 20261009T140000Z */
function stamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Long lines have to be folded at 75 octets or calendar apps reject them. */
function fold(line: string) {
  if (line.length <= 73) return line;
  const parts = [line.slice(0, 73)];
  let rest = line.slice(73);
  while (rest.length > 72) {
    parts.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  parts.push(" " + rest);
  return parts.join("\r\n");
}

const escape = (s: string) => s.replace(/([,;\\])/g, "\\$1");

function buildIcs() {
  const { venue, couple } = mehndi;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nikkah and Mehndi//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:mehndi-${mehndi.date}@mehndi.invite`,
    `DTSTAMP:${stamp(mehndi.startsAt)}`,
    `DTSTART:${stamp(mehndi.startsAt)}`,
    `DTEND:${stamp(mehndi.endsAt)}`,
    fold(
      `SUMMARY:${mehndi.occasion.first} & ${mehndi.occasion.second} — ${escape(
        couple.bride
      )} & ${escape(couple.groom)}`
    ),
    fold(
      `LOCATION:${escape(
        [venue.name, venue.address, venue.city].filter(Boolean).join(", ")
      )}`
    ),
    fold(`DESCRIPTION:${escape(mehndi.couplePanel.body)}`),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/**
 * Hands the guest a calendar file. Built in the browser so there is no
 * endpoint to deploy, and the date can never drift from `data/mehndi.ts`.
 */
export function AddToCalendar() {
  const [saved, setSaved] = useState(false);

  const save = useCallback(() => {
    const blob = new Blob([buildIcs()], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mehndi.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Give the download a moment to start before the blob goes away.
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    setSaved(true);
  }, []);

  return (
    <button
      type="button"
      onClick={save}
      className={`label tap-target ${styles.button}`}
      aria-label={`Save the ${mehndi.occasion.first} and ${mehndi.occasion.second} to your calendar, ${mehndi.displayDate}`}
    >
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true">
        <rect
          x="1.4"
          y="2.6"
          width="11.2"
          height="10"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M1.4 5.8h11.2M4.6 1.4v2.4M9.4 1.4v2.4"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
      <span>{saved ? "Saved" : "Save the date"}</span>
    </button>
  );
}
