import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { mehndi } from "@/data/mehndi";
import "@/styles/mehndi.css";

/**
 * Both faces are self-hosted by next/font with `display: swap` and a metric
 * fallback, so the type never reflows the page once the webfont lands.
 */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const title = `Mehndi Night — ${mehndi.couple.bride} & ${mehndi.couple.groom}`;

export const metadata: Metadata = {
  title,
  description: `${mehndi.couplePanel.body} ${mehndi.displayDate}, ${mehndi.venue.city}.`,
  openGraph: {
    title,
    description: mehndi.couplePanel.body,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The artwork runs under the Dynamic Island and the home indicator; the
  // safe-area insets are handled per-component.
  viewportFit: "cover",
  themeColor: "#18382c",
};

export default function MehndiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${sans.variable}`}>{children}</div>
  );
}
