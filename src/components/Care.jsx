import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, CARD, INK, INK2, INK3, LINE, MARU, PMINCHO, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { useTranslation } from 'react-i18next';

const RECOMMENDATIONS = {
  teas: [
    {
      nameJa: 'ペパーミントティー',
      nameEn: 'Peppermint Tea',
      noteJa: '消化を助け、気持ちをリフレッシュ。',
      noteEn: 'Aids digestion and refreshes the mind.',
      icon: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 010 8h-1" />
          <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          <path d="M6 2v3" /><path d="M10 2v3" /><path d="M14 2v3" />
        </svg>
      ),
    },
    {
      nameJa: 'ジャスミン緑茶',
      nameEn: 'Jasmine Green Tea',
      noteJa: '穏やかな香りで心を落ち着かせる。',
      noteEn: 'A gentle fragrance to calm and soothe.',
      icon: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 010 8h-1" />
          <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          <path d="M6 2v3" /><path d="M10 2v3" /><path d="M14 2v3" />
        </svg>
      ),
    },
  ],
  skincare: [
    {
      nameJa: 'ミネラル日焼け止め SPF50',
      nameEn: 'Mineral Sunscreen',
      noteJa: '肌に優しいミネラルベースの紫外線対策。',
      noteEn: 'Gentle mineral-based UV protection for sensitive skin.',
      icon: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
    },
    {
      nameJa: 'ローズウォーターミスト',
      nameEn: 'Rosewater Mist',
      noteJa: 'いつでも潤いと爽やかさを。',
      noteEn: 'Instant hydration and freshness anytime.',
      icon: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c4.97 0 9-3.58 9-8s-9-12-9-12S3 9.58 3 14s4.03 8 9 8z" />
        </svg>
      ),
    },
    {
      nameJa: 'ジェル保湿クリーム',
      nameEn: 'Light Gel Moisturizer',
      noteJa: '軽いテクスチャーで毎日の保湿に。',
      noteEn: 'Lightweight texture for everyday moisture.',
      icon: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c4.97 0 9-3.58 9-8s-9-12-9-12S3 9.58 3 14s4.03 8 9 8z" />
        </svg>
      ),
    },
  ],
};

export function Care({ phase, onNavigateSettings }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');

  const phaseKey = phaseKeyFromLegacy(phase);
  const p = PHASES[phaseKey];

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
    { key: 'teas', titleJa: 'お茶', titleEn: 'Teas', items: RECOMMENDATIONS.teas },
    { key: 'skincare', titleJa: 'スキンケア', titleEn: 'Skincare', items: RECOMMENDATIONS.skincare },
  ];

  // Use me (spring green) colors for icons as specified
  const mePhase = PHASES.me;

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
        {/* Blobby radial gradient wash at top */}
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

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px' }}>
          {/* Kanji + Season/Clinical eyebrow */}
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

          {/* Title */}
          <h2 style={{ fontFamily: MARU, fontSize: 25, fontWeight: 800, color: INK, margin: '0 0 10px' }}>
            {isJa ? '今週の養生' : "This Week's Care"}
          </h2>

          {/* Phase intro text */}
          <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 600, color: INK2, lineHeight: 1.65, margin: '0 0 14px' }}>
            {isJa ? p.poem : p.poemEn}
          </p>

          {/* Privacy pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 20,
              background: mePhase.soft,
              border: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mePhase.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontFamily: MARU, fontSize: 11.5, fontWeight: 700, color: mePhase.accent }}>
              {isJa ? '周期データは非公開のまま' : 'Your cycle data stays private'}
            </span>
          </div>
        </div>
      </div>

      {/* Grouped recommendations */}
      {groups.map((group) => (
        <div key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Group title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                background: mePhase.soft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {groupIcon[group.key](mePhase.accent)}
            </div>
            <h3 style={{ fontFamily: MARU, fontSize: 17, fontWeight: 800, color: INK, margin: 0 }}>
              {isJa ? group.titleJa : group.titleEn}
            </h3>
          </div>

          {/* Items */}
          {group.items.map((item, idx) => (
            <div
              key={idx}
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
              {/* Icon tile */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: mePhase.soft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon(mePhase.accent)}
              </div>

              {/* Text */}
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

              {/* View pill button */}
              <button
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: mePhase.tint,
                  fontFamily: MARU,
                  fontSize: 12,
                  fontWeight: 700,
                  color: mePhase.accent,
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
      ))}

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
