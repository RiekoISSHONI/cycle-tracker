import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, PHASE_ORDER, CYCLE_LEN, MARU, PMINCHO, INK, INK2, INK3, CARD, CREAM2, LINE, phaseKeyFromLegacy, phaseForDay } from '../utils/phases';
import { CycleRing } from './CycleRing';
import { PhaseSticker } from './PhaseSticker';
import { analyzeCycleDayPatterns, getWeeklyPredictions } from '../utils/predictions';

/* ── copy table ─────────────────────────────────────────────── */
const PLAY_COPY = {
  ki: {
    ja: { hi: 'こんにちは、さくらさん！', vibe: '今日は絶好調の予感 ✨', affirm: '満開のあなた。今日は自信を持って前へ！', tip: '気になるあの人を誘うなら今日！', pods: '同じ「輝」フェーズの3人が話してるよ' },
    en: { hi: 'Hi Sakura!', vibe: 'Feeling unstoppable today ✨', affirm: "You're in full bloom — go get it today!", tip: "Ask out your crush — today's the day!", pods: '3 peers in your Radiance phase are chatting' },
  },
  sei: {
    ja: { hi: 'おかえり、さくらさん', vibe: '今日はゆっくりいこう 🌙', affirm: '休むのも大切な巡り。無理しないでね。', tip: 'あったかいお茶でひと息つこう', pods: '「静」フェーズの2人がケアを共有中' },
    en: { hi: 'Welcome back, Sakura', vibe: "Let's take it slow today 🌙", affirm: 'Resting is part of the cycle too. Be gentle.', tip: 'Warm tea and a cozy break sound perfect', pods: '2 peers in Stillness are sharing care tips' },
  },
  me: {
    ja: { hi: 'やっほー、さくらさん！', vibe: 'エネルギー上昇中 🌱', affirm: '新しいことを始めるのにぴったりの日！', tip: '軽いおさんぽで気分もすっきり', pods: '「芽」フェーズの4人が計画をシェア' },
    en: { hi: 'Hey Sakura!', vibe: 'Energy on the rise 🌱', affirm: 'A perfect day to start something new!', tip: 'A light walk will lift your mood', pods: '4 peers in Budding are sharing plans' },
  },
  mi: {
    ja: { hi: 'おつかれさま、さくらさん', vibe: 'そろそろ整えるとき 🍂', affirm: '実りの季節。自分をいたわってあげて。', tip: '甘いものは控えめに、睡眠たっぷり', pods: '「実」フェーズの3人がまったり中' },
    en: { hi: 'Hi there, Sakura', vibe: 'Time to wind down 🍂', affirm: 'Ripening season — treat yourself kindly.', tip: 'Go easy on sweets, get plenty of sleep', pods: '3 peers in Ripening are taking it easy' },
  },
};

/* ── sakura icon (5-petal) ──────────────────────────────────── */
function SakuraIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="18" cy="10" rx="3.5" ry="6" transform={`rotate(${a} 18 18)`} fill="#fff" fillOpacity="0.85" />
      ))}
    </svg>
  );
}

/* ── forecast helpers ──────────────────────────────────────── */
const MOOD_EMOJI = ['', '😔', '😕', '😐', '😊', '😄'];
const ENERGY_BARS = [0, 1, 2, 3, 4, 5];

function enrichCheckins(checkins, periodHistory, cycleLength) {
  if (!checkins?.length || !periodHistory?.length) return checkins || [];
  const sortedPeriods = [...periodHistory].sort((a, b) => new Date(a) - new Date(b));
  return checkins.map(c => {
    if (c.cycleDay) return c;
    const date = new Date(c.date);
    let cycleDay = null;
    for (let i = sortedPeriods.length - 1; i >= 0; i--) {
      const periodStart = new Date(sortedPeriods[i]);
      if (date >= periodStart) {
        cycleDay = Math.floor((date - periodStart) / (1000 * 60 * 60 * 24)) + 1;
        if (cycleDay > cycleLength) cycleDay = ((cycleDay - 1) % cycleLength) + 1;
        break;
      }
    }
    return cycleDay ? { ...c, cycleDay } : c;
  });
}

function ForecastCard({ forecast, cycleLength, isJa, t }) {
  if (!forecast) {
    return (
      <div style={{
        marginTop: 16,
        background: CARD,
        borderRadius: 24,
        padding: '20px 20px',
        boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>🔮</span>
          <span style={{ fontFamily: MARU, fontSize: 16, fontWeight: 700, color: INK }}>
            {t('predictions.forecastTitle')}
          </span>
        </div>
        <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK3, margin: 0, lineHeight: 1.5 }}>
          {t('predictions.needMoreData')}
        </p>
      </div>
    );
  }

  const dayLabels = forecast.map((f) => {
    if (f.dayOffset === 0) return isJa ? '今日' : 'Today';
    if (f.dayOffset === 1) return isJa ? '明日' : 'Tmrw';
    const d = new Date();
    d.setDate(d.getDate() + f.dayOffset);
    return isJa
      ? `${d.getMonth() + 1}/${d.getDate()}`
      : d.toLocaleDateString('en', { weekday: 'short' });
  });

  return (
    <div style={{
      marginTop: 16,
      background: CARD,
      borderRadius: 24,
      padding: '20px 16px 16px',
      boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔮</span>
          <div>
            <div style={{ fontFamily: MARU, fontSize: 16, fontWeight: 700, color: INK }}>
              {t('predictions.forecastTitle')}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3, marginTop: 1 }}>
              {t('predictions.forecastSubtitle')}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
      }}>
        {forecast.map((f, i) => {
          const pk = phaseForDay(f.cycleDay);
          const phase = PHASES[pk];
          const isToday = f.dayOffset === 0;
          return (
            <div
              key={i}
              style={{
                minWidth: 72,
                flex: '0 0 auto',
                background: isToday ? phase.soft : CREAM2,
                border: isToday ? `2px solid ${phase.accent}` : '2px solid transparent',
                borderRadius: 18,
                padding: '12px 8px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{
                fontFamily: MARU,
                fontSize: 11,
                fontWeight: isToday ? 700 : 600,
                color: isToday ? phase.accent : INK3,
              }}>
                {dayLabels[i]}
              </span>

              <span style={{ fontSize: 22, lineHeight: 1 }}>
                {MOOD_EMOJI[Math.round(f.mood || 3)]}
              </span>

              <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
                {ENERGY_BARS.slice(1).map((lvl) => (
                  <div
                    key={lvl}
                    style={{
                      width: 4,
                      height: 3 + lvl * 2,
                      borderRadius: 2,
                      background: lvl <= Math.round(f.energy || 3) ? phase.accent : LINE,
                      opacity: lvl <= Math.round(f.energy || 3) ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>

              <span style={{
                fontFamily: MARU,
                fontSize: 9,
                fontWeight: 600,
                color: phase.deep,
                padding: '1px 6px',
                borderRadius: 6,
                background: phase.tint,
              }}>
                {isJa ? phase.name : phase.en}
              </span>

              {f.symptoms?.length > 0 && (
                <span style={{
                  fontFamily: MARU,
                  fontSize: 9,
                  fontWeight: 600,
                  color: INK3,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  maxWidth: 64,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {f.symptoms[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── phase key → legacy (for locale lookups) ──────────────── */
const PHASE_TO_LEGACY = { sei: 'menstrual', me: 'follicular', ki: 'ovulatory', mi: 'luteal' };

/* ── today's focus card ───────────────────────────────────── */
function TodaysFocusCard({ phaseKey, isJa, t }) {
  const legacyPhase = PHASE_TO_LEGACY[phaseKey];
  const p = PHASES[phaseKey];

  const lifestyleTips = t(`phaseTips.${legacyPhase}.lifestyle`, { returnObjects: true }) || [];
  const exerciseTips = t(`phaseTips.${legacyPhase}.exercise`, { returnObjects: true }) || [];

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const dailyTip = t(`dailyTips.${legacyPhase}`, { returnObjects: true })?.[dayOfYear % 5] || '';

  const showLifestyle = lifestyleTips.slice(0, 3);
  const showExercise = exerciseTips.slice(0, 2);

  return (
    <div style={{
      marginTop: 16,
      background: CARD,
      borderRadius: 24,
      padding: '20px 20px',
      boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: p.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: MARU, fontSize: 16, fontWeight: 700, color: INK }}>
            {isJa ? '今日のフォーカス' : "Today's Focus"}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3, marginTop: 1 }}>
            {isJa ? p.season : p.seasonEn}
          </div>
        </div>
      </div>

      {/* Daily tip highlight */}
      {dailyTip && (
        <div style={{
          padding: '12px 14px', borderRadius: 16,
          background: p.tint,
          marginBottom: 12,
        }}>
          <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: p.deep, margin: 0, lineHeight: 1.55 }}>
            {dailyTip}
          </p>
        </div>
      )}

      {/* Lifestyle tips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {showLifestyle.map((tip, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: p.accent, flexShrink: 0, marginTop: 6,
            }} />
            <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
              {tip}
            </span>
          </div>
        ))}
      </div>

      {/* Exercise section */}
      {showExercise.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LINE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
            </svg>
            <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
              {isJa ? '運動' : 'Exercise'}
            </span>
          </div>
          {showExercise.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: PHASES.me.accent, flexShrink: 0, marginTop: 6,
              }} />
              <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── partner guide card (collapsed by default) ────────────── */
function PartnerGuideCard({ phaseKey, isJa, t }) {
  const [open, setOpen] = useState(false);
  const legacyPhase = PHASE_TO_LEGACY[phaseKey];

  const understand = t(`partnerTips.${legacyPhase}.understand`) || '';
  const supportTips = t(`partnerTips.${legacyPhase}.support`, { returnObjects: true }) || [];
  const avoidTips = t(`partnerTips.${legacyPhase}.avoid`, { returnObjects: true }) || [];

  return (
    <div style={{
      marginTop: 16,
      background: CARD,
      borderRadius: 24,
      boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
      overflow: 'hidden',
    }}>
      {/* Tap-to-expand header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '16px 20px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: PHASES.mi.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PHASES.mi.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontFamily: MARU, fontSize: 15, fontWeight: 700, color: INK }}>
            {isJa ? 'パートナーガイド' : 'Partner Guide'}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3, marginTop: 1 }}>
            {isJa ? '大切な人に伝えたいこと' : 'What your partner should know'}
          </div>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={INK3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Expandable content */}
      {open && (
        <div style={{ padding: '0 20px 20px' }}>
          {/* Understanding */}
          <div style={{
            padding: '12px 14px', borderRadius: 16,
            background: PHASES.mi.tint,
            marginBottom: 12,
          }}>
            <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: PHASES.mi.deep, margin: 0, lineHeight: 1.55 }}>
              {understand}
            </p>
          </div>

          {/* Support tips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>💚</span>
            <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
              {isJa ? 'サポート方法' : 'How to Support'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {supportTips.slice(0, 3).map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: PHASES.me.accent, flexShrink: 0, marginTop: 6,
                }} />
                <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>

          {/* Avoid tips */}
          {avoidTips.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
                  {isJa ? '避けた方がいいこと' : 'What to Avoid'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {avoidTips.slice(0, 2).map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: PHASES.sei.accent, flexShrink: 0, marginTop: 6,
                    }} />
                    <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── component ──────────────────────────────────────────────── */
export function Dashboard({ cycleInfo, viewMode, checkins = [], cycleLength = 28, periodHistory = [], onNavigateCheckin }) {
  const { t, i18n } = useTranslation();
  const phaseKey = phaseKeyFromLegacy(cycleInfo.phase);
  const day = cycleInfo.cycleDay;
  const isJa = i18n.language.startsWith('ja');
  const lang = isJa ? 'ja' : 'en';

  const p = PHASES[phaseKey];
  const copy = PLAY_COPY[phaseKey][lang];
  const phaseName = isJa ? p.name : p.en;

  const forecast = useMemo(() => {
    const enriched = enrichCheckins(checkins, periodHistory, cycleLength);
    const withDay = enriched.filter(c => c.cycleDay);
    if (withDay.length < 5) return null;
    const patterns = analyzeCycleDayPatterns(withDay);
    if (!patterns) return null;
    return getWeeklyPredictions(day, patterns, cycleLength);
  }, [checkins, periodHistory, cycleLength, day]);

  /* ── partner view ── */
  if (viewMode === 'partner') {
    return (
      <div style={{ padding: '24px 0', paddingBottom: 130 }}>
        <div style={{
          background: CARD,
          borderRadius: 26,
          padding: '48px 24px',
          textAlign: 'center',
          boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>{p.emoji}</div>
          <div style={{ fontFamily: MARU, fontSize: 20, fontWeight: 700, color: INK, marginBottom: 8 }}>
            {isJa ? 'パートナービュー' : 'Partner View'}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK3, lineHeight: 1.6 }}>
            {isJa ? 'パートナー向けの画面は近日公開予定です。' : 'Partner view is coming soon.'}
          </div>
        </div>
      </div>
    );
  }

  /* ── main view ── */
  return (
    <div style={{ position: 'relative', paddingBottom: 130 }}>

      {/* 1 ── blobby radial gradient wash */}
      <div style={{
        position: 'absolute',
        top: -80,
        left: 0,
        right: 0,
        height: 380,
        background: `radial-gradient(60% 70% at 50% 30%, ${p.soft}, transparent)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* relative wrapper for z-stacking above the wash */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* 2 ── greeting */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: MARU, fontSize: 26, fontWeight: 800, color: INK }}>
            {copy.hi}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 15, fontWeight: 600, color: INK2, marginTop: 4 }}>
            {copy.vibe}
          </div>
        </div>

        {/* 3 ── hero card */}
        <div style={{
          background: CARD,
          borderRadius: 30,
          padding: '26px 22px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(60,50,55,0.08)',
        }}>
          {/* tint gradient band */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 96,
            background: `linear-gradient(180deg, ${p.tint}, transparent)`,
            zIndex: 0,
          }} />

          {/* content row */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}>
            {/* left: ring + sticker */}
            <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
              <CycleRing size={150} day={day} stroke={9} />
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <PhaseSticker phase={phaseKey} size={74} />
              </div>
            </div>

            {/* right: info stack */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* phase chip */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 999,
                background: p.soft,
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 16 }}>{p.emoji}</span>
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: p.deep }}>
                  {phaseName}
                </span>
              </div>

              {/* big day number */}
              <div style={{ fontFamily: MARU, fontSize: 46, fontWeight: 800, color: INK, lineHeight: 1 }}>
                {isJa ? `${day}日目` : `Day ${day}`}
              </div>

              {/* tip text */}
              <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, marginTop: 6, lineHeight: 1.45 }}>
                {copy.tip}
              </div>
            </div>
          </div>
        </div>

        {/* 4 ── affirmation bubble */}
        <div style={{
          marginTop: 16,
          background: `linear-gradient(135deg, ${p.accent}, ${p.deep})`,
          borderRadius: 26,
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
        }}>
          {/* sakura tile */}
          <div style={{
            width: 50, height: 50,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <SakuraIcon />
          </div>
          <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.55 }}>
            {copy.affirm}
          </div>
        </div>

        {/* 5 ── forecast card */}
        <ForecastCard forecast={forecast} cycleLength={cycleLength} isJa={isJa} t={t} />

        {/* 6 ── today's focus */}
        <TodaysFocusCard phaseKey={phaseKey} isJa={isJa} t={t} />

        {/* 7 ── partner guide */}
        <PartnerGuideCard phaseKey={phaseKey} isJa={isJa} t={t} />

        {/* 8 ── social pod strip */}
        <div style={{
          marginTop: 16,
          background: CARD,
          borderRadius: 24,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
        }}>
          {/* overlapping avatar stack */}
          <div style={{ display: 'flex', flexShrink: 0 }}>
            {['M', 'A', 'R'].map((letter, i) => {
              const colors = [p.accent, p.deep, p.soft];
              const textColors = i === 2 ? p.deep : '#fff';
              return (
                <div key={letter} style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: colors[i],
                  border: '2.5px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: i > 0 ? -10 : 0,
                  zIndex: 3 - i,
                  position: 'relative',
                }}>
                  <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: textColors }}>
                    {letter}
                  </span>
                </div>
              );
            })}
          </div>

          {/* pods text */}
          <div style={{ flex: 1, fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.4 }}>
            {copy.pods}
          </div>

          {/* join button */}
          <div style={{
            padding: '7px 18px',
            borderRadius: 999,
            background: p.soft,
            cursor: 'pointer',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: p.deep }}>
              {isJa ? '参加' : 'Join'}
            </span>
          </div>
        </div>

        {/* 9 ── quick chips row */}
        <div style={{
          marginTop: 16,
          display: 'flex',
          gap: 10,
        }}>
          {[
            { emoji: '💧', ja: '経血を記録', en: 'Log flow' },
            { emoji: '💭', ja: '気分', en: 'Mood' },
            { emoji: '📝', ja: 'メモ', en: 'Note' },
          ].map((chip) => (
            <div key={chip.en} onClick={onNavigateCheckin} style={{
              flex: 1,
              background: CARD,
              borderRadius: 24,
              padding: '18px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
            }}>
              <span style={{ fontSize: 22 }}>{chip.emoji}</span>
              <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK2 }}>
                {isJa ? chip.ja : chip.en}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
