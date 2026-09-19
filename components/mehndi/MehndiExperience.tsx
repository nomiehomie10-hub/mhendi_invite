"use client";

import { useState } from "react";
import { mehndiAudio } from "@/lib/mehndi/audio";
import { CelebrationSection } from "./CelebrationSection";
import { ClosingCelebration } from "./ClosingCelebration";
import { CoupleSection } from "./CoupleSection";
import { FormalInvitation } from "./FormalInvitation";
import { EntranceDoors } from "./MehndiEntry";
import { DetailsSection } from "./DetailsSection";
import { MehndiCountdown } from "./MehndiCountdown";
import { MehndiHero } from "./MehndiHero";
import { MehndiHand } from "./MehndiHand";
import { MehndiTimeline } from "./MehndiTimeline";
import { MusicControl } from "./MusicControl";
import { SignaturePoster } from "./SignaturePoster";
import { VenueSection } from "./VenueSection";

/**
 * The evening, end to end. There is no navigation: the guest arrives at
 * the entrance and walks through the evening in order.
 *
 * `entered` is the only piece of state the whole experience shares — it
 * releases the scroll, settles the hero type, and arms the audio.
 */
export function MehndiExperience() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="mehndi">
      <EntranceDoors
        onEnter={() => {
          setEntered(true);
          // Raised inside the tap's own handler, which is the only moment
          // iOS will let audio begin.
          mehndiAudio.start();
        }}
      />

      <main>
        <MehndiHero entered={entered} />
        <FormalInvitation />
        <CoupleSection />
        <SignaturePoster />
        <CelebrationSection />
        <MehndiTimeline />
        <MehndiHand />
        <DetailsSection />
        <VenueSection />
        <MehndiCountdown />
        <ClosingCelebration />
      </main>

      <MusicControl armed={entered} />
    </div>
  );
}
