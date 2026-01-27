import { useState } from 'react';

export function CycleSetup({ onSave }) {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lastPeriod) {
      onSave({
        lastPeriodStart: lastPeriod,
        cycleLength: parseInt(cycleLength)
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🌸</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Cycle Tracker</h1>
          <p className="text-gray-600">
            Track your cycle with insights based on Dr. Mindy Pelz's research for optimal health and harmony.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When did your last period start?
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              max={today}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average cycle length (days)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="21"
                max="35"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <span className="text-lg font-semibold text-pink-600 w-12 text-center">
                {cycleLength}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Most cycles are between 21-35 days. The average is 28 days.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Start Tracking
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your data is stored locally on your device and is never sent to any server.
        </p>
      </div>
    </div>
  );
}
