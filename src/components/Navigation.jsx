import { useTranslation } from 'react-i18next';
import { PHASES, INK3, MARU, phaseKeyFromLegacy } from '../utils/phases';

const TABS = [
  {
    id: 'dashboard',
    labelJa: 'フォーカス',
    labelEn: 'Focus',
    icon: (color, sw) => (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11l8-6.5 8 6.5M6 9.6V19h12V9.6M10 19v-5h4v5"/>
      </svg>
    ),
  },
  {
    id: 'work',
    labelJa: 'ワーク',
    labelEn: 'Work',
    icon: (color, sw) => (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    id: 'care',
    labelJa: 'ナリッシュ',
    labelEn: 'Nourish',
    icon: (color, sw) => (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z"/>
        <path d="M5 19c2-4.5 5.5-7.5 9.5-9"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    labelJa: 'カレンダー',
    labelEn: 'Calendar',
    icon: (color, sw) => (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="15.5" rx="4"/>
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>
      </svg>
    ),
  },
  {
    id: 'partner',
    labelJa: 'パートナー',
    labelEn: 'Partner',
    icon: (color, sw) => (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 000-7.8z"/>
      </svg>
    ),
  },
];

export function Navigation({ activeTab, setActiveTab }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language?.startsWith('ja');

  const rawPhase = document.documentElement.getAttribute('data-phase');
  const phaseKey = rawPhase ? phaseKeyFromLegacy(rawPhase) : 'ki';
  const p = PHASES[phaseKey];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-pill">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const color = active ? p.deep : INK3;
          const sw = 2;
          const label = isJa ? tab.labelJa : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, flex: 1,
                background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {tab.icon(color, sw)}
              <span style={{
                fontFamily: MARU, fontSize: 10,
                fontWeight: active ? 700 : 600, color,
              }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
