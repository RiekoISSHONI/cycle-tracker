import { useState, useEffect } from 'react';
import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, CARD, INK, INK2, INK3, LINE, MARU, PMINCHO, CREAM2, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { useTranslation } from 'react-i18next';
import { trackImpression, trackClick, rotatePool, getDayOfYear } from '../utils/analytics';
import { trackContent } from '../utils/telemetry';
import { getCleanAffiliateUrl, openAffiliateLink, isCalmModeEnabled } from '../utils/commerce';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
        <h3 style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK, margin: 0 }}>
          {isJa ? '栄養' : 'Nutrition'}
        </h3>
      </div>

      <div style={{
        background: CARD, borderRadius: 24,
        boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
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
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
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
                  <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
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
                      <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.5 }}>
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
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: PHASES.me.deep, lineHeight: 1.4 }}>
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
/* Every URL below is a verified, publicly available YouTube video.
   rotatePool() picks 2 per day so users see variety across the cycle. */
const WORKOUT_VIDEOS = {
  sei: [
    { id: 'sei-yoga', nameJa: '生理痛・PMS向けヨガ', nameEn: 'Yoga for Cramps & PMS', duration: '20 min', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=4JaCcp39iVI' },
    { id: 'sei-stretch', nameJa: '全身リラックスストレッチ', nameEn: 'Full Body Relaxation Stretch', duration: '25 min', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=8XNpAg5mDS8' },
    { id: 'sei-restorative', nameJa: 'リストラティブヨガ', nameEn: 'Restorative Yoga for Deep Healing', duration: '30 min', channel: 'Yoga With Kassandra', url: 'https://www.youtube.com/watch?v=SGZdaH_fVNE' },
    { id: 'sei-yin', nameJa: '陰ヨガ（ストレス解消）', nameEn: 'Yin Yoga — Release Stress', duration: '30 min', channel: 'Boho Beautiful', url: 'https://www.youtube.com/watch?v=pL1RWA_Qavs' },
    { id: 'sei-calm', nameJa: 'ストレス緩和ストレッチ', nameEn: 'Stretch & Yoga for Stress Relief', duration: '15 min', channel: 'MadFit', url: 'https://www.youtube.com/watch?v=utrAlZf_Pjs' },
  ],
  me: [
    { id: 'me-fullbody', nameJa: '全身ワークアウト', nameEn: 'Full-Body Workout to Feel the Burn', duration: '30 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=QPAr-t6C7c0' },
    { id: 'me-strength', nameJa: '全身筋トレ', nameEn: 'Full Body Strength Workout', duration: '30 min', channel: 'Sydney Cummings', url: 'https://www.youtube.com/watch?v=bzj_pa_ty1Q' },
    { id: 'me-power', nameJa: 'パワーヨガ', nameEn: 'Power Yoga', duration: '40 min', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=WwzihD_WmFE' },
    { id: 'me-dumbbell', nameJa: 'ダンベル全身ワークアウト', nameEn: 'MIGHTY Full Body — Dumbbells', duration: '30 min', channel: 'Caroline Girvan', url: 'https://www.youtube.com/watch?v=ScInpT_5dIQ' },
    { id: 'me-run', nameJa: '初心者ランニング', nameEn: 'Running Workout for Beginners', duration: '15 min', channel: 'The Run Experience', url: 'https://www.youtube.com/watch?v=t4oIzGmCQ58' },
  ],
  ki: [
    { id: 'ki-hiit', nameJa: 'HIIT有酸素トレーニング', nameEn: 'HIIT Cardio — No Equipment', duration: '30 min', channel: 'Heather Robertson', url: 'https://www.youtube.com/watch?v=tYo0rWVEmYc' },
    { id: 'ki-dance', nameJa: 'ダンスカーディオ', nameEn: 'All-Levels Dance Cardio', duration: '30 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=gfO48ejjQhc' },
    { id: 'ki-tabata', nameJa: 'タバタトレーニング', nameEn: 'Full Body Tabata', duration: '12 min', channel: 'Heather Robertson', url: 'https://www.youtube.com/watch?v=JttjN5WWiL0' },
    { id: 'ki-boxing', nameJa: 'キックボクシング', nameEn: 'Cardio Kickboxing', duration: '30 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=nDytx5ZCMh8' },
    { id: 'ki-dancemarshal', nameJa: 'ダンスワークアウト', nameEn: 'Dance Sweat Session', duration: '30 min', channel: 'The Fitness Marshall', url: 'https://www.youtube.com/watch?v=K1ucmt51ODw' },
  ],
  mi: [
    { id: 'mi-pilates', nameJa: '朝のピラティス', nameEn: 'Morning Pilates — Full Body', duration: '30 min', channel: 'Move With Nicole', url: 'https://www.youtube.com/watch?v=LbG1ovCGp-E' },
    { id: 'mi-yoga', nameJa: 'ストレス解消ヨガ', nameEn: 'Yoga for Anxiety & Stress', duration: '27 min', channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=hJbRpHZr_d0' },
    { id: 'mi-barre', nameJa: 'バレエバー・カーディオ', nameEn: 'Cardio Barre Workout', duration: '30 min', channel: 'POPSUGAR Fitness', url: 'https://www.youtube.com/watch?v=YNxXyVy1ypE' },
    { id: 'mi-swim', nameJa: '水泳トレーニング入門', nameEn: 'Beginner Swim Workout', duration: '10 min', channel: 'GTN', url: 'https://www.youtube.com/watch?v=zX0l7T5MjQY' },
    { id: 'mi-walk', nameJa: 'ウォーキング（1マイル）', nameEn: '1 Mile Brisk Walk', duration: '15 min', channel: 'Walk at Home', url: 'https://www.youtube.com/watch?v=jUiI5DlRmO4' },
  ],
};

/* ── shopping product pool ────────────────────────────────── */
const SHOP_PRODUCTS = {
  sei: [
    { id: 'sei-heat', nameJa: 'あずき温熱パッド', nameEn: 'Azuki Heat Pad', priceJa: '¥1,980', priceEn: '$15', asin: 'B08GY3LW5M', cat: 'wellness' },
    { id: 'sei-iron', nameJa: '鉄分サプリ（ヘム鉄）', nameEn: 'Heme Iron Supplement', priceJa: '¥1,480', priceEn: '$12', asin: 'B07TVCFNZ6', cat: 'supplement' },
    { id: 'sei-ginger', nameJa: '有機ジンジャーティー', nameEn: 'Organic Ginger Tea', priceJa: '¥890', priceEn: '$8', asin: 'B003D4F2US', cat: 'tea' },
    { id: 'sei-blanket', nameJa: 'ぬくぬくブランケット', nameEn: 'Cozy Weighted Blanket', priceJa: '¥4,980', priceEn: '$35', asin: 'B082WR6DBP', cat: 'comfort' },
    { id: 'sei-mag', nameJa: 'マグネシウムオイル', nameEn: 'Magnesium Spray', priceJa: '¥1,290', priceEn: '$10', asin: 'B00BPUY3W0', cat: 'wellness' },
    { id: 'sei-choco', nameJa: 'オーガニック高カカオチョコ', nameEn: 'Organic Dark Chocolate 85%', priceJa: '¥680', priceEn: '$6', asin: 'B003XNTJSA', cat: 'food' },
  ],
  me: [
    { id: 'me-band', nameJa: 'トレーニングバンドセット', nameEn: 'Resistance Band Set', priceJa: '¥1,680', priceEn: '$13', asin: 'B07149YC8P', cat: 'fitness' },
    { id: 'me-matcha', nameJa: '有機抹茶パウダー', nameEn: 'Organic Matcha Powder', priceJa: '¥1,580', priceEn: '$14', asin: 'B00DDT116M', cat: 'tea' },
    { id: 'me-vitc', nameJa: 'ビタミンCセラム', nameEn: 'Vitamin C Serum', priceJa: '¥1,980', priceEn: '$16', asin: 'B01M4MCUAF', cat: 'skincare' },
    { id: 'me-journal', nameJa: 'セルフケアジャーナル', nameEn: 'Self-Care Journal', priceJa: '¥1,280', priceEn: '$11', asin: 'B09DFGZFMJ', cat: 'stationery' },
    { id: 'me-probiotic', nameJa: 'プロバイオティクス', nameEn: 'Women\'s Probiotic', priceJa: '¥2,380', priceEn: '$18', asin: 'B078GRLKR4', cat: 'supplement' },
    { id: 'me-bottle', nameJa: '保温ボトル', nameEn: 'Insulated Water Bottle', priceJa: '¥2,180', priceEn: '$17', asin: 'B08LDG4V9V', cat: 'fitness' },
  ],
  ki: [
    { id: 'ki-spf', nameJa: 'ミネラル日焼け止め', nameEn: 'Mineral Sunscreen SPF50', priceJa: '¥1,680', priceEn: '$14', asin: 'B00Y21TWWU', cat: 'skincare' },
    { id: 'ki-electro', nameJa: '電解質パウダー', nameEn: 'Electrolyte Powder', priceJa: '¥1,980', priceEn: '$15', asin: 'B082X4M9PL', cat: 'supplement' },
    { id: 'ki-jasmine', nameJa: 'ジャスミン緑茶', nameEn: 'Jasmine Green Tea', priceJa: '¥980', priceEn: '$9', asin: 'B000WG7SJC', cat: 'tea' },
    { id: 'ki-yoga', nameJa: 'ヨガマット', nameEn: 'Non-Slip Yoga Mat', priceJa: '¥3,280', priceEn: '$25', asin: 'B01LP0V1AI', cat: 'fitness' },
    { id: 'ki-mist', nameJa: 'ローズウォーターミスト', nameEn: 'Rosewater Face Mist', priceJa: '¥1,180', priceEn: '$10', asin: 'B00UGJ5FMU', cat: 'skincare' },
    { id: 'ki-nuts', nameJa: 'ミックスナッツ', nameEn: 'Organic Trail Mix', priceJa: '¥1,280', priceEn: '$11', asin: 'B071Z9WGB2', cat: 'food' },
  ],
  mi: [
    { id: 'mi-lavender', nameJa: 'ラベンダーオイル', nameEn: 'Lavender Essential Oil', priceJa: '¥980', priceEn: '$9', asin: 'B06Y2GZ8FN', cat: 'wellness' },
    { id: 'mi-epsom', nameJa: 'エプソムソルト', nameEn: 'Epsom Salt Bath Soak', priceJa: '¥1,280', priceEn: '$10', asin: 'B004N762WS', cat: 'wellness' },
    { id: 'mi-cinnamon', nameJa: 'シナモンティー', nameEn: 'Cinnamon Spice Tea', priceJa: '¥780', priceEn: '$7', asin: 'B0014AVG2Q', cat: 'tea' },
    { id: 'mi-mask', nameJa: 'シートマスク（保湿）', nameEn: 'Hydrating Sheet Masks', priceJa: '¥1,480', priceEn: '$12', asin: 'B00JEV544S', cat: 'skincare' },
    { id: 'mi-b6', nameJa: 'ビタミンB6', nameEn: 'Vitamin B6 Supplement', priceJa: '¥890', priceEn: '$8', asin: 'B0019LTGOU', cat: 'supplement' },
    { id: 'mi-candle', nameJa: 'ソイキャンドル', nameEn: 'Soy Wax Candle', priceJa: '¥1,580', priceEn: '$13', asin: 'B07FSFKJPC', cat: 'comfort' },
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
    videos.forEach(v => {
      trackImpression('video', v.id);
      trackContent('impression', 'video', v.id);
    });
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
        <h3 style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK, margin: 0 }}>
          {isJa ? '運動' : 'Exercise'}
        </h3>
      </div>

      {/* Tips card */}
      <div style={{
        background: CARD, borderRadius: 24,
        boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
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
          onClick={() => { trackClick('video', video.id); trackContent('click', 'video', video.id); }}
          style={{
            background: CARD, borderRadius: 24,
            boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
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
            <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 700, color: INK }}>
              {isJa ? video.nameJa : video.nameEn}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK3, marginTop: 2 }}>
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

const CAT_LABELS = {
  wellness: { ja: '健康', en: 'Wellness' },
  supplement: { ja: 'サプリ', en: 'Supplement' },
  tea: { ja: 'お茶', en: 'Tea' },
  comfort: { ja: '癒し', en: 'Comfort' },
  food: { ja: '食品', en: 'Food' },
  fitness: { ja: '運動', en: 'Fitness' },
  skincare: { ja: 'スキン', en: 'Skin' },
  stationery: { ja: '文具', en: 'Stationery' },
};

function ShoppingSection({ phaseKey, isJa, dayOfYear }) {
  const [savedItems, setSavedItems] = useLocalStorage('meguri_shoplist', []);
  const [showList, setShowList] = useState(false);

  const allProducts = SHOP_PRODUCTS[phaseKey] || [];
  const products = rotatePool(allProducts, 3, dayOfYear + 21);
  const p = PHASES[phaseKey];

  useEffect(() => {
    products.forEach(item => {
      trackImpression('shop', item.id);
      trackContent('impression', 'shop', item.id);
    });
  }, [products.map(i => i.id).join(',')]);

  const toggleSave = (product) => {
    setSavedItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.filter(i => i.id !== product.id);
      return [...prev, { id: product.id, name: isJa ? product.nameJa : product.nameEn, asin: product.asin, addedAt: Date.now() }];
    });
  };

  const isSaved = (id) => savedItems.some(i => i.id === id);

  const handleBuy = (product) => {
    trackClick('shop', product.id);
    trackContent('click', 'shop', product.id);
    openAffiliateLink(product);
  };

  const removeFromList = (id) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  if (isCalmModeEnabled()) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 10,
            background: PHASES.ki.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PHASES.ki.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h3 style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK, margin: 0 }}>
            {isJa ? 'おすすめアイテム' : 'Phase Picks'}
          </h3>
        </div>

        {savedItems.length > 0 && (
          <button
            onClick={() => setShowList(!showList)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 20, border: 'none',
              background: showList ? p.soft : CREAM2, cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={showList ? p.deep : INK3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: showList ? p.deep : INK3 }}>
              {savedItems.length}
            </span>
          </button>
        )}
      </div>

      {/* Saved list (collapsible) */}
      {showList && savedItems.length > 0 && (
        <div style={{
          background: CARD, borderRadius: 24,
          boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
          padding: '16px 16px',
        }}>
          <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: INK, marginBottom: 10 }}>
            {isJa ? '買い物リスト' : 'Shopping List'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => removeFromList(item.id)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${p.accent}`,
                    background: p.soft, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.deep} strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </button>
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, flex: 1 }}>
                  {item.name}
                </span>
                <a
                  href={`https://www.amazon.co.jp/dp/${item.asin}?tag=meguri-22`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  referrerPolicy="no-referrer"
                  onClick={() => { trackClick('shop', item.id); trackContent('click', 'shop', item.id); }}
                  style={{
                    fontFamily: MARU, fontSize: 11, fontWeight: 700,
                    color: PHASES.ki.accent, textDecoration: 'none',
                  }}
                >
                  {isJa ? '購入' : 'Buy'}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product cards */}
      {products.map((product) => {
        const saved = isSaved(product.id);
        const catLabel = CAT_LABELS[product.cat] || { ja: product.cat, en: product.cat };
        return (
          <div
            key={product.id}
            style={{
              background: CARD, borderRadius: 24,
              boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            {/* Save button */}
            <button
              onClick={() => toggleSave(product)}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: saved ? p.soft : CREAM2,
                border: saved ? `1.5px solid ${p.accent}` : `1.5px solid transparent`,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0,
              }}
            >
              {saved ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill={p.accent} stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>

            {/* Product info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{
                  fontFamily: MARU, fontSize: 10, fontWeight: 700,
                  padding: '1px 7px', borderRadius: 99,
                  background: PHASES.ki.soft, color: PHASES.ki.deep,
                }}>
                  {isJa ? catLabel.ja : catLabel.en}
                </span>
              </div>
              <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 700, color: INK }}>
                {isJa ? product.nameJa : product.nameEn}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK3, marginTop: 1 }}>
                {isJa ? product.priceJa : product.priceEn}
              </div>
            </div>

            {/* Buy button */}
            <a
              href={`https://www.amazon.co.jp/dp/${product.asin}?tag=meguri-22`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              referrerPolicy="no-referrer"
              onClick={() => handleBuy(product)}
              style={{
                padding: '6px 14px', borderRadius: 20, border: 'none',
                background: PHASES.ki.tint,
                fontFamily: MARU, fontSize: 12, fontWeight: 700,
                color: PHASES.ki.accent, textDecoration: 'none',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              Amazon
            </a>
          </div>
        );
      })}

      {/* Affiliate disclosure */}
      <div style={{
        fontFamily: MARU, fontSize: 11, fontWeight: 500,
        color: INK3, textAlign: 'center', padding: '4px 12px', lineHeight: 1.5,
      }}>
        {isJa
          ? '※ リンクにはアフィリエイトが含まれます。購入費用の一部が運営に充てられます。'
          : 'Links include affiliate tags. A small portion of purchases supports Meguri.'}
      </div>
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
    rotatedTeas.forEach(item => { trackImpression('tea', item.id); trackContent('impression', 'tea', item.id); });
    rotatedSkincare.forEach(item => { trackImpression('skincare', item.id); trackContent('impression', 'skincare', item.id); });
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
          boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
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

          <h2 style={{ fontFamily: PMINCHO, fontSize: 26, fontWeight: 600, color: INK, margin: '0 0 10px' }}>
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
            <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: PHASES.me.accent }}>
              {isJa ? '周期データは非公開のまま' : 'Your cycle data stays private'}
            </span>
          </div>
        </div>
      </div>

      {/* Nutrition section */}
      <NutritionSection phaseKey={phaseKey} isJa={isJa} t={t} />

      {/* Exercise section */}
      <ExerciseSection phaseKey={phaseKey} isJa={isJa} t={t} dayOfYear={dayOfYear} />

      {/* Product recommendations */}
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
              <h3 style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK, margin: 0 }}>
                {isJa ? group.titleJa : group.titleEn}
              </h3>
            </div>

            {group.items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: CARD,
                  borderRadius: 24,
                  boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
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
                  <div style={{ fontFamily: MARU, fontSize: 15, fontWeight: 700, color: INK }}>
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
                  onClick={() => { const cat = group.key === 'teas' ? 'tea' : 'skincare'; trackClick(cat, item.id); trackContent('click', cat, item.id); }}
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

      {/* Shopping list */}
      <ShoppingSection phaseKey={phaseKey} isJa={isJa} dayOfYear={dayOfYear} />

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
          boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
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
