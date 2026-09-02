import { useTranslation } from 'react-i18next';
import { PHASES, MARU, PMINCHO, INK, INK2, INK3, CREAM2, LINE, phaseKeyFromLegacy } from '../utils/phases';

const GLASS = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 18px rgba(58,50,38,0.04)',
  border: '1px solid rgba(255,255,255,0.5)',
};

const ENERGY = {
  sei: { pct: 20, en: 'Low · Rest when you can', ja: '低い · 休めるときに休む' },
  me:  { pct: 70, en: 'Rising · Build momentum', ja: '上昇中 · 勢いを作る' },
  ki:  { pct: 95, en: 'Peak · Your best day for meetings', ja: '最高 · 会議に最適な日' },
  mi:  { pct: 45, en: 'Declining · Focus inward', ja: '下降中 · 内面に集中' },
};

const TIPS = {
  sei: [
    { emoji: '🌙', titleEn: 'Honour rest',        titleJa: '休息を大切に',       descEn: 'Your body is recovering — schedule lighter workloads and leave space between meetings.',       descJa: '体は回復中です。軽めの仕事量にして、会議の間に余裕を持たせましょう。' },
    { emoji: '📝', titleEn: 'Review & reflect',    titleJa: '振り返りの時間',     descEn: 'Analytical thinking sharpens during menstruation — use it for retrospectives and audits.',     descJa: '生理中は分析的思考が鋭くなります。振り返りや監査に活かしましょう。' },
    { emoji: '🎧', titleEn: 'Solo focus work',     titleJa: '一人の集中作業',     descEn: 'Low social energy is natural now — deep solo tasks like writing or coding are a great fit.',  descJa: '今は社交エネルギーが低いのが自然です。執筆やコーディングなどの一人作業が合っています。' },
    { emoji: '📅', titleEn: 'Plan next cycle',     titleJa: '次のサイクルの計画', descEn: 'Map out big-ticket tasks for your upcoming follicular and ovulatory phases.',                  descJa: '次の卵胞期と排卵期に向けて、重要なタスクを計画しましょう。' },
  ],
  me: [
    { emoji: '🚀', titleEn: 'Start new projects',  titleJa: '新しいプロジェクト開始', descEn: 'Rising oestrogen fuels creativity and initiative — launch that thing you\'ve been planning.', descJa: 'エストロゲンの上昇が創造性と主体性を高めます。温めていたことを始めましょう。' },
    { emoji: '📊', titleEn: 'Tackle hard problems', titleJa: '難しい課題に挑む',       descEn: 'Cognitive flexibility peaks — take on complex architecture decisions or strategic planning.',  descJa: '認知の柔軟性がピークです。複雑な設計判断や戦略計画に取り組みましょう。' },
    { emoji: '🤝', titleEn: 'Collaborate',          titleJa: 'コラボレーション',       descEn: 'Social confidence is rising — pair-programming, brainstorms, and workshops go well now.',      descJa: '社交的な自信が高まっています。ペアプロやブレストに最適です。' },
    { emoji: '📚', titleEn: 'Learn something new',  titleJa: '新しいことを学ぶ',       descEn: 'Your brain absorbs new information faster right now — take that course or read that book.',   descJa: '今、脳は新しい情報をより早く吸収します。講座や読書に最適です。' },
  ],
  ki: [
    { emoji: '💡', titleEn: 'Pitch ideas today',     titleJa: 'アイデアを提案',         descEn: 'Verbal fluency peaks during ovulation — present proposals and lead discussions with confidence.', descJa: '排卵期は言語能力がピークです。自信を持って提案や議論をリードしましょう。' },
    { emoji: '🎯', titleEn: 'Schedule deep work AM',  titleJa: '午前中にディープワーク', descEn: 'Energy crests in the morning — block your calendar for the hardest task before lunch.',          descJa: 'エネルギーは午前にピーク。ランチ前に最も難しいタスクを入れましょう。' },
    { emoji: '⚡', titleEn: 'Network & connect',      titleJa: '人脈づくり＆交流',       descEn: 'Charisma and empathy are at their highest — attend events and make introductions.',             descJa: 'カリスマと共感力が最高潮です。イベントに参加して新しいつながりを作りましょう。' },
    { emoji: '⏰', titleEn: 'Set boundaries early',   titleJa: '早めに境界線を設定',     descEn: 'High energy can lead to over-committing — protect your calendar for the luteal dip ahead.',    descJa: 'エネルギーが高いと引き受けすぎになりがち。黄体期に備えて予定を守りましょう。' },
  ],
  mi: [
    { emoji: '🔍', titleEn: 'Detail-oriented tasks',  titleJa: '細かい作業に集中',   descEn: 'Progesterone sharpens your eye for errors — great for code reviews, editing, and QA.',         descJa: 'プロゲステロンがエラーへの目を鋭くします。コードレビューや編集に最適です。' },
    { emoji: '📋', titleEn: 'Finish & wrap up',       titleJa: '仕上げとまとめ',     descEn: 'Channel the nesting instinct into closing tickets and tying up loose ends.',                    descJa: '巣作り本能を活かして、チケットを閉じたり未完了の件を片付けましょう。' },
    { emoji: '🏠', titleEn: 'Work from home',         titleJa: '在宅ワーク',         descEn: 'Social fatigue increases — a quiet environment helps you stay productive without draining.',   descJa: '社交的な疲労が増します。静かな環境が生産性を保つ助けになります。' },
    { emoji: '🌿', titleEn: 'Delegate when possible', titleJa: '可能なら委任',       descEn: 'Conserve energy for must-dos and hand off what others can own this week.',                       descJa: '必須タスクにエネルギーを集中し、今週は他の人に任せられることは任せましょう。' },
  ],
};

/* ── component ──────────────────────────────────────────────── */
export function WorkMode({ phase, cycleDay }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');

  const pk = phaseKeyFromLegacy(phase);
  const p = PHASES[pk];
  const energy = ENERGY[pk];
  const tips = TIPS[pk];

  return (
    <div style={{
      minHeight: '100dvh',
      paddingBottom: 130,
      background: `
        radial-gradient(ellipse 60% 30% at 10% 12%, rgba(228,132,158,0.25), transparent 70%),
        radial-gradient(ellipse 55% 28% at 40% 6%, rgba(240,184,24,0.22), transparent 70%),
        radial-gradient(ellipse 55% 30% at 75% 18%, rgba(68,196,116,0.25), transparent 70%),
        linear-gradient(180deg, #FFFCF2, #FFF9EE)
      `,
    }}>
      <div style={{ padding: '24px 20px 0' }}>

        {/* ── Header ──────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: PMINCHO,
            fontSize: 26,
            fontWeight: 700,
            color: INK,
            margin: 0,
            lineHeight: 1.3,
          }}>
            {isJa ? 'ワークモード' : 'Work Mode'}
          </h1>
          <p style={{
            fontFamily: MARU,
            fontSize: 14,
            fontWeight: 500,
            color: INK2,
            margin: '4px 0 0',
          }}>
            {isJa ? 'フェーズに合わせた生産性' : 'Phase-tuned productivity'}
          </p>
        </div>

        {/* ── Energy Meter ────────────────────────────────── */}
        <div style={{
          ...GLASS,
          borderRadius: 24,
          padding: '20px 20px',
          marginBottom: 20,
        }}>
          {/* section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 10,
              background: p.soft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
            }}>
              {p.emoji}
            </div>
            <span style={{
              fontFamily: PMINCHO,
              fontSize: 17,
              fontWeight: 600,
              color: INK,
            }}>
              {isJa ? 'エネルギー' : 'Energy Level'}
            </span>
          </div>

          {/* bar track */}
          <div style={{
            width: '100%',
            height: 14,
            borderRadius: 7,
            background: CREAM2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${energy.pct}%`,
              height: '100%',
              borderRadius: 7,
              background: `linear-gradient(90deg, ${p.soft}, ${p.accent})`,
              transition: 'width 0.6s ease',
            }} />
          </div>

          {/* label */}
          <p style={{
            fontFamily: MARU,
            fontSize: 13,
            fontWeight: 600,
            color: p.deep,
            margin: '10px 0 0',
          }}>
            {isJa ? energy.ja : energy.en}
          </p>
        </div>

        {/* ── Work Tips ───────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '0 4px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 10,
            background: p.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 style={{
            fontFamily: PMINCHO,
            fontSize: 17,
            fontWeight: 600,
            color: INK,
            margin: 0,
          }}>
            {isJa ? '今日のヒント' : 'Today’s Tips'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              borderRadius: 24,
              boxShadow: '0 8px 22px rgba(58,50,38,0.06)',
              padding: '18px 18px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              {/* coloured icon container */}
              <div style={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: 14,
                background: p.soft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}>
                {tip.emoji}
              </div>

              {/* text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: PMINCHO,
                  fontSize: 15,
                  fontWeight: 600,
                  color: INK,
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {isJa ? tip.titleJa : tip.titleEn}
                </h3>
                <p style={{
                  fontFamily: MARU,
                  fontSize: 13,
                  fontWeight: 400,
                  color: INK2,
                  margin: '4px 0 0',
                  lineHeight: 1.55,
                }}>
                  {isJa ? tip.descJa : tip.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
