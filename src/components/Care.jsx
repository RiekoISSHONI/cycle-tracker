import { useState, useEffect } from 'react';
import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, CARD, INK, INK2, INK3, LINE, MARU, PMINCHO, CREAM2, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { useTranslation } from 'react-i18next';
import { trackImpression, trackClick, rotatePool, getDayOfYear } from '../utils/analytics';

const PHASE_TO_LEGACY = { sei: 'menstrual', me: 'follicular', ki: 'ovulatory', mi: 'luteal' };

const TeaIcon = (color) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 010 8h-1" />
    <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
    <path d="M6 2v3" /><path d="M10 2v3" /><path d="M14 2v3" />
  </svg>
);
const DropIcon = (color) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c4.97 0 9-3.58 9-8s-9-12-9-12S3 9.58 3 14s4.03 8 9 8z" />
  </svg>
);
const ShieldIcon = (color) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const TEA_POOL = [
  { id: 'peppermint', nameJa: 'ペパーミントティー', nameEn: 'Peppermint Tea', noteJa: '消化を助け、気持ちをリフレッシュ。', noteEn: 'Aids digestion and refreshes the mind.', icon: TeaIcon },
  { id: 'jasmine', nameJa: 'ジャスミン緑茶', nameEn: 'Jasmine Green Tea', noteJa: '穏やかな香りで心を落ち着かせる。', noteEn: 'A gentle fragrance to calm and soothe.', icon: TeaIcon },
  { id: 'chamomile', nameJa: 'カモミールティー', nameEn: 'Chamomile Tea', noteJa: '緊張をほぐし、安眠を促す。', noteEn: 'Relieves tension and promotes restful sleep.', icon: TeaIcon },
  { id: 'ginger', nameJa: 'ジンジャーティー', nameEn: 'Ginger Tea', noteJa: '体を温め、冷えを改善。', noteEn: 'Warms the body and improves circulation.', icon: TeaIcon },
  { id: 'rooibos', nameJa: 'ルイボスティー', nameEn: 'Rooibos Tea', noteJa: 'ノンカフェインでミネラル豊富。', noteEn: 'Caffeine-free and rich in minerals.', icon: TeaIcon },
  { id: 'rosebud', nameJa: 'ローズバッドティー', nameEn: 'Rose Bud Tea', noteJa: '血行を促進し、肌の調子を整える。', noteEn: 'Promotes circulation and supports clear skin.', icon: TeaIcon },
  { id: 'matcha', nameJa: '抹茶ラテ', nameEn: 'Matcha Latte', noteJa: '穏やかなカフェインで集中力アップ。', noteEn: 'Gentle caffeine boost for sustained focus.', icon: TeaIcon },
  { id: 'chrysanthemum', nameJa: '菊花茶', nameEn: 'Chrysanthemum Tea', noteJa: '目の疲れを癒し、のぼせを和らげる。', noteEn: 'Soothes tired eyes and clears excess heat.', icon: TeaIcon },
];

const SKINCARE_POOL = [
  { id: 'sunscreen', nameJa: 'ミネラル日焼け止め', nameEn: 'Mineral Sunscreen SPF50', noteJa: '肌に優しいミネラルベースの紫外線対策。', noteEn: 'Gentle mineral-based UV protection.', icon: ShieldIcon },
  { id: 'rosewater', nameJa: 'ローズウォーターミスト', nameEn: 'Rosewater Mist', noteJa: 'いつでも潤いと爽やかさを。', noteEn: 'Instant hydration and freshness anytime.', icon: DropIcon },
  { id: 'gel-moist', nameJa: 'ジェル保湿クリーム', nameEn: 'Light Gel Moisturizer', noteJa: '軽いテクスチャーで毎日の保湿に。', noteEn: 'Lightweight texture for everyday moisture.', icon: DropIcon },
  { id: 'vitamin-c', nameJa: 'ビタミンCセラム', nameEn: 'Vitamin C Serum', noteJa: 'くすみを改善し、明るい肌へ。', noteEn: 'Brightens skin and evens complexion.', icon: DropIcon },
  { id: 'hyaluronic', nameJa: 'ヒアルロン酸マスク', nameEn: 'Hyaluronic Acid Mask', noteJa: '深い保湿で弾力のある肌に。', noteEn: 'Deep hydration for plump, bouncy skin.', icon: DropIcon },
  { id: 'clay-mask', nameJa: 'クレイマスク', nameEn: 'Purifying Clay Mask', noteJa: '毛穴の汚れを吸着し、すっきり。', noteEn: 'Draws out impurities and refines pores.', icon: DropIcon },
  { id: 'facial-oil', nameJa: 'ローズヒップオイル', nameEn: 'Rosehip Facial Oil', noteJa: '肌の再生を促し、ツヤを与える。', noteEn: 'Promotes skin renewal and radiance.', icon: DropIcon },
  { id: 'eye-cream', nameJa: 'アイクリーム', nameEn: 'Peptide Eye Cream', noteJa: '目元のむくみとクマに。', noteEn: 'Reduces puffiness and dark circles.', icon: DropIcon },
];

/* ── nutrition section ─────────────────────────────────────── */
function NutritionSection({ phaseKey, isJa, t }) {
  const [showTcm, setShowTcm] = useState(false);
  const legacyPhase = PHASE_TO_LEGACY[phaseKey];
  const p = PHASES[phaseKey];

  const westernTips = t(`nutritionContent.${legacyPhase}.western`, { returnObjects: true }) || [];
  const tcm = t(`nutritionContent.${legacyPhase}.tcm`, { returnObjects: true }) || {};
  const tcmFoods = tcm.foods || [];
  const tcmAvoid = tcm.avoid || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 10,
          background: PHASES.ki.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PHASES.ki.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
          </svg>
        </div>
        <h3 style={{ fontFamily: MARU, fontSize: 17, fontWeight: 800, color: INK, margin: 0 }}>
          {isJa ? '栄養' : 'Nutrition'}
        </h3>
      </div>

      <div style={{
        background: CARD, borderRadius: 24,
        boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
        padding: '18px 18px',
      }}>
        {/* Toggle between modern/TCM */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => setShowTcm(false)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: !showTcm ? p.soft : CREAM2,
              fontFamily: MARU, fontSize: 12, fontWeight: 700,
              color: !showTcm ? p.deep : INK3,
            }}
          >
            {isJa ? '科学' : 'Science'}
          </button>
          <button
            onClick={() => setShowTcm(true)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: showTcm ? p.soft : CREAM2,
              fontFamily: MARU, fontSize: 12, fontWeight: 700,
              color: showTcm ? p.deep : INK3,
            }}
          >
            {isJa ? '漢方' : 'TCM'}
          </button>
        </div>

        {!showTcm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {westernTips.slice(0, 4).map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: PHASES.ki.accent, flexShrink: 0, marginTop: 6,
                }} />
                <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* TCM principle */}
            <div style={{
              padding: '10px 14px', borderRadius: 14,
              background: p.tint, marginBottom: 12,
            }}>
              <span style={{ fontFamily: MARU, fontSize: 11, fontWeight: 700, color: p.accent }}>
                {isJa ? '原則' : 'Principle'}
              </span>
              <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: p.deep, margin: '4px 0 0', lineHeight: 1.5 }}>
                {tcm.principle}
              </p>
            </div>

            {/* Recommended foods */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>🍲</span>
              <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
                {isJa ? 'おすすめ食材' : 'Recommended Foods'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {tcmFoods.slice(0, 4).map((food, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: PHASES.me.accent, flexShrink: 0, marginTop: 6,
                  }} />
                  <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                    {food}
                  </span>
                </div>
              ))}
            </div>

            {/* Avoid */}
            {tcmAvoid.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, paddingTop: 8, borderTop: `1px solid ${LINE}` }}>
                  <span style={{ fontSize: 13 }}>🚫</span>
                  <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK }}>
                    {isJa ? '控えたい食材' : 'Foods to Avoid'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {tcmAvoid.map((food, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: PHASES.sei.accent, flexShrink: 0, marginTop: 6,
                      }} />
                      <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
                        {food}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Tea recommendation */}
            {tcm.tea && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 14,
                background: PHASES.me.tint,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>🍵</span>
                <span style={{ fontFamily: MARU, fontSize: 12.5, fontWeight: 600, color: PHASES.me.deep, lineHeight: 1.4 }}>
                  {tcm.tea}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── exercise video pool by phase ──────────────────────────── */
const WORKOUT_VIDEOS = {
  sei: [
    { id: 'sei-yoga', nameJa: 'やさしいヨガストレッチ', nameEn: 'Gentle Yoga Stretch', duration: '15 min', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=sTANio_2E0Q' },
    { id: 'sei-walk', nameJa: 'リラックス瞑想ウォーク', nameEn: 'Calming Walk & Breathwork', duration: '20 min', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=swMKPacBMbU' },
    { id: 'sei-restorative', nameJa: 'リストラティブヨガ', nameEn: 'Restorative Yoga', duration: '20 min', channel: 'Yoga With Kassandra', url: 'https://www.youtube.com/watch?v=MO8z3i02OBQ' },
    { id: 'sei-yin', nameJa: '陰ヨガ（下半身）', nameEn: 'Yin Yoga for Lower Body', duration: '25 min', channel: 'Boho Beautiful', url: 'https://www.youtube.com/watch?v=SxQj30KkTYo' },
    { id: 'sei-stretch', nameJa: '寝る前ストレッチ', nameEn: 'Bedtime Stretch Routine', duration: '10 min', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
  ],
  me: [
    { id: 'me-fullbody', nameJa: '全身エネルギーワークアウト', nameEn: 'Full Body Energy Boost', duration: '30 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
    { id: 'me-strength', nameJa: '初心者向け筋トレ', nameEn: 'Beginner Strength Training', duration: '25 min', channel: 'Sydney Cummings', url: 'https://www.youtube.com/watch?v=UItWltVZZmE' },
    { id: 'me-power', nameJa: 'パワーヨガフロー', nameEn: 'Power Yoga Flow', duration: '30 min', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=9kOCY0KNByw' },
    { id: 'me-dumbbell', nameJa: 'ダンベルワークアウト', nameEn: 'Dumbbell Full Body', duration: '30 min', channel: 'Caroline Girvan', url: 'https://www.youtube.com/watch?v=pHmDC2lVhPo' },
    { id: 'me-run', nameJa: 'ランニングガイド', nameEn: 'Couch to 5K Run', duration: '30 min', channel: 'The Run Experience', url: 'https://www.youtube.com/watch?v=eFg8iXI0mYE' },
  ],
  ki: [
    { id: 'ki-hiit', nameJa: 'HIIT有酸素トレーニング', nameEn: 'HIIT Cardio Blast', duration: '25 min', channel: 'Heather Robertson', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
    { id: 'ki-dance', nameJa: 'ダンスワークアウト', nameEn: 'Dance Workout', duration: '30 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=ZWk19OVon2k' },
    { id: 'ki-tabata', nameJa: 'タバタトレーニング', nameEn: 'Tabata Challenge', duration: '20 min', channel: 'Heather Robertson', url: 'https://www.youtube.com/watch?v=XIeCMhNWFQQ' },
    { id: 'ki-boxing', nameJa: 'キックボクシング', nameEn: 'Kickboxing Cardio', duration: '25 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=nQqzZqLqhMA' },
    { id: 'ki-spin', nameJa: 'サイクリングワークアウト', nameEn: 'Indoor Cycling Ride', duration: '30 min', channel: 'The Fitness Marshall', url: 'https://www.youtube.com/watch?v=dSw_p4ezb5k' },
  ],
  mi: [
    { id: 'mi-pilates', nameJa: 'やさしいピラティス', nameEn: 'Gentle Pilates Flow', duration: '20 min', channel: 'Move With Nicole', url: 'https://www.youtube.com/watch?v=K56Z12XNQ5c' },
    { id: 'mi-stretch', nameJa: 'ストレス解消ストレッチ', nameEn: 'Stress Relief Stretching', duration: '15 min', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=hJbRpHZr_d0' },
    { id: 'mi-barre', nameJa: 'バレエバー', nameEn: 'Low Impact Barre', duration: '25 min', channel: 'Barre3', url: 'https://www.youtube.com/watch?v=76lIRIjbMaY' },
    { id: 'mi-swim', nameJa: '水泳ガイド', nameEn: 'Swimming Techniques', duration: '15 min', channel: 'Swim England', url: 'https://www.youtube.com/watch?v=gh5V0saf1UU' },
    { id: 'mi-walk', nameJa: 'パワーウォーキング', nameEn: 'Power Walking', duration: '30 min', channel: 'Walk at Home', url: 'https://www.youtube.com/watch?v=JOe-BgYEfMo' },
  ],
};

/* ── exercise section ─────────────────────────────────────── */
function ExerciseSection({ phaseKey, isJa, t, dayOfYear }) {
  const legacyPhase = PHASE_TO_LEGACY[phaseKey];
  const p = PHASES[phaseKey];

  const exerciseTips = t(`phaseTips.${legacyPhase}.exercise`, { returnObjects: true }) || [];
  const allVideos = WORKOUT_VIDEOS[phaseKey] || [];
  const videos = rotatePool(allVideos, 2, dayOfYear + 13);

  useEffect(() => {
    videos.forEach(v => trackImpression('video', v.id));
  }, [videos.map(v => v.id).join(',')]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 10,
          background: PHASES.me.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PHASES.me.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <path d="M5 22l3-9 4 3 4-3 3 9" />
            <path d="M6.5 13L12 15l5.5-2" />
          </svg>
        </div>
        <h3 style={{ fontFamily: MARU, fontSize: 17, fontWeight: 800, color: INK, margin: 0 }}>
          {isJa ? '運動' : 'Exercise'}
        </h3>
      </div>

      {/* Tips card */}
      <div style={{
        background: CARD, borderRadius: 24,
        boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
        padding: '18px 18px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exerciseTips.map((tip, i) => {
            const isWarning = tip.startsWith('CAUTION');
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                ...(isWarning ? {
                  padding: '10px 12px', borderRadius: 14,
                  background: PHASES.sei.tint,
                  margin: '4px 0',
                } : {}),
              }}>
                {isWarning ? (
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                ) : (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: PHASES.me.accent, flexShrink: 0, marginTop: 6,
                  }} />
                )}
                <span style={{
                  fontFamily: MARU, fontSize: 12.5, fontWeight: isWarning ? 700 : 600,
                  color: isWarning ? PHASES.sei.deep : INK2, lineHeight: 1.5,
                }}>
                  {tip}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workout videos */}
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('video', video.id)}
          style={{
            background: CARD, borderRadius: 24,
            boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'none', cursor: 'pointer',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: PHASES.me.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={PHASES.me.accent} stroke="none">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: MARU, fontSize: 14.5, fontWeight: 700, color: INK }}>
              {isJa ? video.nameJa : video.nameEn}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 11.5, fontWeight: 600, color: INK3, marginTop: 2 }}>
              {video.channel} · {video.duration}
            </div>
          </div>

          <div style={{
            padding: '6px 14px', borderRadius: 20, border: 'none',
            background: PHASES.me.tint,
            fontFamily: MARU, fontSize: 12, fontWeight: 700, color: PHASES.me.accent,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {isJa ? '再生' : 'Watch'}
          </div>
        </a>
      ))}
    </div>
  );
}

export function Care({ phase, onNavigateSettings }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');

  const phaseKey = phaseKeyFromLegacy(phase);
  const p = PHASES[phaseKey];
  const dayOfYear = getDayOfYear();

  const rotatedTeas = rotatePool(TEA_POOL, 2, dayOfYear);
  const rotatedSkincare = rotatePool(SKINCARE_POOL, 2, dayOfYear + 5);

  useEffect(() => {
    rotatedTeas.forEach(item => trackImpression('tea', item.id));
    rotatedSkincare.forEach(item => trackImpression('skincare', item.id));
  }, [rotatedTeas.map(i => i.id).join(','), rotatedSkincare.map(i => i.id).join(',')]);

  const TOPIC_COLORS = {
    teas: PHASES.sei,
    skincare: PHASES.mi,
    nutrition: PHASES.ki,
    exercise: PHASES.me,
  };

  const groupIcon = {
    teas: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 010 8h-1" />
        <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
      </svg>
    ),
    skincare: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L12 14l6.34 8h1.66l-3-10z" />
        <path d="M9 2L7.17 4.17" /><path d="M15 2l1.83 2.17" /><path d="M12 2v3" />
      </svg>
    ),
  };

  const groups = [
    { key: 'teas', titleJa: 'お茶', titleEn: 'Teas', items: rotatedTeas },
    { key: 'skincare', titleJa: 'スキンケア', titleEn: 'Skincare', items: rotatedSkincare },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16 }}>
      {/* Header card */}
      <div
        style={{
          background: CARD,
          borderRadius: 24,
          boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${p.soft} 0%, transparent 70%)`,
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PHASES.ki.tint} 0%, transparent 70%)`,
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: PMINCHO, fontSize: 32, fontWeight: 600, color: p.accent, lineHeight: 1 }}>
              {p.kanji}
            </span>
            <div>
              <span style={{ fontFamily: MARU, fontSize: 11, fontWeight: 700, color: p.accent }}>
                {isJa ? p.season : p.seasonEn}
              </span>
              <span style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3, marginLeft: 6 }}>
                {isJa ? p.clinical : p.clinicalEn}
              </span>
            </div>
          </div>

          <h2 style={{ fontFamily: MARU, fontSize: 25, fontWeight: 800, color: INK, margin: '0 0 10px' }}>
            {isJa ? '今週の養生' : "This Week's Care"}
          </h2>

          <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.65, margin: '0 0 14px' }}>
            {isJa ? p.poem : p.poemEn}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 20,
              background: PHASES.me.soft,
              border: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PHASES.me.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontFamily: MARU, fontSize: 11.5, fontWeight: 700, color: PHASES.me.accent }}>
              {isJa ? '周期データは非公開のまま' : 'Your cycle data stays private'}
            </span>
          </div>
        </div>
      </div>

      {/* Grouped recommendations */}
      {groups.map((group) => {
        const tc = TOPIC_COLORS[group.key];
        return (
          <div key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  background: tc.soft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {groupIcon[group.key](tc.accent)}
              </div>
              <h3 style={{ fontFamily: MARU, fontSize: 17, fontWeight: 800, color: INK, margin: 0 }}>
                {isJa ? group.titleJa : group.titleEn}
              </h3>
            </div>

            {group.items.map((item) => (
              <div
                key={item.id}
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
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: tc.soft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.icon(tc.accent)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: MARU, fontSize: 15.5, fontWeight: 700, color: INK }}>
                    {isJa ? item.nameJa : item.nameEn}
                  </div>
                  <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK3, marginTop: 1 }}>
                    {isJa ? item.nameEn : item.nameJa}
                  </div>
                  <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK2, marginTop: 4, lineHeight: 1.4 }}>
                    {isJa ? item.noteJa : item.noteEn}
                  </div>
                </div>

                <button
                  onClick={() => trackClick(group.key === 'teas' ? 'tea' : 'skincare', item.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    background: tc.tint,
                    fontFamily: MARU,
                    fontSize: 12,
                    fontWeight: 700,
                    color: tc.accent,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {isJa ? '見る' : 'View'}
                </button>
              </div>
            ))}
          </div>
        );
      })}

      {/* Nutrition section */}
      <NutritionSection phaseKey={phaseKey} isJa={isJa} t={t} />

      {/* Exercise section */}
      <ExerciseSection phaseKey={phaseKey} isJa={isJa} t={t} dayOfYear={dayOfYear} />

      {/* Settings link */}
      <button
        onClick={() => {
          // Navigate to Settings tab - dispatch a custom event that App.jsx can listen to
          if (onNavigateSettings) onNavigateSettings();
        }}
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
          color: INK2,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INK3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        {isJa ? '設定' : 'Settings'}
      </button>
    </div>
  );
}
