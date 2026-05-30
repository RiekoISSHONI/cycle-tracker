import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateShareCode } from '../utils/cycleData';
import { downloadCalendarEvents } from '../utils/calendarExport';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SocialShare } from './SocialShare';
import { ThemePicker } from './ThemePicker';

function SettingsSection({ title, children }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function SettingsRow({ icon, iconBg, title, subtitle, action, danger = false }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className={`font-medium ${danger ? 'text-red-600' : 'text-gray-800'}`}>{title}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Settings({ cycleData, onUpdate, onReset, theme, onThemeChange }) {
  const { t } = useTranslation();
  const [lastPeriod, setLastPeriod] = useState(cycleData.lastPeriodStart);
  const [cycleLength, setCycleLength] = useState(cycleData.cycleLength);
  const [showShareCode, setShowShareCode] = useState(false);
  const [shareCode, setShareCode] = useState(cycleData.shareCode || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [calendarExported, setCalendarExported] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const sliderPercent = ((cycleLength - 21) / (35 - 21)) * 100;

  const handleSave = () => {
    onUpdate({
      ...cycleData,
      lastPeriodStart: lastPeriod,
      cycleLength: parseInt(cycleLength)
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleGenerateCode = () => {
    const code = generateShareCode();
    setShareCode(code);
    onUpdate({
      ...cycleData,
      shareCode: code
    });
    setShowShareCode(true);
  };

  const handleLogNewPeriod = () => {
    const newDate = new Date().toISOString().split('T')[0];
    setLastPeriod(newDate);
    onUpdate({
      ...cycleData,
      lastPeriodStart: newDate
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleExportCalendar = () => {
    downloadCalendarEvents(cycleData.lastPeriodStart, cycleData.cycleLength, 6);
    setCalendarExported(true);
    setTimeout(() => setCalendarExported(false), 3000);
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Quick Action */}
      <button
        onClick={handleLogNewPeriod}
        className="w-full card p-5 bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-white text-left hover:shadow-lg transition-shadow active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">{t('settings.logPeriod')}</div>
              <div className="text-white/80 text-sm">{t('settings.markToday')}</div>
            </div>
          </div>
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Cycle Settings */}
      <SettingsSection title={t('settings.cycleSettings')}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.lastPeriod')}
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              max={today}
              className="input"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                {t('settings.cycleLength')}
              </label>
              <span className="text-lg font-bold text-pink-500">{cycleLength} {t('insights.days')}</span>
            </div>
            <input
              type="range"
              min="21"
              max="35"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              style={{ '--value': `${sliderPercent}%` }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>21</span>
              <span>28 (avg)</span>
              <span>35</span>
            </div>
          </div>

          <button onClick={handleSave} className="w-full btn-primary">
            {t('settings.saveChanges')}
          </button>
        </div>
      </SettingsSection>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Theme Picker */}
      <ThemePicker currentTheme={theme} onChange={onThemeChange} />

      {/* Partner Sharing */}
      <SettingsSection title={t('settings.sharePartner')}>
        <p className="text-sm text-gray-600 mb-4">{t('settings.shareDescription')}</p>

        {showShareCode && shareCode ? (
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 text-center">
            <div className="text-sm text-gray-600 mb-2">{t('settings.yourCode')}</div>
            <div className="text-4xl font-bold text-violet-600 tracking-widest mb-3">{shareCode}</div>
            <button
              onClick={() => navigator.clipboard?.writeText(shareCode)}
              className="text-sm text-violet-500 font-medium hover:text-violet-600"
            >
              {t('settings.tapToCopy')}
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateCode}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t('settings.generateCode')}
          </button>
        )}
      </SettingsSection>

      {/* Social Share */}
      <SocialShare
        title="Flo Cycle Tracker"
        text="Check out this cycle tracker app - it helps me understand my body better!"
      />

      {/* Calendar Integration */}
      <SettingsSection title={t('settings.addToCalendar')}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('settings.calendarDescription')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('settings.calendarIncludes')}</p>
          </div>
        </div>

        {calendarExported ? (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('settings.calendarDownloaded')}
            </div>
            <p className="text-sm text-emerald-600/70 mt-1">{t('settings.openIcs')}</p>
          </div>
        ) : (
          <button
            onClick={handleExportCalendar}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('settings.downloadCalendar')}
          </button>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Tip:</span> {t('settings.calendarTip')}
          </p>
        </div>
      </SettingsSection>

      {/* About */}
      <SettingsSection title={t('settings.about')}>
        <SettingsRow
          icon={
            <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          iconBg="bg-pink-100"
          title="Flo Cycle Tracker"
          subtitle={`${t('settings.version')} 2.0.0`}
        />
        <div className="border-t border-gray-100 mt-2 pt-4">
          <p className="text-sm text-gray-600">{t('settings.aboutDescription')}</p>
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection title={t('settings.privacy')}>
        <SettingsRow
          icon={
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          iconBg="bg-emerald-100"
          title={t('settings.localStorage')}
          subtitle={t('settings.dataLocal')}
        />

        <div className="border-t border-gray-100 mt-2 pt-2">
          <SettingsRow
            icon={
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
            iconBg="bg-red-100"
            title={t('settings.deleteData')}
            subtitle={t('settings.deleteWarning')}
            danger
            action={
              !showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-red-500 text-sm font-medium hover:text-red-600"
                >
                  {t('settings.yesDelete').split(',')[0]}
                </button>
              ) : null
            }
          />

          {showResetConfirm && (
            <div className="mt-3 p-4 bg-red-50 rounded-2xl">
              <p className="text-sm text-red-600 mb-3">{t('settings.confirmDelete')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { onReset(); setShowResetConfirm(false); }}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  {t('settings.yesDelete')}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  {t('settings.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Toast */}
      {showSaved && (
        <div className="toast">{t('settings.saved')}</div>
      )}
    </div>
  );
}
