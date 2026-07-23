import { useTranslation } from 'react-i18next';
import { PHASES, PHASE_ORDER, CYCLE_LEN, MARU, PMINCHO, INK, INK2, INK3, CARD, CREAM2, LINE, phaseKeyFromLegacy } from '../utils/phases';
import { CycleRing } from './CycleRing';
import { PhaseSticker } from './PhaseSticker';

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

/* ── component ──────────────────────────────────────────────── */
export function Dashboard({ cycleInfo, viewMode }) {
  const { i18n } = useTranslation();
  const phaseKey = phaseKeyFromLegacy(cycleInfo.phase);
  const day = cycleInfo.cycleDay;
  const isJa = i18n.language.startsWith('ja');
  const lang = isJa ? 'ja' : 'en';

  const p = PHASES[phaseKey];
  const copy = PLAY_COPY[phaseKey][lang];
  const phaseName = isJa ? p.name : p.en;

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

        {/* 5 ── social pod strip */}
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

        {/* 6 ── quick chips row */}
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
            <div key={chip.en} style={{
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
