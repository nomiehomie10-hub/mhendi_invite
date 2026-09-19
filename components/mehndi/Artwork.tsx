"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ArtworkProps = Omit<ImageProps, "onError" | "alt"> & {
  alt?: string;
  /** Painted art is decoration; give it a name only when it carries meaning. */
  decorative?: boolean;
};

/**
 * Every illustration goes through here. If an asset is
 * missing the element simply stops occupying space — a guest never sees a
 * broken-image glyph, and the composition closes up around the gap.
 */
export function Artwork({
  alt,
  decorative = true,
  className,
  ...props
}: ArtworkProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <Image
      {...props}
      alt={decorative ? "" : (alt ?? "")}
      aria-hidden={decorative || undefined}
      className={className}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
