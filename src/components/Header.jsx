import { useTranslation } from 'react-i18next';
import { CORAL, CORAL_D, PMINCHO, MARU, INK, INK2, CARD, LINE } from '../utils/phases';

export function Header({ onNavigateSettings }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'transparent',
      padding: '14px 22px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: `linear-gradient(150deg, ${CORAL}, ${CORAL_D})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: PMINCHO, fontSize: 22, fontWeight: 700, color: '#fff',
          boxShadow: `0 6px 14px ${CORAL}55`,
        }}>巡</div>
        <span style={{
          fontFamily: MARU, fontSize: 24, fontWeight: 700,
          letterSpacing: -0.5, color: INK,
        }}>meguri</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onNavigateSettings}
          style={{
            width: 38, height: 38, borderRadius: 99,
            border: `2px solid ${LINE}`,
            background: CARD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
