import { useTranslation } from 'react-i18next';
import { PHASES, PHASE_ORDER, CYCLE_LEN, PAPER2, CARD, INK, INK2, INK3, LINE2, MINCHO, OLDMIN, GOTHIC, phaseKeyFromLegacy } from '../utils/phases';
import { CycleRing } from './CycleRing';
import { Ambient, BrushKanji } from './Ambient';

const HOME_COPY = {
  ja: {
    sei: { affirm: '「いまは、ただ休んでいい。めぐりは静かに始まっています。」', tip: '湯船にゆっくり浸かり、体を温めて。無理は禁物です。', hormone: 'エストロゲン・プロゲステロンともに低め。エネルギーは控えめに。', life: 'ひとりの時間を大切に。内省や記録に向く数日です。' },
    me: { affirm: '「新しい力が芽吹いています。少しずつ、外へ。」', tip: '新しいことを始めるのに最適。軽い運動で巡りを促して。', hormone: 'エストロゲンが上昇中。気分も体力も上向きに。', life: '発想がさえる時期。計画づくりや学びがはかどります。' },
    ki: { affirm: '「あなたは満開です。自信と魅力がピークに達しています。」', tip: 'デートナイトやパートナーとのつながりに最適な時期です。', hormone: 'エストロゲンが最高潮に。最高のエネルギー。', life: '言語能力がピーク。プレゼンや面接に最適。' },
    mi: { affirm: '「実りの季節。ゆっくりと、自分を整えてゆきましょう。」', tip: '温かい食事と十分な睡眠を。甘いものは控えめに。', hormone: 'プロゲステロンが優勢。落ち着きと内省の時期。', life: '仕上げや片づけに向く時期。新規より整理を。' },
  },
  en: {
    sei: { affirm: '"Rest is enough for now. The cycle is quietly beginning again."', tip: 'Take a long warm bath and keep cozy. Don\'t push yourself today.', hormone: 'Estrogen and progesterone are both low. Keep energy gentle.', life: 'Protect your alone time — good days for reflection and journaling.' },
    me: { affirm: '"New energy is budding. Step outward, little by little."', tip: 'A great time to start something new. Light movement keeps things flowing.', hormone: 'Estrogen is rising. Mood and stamina are trending up.', life: 'Ideas come easily now — plan, learn, and get ahead.' },
    ki: { affirm: '"You are in full bloom. Confidence and magnetism are at their peak."', tip: 'An ideal window for date nights and connecting with your partner.', hormone: 'Estrogen is at its peak — your highest energy of the cycle.', life: 'Verbal skills peak now. Perfect for presentations and interviews.' },
    mi: { affirm: '"A season of ripening. Slowly, gently, tend to yourself."', tip: 'Favor warm meals and plenty of sleep. Go easy on sweets.', hormone: 'Progesterone dominates — a calmer, more inward phase.', life: 'Better for finishing and tidying than starting anew.' },
  },
};

const ROW_LABELS = {
  ja: ['今日のヒント', 'エネルギーとホルモン', 'ライフスタイル'],
  en: ['Today’s tip', 'Energy & hormones', 'Lifestyle'],
};

function SproutIcon({ deep }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={deep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3 2.4-5.6 6-5.6-.2 3.4-2.6 5.6-6 5.6z" />
      <path d="M12 14.5c0-2.6-1.9-4.4-4.8-4.4.2 2.7 2 4.4 4.8 4.4z" />
    </svg>
  );
}

function WaveIcon({ deep }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={deep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14c1.6-3 3.2-3 4.8 0s3.2 3 4.8 0 3.2-3 4.8 0" />
      <path d="M3 9c1.6-3 3.2-3 4.8 0s3.2 3 4.8 0 3.2-3 4.8 0" opacity="0.45" />
    </svg>
  );
}

function SunIcon({ deep }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={deep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18" />
      <path d="M7.5 18a4.5 4.5 0 019 0" />
      <path d="M12 6.5V4M6.5 8.2L5 6.7M17.5 8.2L19 6.7" />
    </svg>
  );
}

function SakuraIcon({ accent }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="12" cy="7.2" rx="2.7" ry="4.4" transform={`rotate(${a} 12 12)`} fill={accent} fillOpacity="0.16" />
      ))}
      <circle cx="12" cy="12" r="1.7" fill={accent} stroke="none" />
    </svg>
  );
}

function CalendarIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChevronRight({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function InsightRow({ icon, title, body, accent, deep, soft, line }) {
  return (
    <div
      style={{
        background: CARD,
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: soft,
          border: `1px solid ${line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: GOTHIC, fontWeight: 700, fontSize: 14, color: INK, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontFamily: GOTHIC, fontSize: 13, color: INK2, lineHeight: 1.45 }}>
          {body}
        </div>
      </div>
      <ChevronRight color={INK3} />
    </div>
  );
}

export function Dashboard({ cycleInfo, viewMode }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ja') ? 'ja' : 'en';

  const phaseKey = phaseKeyFromLegacy(cycleInfo.phase);
  const p = PHASES[phaseKey];
  const copy = HOME_COPY[lang][phaseKey];
  const labels = ROW_LABELS[lang];

  const seasonLabel = lang === 'ja' ? p.season : p.seasonEn;
  const phaseName = lang === 'ja' ? p.name : p.en;
  const clinicalName = lang === 'ja' ? p.clinical : p.clinicalEn;
  const poem = lang === 'ja' ? p.poem : p.poemEn;

  const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
  const formattedDate = cycleInfo.nextPeriodDate
    ? new Date(cycleInfo.nextPeriodDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
    : '';

  const daysLeft = cycleInfo.daysUntilPeriod;
  const predictionText = lang === 'ja'
    ? `あと${daysLeft}日 · ${formattedDate}`
    : `In ${daysLeft} days · ${formattedDate}`;

  const dayLabel = lang === 'ja'
    ? `/ ${CYCLE_LEN}日目`
    : `of ${CYCLE_LEN}`;

  if (viewMode === 'partner') {
    return (
      <div style={{ padding: '24px 0' }}>
        <div
          style={{
            background: CARD,
            borderRadius: 20,
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {p.kanji}
          </div>
          <div style={{ fontFamily: MINCHO, fontSize: 18, color: INK, marginBottom: 8 }}>
            {lang === 'ja' ? 'パートナービュー' : 'Partner View'}
          </div>
          <div style={{ fontFamily: GOTHIC, fontSize: 14, color: INK3, lineHeight: 1.5 }}>
            {lang === 'ja' ? 'パートナー向けの画面は近日公開予定です。' : 'Partner view is coming soon.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingBottom: 24 }}>
      {/* Ambient glow */}
      <Ambient phase={phaseKey} top={-60} size={320} opacity={0.5} />

      {/* Hero card */}
      <div
        className="card"
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          background: CARD,
          padding: 0,
        }}
      >
        {/* BrushKanji watermark */}
        <div style={{ position: 'absolute', top: 8, right: 12, zIndex: 1 }}>
          <BrushKanji char={p.kanji} size={150} color={p.accent} opacity={0.08} />
        </div>

        {/* Tint gradient across top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 90,
            background: `linear-gradient(180deg, ${p.tint}, transparent)`,
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, paddingBottom: 24 }}>
          {/* CycleRing with overlaid center content */}
          <div style={{ position: 'relative', width: 244, height: 244 }}>
            <CycleRing size={244} day={cycleInfo.cycleDay} stroke={7} />
            {/* Center overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              {/* Eyebrow */}
              <div style={{ fontFamily: GOTHIC, fontSize: 12, color: p.accent, letterSpacing: 0.5, marginBottom: 2 }}>
                {seasonLabel} · {p.en}
              </div>
              {/* Big day number */}
              <div style={{ fontFamily: MINCHO, fontSize: 78, fontWeight: 600, color: INK, lineHeight: 1 }}>
                {cycleInfo.cycleDay}
              </div>
              {/* Day denominator */}
              <div style={{ fontFamily: MINCHO, fontSize: 17, color: INK3, marginTop: 2 }}>
                {dayLabel}
              </div>
            </div>
          </div>

          {/* Phase pill */}
          <div
            style={{
              marginTop: 18,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 999,
              background: `linear-gradient(135deg, ${p.accent}, ${p.deep})`,
              color: '#fff',
              boxShadow: `0 4px 14px ${p.accent}44`,
            }}
          >
            <span style={{ fontFamily: MINCHO, fontSize: 18 }}>{p.kanji}</span>
            <span style={{ fontFamily: GOTHIC, fontSize: 14, fontWeight: 600 }}>{phaseName}</span>
            <span style={{ fontFamily: GOTHIC, fontSize: 12, opacity: 0.8 }}>{clinicalName}</span>
          </div>

          {/* Poem line */}
          <div
            style={{
              marginTop: 16,
              fontFamily: MINCHO,
              fontSize: 14,
              color: INK2,
              textAlign: 'center',
              paddingLeft: 24,
              paddingRight: 24,
              lineHeight: 1.6,
            }}
          >
            {poem}
          </div>

          {/* Prediction row */}
          <div
            style={{
              marginTop: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 999,
              background: PAPER2,
            }}
          >
            <CalendarIcon color={phaseKey === 'sei' ? '#9A3B50' : p.accent} />
            <span style={{ fontFamily: GOTHIC, fontSize: 14, fontWeight: 700, color: INK }}>
              {predictionText}
            </span>
          </div>
        </div>
      </div>

      {/* Affirmation strip */}
      <div
        style={{
          marginTop: 14,
          background: `linear-gradient(135deg, ${p.tint}, ${CARD})`,
          borderLeft: `3px solid ${p.accent}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SakuraIcon accent={p.accent} />
        </div>
        <div
          style={{
            fontFamily: MINCHO,
            fontSize: 14,
            fontStyle: 'italic',
            color: INK2,
            lineHeight: 1.55,
          }}
        >
          {copy.affirm}
        </div>
      </div>

      {/* Insight rows */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <InsightRow
          icon={<SproutIcon deep={p.deep} />}
          title={labels[0]}
          body={copy.tip}
          accent={p.accent}
          deep={p.deep}
          soft={p.soft}
          line={p.line}
        />
        <InsightRow
          icon={<WaveIcon deep={p.deep} />}
          title={labels[1]}
          body={copy.hormone}
          accent={p.accent}
          deep={p.deep}
          soft={p.soft}
          line={p.line}
        />
        <InsightRow
          icon={<SunIcon deep={p.deep} />}
          title={labels[2]}
          body={copy.life}
          accent={p.accent}
          deep={p.deep}
          soft={p.soft}
          line={p.line}
        />
      </div>
    </div>
  );
}
