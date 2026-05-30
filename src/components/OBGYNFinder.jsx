import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function OBGYNFinder() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const findNearbyOBGYN = useCallback(() => {
    setStatus('loading');
    setError(null);

    if (!navigator.geolocation) {
      setError('geolocation_not_supported');
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/OBGYN+gynecologist+women's+health+clinic/@${latitude},${longitude},14z`;
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      },
      (err) => {
        if (err.code === 1) {
          setError('permission_denied');
        } else if (err.code === 2) {
          setError('position_unavailable');
        } else {
          setError('timeout');
        }
        setStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{t('obgyn.title')}</h3>
          <p className="text-sm text-gray-500 mt-1">{t('obgyn.description')}</p>
        </div>
      </div>

      {status === 'error' && error && (
        <div className="mb-4 p-3 bg-red-50 rounded-xl">
          <p className="text-sm text-red-600">{t(`obgyn.errors.${error}`)}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="mb-4 p-3 bg-emerald-50 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{t('obgyn.opened')}</span>
          </div>
        </div>
      )}

      <button
        onClick={findNearbyOBGYN}
        disabled={status === 'loading'}
        className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t('obgyn.locating')}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('obgyn.findNearby')}
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500">{t('obgyn.privacyNote')}</p>
        </div>
      </div>
    </div>
  );
}
