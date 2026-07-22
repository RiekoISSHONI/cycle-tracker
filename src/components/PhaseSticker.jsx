import { PHASES, PMINCHO } from '../utils/phases';

export function PhaseSticker({ phase, size = 88 }) {
  const p = PHASES[phase];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32,
      background: `linear-gradient(150deg, ${p.accent}, ${p.deep})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 10px 22px ${p.accent}55, inset 0 2px 0 rgba(255,255,255,0.35)`,
      border: '3px solid #fff',
    }}>
      <span style={{
        fontFamily: PMINCHO, fontSize: size * 0.42, fontWeight: 800,
        color: '#fff', lineHeight: 1,
      }}>{p.kanji}</span>
    </div>
  );
}
