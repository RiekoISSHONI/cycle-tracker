import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateCycleInfo } from './utils/cycleData';
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

function App() {
  const [cycleData, setCycleData] = useLocalStorage('cycleData', null);
  const [checkins, setCheckins] = useLocalStorage('checkins', []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('personal');

  const cycleInfo = useMemo(() => {
    if (!cycleData?.lastPeriodStart) return null;
    return calculateCycleInfo(cycleData.lastPeriodStart, cycleData.cycleLength);
  }, [cycleData]);

  const handleSetup = (data) => {
    setCycleData(data);
  };

  const handleUpdate = (data) => {
    setCycleData(data);
  };

  const handleReset = () => {
    setCycleData(null);
    setCheckins([]);
    setActiveTab('dashboard');
    setViewMode('personal');
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
    <div className="min-h-screen pb-24">
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
          />
        )}

        {activeTab === 'insights' && (
          <Insights checkins={checkins} cycleData={cycleData} />
        )}

        {activeTab === 'calendar' && cycleInfo && (
          <CycleCalendar cycleInfo={cycleInfo} />
        )}

        {activeTab === 'settings' && (
          <Settings
            cycleData={cycleData}
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
