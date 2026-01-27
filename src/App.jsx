import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateCycleInfo } from './utils/cycleData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CycleSetup } from './components/CycleSetup';
import { Dashboard } from './components/Dashboard';
import { CycleCalendar } from './components/CycleCalendar';
import { Settings } from './components/Settings';

function App() {
  const [cycleData, setCycleData] = useLocalStorage('cycleData', null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('personal'); // 'personal' or 'partner'

  // Calculate cycle info based on stored data
  const cycleInfo = useMemo(() => {
    if (!cycleData?.lastPeriodStart) return null;
    return calculateCycleInfo(cycleData.lastPeriodStart, cycleData.cycleLength);
  }, [cycleData]);

  // Handle initial setup
  const handleSetup = (data) => {
    setCycleData(data);
  };

  // Handle settings update
  const handleUpdate = (data) => {
    setCycleData(data);
  };

  // Handle reset
  const handleReset = () => {
    setCycleData(null);
    setActiveTab('dashboard');
    setViewMode('personal');
  };

  // Show setup screen if no data
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
          <Dashboard cycleInfo={cycleInfo} viewMode={viewMode} />
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
