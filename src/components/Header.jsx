import { CORAL, CORAL_D, INK2, CARD, LINE, LOGO_WORD } from '../utils/phases';
import { LogoMark } from './LogoMark';

export function Header({ onNavigateSettings }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'transparent',
      padding: '14px 28px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: '#F2E88C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <LogoMark fontSize={20} color="#fff" bgColor="#F2E88C" />
        </div>
        {/* wordmark: "megurı" with dotless i + sun replacing the dot */}
        <span style={{
          fontFamily: LOGO_WORD,
          fontSize: 22, fontWeight: 600,
          letterSpacing: -0.3, color: '#fff',
          position: 'relative',
        }}>
          megur&#305;{/* U+0131 dotless i */}
          <svg
            viewBox="0 0 24 24"
            width="11" height="11"
            style={{
              position: 'absolute',
              right: 0.5,
              top: 2,
              pointerEvents: 'none',
            }}
          >
            <circle cx="12" cy="12" r="5" fill="#fff" />
            <line x1="12" y1="1" x2="12" y2="5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="23" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="1" y1="12" x2="5" y2="12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="19" y1="12" x2="23" y2="12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="4.2" y1="4.2" x2="7" y2="7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="17" x2="19.8" y2="19.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.2" y1="19.8" x2="7" y2="17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="7" x2="19.8" y2="4.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
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
