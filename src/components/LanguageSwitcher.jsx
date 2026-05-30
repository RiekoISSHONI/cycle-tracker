import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English', abbr: 'EN' },
  { code: 'ja', name: '日本語', abbr: 'JA' }
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-800 mb-4">{t('settings.language')}</h3>

      <div className="space-y-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              i18n.language === lang.code
                ? 'bg-pink-50 border-2 border-pink-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
              i18n.language === lang.code
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {lang.abbr}
            </div>
            <span className={`font-medium ${
              i18n.language === lang.code ? 'text-pink-600' : 'text-gray-700'
            }`}>
              {lang.name}
            </span>
            {i18n.language === lang.code && (
              <svg className="w-5 h-5 text-pink-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
