"use client";

import { useEffect, useRef, useState } from "react";
import { mehndi } from "@/data/mehndi";
import styles from "./MusicControl.module.css";

type Props = {
  /** Set once the guest has entered, which is what unlocks audio on iOS. */
  armed: boolean;
};

/**
 * Ambient music. Nothing plays before the guest taps to enter, the track is
 * entirely optional, and if the file is missing the control never appears.
 */
export function MusicControl({ armed }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Create the element only after the entry tap, so the browser treats the
  // first play() as user-initiated.
  useEffect(() => {
    if (!armed || audioRef.current) return;

    const audio = new Audio(mehndi.audio.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const onReady = () => setAvailable(true);
    const onFail = () => {
      setAvailable(false);
      setPlaying(false);
    };
    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("error", onFail);

    audio
      .play()
      .then(() => {
        setAvailable(true);
        setPlaying(true);
        fade(audio, 0.34, 2600);
      })
      .catch(() => {
        // Autoplay refused even after the tap: leave it to the guest.
        setPlaying(false);
      });

    return () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onFail);
      audio.pause();
      audioRef.current = null;
    };
  }, [armed]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      fade(audio, 0, 500, () => audio.pause());
      setPlaying(false);
    } else {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          fade(audio, 0.34, 1400);
        })
        .catch(() => setAvailable(false));
    }
  };

  if (!armed || !available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`tap-target ${styles.control}`}
      aria-pressed={playing}
      aria-label={playing ? "Pause ambient music" : "Play ambient music"}
      title={mehndi.audio.label}
    >
      <span className={styles.brass} aria-hidden="true">
        <span className={styles.bars} data-playing={playing}>
          <span />
          <span />
          <span />
          <span />
        </span>
      </span>
    </button>
  );
}

/** Gentle volume ramp — music should arrive, not switch on. */
function fade(audio: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  const from = audio.volume;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    // ease-out so the last of the ramp is the quietest part
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * (1 - (1 - t) ** 3)));
    if (t < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}
