"use client";

import { useEffect, useState } from "react";
import { mehndi } from "@/data/mehndi";
import { mehndiAudio, type AudioState } from "@/lib/mehndi/audio";
import styles from "./MusicControl.module.css";

/**
 * Ambient music. Nothing plays before the guest taps to enter, the track is
 * entirely optional, and if no audio file is present the control never
 * appears. The playback itself lives in `lib/mehndi/audio`, because iOS only
 * honours a `play()` raised inside the entry tap's own handler.
 */
export function MusicControl({ armed }: { armed: boolean }) {
  const [state, setState] = useState<AudioState>({
    available: false,
    playing: false,
  });

  useEffect(() => mehndiAudio.subscribe(setState), []);

  if (!armed || !state.available) return null;

  return (
    <button
      type="button"
      onClick={() => mehndiAudio.toggle()}
      className={`tap-target ${styles.control}`}
      aria-pressed={state.playing}
      aria-label={state.playing ? "Pause ambient music" : "Play ambient music"}
      title={mehndi.audio.label}
    >
      <span className={styles.brass} aria-hidden="true">
        <span className={styles.bars} data-playing={state.playing}>
          <span />
          <span />
          <span />
          <span />
        </span>
      </span>
    </button>
  );
}
