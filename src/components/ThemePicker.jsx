import { useTranslation } from 'react-i18next';

const THEMES = [
  {
    id: 'meguri',
    name: 'Deep Autumn',
    description: 'Calm & refined',
    colors: ['#b5582f', '#c08a2d', '#3f5040', '#f3ece0'],
    accent: '#b5582f'
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    description: 'Nurturing & cozy',
    colors: ['#ff7e5f', '#feb47b', '#ffcba4', '#ffe5d9'],
    accent: '#ff7e5f'
  },
  {
    id: 'botanical',
    name: 'Botanical',
    description: 'Grounded & natural',
    colors: ['#7c9a7e', '#c4a77d', '#e8dcc4', '#f5f0e6'],
    accent: '#7c9a7e'
  },
  {
    id: 'dusk',
    name: 'Dusk',
    description: 'Premium & calming',
    colors: ['#6b5b95', '#b8a9c9', '#d4af37', '#f8e5ee'],
    accent: '#6b5b95'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Magical & uplifting',
    colors: ['#20b2aa', '#ff6b81', '#ffd700', '#e0f7fa'],
    accent: '#20b2aa'
  }
];

export function ThemePicker({ currentTheme, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-800 mb-2">{t('settings.colorTheme')}</h3>
      <p className="text-sm text-gray-500 mb-4">{t('settings.themeDescription')}</p>

      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
              currentTheme === theme.id
                ? 'border-current ring-2 ring-offset-2'
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
            style={{
              borderColor: currentTheme === theme.id ? theme.accent : undefined,
              ringColor: currentTheme === theme.id ? theme.accent : undefined
            }}
          >
            {/* Color swatches */}
            <div className="flex gap-1.5 mb-3">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full shadow-sm ring-1 ring-black/5"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Theme name */}
            <div className="font-semibold text-gray-800 text-sm">
              {t(`settings.theme.${theme.id}.name`)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {t(`settings.theme.${theme.id}.description`)}
            </div>

            {/* Selected indicator */}
            {currentTheme === theme.id && (
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.accent }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
