import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, PHASE_ORDER, MARU, PMINCHO, INK, INK2, INK3, CREAM2, LINE, phaseKeyFromLegacy } from '../utils/phases';
import { CardPopup } from './CardPopup';

/* ── bilingual educational content per phase × topic ──────── */
const PHASE_TO_LEGACY = { sei: 'menstrual', me: 'follicular', ki: 'ovulatory', mi: 'luteal' };

const LEARN_CONTENT = {
  sei: {
    bodyJa: 'エストロゲンとプロゲステロンが最も低い時期。子宮内膜が剥がれ落ち、月経が起こります。鉄分が失われるため、疲れやすくなることがあります。',
    bodyEn: 'Estrogen and progesterone are at their lowest. The uterine lining sheds, causing menstruation. Iron loss can lead to fatigue.',
    nutritionJa: '鉄分豊富な食材（ほうれん草、レバー、小松菜）を積極的に。ビタミンCと一緒に摂ると吸収率アップ。温かいスープや煮込み料理がおすすめ。',
    nutritionEn: 'Focus on iron-rich foods (spinach, liver, leafy greens). Pair with vitamin C for better absorption. Warm soups and stews are ideal.',
    exerciseJa: '激しい運動は控えめに。ゆったりしたヨガ、ストレッチ、軽い散歩が最適。体を温めることを優先しましょう。',
    exerciseEn: 'Keep exercise gentle. Restorative yoga, stretching, and light walks are ideal. Prioritize warmth and comfort.',
    tcmJa: '冬の季節、腎の気を養う時期。黒い食べ物（黒豆、黒ごま、ひじき）で腎を補い、冷えを防ぎましょう。',
    tcmEn: 'A winter season for nourishing kidney Qi. Black foods (black beans, sesame, hijiki) support the kidneys and prevent cold.',
    skinJa: 'ホルモンが低下し、肌が敏感に。刺激の少ないスキンケアに切り替え、保湿を重点的に。',
    skinEn: 'Low hormones make skin sensitive. Switch to gentle skincare and focus on deep hydration.',
  },
  me: {
    bodyJa: 'エストロゲンが徐々に上昇。卵胞が成長し始め、エネルギーと気分が向上。新しいことを始めるのに最適な時期です。',
    bodyEn: 'Estrogen gradually rises. Follicles begin growing, boosting energy and mood. An ideal time to start new things.',
    nutritionJa: '発酵食品（味噌、キムチ、ヨーグルト）で腸内環境を整えましょう。新鮮な野菜やタンパク質をバランスよく。',
    nutritionEn: 'Fermented foods (miso, kimchi, yogurt) support gut health. Balance with fresh vegetables and lean protein.',
    exerciseJa: 'エネルギーが上昇中！ランニング、HIIT、ダンスなど強度の高い運動にトライ。筋力トレーニングの効果も出やすい時期。',
    exerciseEn: 'Energy is rising! Try running, HIIT, or dance. Strength training is especially effective during this phase.',
    tcmJa: '春の季節、肝の気が巡る時期。緑の食べ物（ブロッコリー、ほうれん草、アスパラガス）で肝を整え、のびやかに過ごしましょう。',
    tcmEn: 'A spring season for liver Qi flow. Green foods (broccoli, spinach, asparagus) support the liver. Move freely and expansively.',
    skinJa: 'エストロゲン上昇で肌のコンディションが改善。新しいスキンケア製品を試すならこの時期が◎。',
    skinEn: 'Rising estrogen improves skin condition. This is the best time to try new skincare products.',
  },
  ki: {
    bodyJa: 'エストロゲンがピークに達し、LHサージで排卵が起こります。エネルギー、魅力、コミュニケーション力が最高潮。体温がわずかに上昇します。',
    bodyEn: 'Estrogen peaks and the LH surge triggers ovulation. Energy, attractiveness, and communication skills are at their highest. Body temperature rises slightly.',
    nutritionJa: '抗酸化物質豊富な食材（ベリー類、緑茶、カラフルな野菜）を。軽めの食事で消化に負担をかけないようにしましょう。',
    nutritionEn: 'Focus on antioxidant-rich foods (berries, green tea, colorful vegetables). Keep meals light to ease digestion.',
    exerciseJa: '最もエネルギッシュな時期！チャレンジングなワークアウト、グループスポーツ、新しい運動に最適。パフォーマンスがピークに。',
    exerciseEn: 'Your most energetic phase! Perfect for challenging workouts, group sports, and trying new activities. Performance peaks now.',
    tcmJa: '夏の季節、心の気が充実する時期。赤い食べ物（トマト、スイカ、クコの実）で心を養い、喜びを表現しましょう。',
    tcmEn: 'A summer season for heart Qi abundance. Red foods (tomatoes, watermelon, goji berries) nourish the heart. Express joy freely.',
    skinJa: 'ホルモンバランスが最も良い時期。肌が最も輝く時期なので、メイクも映えます。紫外線対策も忘れずに。',
    skinEn: 'Hormonal balance is at its best. Skin glows the most now, so makeup shines too. Remember sun protection.',
  },
  mi: {
    bodyJa: 'プロゲステロンが上昇し、体は着床に備えます。後半にかけてPMS症状が出ることも。体温は高めを維持。',
    bodyEn: 'Progesterone rises as the body prepares for potential implantation. PMS symptoms may appear in the second half. Temperature stays elevated.',
    nutritionJa: 'マグネシウム豊富な食材（ダークチョコ、ナッツ）で筋肉の緊張を和らげましょう。複合炭水化物でセロトニンをサポート。',
    nutritionEn: 'Magnesium-rich foods (dark chocolate, nuts) ease muscle tension. Complex carbs support serotonin production.',
    exerciseJa: 'エネルギーが徐々に低下。ピラティス、水泳、穏やかなジョギングがおすすめ。無理は禁物。',
    exerciseEn: "Energy gradually decreases. Pilates, swimming, and gentle jogging work well. Don't push too hard.",
    tcmJa: '秋の季節、肺の気を整える時期。白い食べ物（大根、梨、百合根）が潤いを与えます。深い呼吸を意識しましょう。',
    tcmEn: 'An autumn season for lung Qi. White foods (daikon, pear, lily bulb) provide moisture. Practice deep breathing.',
    skinJa: 'プロゲステロン上昇で皮脂分泌が増加。毛穴ケアと軽めの保湿に切り替えましょう。',
    skinEn: 'Rising progesterone increases oil production. Switch to pore care and lighter moisturizers.',
  },
};

const TOPICS = [
  {
    key: 'body',
    emoji: '🧬',
    labelJa: 'カラダの変化',
    labelEn: 'Body Changes',
    get: (pk, isJa) => LEARN_CONTENT[pk][isJa ? 'bodyJa' : 'bodyEn'],
  },
  {
    key: 'nutrition',
    emoji: '🍽️',
    labelJa: '食事と栄養',
    labelEn: 'Nutrition',
    get: (pk, isJa) => LEARN_CONTENT[pk][isJa ? 'nutritionJa' : 'nutritionEn'],
  },
  {
    key: 'exercise',
    emoji: '🏃‍♀️',
    labelJa: '運動',
    labelEn: 'Exercise',
    get: (pk, isJa) => LEARN_CONTENT[pk][isJa ? 'exerciseJa' : 'exerciseEn'],
  },
  {
    key: 'tcm',
    emoji: '🌿',
    labelJa: '東洋医学',
    labelEn: 'TCM & Seasons',
    get: (pk, isJa) => LEARN_CONTENT[pk][isJa ? 'tcmJa' : 'tcmEn'],
  },
  {
    key: 'skin',
    emoji: '✨',
    labelJa: 'スキンケア',
    labelEn: 'Skin Care',
    get: (pk, isJa) => LEARN_CONTENT[pk][isJa ? 'skinJa' : 'skinEn'],
  },
];

const GLASS = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 18px rgba(60,50,55,0.04)',
  border: '1px solid rgba(255,255,255,0.5)',
};

/* ── phase selector chips ──────────────────────────────────── */
function PhaseSelector({ selected, onSelect, isJa }) {
  return (
    <div style={{
      display: 'flex', gap: 8, overflowX: 'auto',
      paddingBottom: 4, scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {PHASE_ORDER.map(pk => {
        const p = PHASES[pk];
        const active = pk === selected;
        return (
          <button
            key={pk}
            onClick={() => onSelect(pk)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 999,
              background: active ? p.soft : 'rgba(255,255,255,0.5)',
              border: active ? `2px solid ${p.accent}` : '2px solid transparent',
              cursor: 'pointer', flexShrink: 0,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: 14 }}>{p.emoji}</span>
            <span style={{
              fontFamily: MARU, fontSize: 12.5,
              fontWeight: active ? 700 : 600,
              color: active ? p.deep : INK3,
            }}>
              {isJa ? p.name : p.en}
            </span>
            {active && pk === selected && (
              <span style={{
                fontFamily: MARU, fontSize: 9, fontWeight: 700,
                color: p.accent, marginLeft: -2,
              }}>
                {isJa ? '今ここ' : 'Now'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── topic card with CardPopup ──────────────────────────────── */
function TopicCard({ topic, selectedPhase, currentPhase, isJa }) {
  const p = PHASES[selectedPhase];
  const content = topic.get(selectedPhase, isJa);

  return (
    <CardPopup
      title={isJa ? topic.labelJa : topic.labelEn}
      accentBg={p.tint}
      preview={
        <div style={{
          ...GLASS, borderRadius: 20, padding: '16px 18px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: p.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 20,
          }}>
            {topic.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: PMINCHO, fontSize: 15, fontWeight: 600, color: INK, marginBottom: 4 }}>
              {isJa ? topic.labelJa : topic.labelEn}
            </div>
            <p style={{
              fontFamily: MARU, fontSize: 13, fontWeight: 500,
              color: INK2, margin: 0, lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {content}
            </p>
          </div>
        </div>
      }
      detail={
        <div>
          {/* Full content for selected phase */}
          <div style={{
            padding: '14px 16px', borderRadius: 16,
            background: p.tint, border: `1px solid ${p.line}`,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{p.emoji}</span>
              <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: p.deep }}>
                {isJa ? p.name : p.en}
              </span>
              {selectedPhase === currentPhase && (
                <span style={{
                  fontFamily: MARU, fontSize: 9, fontWeight: 700,
                  color: '#fff', background: p.accent,
                  padding: '1px 8px', borderRadius: 6,
                }}>
                  {isJa ? '今のフェーズ' : 'Current phase'}
                </span>
              )}
            </div>
            <p style={{
              fontFamily: MARU, fontSize: 14, fontWeight: 500,
              color: p.deep, margin: 0, lineHeight: 1.65,
            }}>
              {content}
            </p>
          </div>

          {/* Content for other phases for comparison */}
          <div style={{
            fontFamily: MARU, fontSize: 11, fontWeight: 700, color: INK3,
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
          }}>
            {isJa ? '他のフェーズ' : 'Other Phases'}
          </div>

          {PHASE_ORDER.filter(pk => pk !== selectedPhase).map(pk => {
            const op = PHASES[pk];
            const otherContent = topic.get(pk, isJa);
            return (
              <div key={pk} style={{
                padding: '12px 14px', borderRadius: 14,
                background: CREAM2, marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{op.emoji}</span>
                  <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: op.deep }}>
                    {isJa ? op.name : op.en}
                  </span>
                </div>
                <p style={{
                  fontFamily: MARU, fontSize: 13, fontWeight: 500,
                  color: INK2, margin: 0, lineHeight: 1.55,
                }}>
                  {otherContent}
                </p>
              </div>
            );
          })}
        </div>
      }
    />
  );
}

/* ── main Learn component ──────────────────────────────────── */
export function Learn({ phase = 'ki' }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language?.startsWith('ja');
  const [selectedPhase, setSelectedPhase] = useState(phase);
  const p = PHASES[selectedPhase];

  return (
    <div style={{ position: 'relative', paddingBottom: 130 }}>
      {/* background wash */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(ellipse 60% 30% at 10% 12%, rgba(228,160,176,0.25), transparent 70%),
          radial-gradient(ellipse 55% 28% at 40% 6%, rgba(212,192,122,0.22), transparent 70%),
          radial-gradient(ellipse 55% 30% at 75% 18%, rgba(142,190,144,0.25), transparent 70%),
          linear-gradient(180deg, #FFFCFA, #FDF9F6)
        `,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: PMINCHO, fontSize: 26, fontWeight: 600, color: INK }}>
            {isJa ? 'カラダを知る' : 'Know Your Body'}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 500, color: INK2, marginTop: 4 }}>
            {isJa ? 'フェーズごとの変化を学ぼう' : 'Learn what changes each phase'}
          </div>
        </div>

        {/* Phase selector */}
        <div style={{ marginBottom: 16 }}>
          <PhaseSelector
            selected={selectedPhase}
            onSelect={setSelectedPhase}
            isJa={isJa}
          />
        </div>

        {/* Phase highlight */}
        <div style={{
          ...GLASS, borderRadius: 24, padding: '18px 20px', marginBottom: 16,
          borderLeft: `4px solid ${p.accent}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{p.emoji}</span>
            <div>
              <div style={{ fontFamily: PMINCHO, fontSize: 18, fontWeight: 600, color: INK }}>
                {isJa ? p.name : p.en}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3 }}>
                {isJa ? `${p.season} · ${p.clinical}` : `${p.seasonEn} · ${p.clinicalEn}`}
              </div>
            </div>
          </div>
          <p style={{
            fontFamily: MARU, fontSize: 13.5, fontWeight: 500,
            color: p.deep, margin: 0, lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            {isJa ? p.poem : p.poemEn}
          </p>
        </div>

        {/* Topic cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOPICS.map(topic => (
            <TopicCard
              key={topic.key}
              topic={topic}
              selectedPhase={selectedPhase}
              currentPhase={phase}
              isJa={isJa}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
