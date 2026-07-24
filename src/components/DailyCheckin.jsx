import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, MARU, PMINCHO, INK, INK2, INK3, CARD, CREAM2, LINE, LINE2, phaseKeyFromLegacy } from '../utils/phases';

/* ── symptom keys (unchanged for data compat) & display labels ── */
const SYMPTOM_KEYS = [
  'cramps', 'headache', 'bloating', 'backPain',
  'breastTenderness', 'acne', 'cravings', 'nausea',
  'fatigue', 'insomnia',
];
const SYMPTOM_DISPLAY = {
  en: { cramps: 'Cramps', headache: 'Headache', bloating: 'Bloating', backPain: 'Back pain', breastTenderness: 'Tender breasts', acne: 'Acne', cravings: 'Cravings', nausea: 'Nausea', fatigue: 'Fatigue', insomnia: 'Insomnia' },
  ja: { cramps: '生理痛', headache: '頭痛', bloating: 'むくみ', backPain: '腰痛', breastTenderness: '胸の張り', acne: 'ニキビ', cravings: '食欲増加', nausea: '吐き気', fatigue: '倦怠感', insomnia: '不眠' },
};

const FLOW_LABELS = {
  en: ['None', 'Spot', 'Light', 'Medium', 'Heavy'],
  ja: ['なし', '少量', '軽い', '普通', '多い'],
};

const MOOD_HINTS = {
  en: { 1: 'Bad', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great' },
  ja: { 1: '悪い', 2: '低い', 3: '普通', 4: '良い', 5: '最高' },
};

const ENERGY_HINTS = {
  en: { 1: 'Exhausted', 2: 'Low', 3: 'Moderate', 4: 'Good', 5: 'High' },
  ja: { 1: '疲労', 2: '低い', 3: '普通', 4: '良い', 5: '最高' },
};

const CARD_SHADOW = '0 8px 22px rgba(60,50,55,0.06)';

/* ── legacy phase helper (mirrors cycleData.getPhaseForDay) ── */
function legacyPhaseForDay(day, len = 28) {
  const r = len / 28;
  if (day <= Math.round(5 * r)) return 'menstrual';
  if (day <= Math.round(13 * r)) return 'follicular';
  if (day <= Math.round(17 * r)) return 'ovulatory';
  return 'luteal';
}

/* ================================================================
   DailyCheckin  —  Peanut-flavored playful check-in screen
   ================================================================ */
export function DailyCheckin({
  cycleDay,
  onSave,
  existingData,
  checkins = [],
  onLogPeriod,
  periodHistory = [],
}) {
  const { i18n } = useTranslation();
  const ja = i18n.language.startsWith('ja');
  const lang = ja ? 'ja' : 'en';
  const today = new Date().toISOString().split('T')[0];

  /* phase */
  const phaseKey = phaseKeyFromLegacy(legacyPhaseForDay(cycleDay));
  const p = PHASES[phaseKey];
  const sei = PHASES.sei;

  /* state */
  const [mood, setMood] = useState(existingData?.mood || 3);
  const [energy, setEnergy] = useState(existingData?.energy || 3);
  const [flow, setFlow] = useState(existingData?.flow || 0);
  const [symptoms, setSymptoms] = useState(existingData?.symptoms || []);
  const [saved, setSaved] = useState(false);

  const toggleSymptom = (key) => {
    setSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const handleSave = () => {
    onSave({ date: today, mood, energy, flow, symptoms, cycleDay });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ── shared segment builder ── */
  function Segments({ count, value, onChange, labels, selectedGradient, style: extraStyle }) {
    const grad = selectedGradient || `linear-gradient(135deg, ${p.accent}, ${p.deep})`;
    return (
      <div style={{ display: 'flex', gap: 8, ...extraStyle }}>
        {Array.from({ length: count }, (_, i) => {
          const active = value === (labels ? i : i + 1);
          const idx = labels ? i : i + 1;
          return (
            <button
              key={idx}
              onClick={() => onChange(idx)}
              style={{
                flex: 1,
                height: extraStyle?.height || 52,
                borderRadius: extraStyle?.borderRadius || 14,
                border: active ? 'none' : `1px solid ${LINE}`,
                background: active ? grad : CARD,
                color: active ? '#fff' : INK3,
                fontFamily: MARU,
                fontSize: extraStyle?.fontSize || 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: active ? `0 6px 16px ${p.accent}44` : 'none',
                transition: 'all 0.2s',
                padding: extraStyle?.padding || 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {labels ? labels[i] : idx}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── 0. Blobby radial gradient wash ── */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${sei.accent}20, ${sei.soft}18 45%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── 1. Period log CTA ── */}
      <button
        onClick={() => onLogPeriod && onLogPeriod(today)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          padding: '20px 22px',
          borderRadius: 22,
          border: 'none',
          background: `linear-gradient(135deg, ${sei.accent}, ${sei.deep})`,
          boxShadow: `0 14px 30px ${sei.accent}33`,
          cursor: 'pointer',
          textAlign: 'left',
          color: '#fff',
          transition: 'transform 0.15s',
          zIndex: 1,
        }}
      >
        {/* large translucent kanji watermark */}
        <span
          style={{
            position: 'absolute',
            right: -10,
            top: -18,
            fontFamily: PMINCHO,
            fontWeight: 700,
            fontSize: 140,
            lineHeight: 1,
            color: '#fff',
            opacity: 0.08,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {sei.kanji}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* icon tile */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: MARU, fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>
                {ja ? '生理開始を記録' : 'Log period start'}
              </div>
              <div style={{ fontSize: 13, fontFamily: MARU, opacity: 0.78, marginTop: 2 }}>
                {ja ? '生理が始まったらタップ' : 'Tap if your period started today'}
              </div>
            </div>
          </div>
          {/* chevron */}
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
            <polyline points="9 5 16 12 9 19" />
          </svg>
        </div>
      </button>

      {/* ── 2. Header ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: MARU, fontSize: 24, fontWeight: 800, color: INK, margin: 0 }}>
          {ja ? '毎日のチェックイン' : 'Daily check-in'}
        </h2>
        <p style={{ fontFamily: MARU, fontSize: 13, color: INK2, margin: '6px 0 0' }}>
          {ja ? '今日の調子はどうですか？' : 'How are you feeling today?'}
        </p>
      </div>

      {/* ── 3. Mood scale ── */}
      <div style={{ background: CARD, borderRadius: 18, padding: '20px 20px 22px', boxShadow: CARD_SHADOW, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: MARU, fontSize: 19, fontWeight: 700, color: INK }}>
            {ja ? '気分' : 'Mood'}
          </span>
          <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: p.accent }}>
            {MOOD_HINTS[lang][mood]}
          </span>
        </div>
        <Segments count={5} value={mood} onChange={setMood} />
      </div>

      {/* ── 4. Energy scale ── */}
      <div style={{ background: CARD, borderRadius: 18, padding: '20px 20px 22px', boxShadow: CARD_SHADOW, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: MARU, fontSize: 19, fontWeight: 700, color: INK }}>
            {ja ? 'エネルギー' : 'Energy'}
          </span>
          <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: p.accent }}>
            {ENERGY_HINTS[lang][energy]}
          </span>
        </div>
        <Segments count={5} value={energy} onChange={setEnergy} />
      </div>

      {/* ── 5. Flow selector ── */}
      <div style={{ background: CARD, borderRadius: 18, padding: '20px 20px 22px', boxShadow: CARD_SHADOW, position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontFamily: MARU, fontSize: 19, fontWeight: 700, color: INK }}>
            {ja ? '経血量' : 'Flow'}
          </span>
        </div>
        <Segments
          count={5}
          value={flow}
          onChange={setFlow}
          labels={FLOW_LABELS[lang]}
          selectedGradient={`linear-gradient(135deg, ${sei.accent}, ${sei.deep})`}
          style={{ height: 46, borderRadius: 13, fontSize: 13.5, padding: '11px 0' }}
        />
      </div>

      {/* ── 6. Symptoms ── */}
      <div style={{ background: CARD, borderRadius: 18, padding: '20px 20px 22px', boxShadow: CARD_SHADOW, position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontFamily: MARU, fontSize: 19, fontWeight: 700, color: INK }}>
            {ja ? '症状' : 'Symptoms'}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SYMPTOM_KEYS.map((key) => {
            const active = symptoms.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleSymptom(key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 99,
                  border: `1px solid ${active ? p.line : LINE}`,
                  background: active ? p.soft : CARD,
                  color: active ? p.deep : INK2,
                  fontFamily: MARU,
                  fontSize: 13.5,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  lineHeight: 1.3,
                }}
              >
                {SYMPTOM_DISPLAY[lang][key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 7. Save button ── */}
      <button
        onClick={handleSave}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: 56,
          borderRadius: 18,
          border: 'none',
          background: `linear-gradient(135deg, ${p.accent}, ${p.deep})`,
          color: '#fff',
          fontFamily: MARU,
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: `0 8px 24px ${p.accent}33`,
          transition: 'all 0.2s',
        }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {ja ? '今日の記録を保存' : "Save today's entry"}
      </button>

      {/* ── Toast ── */}
      {saved && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: p.deep,
            color: '#fff',
            fontFamily: MARU,
            fontSize: 14,
            fontWeight: 600,
            padding: '12px 28px',
            borderRadius: 14,
            boxShadow: `0 8px 28px ${p.accent}44`,
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {ja ? '保存しました' : 'Saved!'}
        </div>
      )}
    </div>
  );
}
