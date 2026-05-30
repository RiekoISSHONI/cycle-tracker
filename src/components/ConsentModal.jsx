import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ConsentModal({ onAccept }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{t('consent.title')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('consent.subtitle')}</p>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                i18n.language === 'en'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ja')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                i18n.language === 'ja'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              日本語
            </button>
          </div>

          {/* Key Points */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-emerald-800 text-sm">{t('consent.localStorage')}</div>
                <div className="text-emerald-600 text-xs mt-0.5">{t('consent.localStorageDesc')}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-blue-800 text-sm">{t('consent.noAccount')}</div>
                <div className="text-blue-600 text-xs mt-0.5">{t('consent.noAccountDesc')}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-purple-800 text-sm">{t('consent.location')}</div>
                <div className="text-purple-600 text-xs mt-0.5">{t('consent.locationDesc')}</div>
              </div>
            </div>
          </div>

          {/* Expandable Details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4 hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">{t('consent.viewDetails')}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-3">
              <div>
                <div className="font-semibold text-gray-700 mb-1">{t('consent.dataCollected')}</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('consent.dataList.cycleData')}</li>
                  <li>{t('consent.dataList.checkins')}</li>
                  <li>{t('consent.dataList.preferences')}</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">{t('consent.howUsed')}</div>
                <p>{t('consent.howUsedDesc')}</p>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">{t('consent.yourRights')}</div>
                <p>{t('consent.yourRightsDesc')}</p>
              </div>
            </div>
          )}

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all active:scale-[0.98]"
          >
            {t('consent.accept')}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            {t('consent.byAccepting')}
          </p>
        </div>
      </div>
    </div>
  );
}
