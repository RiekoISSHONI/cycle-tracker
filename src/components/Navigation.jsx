export function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="max-w-4xl mx-auto flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'text-pink-600 bg-pink-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
