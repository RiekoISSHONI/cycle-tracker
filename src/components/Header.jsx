import { useTranslation } from 'react-i18next';
import {
  PHASES,
  CARD,
  INK,
  INK3,
  LINE,
  PAPER2,
  MINCHO,
  OLDMIN,
  GOTHIC,
  phaseKeyFromLegacy,
} from '../utils/phases';

export function Header({ viewMode, setViewMode, cycleInfo }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');

  const phaseKey = cycleInfo?.phase ? phaseKeyFromLegacy(cycleInfo.phase) : 'ki';
  const phase = PHASES[phaseKey];

  const selfLabel = isJa ? '自分用' : 'For me';
  const partnerLabel = isJa ? 'パートナー' : 'Partner';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'transparent',
        padding: '14px 22px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${phase.soft} 0%, ${CARD} 100%)`,
            border: `1px solid ${phase.line}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: MINCHO,
              fontSize: 21,
              fontWeight: 700,
              color: phase.accent,
              lineHeight: 1,
            }}
          >
            巡
          </span>
        </div>
        <span
          style={{
            fontFamily: OLDMIN,
            fontSize: 25,
            fontWeight: 600,
            color: INK,
            lineHeight: 1,
          }}
        >
          Meguri
        </span>
      </div>

      {/* Segmented toggle */}
      <div
        style={{
          display: 'flex',
          borderRadius: 13,
          background: PAPER2,
          border: `1px solid ${LINE}`,
          padding: 3,
        }}
      >
        <button
          onClick={() => setViewMode('personal')}
          style={{
            fontFamily: GOTHIC,
            fontSize: 13,
            fontWeight: viewMode === 'personal' ? 700 : 500,
            color: viewMode === 'personal' ? INK : INK3,
            background: viewMode === 'personal' ? CARD : 'transparent',
            borderRadius: viewMode === 'personal' ? 10 : 10,
            boxShadow:
              viewMode === 'personal'
                ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
                : 'none',
            border: 'none',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {selfLabel}
        </button>
        <button
          onClick={() => setViewMode('partner')}
          style={{
            fontFamily: GOTHIC,
            fontSize: 13,
            fontWeight: viewMode === 'partner' ? 700 : 500,
            color: viewMode === 'partner' ? INK : INK3,
            background: viewMode === 'partner' ? CARD : 'transparent',
            borderRadius: 10,
            boxShadow:
              viewMode === 'partner'
                ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
                : 'none',
            border: 'none',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {partnerLabel}
        </button>
      </div>
    </header>
  );
}
