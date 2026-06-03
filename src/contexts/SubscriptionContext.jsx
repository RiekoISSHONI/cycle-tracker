import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SubscriptionContext = createContext(null);

// Feature flags for each tier
export const FEATURES = {
  // Free features
  phaseTracking: 'free',
  basicCheckin: 'free',
  phaseTips: 'free',
  calendar: 'free',
  shop: 'free',

  // Premium features
  pillReminders: 'premium',
  unlimitedHistory: 'premium',
  journalExport: 'premium',
  partnerShare: 'premium',
  fullInsights: 'premium',
  supplyAlerts: 'premium'
};

// Free tier limits
export const FREE_LIMITS = {
  checkinHistoryDays: 7,
  pillReminders: 1
};

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useLocalStorage('subscription', {
    tier: 'free',
    startDate: null,
    expiresAt: null
  });

  const isPremium = useMemo(() => {
    if (subscription.tier !== 'premium') return false;
    if (!subscription.expiresAt) return false;
    return new Date(subscription.expiresAt) > new Date();
  }, [subscription]);

  const canAccess = (feature) => {
    const tier = FEATURES[feature];
    if (tier === 'free') return true;
    return isPremium;
  };

  const getLimit = (limitKey) => {
    if (isPremium) return Infinity;
    return FREE_LIMITS[limitKey] || 0;
  };

  const upgradeToPremium = () => {
    // In production, this would integrate with Stripe/RevenueCat
    // For now, simulate a subscription
    const now = new Date();
    const expiresAt = new Date(now.setMonth(now.getMonth() + 1));

    setSubscription({
      tier: 'premium',
      startDate: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    });
  };

  const cancelSubscription = () => {
    setSubscription({
      tier: 'free',
      startDate: null,
      expiresAt: null
    });
  };

  // For testing - remove in production
  const togglePremium = () => {
    if (isPremium) {
      cancelSubscription();
    } else {
      upgradeToPremium();
    }
  };

  const value = {
    subscription,
    isPremium,
    canAccess,
    getLimit,
    upgradeToPremium,
    cancelSubscription,
    togglePremium
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
