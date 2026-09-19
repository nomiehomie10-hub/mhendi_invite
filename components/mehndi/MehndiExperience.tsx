"use client";

import { useState } from "react";
import { CelebrationSection } from "./CelebrationSection";
import { ClosingCelebration } from "./ClosingCelebration";
import { CoupleSection } from "./CoupleSection";
import { CourtyardEntrance } from "./MehndiEntry";
import { DetailsSection } from "./DetailsSection";
import { MehndiCountdown } from "./MehndiCountdown";
import { MehndiHero } from "./MehndiHero";
import { MehndiTimeline } from "./MehndiTimeline";
import { MusicControl } from "./MusicControl";
import { SignaturePoster } from "./SignaturePoster";
import { VenueSection } from "./VenueSection";

/**
 * The courtyard, end to end. There is no navigation: the guest arrives at
 * the entrance and walks through the evening in order.
 *
 * `entered` is the only piece of state the whole experience shares — it
 * releases the scroll, settles the hero type, and arms the audio.
 */
export function MehndiExperience() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="mehndi">
      <CourtyardEntrance onEnter={() => setEntered(true)} />

      <main>
        <MehndiHero entered={entered} />
        <CoupleSection />
        <SignaturePoster />
        <CelebrationSection />
        <MehndiTimeline />
        <DetailsSection />
        <VenueSection />
        <MehndiCountdown />
        <ClosingCelebration />
      </main>

      <MusicControl armed={entered} />
    </div>
  );
}
