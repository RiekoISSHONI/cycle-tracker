import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, CORAL, CORAL_D, MARU, PMINCHO, INK, INK2, INK3, CREAM2 } from '../utils/phases';

export function UpgradeSuccessBanner({ onDismiss }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language?.startsWith('ja');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 100, display: 'flex', justifyContent: 'center',
      padding: '12px 16px',
      pointerEvents: 'none',
    }}>
      <div
        style={{
          maxWidth: 400, width: '100%',
          padding: '16px 20px',
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 8px 32px rgba(59,51,53,0.15)',
          display: 'flex', alignItems: 'center', gap: 14,
          pointerEvents: 'auto',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s',
        }}
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: PHASES.me.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={PHASES.me.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: PMINCHO, fontSize: 16, fontWeight: 600, color: INK,
          }}>
            {isJa ? 'プレミアムへようこそ' : 'Welcome to Premium'}
          </div>
          <div style={{
            fontFamily: MARU, fontSize: 12, color: INK2, marginTop: 2,
          }}>
            {isJa ? 'すべての機能がアンロックされました' : 'All features are now unlocked'}
          </div>
        </div>
      </div>
    </div>
  );
}
