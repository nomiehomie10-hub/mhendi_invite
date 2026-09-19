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
};

export type MehndiDetail = {
  label: string;
  value: string;
  note?: string;
};

export const mehndi = {
  couple: {
    bride: "Sobia Mariam",
    groom: "Farhan Ullah Khan",
  },

  /**
   * The moment the celebration begins, as an absolute instant.
   * Dubai runs at UTC+04:00 with no daylight saving, so the offset is fixed
   * and the countdown reads the same from anywhere in the world.
   */
  startsAt: "2027-01-09T18:00:00+04:00",
  date: "2027-01-09",
  displayDate: "09 January 2027",
  displayDay: "Saturday",
  displayTime: "18:00 onwards",

  venue: {
    name: "Al Bustan Courtyard",
    address: "Umm Suqeim Street, Al Barsha",
    city: "Dubai",
    country: "United Arab Emirates",
    mapsUrl: "https://maps.google.com/?q=Al+Barsha+Dubai",
  },

  dressCode: "Festive Pakistani",
  dressCodeNote: "Marigold, mehndi green, anything that catches the light.",

  entry: {
    eyebrow: "Mehndi Night",
    instruction: "Tap to enter",
  },

  hero: {
    eyebrow: "Mehndi Night",
    ampersand: "&",
  },

  couplePanel: {
    eyebrow: "The Celebration",
    body: "Come celebrate an evening of colour, music, laughter and mehndi with us.",
  },

  celebration: {
    eyebrow: "The Courtyard",
    headline: "An evening made for colour, music, laughter and the people we love.",
  },

  timeline: {
    eyebrow: "The Night Ahead",
    title: "The Night",
  },

  closing: {
    headline: ["Come celebrate", "with us"],
    signoff: "With love",
  },

  events: [
    {
      time: "18:00",
      title: "Welcome",
      description: "Chilled sharbat under the garlands as the courtyard fills.",
      icon: "sharbat",
    },
    {
      time: "18:30",
      title: "Mehndi Begins",
      description: "The cones come out and the henna starts to travel.",
      icon: "mehndi-cone",
    },
    {
      time: "19:30",
      title: "Performances",
      description: "Dhol, dholki and everything the families have been rehearsing.",
      icon: "dhol",
    },
    {
      time: "20:30",
      title: "Dinner",
      description: "Served in the courtyard, under the lanterns.",
      icon: "dinner",
    },
    {
      time: "21:30",
      title: "Celebration",
      description: "Dupattas up. We dance until the marigolds come down.",
      icon: "dupatta",
    },
  ] satisfies MehndiEvent[],

  details: [
    { label: "Date", value: "09 January 2027", note: "Saturday" },
    { label: "Time", value: "18:00", note: "Onwards" },
    { label: "Venue", value: "Al Bustan Courtyard", note: "Al Barsha, Dubai" },
    { label: "Dress Code", value: "Festive Pakistani" },
  ] satisfies MehndiDetail[],

  audio: {
    /** Drop a file here to enable the ambient track. Missing is fine. */
    src: "/audio/mehndi.mp3",
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
