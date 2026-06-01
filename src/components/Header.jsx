import { useTranslation } from 'react-i18next';

export function Header({ viewMode, setViewMode, cycleInfo }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/30 safe-area-pt">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center shadow-md" style={{ boxShadow: '0 4px 12px -2px rgba(181, 88, 47, 0.2)' }}>
              <span className="text-xl font-display text-terra font-medium">巡</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-medium text-bark">{t('app.name')}</h1>
            </div>
          </div>

          {/* View Mode Toggle */}
          {cycleInfo && (
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('personal')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'personal'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('header.forMe')}
              </button>
              <button
                onClick={() => setViewMode('partner')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'partner'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('header.partner')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
