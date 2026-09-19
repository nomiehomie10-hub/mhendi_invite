/**
 * Every piece of content in the Mehndi Courtyard experience lives here.
 * Components read from this file and never hardcode names, times or copy.
 */

export type MehndiIcon =
  | "sharbat"
  | "mehndi-cone"
  | "entrance-arch"
  | "dhol"
  | "dinner"
  | "dupatta";

export type MehndiEvent = {
  time: string;
  title: string;
  description: string;
  icon: MehndiIcon;
  /** Which half of the evening this belongs to. */
  phase: "nikah" | "mehndi";
};

export type MehndiDetail = {
  label: string;
  value: string;
  note?: string;
};

export const mehndi = {
  couple: {
    bride: "Dr. Sobia Mariam",
    groom: "Farhan Ullah Khan",
  },

  /**
   * The moment the celebration begins, as an absolute instant.
   * Karachi runs at UTC+05:00 with no daylight saving, so the offset is fixed
   * and the countdown reads the same from anywhere in the world.
   */
  startsAt: "2026-10-09T19:00:00+05:00",
  endsAt: "2026-10-10T00:30:00+05:00",
  date: "2026-10-09",
  displayDate: "09 October 2026",
  displayDay: "Friday",
  displayTime: "19:00 onwards",

  venue: {
    name: "Creek Club",
    address: "DHA Phase VIII",
    city: "Karachi",
    country: "Pakistan",
    mapsUrl: "https://maps.google.com/?q=Creek+Club+DHA+Phase+8+Karachi",
  },

  dressCode: "Festive Pakistani",
  dressCodeNote: "Marigold, mehndi green, anything that catches the light.",

  /** The two halves of the night, used as one lockup throughout. */
  occasion: {
    first: "Nikah",
    second: "Mehndi",
    joiner: "&",
  },

  entry: {
    instruction: "Tap to enter",
  },

  /** The formal wording: who is invited, by whom, and on whose behalf. */
  formal: {
    lead: "You are invited to the",
    of: "of",
    joiner: "with",
    bride: {
      relation: "Daughter of",
      parents: "Mr. & Mrs. Lt Col (R) Ghulam Farooq",
    },
    groom: {
      relation: "Son of",
      parents: "Mr. & Mrs. Maj (R) Shahid Ashraf",
    },
  },

  hero: {
    ampersand: "&",
    footer: "Karachi \u00b7 Friday evening",
  },

  couplePanel: {
    eyebrow: "Dear friends and family",
    body: "Join us for an evening of love, laughter, duas and unforgettable memories as we begin our forever.",
    hosts: "",
  },

  celebration: {
    eyebrow: "The Courtyard",
    headline: "First the promise. Then the dhol.",
  },

  timeline: {
    eyebrow: "The Night Ahead",
    title: "The Night",
    /** Shown where the ceremony gives way to the celebration. */
    turn: "The vows are made. Now the courtyard comes alive.",
  },

  closing: {
    headline: ["Come celebrate", "with us"],
    signoff: "With love",
  },

  events: [
    {
      time: "19:00",
      title: "Arrival of Guests",
      description: "Chilled sharbat under the garlands as the courtyard fills.",
      icon: "sharbat",
      phase: "nikah",
    },
    {
      time: "20:00",
      title: "The Nikah",
      description: "The ceremony, and the moment everything is promised.",
      icon: "entrance-arch",
      phase: "nikah",
    },
    {
      time: "21:00",
      title: "Dinner",
      description: "Served in the courtyard, under the lanterns.",
      icon: "dinner",
      phase: "mehndi",
    },
    {
      time: "Afterwards",
      title: "Mehndi & Dances",
      description: "Dhol, dholki, cones and colour — until the marigolds come down.",
      icon: "dhol",
      phase: "mehndi",
    },
  ] satisfies MehndiEvent[],

  details: [
    { label: "Date", value: "09 October 2026", note: "Friday" },
    { label: "Time", value: "19:00", note: "Onwards" },
    { label: "Venue", value: "Creek Club", note: "DHA Phase VIII, Karachi" },
    { label: "Dress Code", value: "Festive Pakistani" },
  ] satisfies MehndiDetail[],

  audio: {
    /**
     * Drop a file at any one of these paths to enable the ambient track.
     * They are tried in order and missing files are fine — with none of them
     * present the control never appears.
     */
    sources: ["/audio/mehndi.mp3", "/audio/mehndi.m4a", "/audio/mehndi.ogg"],
    /** Ambient, not a performance: it should sit under the room. */
    volume: 0.34,
    label: "Ambient music",
  },
} as const;

export const ICON_SOURCES: Record<MehndiIcon, string> = {
  sharbat: "/images/mehndi/timeline/icon-sharbat.webp",
  "mehndi-cone": "/images/mehndi/timeline/icon-mehndi-cone.webp",
  "entrance-arch": "/images/mehndi/timeline/icon-entrance-arch.webp",
  dhol: "/images/mehndi/timeline/icon-dhol.webp",
  dinner: "/images/mehndi/timeline/icon-dinner.webp",
  dupatta: "/images/mehndi/timeline/icon-dupatta.webp",
};
