import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateCycleInfo, calculateCycleStats } from './utils/cycleData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CycleSetup } from './components/CycleSetup';
import { Dashboard } from './components/Dashboard';
import { CycleCalendar } from './components/CycleCalendar';
import { Settings } from './components/Settings';
import { DailyCheckin } from './components/DailyCheckin';
import { Insights } from './components/Insights';
import { DailyTip } from './components/DailyTip';
import { Workouts } from './components/Workouts';
import { PhaseBackground } from './components/PhaseBackground';
import { ConsentModal } from './components/ConsentModal';

function App() {
  const [hasConsented, setHasConsented] = useLocalStorage('privacyConsent', false);
  const [cycleData, setCycleData] = useLocalStorage('cycleData', null);
  const [checkins, setCheckins] = useLocalStorage('checkins', []);
  const [periodHistory, setPeriodHistory] = useLocalStorage('periodHistory', []);
  const [theme, setTheme] = useLocalStorage('theme', 'sunset');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('personal');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAcceptConsent = () => {
    setHasConsented(true);
  };

  if (!hasConsented) {
    return <ConsentModal onAccept={handleAcceptConsent} />;
  }

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

  const handleSetup = (data) => {
    setCycleData(data);
    if (data.lastPeriodStart) {
      setPeriodHistory([data.lastPeriodStart]);
    }
  };

  const handleUpdate = (data) => {
    setCycleData(data);
  };

  const handleReset = () => {
    setCycleData(null);
    setCheckins([]);
    setPeriodHistory([]);
    setActiveTab('dashboard');
    setViewMode('personal');
  };

  const handleLogPeriod = (date) => {
    setCycleData(prev => ({
      ...prev,
      lastPeriodStart: date
    }));
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

  const todayCheckin = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return checkins.find(c => c.date === today);
  }, [checkins]);

  if (!cycleData) {
    return <CycleSetup onSave={handleSetup} />;
  }

  return (
    <div className="min-h-screen pb-24 relative">
      {cycleInfo && <PhaseBackground phase={cycleInfo.phase} theme={theme} />}

      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        cycleInfo={cycleInfo}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && cycleInfo && (
          <div className="space-y-6">
            <Dashboard cycleInfo={cycleInfo} viewMode={viewMode} />

            {viewMode === 'personal' && (
              <>
                <DailyTip phase={cycleInfo.phase} />
                <Workouts phase={cycleInfo.phase} />
              </>
            )}
          </div>
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

        {activeTab === 'settings' && (
          <Settings
            cycleData={cycleData}
            onUpdate={handleUpdate}
            onReset={handleReset}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
