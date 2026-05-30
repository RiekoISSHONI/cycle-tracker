import { useMemo } from 'react';

// Menstrual: Gentle embracing circles - warmth and comfort
function MenstrualAnimation() {
  return (
    <div className="phase-bg menstrual">
      <div className="embrace-circle embrace-1" />
      <div className="embrace-circle embrace-2" />
      <div className="embrace-circle embrace-3" />
      <div className="warmth-glow" />
    </div>
  );
}

// Follicular: Rising energy bubbles - growth and renewal
function FollicularAnimation() {
  return (
    <div className="phase-bg follicular">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`rising-bubble bubble-${i + 1}`} />
      ))}
      <div className="growth-rays" />
    </div>
  );
}

// Ovulatory: Radiating light - peak energy and confidence
function OvulatoryAnimation() {
  return (
    <div className="phase-bg ovulatory">
      <div className="radiance-core" />
      <div className="radiance-ring ring-1" />
      <div className="radiance-ring ring-2" />
      <div className="radiance-ring ring-3" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`sparkle sparkle-${i + 1}`} />
      ))}
    </div>
  );
}

// Luteal: Settling particles - winding down and reflection
function LutealAnimation() {
  return (
    <div className="phase-bg luteal">
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`falling-particle particle-${i + 1}`} />
      ))}
      <div className="cozy-gradient" />
    </div>
  );
}

export function PhaseBackground({ phase }) {
  const Animation = useMemo(() => {
    switch (phase) {
      case 'menstrual':
        return MenstrualAnimation;
      case 'follicular':
        return FollicularAnimation;
      case 'ovulatory':
        return OvulatoryAnimation;
      case 'luteal':
        return LutealAnimation;
      default:
        return FollicularAnimation;
    }
  }, [phase]);

  return (
    <div className="phase-background-container">
      <Animation />
    </div>
  );
}
