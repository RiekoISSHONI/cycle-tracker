import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, PHASE_ORDER, CYCLE_LEN, CORAL, CORAL_D, MARU, PMINCHO, INK, INK2, INK3, CARD, CREAM2, LINE, phaseKeyFromLegacy, phaseForDay } from '../utils/phases';
import { CycleRing } from './CycleRing';
import { PhaseSticker } from './PhaseSticker';
import { getDailyQuote } from '../utils/quotes';
import { CardPopup } from './CardPopup';
import { analyzeCycleDayPatterns, getWeeklyPredictions } from '../utils/predictions';

/* ── copy table ─────────────────────────────────────────────── */
const PLAY_COPY = {
  ki: {
    ja: { hi: 'こんにちは、さくらさん！', vibe: '今日は絶好調の予感 ✨', affirm: '満開のあなた。今日は自信を持って前へ！', tip: '気になるあの人を誘うなら今日！', pods: '「輝」の仲間3人がシェア中' },
    en: { hi: 'Hi Sakura!', vibe: 'Feeling unstoppable today ✨', affirm: "You're in full bloom — go get it today!", tip: "Ask out your crush — today's the day!", pods: '3 in your Radiance circle are sharing' },
  },
  sei: {
    ja: { hi: 'おかえり、さくらさん', vibe: '今日はゆっくりいこう 🌙', affirm: '休むのも大切な巡り。無理しないでね。', tip: 'あったかいお茶でひと息つこう', pods: '「静」の仲間2人がケアを共有中' },
    en: { hi: 'Welcome back, Sakura', vibe: "Let's take it slow today 🌙", affirm: 'Resting is part of the cycle too. Be gentle.', tip: 'Warm tea and a cozy break sound perfect', pods: '2 in Stillness circle are sharing care tips' },
  },
  me: {
    ja: { hi: 'やっほー、さくらさん！', vibe: 'エネルギー上昇中 🌱', affirm: '新しいことを始めるのにぴったりの日！', tip: '軽いおさんぽで気分もすっきり', pods: '「芽」の仲間4人が計画をシェア中' },
    en: { hi: 'Hey Sakura!', vibe: 'Energy on the rise 🌱', affirm: 'A perfect day to start something new!', tip: 'A light walk will lift your mood', pods: '4 in Budding circle are sharing plans' },
  },
  mi: {
    ja: { hi: 'おつかれさま、さくらさん', vibe: 'そろそろ整えるとき 🍂', affirm: '実りの季節。自分をいたわってあげて。', tip: '甘いものは控えめに、睡眠たっぷり', pods: '「実」の仲間3人がまったり中' },
    en: { hi: 'Hi there, Sakura', vibe: 'Time to wind down 🍂', affirm: 'Ripening season — treat yourself kindly.', tip: 'Go easy on sweets, get plenty of sleep', pods: '3 in Ripening circle are winding down' },
  },
};

/* ── week icon (soft calendar sparkle) ─────────────────────── */
function WeekIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
      <path d="M12 16l1.5-3 1.5 3" /><path d="M9 16l1.5-3L12 16" />
    </svg>
  );
}

const GLASS = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 18px rgba(58,50,38,0.04)',
  border: '1px solid rgba(255,255,255,0.5)',
};

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
        ...GLASS,
        borderRadius: 24,
        padding: '20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <WeekIcon color={INK3} />
          <span style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK }}>
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
      ...GLASS,
      borderRadius: 24,
      padding: '20px 16px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WeekIcon color={INK3} />
          <div>
            <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK }}>
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
      ...GLASS,
      borderRadius: 24,
      padding: '20px 20px',
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
          <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK }}>
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
            <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
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
              <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── rotate array: pick `count` items starting at a day-based offset ── */
function rotateSlice(arr, count, seed) {
  if (!arr || arr.length <= count) return arr || [];
  const start = seed % arr.length;
  const result = [];
  for (let i = 0; i < count; i++) result.push(arr[(start + i) % arr.length]);
  return result;
}

/* ── partner guide card (popup on tap) ────────────────────── */
function PartnerGuideCard({ phaseKey, isJa, t }) {
  const legacyPhase = PHASE_TO_LEGACY[phaseKey];

  const understand = t(`partnerTips.${legacyPhase}.understand`) || '';
  const allSupport = t(`partnerTips.${legacyPhase}.support`, { returnObjects: true }) || [];
  const allAvoid = t(`partnerTips.${legacyPhase}.avoid`, { returnObjects: true }) || [];
  const allSayThis = t(`partnerTips.${legacyPhase}.sayThis`, { returnObjects: true }) || [];
  const allOffer = t(`partnerTips.${legacyPhase}.offer`, { returnObjects: true }) || [];

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const supportTips = rotateSlice(allSupport, 3, dayOfYear);
  const avoidTips = rotateSlice(allAvoid, 2, dayOfYear + 7);
  const sayThisTips = rotateSlice(allSayThis, 2, dayOfYear + 13);
  const offerTips = rotateSlice(allOffer, 2, dayOfYear + 19);

  return (
    <CardPopup
      title={isJa ? 'パートナーガイド' : 'Partner Guide'}
      accentBg={PHASES.mi.tint}
      style={{ marginTop: 16 }}
      preview={
        <div style={{ ...GLASS, borderRadius: 24, overflow: 'hidden' }}>
          <div style={{
            width: '100%', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
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
              <div style={{ fontFamily: PMINCHO, fontSize: 16, fontWeight: 600, color: INK }}>
                {isJa ? 'パートナーガイド' : 'Partner Guide'}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3, marginTop: 1 }}>
                {isJa ? '大切な人に伝えたいこと' : 'What your partner should know'}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={INK3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      }
      detail={
        <div>
          {/* Understanding */}
          <div style={{ padding: '12px 14px', borderRadius: 16, background: PHASES.mi.tint, marginBottom: 12 }}>
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
            {supportTips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: PHASES.me.accent, flexShrink: 0, marginTop: 6 }} />
                <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>{tip}</span>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {avoidTips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: PHASES.sei.accent, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Say this */}
          {sayThisTips.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
                <span style={{ fontSize: 14 }}>💬</span>
                <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
                  {isJa ? 'こう言ってあげて' : 'Try saying this'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {sayThisTips.map((phrase, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', borderRadius: 12,
                    background: PHASES.ki.tint, border: `1px solid ${PHASES.ki.line}`,
                  }}>
                    <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.5, fontStyle: 'italic' }}>
                      "{phrase}"
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Things to offer */}
          {offerTips.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
                <span style={{ fontSize: 14 }}>🤲</span>
                <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
                  {isJa ? '今日できること' : 'Things you can do'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {offerTips.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: PHASES.mi.accent, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      }
    />
  );
}

/* ── component ──────────────────────────────────────────────── */
export function Dashboard({ cycleInfo, checkins = [], cycleLength = 28, periodHistory = [], onNavigateDiary, onNavigateCheckin }) {
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

  const legacyPhaseKey = PHASE_TO_LEGACY[phaseKey];
  const dailyQuote = getDailyQuote(isJa ? 'ja' : 'en');

  /* ── main view ── */
  return (
    <div style={{ position: 'relative', paddingBottom: 130 }}>

      {/* 1 ── full-screen soft pastel rainbow wash */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse 60% 30% at 10% 12%, rgba(228,132,158,0.25), transparent 70%),
          radial-gradient(ellipse 55% 28% at 40% 6%, rgba(240,184,24,0.22), transparent 70%),
          radial-gradient(ellipse 55% 30% at 75% 18%, rgba(68,196,116,0.25), transparent 70%),
          radial-gradient(ellipse 50% 25% at 90% 35%, rgba(228,132,158,0.16), transparent 70%),
          radial-gradient(ellipse 55% 30% at 20% 45%, rgba(68,196,116,0.18), transparent 70%),
          radial-gradient(ellipse 50% 28% at 55% 40%, rgba(240,184,24,0.16), transparent 70%),
          radial-gradient(ellipse 60% 30% at 80% 60%, rgba(240,184,24,0.18), transparent 70%),
          radial-gradient(ellipse 55% 28% at 35% 70%, rgba(228,132,158,0.16), transparent 70%),
          radial-gradient(ellipse 50% 25% at 65% 80%, rgba(68,196,116,0.15), transparent 70%),
          radial-gradient(ellipse 55% 30% at 15% 88%, rgba(240,184,24,0.14), transparent 70%),
          linear-gradient(180deg, #FFFCF2, #FFF9EE)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* relative wrapper for z-stacking above the wash */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* 2 ── greeting */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: PMINCHO, fontSize: 28, fontWeight: 600, color: INK }}>
            {copy.hi}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 16, fontWeight: 500, color: INK2, marginTop: 4 }}>
            {copy.vibe}
          </div>
        </div>

        {/* 3 ── hero card */}
        <CardPopup
          title={isJa ? phaseName : `${phaseName} Phase`}
          accentBg={p.tint}
          preview={
            <div style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 30,
              padding: '26px 22px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 6px 24px rgba(58,50,38,0.05)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 96,
                background: `linear-gradient(180deg, ${p.tint}, transparent)`, zIndex: 0,
              }} />
              <div style={{
                position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 18,
              }}>
                <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
                  <CycleRing size={150} day={day} stroke={9} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <PhaseSticker phase={phaseKey} size={74} />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 14px', borderRadius: 999, background: p.soft, marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 16 }}>{p.emoji}</span>
                    <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: p.deep }}>{phaseName}</span>
                  </div>
                  <div style={{ fontFamily: PMINCHO, fontSize: 48, fontWeight: 600, color: INK, lineHeight: 1 }}>
                    {isJa ? `${day}日目` : `Day ${day}`}
                  </div>
                  <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK2, marginTop: 6, lineHeight: 1.5 }}>
                    {copy.tip}
                  </div>
                </div>
              </div>
            </div>
          }
          detail={
            <div>
              {/* Phase header */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: PMINCHO, fontSize: 56, color: p.accent, lineHeight: 1 }}>{p.kanji}</div>
                <div style={{ fontFamily: PMINCHO, fontSize: 22, fontWeight: 600, color: INK, marginTop: 8 }}>
                  {isJa ? `${p.name} · ${p.reading}` : `${p.en} Phase`}
                </div>
                <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: INK2, marginTop: 4 }}>
                  {isJa ? `${p.season} · ${p.clinical}` : `${p.seasonEn} · ${p.clinicalEn}`}
                </div>
              </div>

              {/* Larger ring */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative', width: 180, height: 180 }}>
                  <CycleRing size={180} day={day} stroke={10} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <PhaseSticker phase={phaseKey} size={90} />
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: PMINCHO, fontSize: 42, fontWeight: 600, color: INK, lineHeight: 1 }}>
                  {isJa ? `${day}日目` : `Day ${day}`}
                </div>
              </div>

              {/* Phase poem */}
              <div style={{ padding: '16px 18px', borderRadius: 18, background: p.tint, border: `1px solid ${p.line}`, marginBottom: 16 }}>
                <p style={{ fontFamily: MARU, fontSize: 15, fontWeight: 600, color: p.deep, margin: 0, lineHeight: 1.65 }}>
                  {isJa ? p.poem : p.poemEn}
                </p>
              </div>

              {/* Phase description */}
              <p style={{ fontFamily: MARU, fontSize: 14, fontWeight: 500, color: INK2, margin: '0 0 16px', lineHeight: 1.6 }}>
                {t(`phases.${legacyPhaseKey}.description`)}
              </p>

              {/* Energy */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, background: CREAM2, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2 }}>
                  {t(`phases.${legacyPhaseKey}.energy`)}
                </span>
              </div>

              {/* Tip */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 14, background: CREAM2 }}>
                <span style={{ fontSize: 16 }}>💡</span>
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                  {copy.tip}
                </span>
              </div>
            </div>
          }
        />

        {/* 4 ── daily quote */}
        <CardPopup
          title={isJa ? '今日のことば' : "Today's Words"}
          accentBg={p.tint}
          style={{ marginTop: 16 }}
          preview={
            <div style={{
              background: `linear-gradient(135deg, ${p.soft}, ${p.tint})`,
              border: `1px solid ${p.line}`,
              borderRadius: 26,
              padding: '20px 22px',
              boxShadow: '0 4px 16px rgba(58,50,38,0.04)',
            }}>
              <p style={{
                fontFamily: MARU, fontSize: 15, fontWeight: 600,
                color: p.deep, lineHeight: 1.65, margin: 0,
              }}>
                {dailyQuote.text}
              </p>
            </div>
          }
          detail={
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: p.accent, lineHeight: 1, marginBottom: 20 }}>✦</div>
              <p style={{
                fontFamily: MARU, fontSize: 20, fontWeight: 600,
                color: p.deep, lineHeight: 1.7, margin: '0 0 28px',
              }}>
                {dailyQuote.text}
              </p>
              <div style={{
                padding: '16px 18px', borderRadius: 18,
                background: p.tint, border: `1px solid ${p.line}`,
              }}>
                <div style={{
                  fontFamily: MARU, fontSize: 11, fontWeight: 700, color: p.accent,
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
                }}>
                  {isJa ? '今日のアファメーション' : "Today's Affirmation"}
                </div>
                <p style={{
                  fontFamily: MARU, fontSize: 15, fontWeight: 600,
                  color: p.deep, margin: 0, lineHeight: 1.6,
                }}>
                  {copy.affirm}
                </p>
              </div>
            </div>
          }
        />

        {/* 5 ── forecast card */}
        <CardPopup
          title={t('predictions.forecastTitle')}
          style={{ marginTop: 0 }}
          preview={
            <ForecastCard forecast={forecast} cycleLength={cycleLength} isJa={isJa} t={t} />
          }
          detail={
            forecast ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {forecast.map((f, i) => {
                  const pk = phaseForDay(f.cycleDay);
                  const phase = PHASES[pk];
                  const isToday = f.dayOffset === 0;
                  const d = new Date();
                  d.setDate(d.getDate() + f.dayOffset);
                  const lbl = isToday ? (isJa ? '今日' : 'Today')
                    : f.dayOffset === 1 ? (isJa ? '明日' : 'Tomorrow')
                    : isJa ? `${d.getMonth()+1}/${d.getDate()}` : d.toLocaleDateString('en', { weekday: 'long' });
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: isToday ? '14px 10px' : '14px 4px',
                      borderBottom: i < forecast.length - 1 ? `1px solid ${LINE}` : 'none',
                      background: isToday ? phase.tint : 'transparent',
                      borderRadius: isToday ? 14 : 0,
                    }}>
                      <div style={{ width: 56, flexShrink: 0 }}>
                        <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: isToday ? 700 : 600, color: isToday ? phase.accent : INK3 }}>
                          {lbl}
                        </div>
                      </div>
                      <span style={{ fontSize: 24, lineHeight: 1 }}>{MOOD_EMOJI[Math.round(f.mood || 3)]}</span>
                      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 18 }}>
                        {ENERGY_BARS.slice(1).map(lvl => (
                          <div key={lvl} style={{
                            width: 5, height: 3 + lvl * 2.5, borderRadius: 2,
                            background: lvl <= Math.round(f.energy || 3) ? phase.accent : LINE,
                            opacity: lvl <= Math.round(f.energy || 3) ? 1 : 0.4,
                          }} />
                        ))}
                      </div>
                      <span style={{
                        fontFamily: MARU, fontSize: 11, fontWeight: 600,
                        color: phase.deep, padding: '2px 10px',
                        borderRadius: 8, background: isToday ? 'rgba(255,255,255,0.7)' : phase.tint, flexShrink: 0,
                      }}>
                        {isJa ? phase.name : phase.en}
                      </span>
                      {f.symptoms?.length > 0 && (
                        <span style={{
                          fontFamily: MARU, fontSize: 11, fontWeight: 500, color: INK3,
                          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {f.symptoms.join(', ')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                {/* Phase-based week preview (no check-in data needed) */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const futureDay = ((day - 1 + i) % cycleLength) + 1;
                    const pk = phaseForDay(futureDay);
                    const phase = PHASES[pk];
                    const isToday = i === 0;
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    const lbl = isToday ? (isJa ? '今日' : 'Today')
                      : i === 1 ? (isJa ? '明日' : 'Tomorrow')
                      : isJa ? `${d.getMonth()+1}/${d.getDate()}` : d.toLocaleDateString('en', { weekday: 'long' });
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: isToday ? '14px 10px' : '14px 4px',
                        borderBottom: i < 6 ? `1px solid ${LINE}` : 'none',
                        background: isToday ? phase.tint : 'transparent',
                        borderRadius: isToday ? 14 : 0,
                      }}>
                        <div style={{ width: 56, flexShrink: 0 }}>
                          <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: isToday ? 700 : 600, color: isToday ? phase.accent : INK3 }}>
                            {lbl}
                          </div>
                        </div>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{phase.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2,
                          }}>
                            {isJa ? `${phase.name} · ${phase.season}` : `${phase.en} · ${phase.seasonEn}`}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: MARU, fontSize: 11, fontWeight: 600,
                          color: phase.deep, padding: '2px 10px',
                          borderRadius: 8, background: isToday ? 'rgba(255,255,255,0.7)' : phase.tint, flexShrink: 0,
                        }}>
                          {isJa ? `${futureDay}日目` : `Day ${futureDay}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  marginTop: 16, padding: '12px 14px', borderRadius: 14,
                  background: CREAM2,
                }}>
                  <p style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK3, margin: 0, lineHeight: 1.5 }}>
                    {isJa
                      ? '💡 チェックインを5回以上すると、気分やエネルギーの予測が表示されます'
                      : '💡 Log 5+ check-ins to unlock mood & energy predictions'}
                  </p>
                </div>
              </div>
            )
          }
        />

        {/* 6 ── today's focus */}
        <TodaysFocusCard phaseKey={phaseKey} isJa={isJa} t={t} />

        {/* 7 ── daily check-in card */}
        <div
          onClick={() => onNavigateCheckin?.()}
          style={{
            marginTop: 16,
            ...GLASS,
            borderRadius: 24,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: PHASES.ki.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PHASES.ki.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: PMINCHO, fontSize: 16, fontWeight: 600, color: INK, lineHeight: 1.4 }}>
              {isJa ? '今日のチェックイン' : 'Daily Check-in'}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 500, color: INK3, marginTop: 2 }}>
              {isJa ? '気分・エネルギー・フローを記録' : 'Log mood, energy & flow'}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigateCheckin?.(); }}
            style={{
              padding: '7px 18px',
              borderRadius: 999,
              background: PHASES.ki.soft,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: PHASES.ki.deep }}>
              {isJa ? '記録' : 'Log'}
            </span>
          </button>
        </div>

        {/* 8 ── journal card */}
        <div
          onClick={() => onNavigateDiary?.()}
          style={{
            marginTop: 16,
            ...GLASS,
            borderRadius: 24,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: p.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: PMINCHO, fontSize: 16, fontWeight: 600, color: INK, lineHeight: 1.4 }}>
              {isJa ? '今日の気持ちを書こう' : "Write about today"}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 500, color: INK3, marginTop: 2 }}>
              {isJa ? 'ジャーナルで自分のリズムを知る' : 'Journal to understand your rhythm'}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigateDiary?.(); }}
            style={{
              padding: '7px 18px',
              borderRadius: 999,
              background: p.soft,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: p.deep }}>
              {isJa ? '書く' : 'Write'}
            </span>
          </button>
        </div>


      </div>
    </div>
  );
}
