import { useMemo } from 'react';
import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, PAPER2, CARD, INK, INK2, INK3, LINE, LINE2, MINCHO, OLDMIN, GOTHIC, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { Ambient, BrushKanji } from './Ambient';
import { useTranslation } from 'react-i18next';

// SVG mood wave chart
function MoodWaveChart({ moodData, cycleLength }) {
  if (!moodData || moodData.length < 2) return null;

  const W = 320;
  const H = 120;
  const padX = 10;
  const padY = 16;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const maxVal = Math.max(...moodData.map((d) => d.value), 5);
  const minVal = Math.min(...moodData.map((d) => d.value), 1);
  const range = maxVal - minVal || 1;

  const points = moodData.map((d, i) => {
    const x = padX + (d.cycleDay / (cycleLength || CYCLE_LEN)) * chartW;
    const y = padY + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y };
  });

  const lineD = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  const areaD = lineD + ` L ${points[points.length - 1].x} ${H - padY} L ${points[0].x} ${H - padY} Z`;

  // Phase background bands
  const phaseBands = PHASE_ORDER.map((k) => {
    const [s, e] = PHASE_RANGES[k];
    const x1 = padX + (s / CYCLE_LEN) * chartW;
    const x2 = padX + (e / CYCLE_LEN) * chartW;
    return { key: k, x: x1, width: x2 - x1, color: PHASES[k].tint };
  });

  const phaseLabels = PHASE_ORDER.map((k) => {
    const [s, e] = PHASE_RANGES[k];
    const mid = padX + ((s + e) / 2 / CYCLE_LEN) * chartW;
    return { key: k, x: mid, kanji: PHASES[k].kanji, clinical: PHASES[k].clinical, accent: PHASES[k].accent };
  });

  const currentPhaseKey = phaseForDay(moodData[moodData.length - 1]?.cycleDay || 0);
  const accent = PHASES[currentPhaseKey]?.accent || PHASES.sei.accent;

  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" style={{ display: 'block' }}>
      {phaseBands.map((band) => (
        <rect
          key={band.key}
          x={band.x}
          y={padY}
          width={band.width}
          height={chartH}
          fill={band.color}
          rx={3}
        />
      ))}
      <path d={areaD} fill={`${accent}18`} />
      <path d={lineD} fill="none" stroke={accent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill={accent} />
      ))}
      {phaseLabels.map((pl) => (
        <g key={pl.key}>
          <text x={pl.x} y={H + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={pl.accent} fontFamily="Shippori Mincho B1, serif">
            {pl.kanji}
          </text>
          <text x={pl.x} y={H + 20} textAnchor="middle" fontSize={8.5} fill={INK3} fontFamily="Zen Kaku Gothic New, sans-serif">
            {pl.clinical}
          </text>
        </g>
      ))}
    </svg>
  );
}

// SVG phase donut
function PhaseDonut({ size = 160 }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 6;
  const innerR = outerR - 18;
  const total = CYCLE_LEN;

  let startAngle = -90;
  const segments = PHASE_ORDER.map((k) => {
    const days = PHASES[k].days;
    const sweep = (days / total) * 360;
    const seg = { key: k, startAngle, sweep, accent: PHASES[k].accent, deep: PHASES[k].deep };
    startAngle += sweep;
    return seg;
  });

  const polarPt = (r, angleDeg) => {
    const a = (angleDeg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  const arcSeg = (r, start, sweep) => {
    const end = start + sweep;
    const [x1, y1] = polarPt(r, start);
    const [x2, y2] = polarPt(r, end);
    const large = sweep > 180 ? 1 : 0;
    return { x1, y1, x2, y2, large };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {segments.map((seg) => {
        const outer = arcSeg(outerR, seg.startAngle, seg.sweep);
        const inner = arcSeg(innerR, seg.startAngle, seg.sweep);
        const d = [
          `M ${outer.x1} ${outer.y1}`,
          `A ${outerR} ${outerR} 0 ${outer.large} 1 ${outer.x2} ${outer.y2}`,
          `L ${inner.x2} ${inner.y2}`,
          `A ${innerR} ${innerR} 0 ${outer.large} 0 ${inner.x1} ${inner.y1}`,
          'Z',
        ].join(' ');
        return <path key={seg.key} d={d} fill={seg.accent} opacity={0.85} />;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={22} fontWeight={700} fill={INK} fontFamily="Shippori Mincho B1, serif">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10.5} fill={INK3} fontFamily="Zen Kaku Gothic New, sans-serif">
        日周期
      </text>
    </svg>
  );
}

export function Insights({ checkins, cycleData, cycleStats, periodHistory = [] }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');
  const locale = isJa ? 'ja-JP' : 'en-US';

  const stats = useMemo(() => {
    if (!checkins || checkins.length === 0) return null;

    const moodData = checkins
      .filter((c) => c.mood)
      .map((c) => ({ cycleDay: c.cycleDay, value: c.mood }));

    const avgMood = moodData.length > 0
      ? (moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length).toFixed(1)
      : null;

    // Symptom frequency
    const symptomCounts = {};
    checkins.forEach((c) => {
      (c.symptoms || []).forEach((s) => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      moodData,
      avgMood,
      topSymptoms,
      totalCheckins: checkins.length,
    };
  }, [checkins]);

  const avgCycleDays = cycleStats?.averageLength || cycleData?.cycleLength || 28;
  const avgPeriodDays = 5;
  const variability = cycleStats?.isIrregular ? (isJa ? '不規則' : 'Irregular') : (isJa ? '安定' : 'Regular');

  const headlineStats = [
    {
      value: avgCycleDays,
      unit: isJa ? '日' : 'd',
      label: isJa ? '平均周期' : 'Avg Cycle',
      accent: PHASES.ki.accent,
    },
    {
      value: avgPeriodDays,
      unit: isJa ? '日' : 'd',
      label: isJa ? '平均生理' : 'Avg Period',
      accent: PHASES.sei.accent,
    },
    {
      value: variability,
      unit: '',
      label: isJa ? '変動' : 'Variability',
      accent: PHASES.mi.accent,
      isText: true,
    },
  ];

  // Pick an insight note
  const insightPhaseKey = 'me';
  const ip = PHASES[insightPhaseKey];

  if (!stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: '0 16px' }}>
          <h2 style={{ fontFamily: MINCHO, fontSize: 26, fontWeight: 600, color: INK, margin: 0 }}>
            {isJa ? 'あなたの傾向' : 'Your Trends'}
          </h2>
          <p style={{ fontFamily: GOTHIC, fontSize: 13, color: INK2, marginTop: 6 }}>
            {isJa ? '過去6周期から見えてきたこと。' : 'Patterns from your recent cycles.'}
          </p>
        </div>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: PAPER2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={INK3} strokeWidth="2">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 style={{ fontFamily: MINCHO, fontSize: 18, fontWeight: 600, color: INK, marginBottom: 6 }}>
            {t('insights.title')}
          </h3>
          <p style={{ fontFamily: GOTHIC, fontSize: 13, color: INK3 }}>{t('insights.noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16 }}>
      {/* Title */}
      <div style={{ textAlign: 'center', padding: '0 16px' }}>
        <h2 style={{ fontFamily: MINCHO, fontSize: 26, fontWeight: 600, color: INK, margin: 0 }}>
          {isJa ? 'あなたの傾向' : 'Your Trends'}
        </h2>
        <p style={{ fontFamily: GOTHIC, fontSize: 13, color: INK2, marginTop: 6 }}>
          {isJa ? '過去6周期から見えてきたこと。' : 'Patterns from your recent cycles.'}
        </p>
      </div>

      {/* 3 headline stat cards */}
      <div style={{ display: 'flex', gap: 10 }}>
        {headlineStats.map((hs, i) => (
          <div
            key={i}
            className="card"
            style={{ flex: 1, padding: '16px 10px', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
              <span style={{ fontFamily: MINCHO, fontSize: hs.isText ? 16 : 28, fontWeight: 700, color: hs.accent }}>
                {hs.value}
              </span>
              {hs.unit && (
                <span style={{ fontFamily: GOTHIC, fontSize: 12, color: INK3 }}>{hs.unit}</span>
              )}
            </div>
            <div style={{ fontFamily: GOTHIC, fontSize: 11, color: INK2, marginTop: 4 }}>
              {hs.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mood wave chart */}
      {stats.moodData.length >= 2 && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontFamily: MINCHO, fontSize: 16, fontWeight: 600, color: INK, marginBottom: 12 }}>
            {isJa ? '気分の波' : 'Mood Wave'}
          </h3>
          <MoodWaveChart moodData={stats.moodData} cycleLength={cycleData?.cycleLength || 28} />
        </div>
      )}

      {/* Phase donut */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontFamily: MINCHO, fontSize: 16, fontWeight: 600, color: INK, marginBottom: 12 }}>
          {isJa ? '周期の構成' : 'Cycle Composition'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
          <PhaseDonut size={140} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PHASE_ORDER.map((k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: PHASES[k].accent }} />
                <span style={{ fontFamily: MINCHO, fontSize: 14, fontWeight: 700, color: PHASES[k].accent }}>
                  {PHASES[k].kanji}
                </span>
                <span style={{ fontFamily: GOTHIC, fontSize: 11, color: INK2 }}>
                  {PHASES[k].days}{isJa ? '日' : 'd'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Symptom frequency bars */}
      {stats.topSymptoms.length > 0 && (
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontFamily: MINCHO, fontSize: 16, fontWeight: 600, color: INK, marginBottom: 14 }}>
            {isJa ? '症状の頻度' : 'Symptom Frequency'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.topSymptoms.map(([symptom, count]) => {
              const maxCount = stats.topSymptoms[0][1];
              const pct = (count / maxCount) * 100;
              return (
                <div key={symptom} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontFamily: GOTHIC,
                      fontSize: 12.5,
                      color: INK2,
                      width: 80,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {t(`checkin.symptomsList.${symptom}`)}
                  </span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: PAPER2, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 4,
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${PHASES.mi.accent}, ${PHASES.mi.deep})`,
                        transition: 'width 0.5s',
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: GOTHIC, fontSize: 11, color: INK3, width: 28, textAlign: 'right', flexShrink: 0 }}>
                    {count}x
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Insight note */}
      <div
        className="card"
        style={{
          padding: 18,
          background: `linear-gradient(135deg, ${ip.tint}, ${CARD})`,
          border: `1px solid ${ip.line}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontFamily: MINCHO, fontSize: 28, fontWeight: 700, color: ip.accent, lineHeight: 1 }}>
            {ip.kanji}
          </span>
          <p style={{ fontFamily: GOTHIC, fontSize: 13, color: INK2, lineHeight: 1.6, margin: 0 }}>
            {isJa
              ? '周期のリズムを知ることで、自分に合ったケアが見えてきます。'
              : 'Understanding your cycle rhythm helps you find the care that suits you best.'}
          </p>
        </div>
      </div>
    </div>
  );
}
