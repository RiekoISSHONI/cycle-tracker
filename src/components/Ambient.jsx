import { PHASES } from '../utils/phases';

export function Ambient({ phase, top = -60, size = 320, opacity = 0.5 }) {
  const p = PHASES[phase];
  if (!p) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: 'translateX(-50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${p.soft}, ${p.tint} 50%, transparent 72%)`,
        filter: 'blur(12px)',
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

// Kept as a no-op export for backward compatibility — phase kanji is now
// shown via PhaseSticker badges, not as watermark text.
export function BrushKanji() {
  return null;
}
