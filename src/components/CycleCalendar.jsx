import { useState } from 'react';
import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, CARD, INK, INK2, INK3, LINE, CREAM, CREAM2, MARU, PMINCHO, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { useTranslation } from 'react-i18next';
import { CycleRing } from './CycleRing';
import { downloadCalendarEvents } from '../utils/calendarExport';

export function CycleCalendar({ cycleInfo }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');
  const locale = isJa ? 'ja-JP' : 'en-US';
  const { cycleDay, cycleLength, phase } = cycleInfo;
  const [calendarExported, setCalendarExported] = useState(false);

  const phaseKey = phaseKeyFromLegacy(phase);
  const p = PHASES[phaseKey];

  const handleExportCalendar = () => {
    downloadCalendarEvents(cycleInfo.lastPeriodStart || new Date().toISOString().split('T')[0], cycleLength, 6);
    setCalendarExported(true);
    setTimeout(() => setCalendarExported(false), 3000);
  };

  // Calculate phase for each day based on cycle length
  const getPhaseKeyForDay = (day) => {
    const ratio = cycleLength / 28;
    let acc = 0;
    for (const k of PHASE_ORDER) {
      const d = Math.round(PHASES[k].days * ratio);
      if (day <= acc + d) return k;
      acc += d;
    }
    return 'mi';
  };

  // Generate 28-day grid
  const days = Array.from({ length: CYCLE_LEN }, (_, i) => i + 1);

  // Upcoming events computation
  const today = new Date();
  const lastPeriod = cycleInfo.lastPeriodStart ? new Date(cycleInfo.lastPeriodStart) : today;
  const daysSincePeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
  const daysUntilNextPeriod = cycleLength - (daysSincePeriod % cycleLength);
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + daysUntilNextPeriod);

  const ratio = cycleLength / 28;
  const ovulationDay = Math.round(13 * ratio);
  const currentCycleDay = (daysSincePeriod % cycleLength) + 1;
  const daysUntilOvulation = ovulationDay > currentCycleDay ? ovulationDay - currentCycleDay : cycleLength - currentCycleDay + ovulationDay;
  const nextOvulationDate = new Date(today);
  nextOvulationDate.setDate(nextOvulationDate.getDate() + daysUntilOvulation);

  const fertileStart = new Date(nextOvulationDate);
  fertileStart.setDate(fertileStart.getDate() - 3);
  const fertileEnd = new Date(nextOvulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  const formatRelative = (days) => {
    if (days === 0) return isJa ? '今日' : 'Today';
    if (days === 1) return isJa ? '明日' : 'Tomorrow';
    return isJa ? `${days}日後` : `in ${days} days`;
  };

  const upcomingEvents = [
    {
      kanji: '静',
      phaseKey: 'sei',
      title: isJa ? '次の生理' : 'Next Period',
      date: nextPeriodDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
      relative: formatRelative(daysUntilNextPeriod),
    },
    {
      kanji: '輝',
      phaseKey: 'ki',
      title: isJa ? '次の排卵' : 'Next Ovulation',
      date: nextOvulationDate.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
      relative: formatRelative(daysUntilOvulation),
    },
    {
      kanji: '芽',
      phaseKey: 'me',
      title: isJa ? '妊娠可能期間' : 'Fertile Window',
      date: `${fertileStart.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} - ${fertileEnd.toLocaleDateString(locale, { day: 'numeric' })}`,
      relative: formatRelative(Math.max(0, daysUntilOvulation - 3)),
    },
  ];

  const legendItems = PHASE_ORDER.map((k) => ({
    key: k,
    kanji: PHASES[k].kanji,
    label: isJa
      ? { sei: '生理', me: '卵胞期', ki: '排卵', mi: '黄体期' }[k]
      : { sei: 'Menstrual', me: 'Follicular', ki: 'Ovulation', mi: 'Luteal' }[k],
    accent: PHASES[k].accent,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16 }}>
      {/* Title */}
      <div style={{ textAlign: 'center', padding: '0 16px' }}>
        <h2 style={{ fontFamily: MARU, fontSize: 26, fontWeight: 900, color: INK, margin: 0 }}>
          {isJa ? '周期の暦' : 'Cycle Calendar'}
        </h2>
        <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, marginTop: 6 }}>
          {isJa ? '四季のように巡る、あなたの28日。' : 'Your 28 days, cycling like the seasons.'}
        </p>
      </div>

      {/* Phase legend */}
      <div style={{ display: 'flex', gap: 7, justifyContent: 'center', padding: '0 12px' }}>
        {legendItems.map((item) => (
          <div
            key={item.key}
            style={{
              flex: 1,
              background: CARD,
              borderRadius: 16,
              padding: '8px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 8px 22px rgba(120,70,40,0.06)',
              border: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: item.accent,
                }}
              />
              <span style={{ fontFamily: PMINCHO, fontSize: 14, fontWeight: 700, color: item.accent }}>
                {item.kanji}
              </span>
            </div>
            <span style={{ fontFamily: MARU, fontSize: 10.5, fontWeight: 600, color: INK2, textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* 28-day grid */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: CARD,
          borderRadius: 24,
          boxShadow: '0 8px 22px rgba(120,70,40,0.06)',
          padding: 14,
        }}
      >
        {/* Blobby radial gradient wash */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${p.tint} 0%, transparent 70%)`,
            opacity: 0.7,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PHASES.me.tint} 0%, transparent 70%)`,
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 7,
          }}
        >
          {days.map((day) => {
            const dayPhaseKey = getPhaseKeyForDay(day);
            const dp = PHASES[dayPhaseKey];
            const isToday = day === cycleDay;

            return (
              <div
                key={day}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isToday
                    ? `linear-gradient(135deg, ${dp.accent}, ${dp.deep})`
                    : dp.tint,
                  border: 'none',
                  color: isToday ? '#fff' : dp.deep,
                  fontFamily: MARU,
                  fontSize: 14,
                  fontWeight: isToday ? 800 : 600,
                  boxShadow: isToday ? `0 4px 14px ${dp.accent}44` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {day}
                {isToday && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 4,
                      fontFamily: PMINCHO,
                      fontSize: 9,
                      opacity: 0.7,
                      color: '#fff',
                    }}
                  >
                    {dp.kanji}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {upcomingEvents.map((ev, i) => {
          const ep = PHASES[ev.phaseKey];
          return (
            <div
              key={i}
              style={{
                background: CARD,
                borderRadius: 24,
                boxShadow: '0 8px 22px rgba(120,70,40,0.06)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: ep.tint,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: PMINCHO,
                  fontSize: 20,
                  fontWeight: 700,
                  color: ep.accent,
                  flexShrink: 0,
                }}
              >
                {ev.kanji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 800, color: INK }}>
                  {ev.title}
                </div>
                <div style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, marginTop: 2 }}>
                  {ev.date}
                </div>
              </div>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: ep.soft,
                  fontFamily: MARU,
                  fontSize: 11,
                  fontWeight: 800,
                  color: ep.accent,
                  whiteSpace: 'nowrap',
                }}
              >
                {ev.relative}
              </div>
            </div>
          );
        })}
      </div>

      {/* Export button */}
      {calendarExported ? (
        <div
          style={{
            background: PHASES.me.tint,
            borderRadius: 24,
            boxShadow: '0 8px 22px rgba(120,70,40,0.06)',
            padding: '14px 20px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 800, color: PHASES.me.accent }}>
            {isJa ? 'ダウンロード完了' : 'Downloaded'}
          </span>
        </div>
      ) : (
        <button
          onClick={handleExportCalendar}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 24,
            border: 'none',
            background: CARD,
            boxShadow: '0 8px 22px rgba(120,70,40,0.06)',
            fontFamily: MARU,
            fontSize: 14,
            fontWeight: 800,
            color: INK,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isJa ? 'カレンダーに書き出す' : 'Export to calendar'}
        </button>
      )}
    </div>
  );
}
