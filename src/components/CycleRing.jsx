import { PHASES, PHASE_ORDER, PHASE_RANGES, PAPER, dayToAngle, polar, arcPath, phaseForDay } from '../utils/phases';

export function CycleRing({ size = 244, day = 15, stroke = 7, showMarker = true, dim = false }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2 - 6;
  const gapDeg = 5;
  const active = phaseForDay(day);
  const [mx, my] = polar(cx, cy, r, dayToAngle(day));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(42,37,32,0.06)" strokeWidth={stroke} />
      {PHASE_ORDER.map((k) => {
        const [s, e] = PHASE_RANGES[k];
        const a0 = dayToAngle(s) + gapDeg / 2;
        const a1 = dayToAngle(e) - gapDeg / 2;
        const isActive = k === active;
        return (
          <path
            key={k}
            d={arcPath(cx, cy, r, a0, a1)}
            fill="none"
            stroke={PHASES[k].accent}
            strokeWidth={isActive ? stroke + 2 : stroke}
            strokeLinecap="round"
            opacity={dim ? 0.5 : isActive ? 1 : 0.32}
          />
        );
      })}
      {showMarker && (
        <g>
          <circle cx={mx} cy={my} r={stroke / 2 + 5} fill={PAPER} />
          <circle
            cx={mx} cy={my}
            r={stroke / 2 + 2.5}
            fill={PHASES[active].accent}
            stroke="#fff"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}
