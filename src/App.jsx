import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateCycleInfo, calculateCycleStats } from './utils/cycleData';
import { phaseKeyFromLegacy } from './utils/phases';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CycleSetup } from './components/CycleSetup';
import { Dashboard } from './components/Dashboard';
import { CycleCalendar } from './components/CycleCalendar';
import { Settings } from './components/Settings';
import { DailyCheckin } from './components/DailyCheckin';
import { Insights } from './components/Insights';
import { Care } from './components/Care';
import { Peers } from './components/Peers';
import { ConsentModal } from './components/ConsentModal';

function App() {
  const [hasConsented, setHasConsented] = useLocalStorage('privacyConsent', false);
  const [cycleData, setCycleData] = useLocalStorage('cycleData', null);
  const [checkins, setCheckins] = useLocalStorage('checkins', []);
  const [periodHistory, setPeriodHistory] = useLocalStorage('periodHistory', []);
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

  const handleAcceptConsent = () => setHasConsented(true);

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
    setActiveTab('dashboard');
    setViewMode('personal');
  };

  const handleLogPeriod = (date) => {
    setCycleData(prev => ({ ...prev, lastPeriodStart: date }));
    setPeriodHistory(prev => {
      if (prev.includes(date)) return prev;
      const updated = [...prev, date].sort((a, b) => new Date(b) - new Date(a));
      return updated.slice(0, 12);
    });
  };

  const handleCheckinSave = (checkinData) => {
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

  if (!hasConsented) return <ConsentModal onAccept={handleAcceptConsent} />;
  if (!cycleData) return <CycleSetup onSave={handleSetup} />;

  const phaseKey = cycleInfo?.phase ? phaseKeyFromLegacy(cycleInfo.phase) : 'ki';

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 110, position: 'relative' }}>
      <Header cycleInfo={cycleInfo} />

      <main style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
        {activeTab === 'dashboard' && cycleInfo && (
          <Dashboard cycleInfo={cycleInfo} viewMode={viewMode} checkins={checkins} cycleLength={effectiveCycleLength} periodHistory={periodHistory} />
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

        {activeTab === 'community' && cycleInfo && (
          <Peers phase={phaseKey} />
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
          <CycleCalendar cycleInfo={cycleInfo} />
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
