import { useTranslation } from 'react-i18next';

const THEMES = [
  {
    id: 'pastel',
    colors: ['#fdf2f8', '#fce7f3', '#f5f3ff', '#ede9fe']
  },
  {
    id: 'pop',
    colors: ['#f472b6', '#e879f9', '#a78bfa', '#818cf8']
  }
];

export function ThemePicker({ currentTheme, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-800 mb-4">{t('settings.colorTheme')}</h3>

      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentTheme === theme.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex gap-1 mb-3 justify-center">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className={`text-sm font-medium ${
              currentTheme === theme.id ? 'text-pink-600' : 'text-gray-700'
            }`}>
              {t(`settings.theme${theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}`)}
            </div>
            {currentTheme === theme.id && (
              <div className="flex justify-center mt-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
