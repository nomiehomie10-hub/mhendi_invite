/**
 * Every piece of content in the invitation lives here.
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
  phase: "nikkah" | "mehndi";
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
    first: "Nikkah",
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

  /**
   * The wreath carries the invitation in the couple's words — deliberately
   * not the wording on the printed card, which the formal chapter above it
   * already states.
   */
  couplePanel: {
    body: "We warmly invite you to join us for our Nikkah and Mehndi, as we celebrate this beautiful beginning surrounded by love, laughter and the people who mean most to us.",
    hosts: "",
  },

  celebration: {
    eyebrow: "The Evening",
    headline: ["First the promise.", "Then the dhol."],
  },

  timeline: {
    eyebrow: "The Night Ahead",
    title: "The Night",
    /** Shown where the ceremony gives way to the celebration. */
    turn: "The vows are made. Now the celebration begins.",
  },

  closing: {
    headline: ["Come celebrate", "with us"],
    signoff: "With love",
  },

  events: [
    {
      time: "19:00",
      title: "Arrival of Guests",
      description: "Chilled sharbat under the garlands as everyone arrives.",
      icon: "sharbat",
      phase: "nikkah",
    },
    {
      time: "20:00",
      title: "The Nikkah",
      description: "The ceremony, and the moment everything is promised.",
      icon: "entrance-arch",
      phase: "nikkah",
    },
    {
      time: "21:00",
      title: "Dinner",
      description: "Served under the lanterns, as the evening settles in.",
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
     * Candidate paths for the ambient track, tried in order; missing files
     * are fine, and with none of them present the control never appears.
     *
     * AAC leads because it is half the weight of the MP3 at a quality that
     * is indistinguishable for background music, and it is what iOS decodes
     * natively. The MP3 stays behind it as the fallback.
     */
    sources: ["/audio/mehndi.m4a", "/audio/mehndi.mp3", "/audio/mehndi.ogg"],
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
