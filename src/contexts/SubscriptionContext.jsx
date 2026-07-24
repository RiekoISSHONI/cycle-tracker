import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SubscriptionContext = createContext(null);

export const PLANS = {
  monthly: { id: 'monthly', priceUSD: '$4.99', priceJPY: '¥780', months: 1 },
  annual: { id: 'annual', priceUSD: '$39.99', priceJPY: '¥5,800', months: 12 },
};

export const FEATURES = {
  phaseTracking: 'free',
  basicCheckin: 'free',
  phaseTips: 'free',
  calendar: 'free',
  shop: 'free',

  pillReminders: 'premium',
  unlimitedHistory: 'premium',
  journalExport: 'premium',
  partnerShare: 'premium',
  fullInsights: 'premium',
  supplyAlerts: 'premium',
};

export const FREE_LIMITS = {
  checkinHistoryDays: 7,
  pillReminders: 1,
};

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useLocalStorage('subscription', {
    tier: 'free',
    plan: null,
    startDate: null,
    expiresAt: null,
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

  const upgradeToPremium = (planId = 'monthly') => {
    const plan = PLANS[planId] || PLANS.monthly;
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + plan.months);

    setSubscription({
      tier: 'premium',
      plan: plan.id,
      startDate: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  };

  const cancelSubscription = () => {
    setSubscription({
      tier: 'free',
      plan: null,
      startDate: null,
      expiresAt: null,
    });
  };

  const togglePremium = () => {
    if (isPremium) {
      cancelSubscription();
    } else {
      upgradeToPremium('monthly');
    }
  };

  const value = {
    subscription,
    isPremium,
    canAccess,
    getLimit,
    upgradeToPremium,
    cancelSubscription,
    togglePremium,
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
