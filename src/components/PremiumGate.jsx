import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../contexts/SubscriptionContext';

export function PremiumBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-medium ${className}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Premium
    </span>
  );
}

export function PremiumGate({ feature, children, fallback = null }) {
  const { canAccess } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (canAccess(feature)) {
    return children;
  }

  if (fallback) {
    return (
      <>
        {fallback}
        {showUpgrade && (
          <UpgradeModal onClose={() => setShowUpgrade(false)} feature={feature} />
        )}
      </>
    );
  }

  return (
    <>
      <LockedFeature onClick={() => setShowUpgrade(true)} />
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} feature={feature} />
      )}
    </>
  );
}

function LockedFeature({ onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="font-medium text-bark">{t('premium.unlockFeature')}</span>
      </div>
      <p className="text-sm text-muted">{t('premium.tapToUpgrade')}</p>
    </button>
  );
}

export function UpgradeModal({ onClose, feature }) {
  const { t } = useTranslation();
  const { upgradeToPremium } = useSubscription();

  const features = [
    { key: 'pillReminders', icon: '💊', label: t('premium.features.pillReminders') },
    { key: 'fullInsights', icon: '📊', label: t('premium.features.fullInsights') },
    { key: 'unlimitedHistory', icon: '📅', label: t('premium.features.unlimitedHistory') },
    { key: 'journalExport', icon: '📝', label: t('premium.features.journalExport') },
    { key: 'partnerShare', icon: '💕', label: t('premium.features.partnerShare') }
  ];

  const handleUpgrade = () => {
    upgradeToPremium();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-3xl max-w-sm w-full overflow-hidden shadow-xl">
        {/* Header with Logo */}
        <div className="bg-gradient-to-br from-terra to-rose-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl font-display">巡</div>
            <div className="absolute bottom-4 right-4 text-6xl font-display">巡</div>
          </div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-display">巡</span>
            </div>
            <h2 className="font-display text-2xl">{t('premium.upgradeTo')}</h2>
            <p className="text-white/80 text-sm mt-2">{t('premium.unlockAll')}</p>
          </div>
        </div>

        {/* Features */}
        <div className="p-5 space-y-2">
          {features.map((f) => (
            <div
              key={f.key}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                f.key === feature
                  ? 'bg-terra/10 border border-terra/30'
                  : 'bg-washi hover:bg-washi/80'
              }`}
            >
              <span className="text-lg">{f.icon}</span>
              <span className="text-sm text-bark flex-1">{f.label}</span>
              {f.key === feature && (
                <svg className="w-5 h-5 text-terra" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="px-5 py-4 text-center bg-washi/50">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-display text-bark">$4.99</span>
            <span className="text-muted">/ {t('premium.month')}</span>
          </div>
          <p className="text-xs text-muted mt-1">{t('premium.cancelAnytime')}</p>
        </div>

        {/* Actions */}
        <div className="p-5 space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-terra to-rose-600 text-white font-medium shadow-lg shadow-terra/30 hover:shadow-xl hover:shadow-terra/40 transition-shadow"
          >
            {t('premium.startTrial')}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-muted text-sm hover:text-bark transition-colors"
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
        {!canAccess(feature) && <PremiumBadge className="ml-2" />}
      </button>
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} feature={feature} />
      )}
    </>
  );
}
