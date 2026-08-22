import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, CORAL, CORAL_D, PMINCHO, MARU, INK, INK2, INK3, CARD, LINE, CREAM2, phaseKeyFromLegacy } from '../utils/phases';
import { useSubscription } from '../contexts/SubscriptionContext';
import { UpgradeModal } from './PremiumGate';
import { trackEvent } from '../utils/telemetry';

export function Header({ cycleInfo, viewMode, setViewMode }) {
  const { t, i18n } = useTranslation();
  const { canAccess } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const isJa = i18n.language?.startsWith('ja');
  const isPartner = viewMode === 'partner';

  const handlePartnerToggle = () => {
    if (isPartner) {
      trackEvent('view_mode_toggle', { mode: 'personal' });
      setViewMode('personal');
      return;
    }
    if (canAccess('partnerShare')) {
      trackEvent('view_mode_toggle', { mode: 'partner' });
      setViewMode('partner');
    } else {
      setShowUpgrade(true);
    }
  };

  return (
    <>
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
            fontFamily: MARU, fontSize: 24, fontWeight: 800,
            letterSpacing: -0.5, color: INK,
          }}>meguri</span>
        </div>

        <button
          onClick={handlePartnerToggle}
          style={{
            height: 38,
            padding: '0 14px',
            borderRadius: 99,
            border: isPartner ? `2px solid ${CORAL}` : `2px solid ${LINE}`,
            background: isPartner ? CORAL : CARD,
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={isPartner ? '#fff' : INK2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span style={{
            fontFamily: MARU, fontSize: 12, fontWeight: 700,
            color: isPartner ? '#fff' : INK2,
          }}>
            {isPartner
              ? (isJa ? '自分に戻る' : 'Back to Me')
              : (isJa ? 'パートナー' : 'Partner')}
          </span>
          {!isPartner && !canAccess('partnerShare') && (
            <svg width="10" height="10" viewBox="0 0 20 20" fill={CORAL}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </button>
      </header>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature="partnerShare" />}
    </>
  );
}
