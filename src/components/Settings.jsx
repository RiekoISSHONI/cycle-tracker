import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateShareCode } from '../utils/cycleData';
import { downloadCalendarEvents } from '../utils/calendarExport';
import { isCalmModeEnabled, setCalmMode } from '../utils/commerce';
import { useSubscription } from '../contexts/SubscriptionContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SocialShare } from './SocialShare';
import { ThemePicker } from './ThemePicker';
import { OBGYNFinder } from './OBGYNFinder';
import { PartnerShare } from './PartnerShare';
import { PremiumBadge, UpgradeModal } from './PremiumGate';

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

export function Settings({ cycleData, cycleInfo, onUpdate, onReset, theme, onThemeChange }) {
  const { t } = useTranslation();
  const { isPremium, canAccess, togglePremium, subscription } = useSubscription();
  const [lastPeriod, setLastPeriod] = useState(cycleData.lastPeriodStart);
  const [cycleLength, setCycleLength] = useState(cycleData.cycleLength);
  const [showShareCode, setShowShareCode] = useState(false);
  const [shareCode, setShareCode] = useState(cycleData.shareCode || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [calendarExported, setCalendarExported] = useState(false);
  const [calmMode, setCalmModeState] = useState(isCalmModeEnabled());
  const [showPartnerShare, setShowPartnerShare] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  const handleCalmModeToggle = () => {
    const newValue = !calmMode;
    setCalmModeState(newValue);
    setCalmMode(newValue);
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

      {/* Subscription Status */}
      <SettingsSection title={t('premium.currentPlan')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-gray-100'
            }`}>
              {isPremium ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-800">
                {isPremium ? t('premium.premiumPlan') : t('premium.free')}
              </div>
              {isPremium && subscription.expiresAt && (
                <div className="text-sm text-gray-500">
                  {t('premium.activeUntil')} {new Date(subscription.expiresAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          {isPremium && <PremiumBadge />}
        </div>

        {!isPremium && (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full mt-4 py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(145deg, var(--terra) 0%, #c4664a 100%)',
              boxShadow: '0 4px 12px rgba(181, 88, 47, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            }}
          >
            {t('premium.startTrial')}
          </button>
        )}

        {/* Dev toggle - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={togglePremium}
            className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            [Dev] Toggle Premium
          </button>
        )}
      </SettingsSection>

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

          <button
            onClick={handleSave}
            className="w-full py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(145deg, var(--terra) 0%, #c4664a 100%)',
              boxShadow: '0 4px 12px rgba(181, 88, 47, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            }}
          >
            {t('settings.saveChanges')}
          </button>
        </div>
      </SettingsSection>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Theme Picker */}
      <ThemePicker currentTheme={theme} onChange={onThemeChange} />

      {/* Calm Mode */}
      <SettingsSection title={t('commerce.calmMode')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-800">{t('commerce.calmMode')}</div>
              <div className="text-sm text-gray-500">{t('commerce.calmModeDesc')}</div>
            </div>
          </div>
          <button
            onClick={handleCalmModeToggle}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              calmMode ? 'bg-forest' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                calmMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {calmMode && (
          <div className="mt-3 p-3 bg-forest/10 rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-forest font-medium">{t('commerce.calmModeEnabled')}</span>
          </div>
        )}
      </SettingsSection>

      {/* OBGYN Finder */}
      <OBGYNFinder />

      {/* Partner Sharing */}
      <SettingsSection title={t('settings.sharePartner')}>
        <p className="text-sm text-muted mb-4">{t('settings.shareDescription')}</p>

        {/* New Partner Share Button - Premium Feature */}
        {cycleInfo && (
          <button
            onClick={() => {
              if (canAccess('partnerShare')) {
                setShowPartnerShare(true);
              } else {
                setShowUpgradeModal(true);
              }
            }}
            className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t('partnerShare.title')}
            {!canAccess('partnerShare') && <PremiumBadge className="ml-1" />}
          </button>
        )}

        {showShareCode && shareCode ? (
          <div className="bg-gradient-to-br from-terra/10 to-rose-100/50 rounded-2xl p-5 text-center">
            <div className="text-sm text-muted mb-2">{t('settings.yourCode')}</div>
            <div className="text-4xl font-display text-terra tracking-widest mb-3">{shareCode}</div>
            <button
              onClick={() => navigator.clipboard?.writeText(shareCode)}
              className="text-sm text-terra font-medium hover:text-terra/80"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {t('settings.generateCode')}
          </button>
        )}
      </SettingsSection>

      {/* Social Share */}
      <SocialShare
        title="Meguri Cycle Tracker"
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
        <div className="flex items-center gap-3 py-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terra to-rose-600 flex items-center justify-center">
            <span className="text-xl font-display text-white">巡</span>
          </div>
          <div>
            <div className="font-display text-bark">Meguri</div>
            <div className="text-sm text-muted">{t('settings.version')} 2.0.0</div>
          </div>
        </div>
        <div className="border-t border-washi mt-2 pt-4">
          <p className="text-sm text-muted">{t('settings.aboutDescription')}</p>
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

      {/* Partner Share Modal */}
      {showPartnerShare && cycleInfo && (
        <PartnerShare
          cycleInfo={cycleInfo}
          onClose={() => setShowPartnerShare(false)}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          feature="partnerShare"
        />
      )}
    </div>
  );
}
