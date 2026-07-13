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
        background: `radial-gradient(closest-side, ${p.accent}26, ${p.accent}08 55%, transparent 72%)`,
        filter: 'blur(8px)',
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export function BrushKanji({ char, size = 300, color, opacity = 0.06, style }) {
  return (
    <div
      style={{
        fontFamily: '"Shippori Mincho B1", serif',
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color: color || '#2A2520',
        opacity,
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {char}
    </div>
  );
}
