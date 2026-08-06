import { useTranslation } from 'react-i18next';
import { PHASES, INK3, MARU, PMINCHO, CARD, phaseKeyFromLegacy } from '../utils/phases';

const TABS = [
  {
    id: 'dashboard',
    labelJa: 'ホーム',
    labelEn: 'Home',
    icon: (color, sw) => (
      <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11l8-6.5 8 6.5M6 9.6V19h12V9.6M10 19v-5h4v5"/>
      </svg>
    ),
  },
  {
    id: 'care',
    labelJa: 'ケア',
    labelEn: 'Care',
    icon: (color, sw) => (
      <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z"/>
        <path d="M5 19c2-4.5 5.5-7.5 9.5-9"/>
      </svg>
    ),
  },
  {
    id: 'checkin',
    center: true,
  },
  {
    id: 'community',
    labelJa: 'サークル',
    labelEn: 'Circle',
    icon: (color, sw) => (
      <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
        <circle cx="9" cy="9" r="3"/>
        <path d="M3.5 19a5.5 5.5 0 0111 0"/>
        <path d="M16 7.5a3 3 0 010 5.5M15.5 14.5a5.5 5.5 0 015 4.5"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    labelJa: 'こよみ',
    labelEn: 'Cal',
    icon: (color, sw) => (
      <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="15.5" rx="4"/>
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>
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
          if (tab.center) {
            return (
              <button
                key="center"
                onClick={() => setActiveTab('checkin')}
                style={{
                  width: 60, height: 60, borderRadius: '50%', marginTop: -26,
                  background: `linear-gradient(150deg, ${p.accent}, ${p.deep})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 10px 22px ${p.accent}66`,
                  border: '4px solid #fff',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  padding: 0,
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M12 6v12M6 12h12"/>
                </svg>
              </button>
            );
          }

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
                gap: 3, width: 52,
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {tab.icon(color, sw)}
              <span style={{
                fontFamily: MARU, fontSize: 11.5,
                fontWeight: active ? 700 : 600, color,
              }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
