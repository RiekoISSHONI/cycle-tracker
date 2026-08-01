import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PLANS, isStripeConfigured } from '../contexts/SubscriptionContext';
import { PHASES, CORAL, CORAL_D, MARU, PMINCHO, INK, INK2, INK3, CARD, CREAM, CREAM2, LINE } from '../utils/phases';

export function PremiumBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 99,
      background: `linear-gradient(135deg, ${CORAL}, ${CORAL_D})`,
      fontFamily: MARU, fontSize: 10, fontWeight: 700, color: '#fff',
    }}>
      <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Premium
    </span>
  );
}

export function PremiumGate({ feature, children, fallback = null }) {
  const { canAccess } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (canAccess(feature)) return children;

  if (fallback) {
    return (
      <>
        {fallback}
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature={feature} />}
      </>
    );
  }

  return (
    <>
      <LockedFeature onClick={() => setShowUpgrade(true)} />
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature={feature} />}
    </>
  );
}

function LockedFeature({ onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: 16, borderRadius: 20,
        background: PHASES.ki.tint, border: `1px solid ${PHASES.ki.line}`,
        textAlign: 'center', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PHASES.ki.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 600, color: INK }}>{t('premium.unlockFeature')}</span>
      </div>
      <p style={{ fontFamily: MARU, fontSize: 12, color: INK3, margin: 0 }}>{t('premium.tapToUpgrade')}</p>
    </button>
  );
}

export function UpgradeModal({ onClose, feature }) {
  const { t, i18n } = useTranslation();
  const { upgradeToPremium, redirectToStripe } = useSubscription();
  const isJa = i18n.language?.startsWith('ja');
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const stripeReady = isStripeConfigured();

  const features = [
    { key: 'pillReminders', icon: '💊', label: t('premium.features.pillReminders') },
    { key: 'fullInsights', icon: '📊', label: t('premium.features.fullInsights') },
    { key: 'unlimitedHistory', icon: '📅', label: t('premium.features.unlimitedHistory') },
    { key: 'journalExport', icon: '📝', label: t('premium.features.journalExport') },
    { key: 'partnerShare', icon: '💕', label: t('premium.features.partnerShare') },
  ];

  const handleUpgrade = () => {
    if (!redirectToStripe(selectedPlan)) {
      upgradeToPremium(selectedPlan);
      onClose();
    }
  };

  const monthlyPrice = isJa ? PLANS.monthly.priceJPY : PLANS.monthly.priceUSD;
  const annualPrice = isJa ? PLANS.annual.priceJPY : PLANS.annual.priceUSD;
  const annualMonthly = isJa ? '¥483' : '$3.33';
  const savingsLabel = isJa ? '2ヶ月分お得' : 'Save 2 months';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(59,51,53,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: CREAM, borderRadius: 28,
        maxWidth: 380, width: '100%',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(60,50,55,0.2)',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(150deg, ${CORAL}, ${CORAL_D})`,
          padding: '32px 24px 28px',
          textAlign: 'center', color: '#fff',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 12, left: 16, opacity: 0.1,
            fontFamily: PMINCHO, fontSize: 56, fontWeight: 700,
          }}>巡</div>
          <div style={{
            position: 'absolute', bottom: 8, right: 16, opacity: 0.1,
            fontFamily: PMINCHO, fontSize: 56, fontWeight: 700,
          }}>巡</div>
          <div style={{
            width: 56, height: 56, margin: '0 auto 14px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: PMINCHO, fontSize: 28, fontWeight: 700,
          }}>巡</div>
          <h2 style={{ fontFamily: MARU, fontSize: 22, fontWeight: 800, margin: 0 }}>
            {t('premium.upgradeTo')}
          </h2>
          <p style={{ fontFamily: MARU, fontSize: 13, opacity: 0.8, marginTop: 6 }}>
            {t('premium.unlockAll')}
          </p>
        </div>

        {/* Plan toggle */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
            {/* Monthly */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              style={{
                padding: '14px 12px', borderRadius: 18,
                background: selectedPlan === 'monthly' ? CARD : 'transparent',
                border: selectedPlan === 'monthly' ? `2px solid ${CORAL}` : `2px solid ${LINE}`,
                boxShadow: selectedPlan === 'monthly' ? '0 4px 14px rgba(60,50,55,0.08)' : 'none',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK2, marginBottom: 4 }}>
                {isJa ? '月額' : 'Monthly'}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 22, fontWeight: 800, color: INK }}>
                {monthlyPrice}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 11, color: INK3, marginTop: 2 }}>
                /{isJa ? '月' : 'mo'}
              </div>
            </button>

            {/* Annual */}
            <button
              onClick={() => setSelectedPlan('annual')}
              style={{
                padding: '14px 12px', borderRadius: 18,
                background: selectedPlan === 'annual' ? CARD : 'transparent',
                border: selectedPlan === 'annual' ? `2px solid ${CORAL}` : `2px solid ${LINE}`,
                boxShadow: selectedPlan === 'annual' ? '0 4px 14px rgba(60,50,55,0.08)' : 'none',
                cursor: 'pointer', textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Savings badge */}
              <div style={{
                position: 'absolute', top: -10, right: -6,
                padding: '2px 8px', borderRadius: 99,
                background: PHASES.me.accent, color: '#fff',
                fontFamily: MARU, fontSize: 9, fontWeight: 700,
              }}>
                {savingsLabel}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: INK2, marginBottom: 4 }}>
                {isJa ? '年額' : 'Annual'}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 22, fontWeight: 800, color: INK }}>
                {annualPrice}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 11, color: INK3, marginTop: 2 }}>
                {annualMonthly}/{isJa ? '月' : 'mo'}
              </div>
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {features.map((f) => {
            const isHighlighted = f.key === feature;
            return (
              <div
                key={f.key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 14,
                  background: isHighlighted ? PHASES.ki.tint : CREAM2,
                  border: isHighlighted ? `1px solid ${PHASES.ki.line}` : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ fontFamily: MARU, fontSize: 13, color: INK, flex: 1 }}>{f.label}</span>
                {isHighlighted && (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill={CORAL}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleUpgrade}
            style={{
              width: '100%', padding: '15px 20px',
              borderRadius: 18, border: 'none',
              background: `linear-gradient(135deg, ${CORAL}, ${CORAL_D})`,
              boxShadow: `0 8px 20px rgba(212,137,122,0.3)`,
              fontFamily: MARU, fontSize: 15, fontWeight: 700, color: '#fff',
              cursor: 'pointer',
            }}
          >
            {stripeReady
              ? (isJa ? 'プレミアムを始める' : 'Start Premium')
              : t('premium.startTrial')}
          </button>
          {stripeReady && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontFamily: MARU, fontSize: 11, color: INK3,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="7" width="18" height="12" rx="2"/>
                <path d="M3 11h18"/>
              </svg>
              {isJa ? 'Stripeで安全にお支払い' : 'Secure payment via Stripe'}
            </div>
          )}
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: 12,
              background: 'none', border: 'none',
              fontFamily: MARU, fontSize: 13, color: INK3,
              cursor: 'pointer',
            }}
          >
            {t('premium.maybeLater')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PremiumButton({ feature, children, onClick, className = '' }) {
  const { canAccess } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleClick = () => {
    if (canAccess(feature)) {
      onClick?.();
    } else {
      setShowUpgrade(true);
    }
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
        {!canAccess(feature) && (
          <span style={{ marginLeft: 8 }}><PremiumBadge /></span>
        )}
      </button>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} feature={feature} />}
    </>
  );
}
