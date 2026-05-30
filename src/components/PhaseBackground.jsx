import { useMemo } from 'react';

// SUNSET THEME - Warm flowing waves and glowing orbs
function SunsetMenstrual() {
  return (
    <div className="phase-bg sunset-menstrual">
      <div className="sunset-wave wave-1" />
      <div className="sunset-wave wave-2" />
      <div className="sunset-orb orb-1" />
      <div className="sunset-orb orb-2" />
      <div className="warmth-glow" />
    </div>
  );
}

function SunsetFollicular() {
  return (
    <div className="phase-bg sunset-follicular">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`sunset-ray ray-${i + 1}`} />
      ))}
      <div className="sunrise-glow" />
    </div>
  );
}

function SunsetOvulatory() {
  return (
    <div className="phase-bg sunset-ovulatory">
      <div className="sun-core" />
      <div className="sun-corona corona-1" />
      <div className="sun-corona corona-2" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`sun-flare flare-${i + 1}`} />
      ))}
    </div>
  );
}

function SunsetLuteal() {
  return (
    <div className="phase-bg sunset-luteal">
      <div className="dusk-gradient" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`floating-cloud cloud-${i + 1}`} />
      ))}
    </div>
  );
}

// BOTANICAL THEME - Leaves, petals, organic growth
function BotanicalMenstrual() {
  return (
    <div className="phase-bg botanical-menstrual">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`falling-petal petal-${i + 1}`} />
      ))}
      <div className="earth-glow" />
    </div>
  );
}

function BotanicalFollicular() {
  return (
    <div className="phase-bg botanical-follicular">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`growing-vine vine-${i + 1}`} />
      ))}
      <div className="spring-light" />
    </div>
  );
}

function BotanicalOvulatory() {
  return (
    <div className="phase-bg botanical-ovulatory">
      <div className="bloom-center" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`bloom-petal bloom-${i + 1}`} />
      ))}
    </div>
  );
}

function BotanicalLuteal() {
  return (
    <div className="phase-bg botanical-luteal">
      {[...Array(10)].map((_, i) => (
        <div key={i} className={`autumn-leaf leaf-${i + 1}`} />
      ))}
      <div className="harvest-glow" />
    </div>
  );
}

// DUSK THEME - Stars, nebulas, elegant swoops
function DuskMenstrual() {
  return (
    <div className="phase-bg dusk-menstrual">
      <div className="nebula-cloud nebula-1" />
      <div className="nebula-cloud nebula-2" />
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`tiny-star star-${i + 1}`} />
      ))}
    </div>
  );
}

function DuskFollicular() {
  return (
    <div className="phase-bg dusk-follicular">
      <div className="twilight-gradient" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`rising-star rstar-${i + 1}`} />
      ))}
    </div>
  );
}

function DuskOvulatory() {
  return (
    <div className="phase-bg dusk-ovulatory">
      <div className="moon-glow" />
      <div className="moon-halo halo-1" />
      <div className="moon-halo halo-2" />
      {[...Array(15)].map((_, i) => (
        <div key={i} className={`shimmer-star sstar-${i + 1}`} />
      ))}
    </div>
  );
}

function DuskLuteal() {
  return (
    <div className="phase-bg dusk-luteal">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`swooping-arc arc-${i + 1}`} />
      ))}
      <div className="night-mist" />
    </div>
  );
}

// AURORA THEME - Northern lights, ribbons, magical particles
function AuroraMenstrual() {
  return (
    <div className="phase-bg aurora-menstrual">
      <div className="aurora-curtain curtain-1" />
      <div className="aurora-curtain curtain-2" />
      <div className="aurora-curtain curtain-3" />
    </div>
  );
}

function AuroraFollicular() {
  return (
    <div className="phase-bg aurora-follicular">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`aurora-ribbon ribbon-${i + 1}`} />
      ))}
      <div className="magic-glow" />
    </div>
  );
}

function AuroraOvulatory() {
  return (
    <div className="phase-bg aurora-ovulatory">
      <div className="aurora-burst" />
      {[...Array(20)].map((_, i) => (
        <div key={i} className={`magic-particle mparticle-${i + 1}`} />
      ))}
    </div>
  );
}

function AuroraLuteal() {
  return (
    <div className="phase-bg aurora-luteal">
      <div className="aurora-wave awave-1" />
      <div className="aurora-wave awave-2" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`fading-spark spark-${i + 1}`} />
      ))}
    </div>
  );
}

const THEME_ANIMATIONS = {
  sunset: {
    menstrual: SunsetMenstrual,
    follicular: SunsetFollicular,
    ovulatory: SunsetOvulatory,
    luteal: SunsetLuteal
  },
  botanical: {
    menstrual: BotanicalMenstrual,
    follicular: BotanicalFollicular,
    ovulatory: BotanicalOvulatory,
    luteal: BotanicalLuteal
  },
  dusk: {
    menstrual: DuskMenstrual,
    follicular: DuskFollicular,
    ovulatory: DuskOvulatory,
    luteal: DuskLuteal
  },
  aurora: {
    menstrual: AuroraMenstrual,
    follicular: AuroraFollicular,
    ovulatory: AuroraOvulatory,
    luteal: AuroraLuteal
  }
};

export function PhaseBackground({ phase, theme = 'sunset' }) {
  const Animation = useMemo(() => {
    const themeAnims = THEME_ANIMATIONS[theme] || THEME_ANIMATIONS.sunset;
    return themeAnims[phase] || themeAnims.follicular;
  }, [phase, theme]);

  return (
    <div className="phase-background-container">
      <Animation />
    </div>
  );
}
