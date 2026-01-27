import { useState } from 'react';
import { generateShareCode } from '../utils/cycleData';

export function Settings({ cycleData, onUpdate, onReset }) {
  const [lastPeriod, setLastPeriod] = useState(cycleData.lastPeriodStart);
  const [cycleLength, setCycleLength] = useState(cycleData.cycleLength);
  const [showShareCode, setShowShareCode] = useState(false);
  const [shareCode, setShareCode] = useState(cycleData.shareCode || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSave = () => {
    onUpdate({
      ...cycleData,
      lastPeriodStart: lastPeriod,
      cycleLength: parseInt(cycleLength)
    });
  };

  const handleGenerateCode = () => {
    const code = generateShareCode();
    setShareCode(code);
    onUpdate({
      ...cycleData,
      shareCode: code
    });
    setShowShareCode(true);
  };

  const handleLogNewPeriod = () => {
    const newDate = new Date().toISOString().split('T')[0];
    setLastPeriod(newDate);
    onUpdate({
      ...cycleData,
      lastPeriodStart: newDate
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚙️</span> Cycle Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Period Start Date
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              max={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Cycle Length: {cycleLength} days
            </label>
            <input
              type="range"
              min="21"
              max="35"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span> Quick Actions
        </h3>

        <button
          onClick={handleLogNewPeriod}
          className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center gap-2"
        >
          <span>🔴</span> Log Period Started Today
        </button>
      </div>

      {/* Partner Sharing */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>💕</span> Share with Partner
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Generate a code to share your cycle information with your partner. They can use this to understand where you are in your cycle and how to best support you.
        </p>

        {showShareCode && shareCode ? (
          <div className="bg-pink-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Your share code:</p>
            <p className="text-3xl font-bold text-pink-600 tracking-wider">{shareCode}</p>
            <p className="text-xs text-gray-500 mt-2">
              Share this code with your partner
            </p>
          </div>
        ) : (
          <button
            onClick={handleGenerateCode}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Generate Share Code
          </button>
        )}
      </div>

      {/* Reset Data */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🗑️</span> Reset Data
        </h3>

        {showResetConfirm ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600">
              Are you sure? This will delete all your cycle data.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Reset All Data
          </button>
        )}
      </div>

      {/* About */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span>ℹ️</span> About This App
        </h3>
        <p className="text-sm text-gray-600">
          This cycle tracker is based on the research of Dr. Mindy Pelz, focusing on how women can optimize their nutrition, exercise, and lifestyle based on their menstrual cycle phases.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          The partner view helps your significant other understand your cycle and provides specific tips on how to support you during each phase.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Your data is stored locally and never leaves your device.
        </p>
      </div>
    </div>
  );
}
