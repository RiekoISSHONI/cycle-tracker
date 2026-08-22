import { useState, useMemo } from 'react';
import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, CARD, INK, INK2, INK3, LINE, CREAM, CREAM2, MARU, PMINCHO, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { useTranslation } from 'react-i18next';
import { CycleRing } from './CycleRing';
import { downloadCalendarEvents } from '../utils/calendarExport';
import { useSubscription, FREE_LIMITS, STRIPE_LINKS, isStripeConfigured } from '../contexts/SubscriptionContext';
import { CardPopup } from './CardPopup';
import { trackFeature } from '../utils/telemetry';

const MOOD_EMOJI = ['', '😔', '😕', '😐', '😊', '😄'];

export function CycleCalendar({ cycleInfo, journalEntries = [] }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');
  const locale = isJa ? 'ja-JP' : 'en-US';
  const { cycleDay, cycleLength, phase } = cycleInfo;
  const [calendarExported, setCalendarExported] = useState(false);
  const { isPremium, canAccess, redirectToStripe } = useSubscription();

  const phaseKey = phaseKeyFromLegacy(phase);
  const p = PHASES[phaseKey];

  const handleExportCalendar = () => {
    trackFeature('calendar_export');
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

  // Map journal entries to cycle days for the current cycle
  const journalByCycleDay = useMemo(() => {
    if (!journalEntries.length || !cycleInfo.lastPeriodStart) return {};
    const lastPeriod = new Date(cycleInfo.lastPeriodStart);
    const today = new Date();
    const map = {};
    journalEntries.forEach(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      const daysSincePeriod = Math.floor((entryDate - lastPeriod) / (1000 * 60 * 60 * 24));
      const cd = (daysSincePeriod % cycleLength) + 1;
      if (cd >= 1 && cd <= CYCLE_LEN) {
        map[cd] = entry;
      }
    });
    return map;
  }, [journalEntries, cycleInfo.lastPeriodStart, cycleLength]);

  // Journal history: sorted newest first, gated by subscription
  const sortedJournal = useMemo(() => {
    return [...journalEntries].sort((a, b) => b.date.localeCompare(a.date));
  }, [journalEntries]);

  const visibleJournal = useMemo(() => {
    if (isPremium) return sortedJournal;
    // Free tier: only entries from the last N days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - FREE_LIMITS.journalHistoryDays);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return sortedJournal.filter(e => e.date >= cutoffStr);
  }, [sortedJournal, isPremium]);

  const lockedCount = sortedJournal.length - visibleJournal.length;

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

  const formatEntryDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (isJa) {
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      return `${d.getMonth() + 1}/${d.getDate()} (${weekdays[d.getDay()]})`;
    }
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16 }}>
      {/* Title */}
      <div style={{ textAlign: 'center', padding: '0 16px' }}>
        <h2 style={{ fontFamily: PMINCHO, fontSize: 26, fontWeight: 600, color: INK, margin: 0 }}>
          {isJa ? '周期の暦' : 'Cycle Calendar'}
        </h2>
        <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: INK2, marginTop: 6 }}>
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
              boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
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
              <span style={{ fontFamily: PMINCHO, fontSize: 14, fontWeight: 600, color: item.accent }}>
                {item.kanji}
              </span>
            </div>
            <span style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK2, textAlign: 'center' }}>
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
          boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
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

        {/* Journal indicator legend */}
        {Object.keys(journalByCycleDay).length > 0 && (
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 10, paddingLeft: 2,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: INK2,
            }} />
            <span style={{ fontFamily: MARU, fontSize: 10, fontWeight: 600, color: INK3 }}>
              {isJa ? 'ジャーナル記録あり' : 'Journal entry'}
            </span>
          </div>
        )}

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
            const hasJournal = !!journalByCycleDay[day];

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
                  fontWeight: isToday ? 700 : 600,
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
                {/* Journal dot indicator */}
                {hasJournal && (
                  <div style={{
                    position: 'absolute',
                    bottom: 3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: isToday ? 'rgba(255,255,255,0.8)' : INK2,
                  }} />
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
                boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
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
                  fontWeight: 600,
                  color: ep.accent,
                  flexShrink: 0,
                }}
              >
                {ev.kanji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 700, color: INK }}>
                  {ev.title}
                </div>
                <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, marginTop: 2 }}>
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
                  fontWeight: 700,
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

      {/* ── Journal History ──────────────────────────────────── */}
      {sortedJournal.length > 0 && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📝</span>
              <span style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK }}>
                {isJa ? 'ジャーナル履歴' : 'Journal History'}
              </span>
            </div>
            <span style={{
              fontFamily: MARU, fontSize: 11, fontWeight: 600,
              color: isPremium ? p.accent : INK3,
              padding: '2px 10px', borderRadius: 8,
              background: isPremium ? p.tint : CREAM2,
            }}>
              {isPremium
                ? (isJa ? `全${sortedJournal.length}件` : `All ${sortedJournal.length}`)
                : (isJa ? `直近${FREE_LIMITS.journalHistoryDays}日間` : `Last ${FREE_LIMITS.journalHistoryDays} days`)}
            </span>
          </div>

          {/* Visible entries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleJournal.map(entry => {
              const ePk = entry.phase || 'ki';
              const ep = PHASES[ePk];
              const todayStr = new Date().toISOString().split('T')[0];
              const isEntryToday = entry.date === todayStr;

              return (
                <CardPopup
                  key={entry.date}
                  title={formatEntryDate(entry.date)}
                  accentBg={ep.tint}
                  preview={
                    <div style={{
                      background: CARD,
                      borderRadius: 20,
                      boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
                      padding: '14px 16px',
                      borderLeft: `3px solid ${ep.accent}`,
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: entry.text ? 8 : 0,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13 }}>{ep.emoji}</span>
                          <span style={{
                            fontFamily: MARU, fontSize: 13, fontWeight: 700,
                            color: isEntryToday ? ep.accent : INK2,
                          }}>
                            {formatEntryDate(entry.date)}
                          </span>
                          {isEntryToday && (
                            <span style={{
                              fontFamily: MARU, fontSize: 9, fontWeight: 700,
                              color: '#fff', background: ep.accent,
                              padding: '1px 7px', borderRadius: 5,
                            }}>
                              {isJa ? '今日' : 'Today'}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {entry.mood > 0 && (
                            <span style={{ fontSize: 14 }}>{MOOD_EMOJI[entry.mood]}</span>
                          )}
                          <span style={{
                            fontFamily: MARU, fontSize: 10, fontWeight: 600,
                            color: ep.deep, padding: '2px 8px', borderRadius: 6, background: ep.tint,
                          }}>
                            {isJa ? `${entry.cycleDay}日目` : `Day ${entry.cycleDay}`}
                          </span>
                        </div>
                      </div>
                      {entry.text && (
                        <p style={{
                          fontFamily: MARU, fontSize: 13, fontWeight: 500,
                          color: INK, margin: 0, lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {entry.text}
                        </p>
                      )}
                    </div>
                  }
                  detail={
                    <div>
                      {/* Phase & day info */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 14px', borderRadius: 14, background: ep.tint,
                        marginBottom: 16,
                      }}>
                        <span style={{ fontSize: 22 }}>{ep.emoji}</span>
                        <div>
                          <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 700, color: ep.deep }}>
                            {isJa ? `${ep.name} · ${entry.cycleDay}日目` : `${ep.en} · Day ${entry.cycleDay}`}
                          </div>
                          <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3 }}>
                            {isJa ? ep.season : ep.seasonEn}
                          </div>
                        </div>
                        {entry.mood > 0 && (
                          <span style={{ fontSize: 28, marginLeft: 'auto' }}>{MOOD_EMOJI[entry.mood]}</span>
                        )}
                      </div>

                      {/* Full journal text */}
                      {entry.text && (
                        <p style={{
                          fontFamily: MARU, fontSize: 15, fontWeight: 500,
                          color: INK, margin: 0, lineHeight: 1.75,
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>
                          {entry.text}
                        </p>
                      )}

                      {!entry.text && entry.mood > 0 && (
                        <p style={{
                          fontFamily: MARU, fontSize: 14, fontWeight: 500,
                          color: INK3, margin: 0, textAlign: 'center',
                          padding: '20px 0',
                        }}>
                          {isJa ? '気分だけ記録しました' : 'Mood logged, no written entry'}
                        </p>
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>

          {/* Premium upsell for locked entries */}
          {lockedCount > 0 && (
            <div style={{
              marginTop: 14,
              background: CARD,
              borderRadius: 20,
              boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
              padding: '18px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK, marginBottom: 6 }}>
                {isJa
                  ? `${lockedCount}件のジャーナルがロックされています`
                  : `${lockedCount} journal ${lockedCount === 1 ? 'entry' : 'entries'} locked`}
              </div>
              <p style={{
                fontFamily: MARU, fontSize: 13, fontWeight: 500,
                color: INK3, margin: '0 0 14px', lineHeight: 1.5,
              }}>
                {isJa
                  ? 'プレミアムにアップグレードして、すべてのジャーナル履歴にアクセスしましょう'
                  : 'Upgrade to Premium for full access to your journal history'}
              </p>
              <button
                onClick={() => {
                  if (isStripeConfigured()) {
                    redirectToStripe('monthly');
                  }
                }}
                style={{
                  padding: '10px 28px', borderRadius: 14, border: 'none',
                  background: `linear-gradient(135deg, ${p.accent}, ${p.deep})`,
                  boxShadow: `0 4px 14px ${p.accent}44`,
                  fontFamily: MARU, fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer',
                }}
              >
                {isJa ? 'プレミアムを見る' : 'View Premium'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Export button */}
      {calendarExported ? (
        <div
          style={{
            background: PHASES.me.tint,
            borderRadius: 24,
            boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
            padding: '14px 20px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 700, color: PHASES.me.accent }}>
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
            boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
            fontFamily: MARU,
            fontSize: 14,
            fontWeight: 700,
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
