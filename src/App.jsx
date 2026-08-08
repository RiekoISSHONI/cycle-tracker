import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateCycleInfo, calculateCycleStats } from './utils/cycleData';
import { phaseKeyFromLegacy } from './utils/phases';
import { trackPageView, trackFeature, trackEvent } from './utils/telemetry';
import { useSubscription } from './contexts/SubscriptionContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CycleSetup } from './components/CycleSetup';
import { Dashboard } from './components/Dashboard';
import { CycleCalendar } from './components/CycleCalendar';
import { Settings } from './components/Settings';
import { DailyCheckin } from './components/DailyCheckin';
import { Insights } from './components/Insights';
import { Care } from './components/Care';
import { Journal } from './components/Journal';
import { ConsentModal } from './components/ConsentModal';
import { UpgradeSuccessBanner } from './components/UpgradeSuccessBanner';

function App() {
  const [hasConsented, setHasConsented] = useLocalStorage('privacyConsent', false);
  const [cycleData, setCycleData] = useLocalStorage('cycleData', null);
  const [checkins, setCheckins] = useLocalStorage('checkins', []);
  const [periodHistory, setPeriodHistory] = useLocalStorage('periodHistory', []);
  const [journalEntries, setJournalEntries] = useLocalStorage('journalEntries', []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('personal');

  const cycleStats = useMemo(() => {
    return calculateCycleStats(periodHistory);
  }, [periodHistory]);

  const effectiveCycleLength = useMemo(() => {
    if (periodHistory.length >= 2) {
      return cycleStats.averageLength;
    }
    return cycleData?.cycleLength || 28;
  }, [periodHistory, cycleStats, cycleData]);

  const cycleInfo = useMemo(() => {
    if (!cycleData?.lastPeriodStart) return null;
    const info = calculateCycleInfo(cycleData.lastPeriodStart, effectiveCycleLength);
    return {
      ...info,
      cycleStats,
      isIrregular: cycleStats.isIrregular
    };
  }, [cycleData, effectiveCycleLength, cycleStats]);

  const todayCheckin = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return checkins.find(c => c.date === today);
  }, [checkins]);

  useEffect(() => {
    if (cycleInfo?.phase) {
      document.documentElement.setAttribute('data-phase', cycleInfo.phase);
      const phaseKey = phaseKeyFromLegacy(cycleInfo.phase);
      document.documentElement.setAttribute('data-phase-key', phaseKey);
    }
  }, [cycleInfo?.phase]);

  useEffect(() => {
    trackEvent('app_open', { locale: navigator.language?.slice(0, 2) });
  }, []);

  useEffect(() => {
    const phase = cycleInfo?.phase ? phaseKeyFromLegacy(cycleInfo.phase) : undefined;
    trackPageView(activeTab, { phase, mode: viewMode });
  }, [activeTab]);

  const handleAcceptConsent = () => {
    setHasConsented(true);
    trackEvent('consent_accept');
  };

  const handleSetup = (data) => {
    setCycleData(data);
    if (data.lastPeriodStart) {
      setPeriodHistory([data.lastPeriodStart]);
    }
  };

  const handleUpdate = (data) => setCycleData(data);

  const handleReset = () => {
    setCycleData(null);
    setCheckins([]);
    setPeriodHistory([]);
    setJournalEntries([]);
    setActiveTab('dashboard');
    setViewMode('personal');
  };

  const handleLogPeriod = (date) => {
    trackEvent('period_log');
    setCycleData(prev => ({ ...prev, lastPeriodStart: date }));
    setPeriodHistory(prev => {
      if (prev.includes(date)) return prev;
      const updated = [...prev, date].sort((a, b) => new Date(b) - new Date(a));
      return updated.slice(0, 12);
    });
  };

  const handleCheckinSave = (checkinData) => {
    trackEvent('checkin_save');
    setCheckins(prev => {
      const existing = prev.findIndex(c => c.date === checkinData.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = checkinData;
        return updated;
      }
      return [...prev, checkinData];
    });
  };

  const handleJournalSave = (entryData) => {
    trackEvent('journal_save');
    setJournalEntries(prev => {
      const existing = prev.findIndex(e => e.date === entryData.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entryData;
        return updated;
      }
      return [...prev, entryData];
    });
  };

  const handleJournalDelete = (date) => {
    trackEvent('journal_delete');
    setJournalEntries(prev => prev.filter(e => e.date !== date));
  };

  const { justUpgraded, dismissUpgraded } = useSubscription();

  if (!hasConsented) return <ConsentModal onAccept={handleAcceptConsent} />;
  if (!cycleData) return <CycleSetup onSave={handleSetup} />;

  const phaseKey = cycleInfo?.phase ? phaseKeyFromLegacy(cycleInfo.phase) : 'ki';

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 110, position: 'relative' }}>
      <Header cycleInfo={cycleInfo} viewMode={viewMode} setViewMode={setViewMode} />
      {justUpgraded && <UpgradeSuccessBanner onDismiss={dismissUpgraded} />}

      <main style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
        {activeTab === 'dashboard' && cycleInfo && (
          <Dashboard cycleInfo={cycleInfo} viewMode={viewMode} checkins={checkins} cycleLength={effectiveCycleLength} periodHistory={periodHistory} onNavigateDiary={() => setActiveTab('diary')} />
        )}

        {activeTab === 'checkin' && cycleInfo && (
          <DailyCheckin
            cycleDay={cycleInfo.cycleDay}
            onSave={handleCheckinSave}
            existingData={todayCheckin}
            checkins={checkins}
            onLogPeriod={handleLogPeriod}
            periodHistory={periodHistory}
          />
        )}

        {activeTab === 'diary' && cycleInfo && (
          <Journal
            phase={phaseKey}
            cycleDay={cycleInfo.cycleDay}
            entries={journalEntries}
            onSaveEntry={handleJournalSave}
            onDeleteEntry={handleJournalDelete}
          />
        )}

        {activeTab === 'insights' && (
          <Insights
            checkins={checkins}
            cycleData={cycleData}
            cycleStats={cycleStats}
            periodHistory={periodHistory}
          />
        )}

        {activeTab === 'calendar' && cycleInfo && (
          <CycleCalendar cycleInfo={cycleInfo} journalEntries={journalEntries} />
        )}

        {activeTab === 'care' && cycleInfo && (
          <Care
            phase={cycleInfo.phase}
            onNavigateSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            cycleData={cycleData}
            cycleInfo={cycleInfo}
            onUpdate={handleUpdate}
            onReset={handleReset}
          />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
