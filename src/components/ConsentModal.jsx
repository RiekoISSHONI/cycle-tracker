import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogoMark } from './LogoMark';

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
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: '#F2E88C' }}
            >
              <LogoMark fontSize={28} color="#fff" bgColor="#F2E88C" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{t('consent.title')}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('consent.subtitle')}</p>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => handleLanguageChange('en')}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={i18n.language === 'en'
                ? { background: '#F0B818', color: '#fff' }
                : { background: '#f3f4f6', color: '#4b5563' }}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ja')}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={i18n.language === 'ja'
                ? { background: '#F0B818', color: '#fff' }
                : { background: '#f3f4f6', color: '#4b5563' }}
            >
              日本語
            </button>
          </div>

          {/* Key Points */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#EDFDF3' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#DCFAE6' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#2CA85A">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: '#1a5c32' }}>{t('consent.localStorage')}</div>
                <div className="text-xs mt-0.5" style={{ color: '#2CA85A' }}>{t('consent.localStorageDesc')}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#FFF8E0' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FEF0C4' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D49E00">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: '#7a5800' }}>{t('consent.noAccount')}</div>
                <div className="text-xs mt-0.5" style={{ color: '#D49E00' }}>{t('consent.noAccountDesc')}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#FEF2EA' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FDE3D4' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D47030">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: '#7a3a10' }}>{t('consent.location')}</div>
                <div className="text-xs mt-0.5" style={{ color: '#D47030' }}>{t('consent.locationDesc')}</div>
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
            className="w-full py-4 text-white font-semibold rounded-2xl hover:shadow-lg transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #F0B818, #D49E00)' }}
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
