import { useTranslation } from 'react-i18next';
import { PHASES, INK3, GOTHIC, phaseKeyFromLegacy } from '../utils/phases';

const TABS = [
  {
    id: 'dashboard',
    labelJa: 'ホーム',
    labelEn: 'Home',
    icon: (color, sw) => (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11l8-6.5 8 6.5M6 9.6V19h12V9.6M10 19v-5h4v5"/>
      </svg>
    ),
  },
  {
    id: 'checkin',
    labelJa: '記録',
    labelEn: 'Log',
    icon: (color, sw) => (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5"/>
        <path d="M12 8.3v7.4M8.3 12h7.4"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    labelJa: 'カレンダー',
    labelEn: 'Calendar',
    icon: (color, sw) => (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/>
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>
      </svg>
    ),
  },
  {
    id: 'insights',
    labelJa: '分析',
    labelEn: 'Trends',
    icon: (color, sw) => (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16"/>
        <path d="M7 20v-6M12 20V8M17 20v-9"/>
      </svg>
    ),
  },
  {
    id: 'care',
    labelJa: 'ケア',
    labelEn: 'Care',
    icon: (color, sw) => (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z"/>
        <path d="M5 19c2-4.5 5.5-7.5 9.5-9"/>
      </svg>
    ),
  },
];

export function Navigation({ activeTab, setActiveTab }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language?.startsWith('ja');

  const rawPhase = document.documentElement.getAttribute('data-phase');
  const phaseKey = rawPhase ? phaseKeyFromLegacy(rawPhase) : 'ki';
  const accent = PHASES[phaseKey].accent;

  return (
    <nav className="bottom-nav">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const color = active ? accent : INK3;
          const sw = active ? 1.9 : 1.7;
          const label = isJa ? tab.labelJa : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 62,
                gap: 5,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {tab.icon(color, sw)}
              <span
                style={{
                  fontFamily: GOTHIC,
                  fontSize: '10.5px',
                  fontWeight: active ? 700 : 500,
                  color,
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: active ? accent : 'transparent',
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
