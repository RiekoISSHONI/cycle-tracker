export function Header({ viewMode, setViewMode, cycleInfo }) {
  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌸</span>
            <div>
              <h1 className="text-xl font-bold">Cycle Tracker</h1>
              <p className="text-xs text-pink-100">Based on Dr. Mindy Pelz Research</p>
            </div>
          </div>

          {cycleInfo && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('personal')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'personal'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                For Her
              </button>
              <button
                onClick={() => setViewMode('partner')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'partner'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                For Partner
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
