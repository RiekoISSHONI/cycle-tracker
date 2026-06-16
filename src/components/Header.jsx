import { useTranslation } from 'react-i18next';

export function Header({ viewMode, setViewMode, cycleInfo }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 glass safe-area-pt">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, var(--cream) 0%, #fff 100%)',
                boxShadow: '0 2px 8px rgba(181, 88, 47, 0.12), 0 4px 16px rgba(181, 88, 47, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
              }}
            >
              <span className="text-xl font-display text-terra font-medium">巡</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-medium text-bark tracking-wide">{t('app.name')}</h1>
            </div>
          </div>

          {/* View Mode Toggle */}
          {cycleInfo && (
            <div
              className="flex p-1 rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, rgba(236,227,212,0.6) 0%, rgba(243,236,224,0.8) 100%)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              <button
                onClick={() => setViewMode('personal')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  viewMode === 'personal'
                    ? 'bg-white text-bark shadow-sm'
                    : 'text-muted hover:text-bark'
                }`}
                style={viewMode === 'personal' ? {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
                } : {}}
              >
                {t('header.forMe')}
              </button>
              <button
                onClick={() => setViewMode('partner')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  viewMode === 'partner'
                    ? 'bg-white text-bark shadow-sm'
                    : 'text-muted hover:text-bark'
                }`}
                style={viewMode === 'partner' ? {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
                } : {}}
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
