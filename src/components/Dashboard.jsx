import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NutritionSection } from './NutritionSection';
import { SkinSection } from './SkinSection';
import { Workouts } from './Workouts';
import { PartnerShare } from './PartnerShare';
import { useSubscription } from '../contexts/SubscriptionContext';
import { UpgradeModal } from './PremiumGate';

const phaseKanji = {
  menstrual: { kanji: '静', reading: 'shizuka', meaning: 'stillness' },
  follicular: { kanji: '芽', reading: 'me', meaning: 'sprout' },
  ovulatory: { kanji: '輝', reading: 'kagayaki', meaning: 'radiance' },
  luteal: { kanji: '穏', reading: 'odayaka', meaning: 'calm' }
};

function CycleRing({ cycleDay, cycleLength, phase }) {
  const size = 200;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = cycleDay / cycleLength;
  const offset = circumference - (progress * circumference);

  return (
    <div className="cycle-ring-container">
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent-soft)"
          strokeWidth={strokeWidth}
          opacity="0.3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring__circle"
        />
      </svg>
      <div className="cycle-ring-content">
        <span className="text-4xl font-display font-medium text-bark">{cycleDay}</span>
        <span className="text-muted text-sm">/ {cycleLength}</span>
      </div>
    </div>
  );
}

function CollapsibleSection({ icon, title, children, defaultExpanded = false, iconBg = 'bg-gray-100', iconColor = 'text-gray-600' }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-washi/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          <h3 className="font-medium text-bark">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`expandable-content ${expanded ? 'expanded' : ''}`}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function TipsList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-terra mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PartnerTipCard({ icon, title, description, items, variant = 'default' }) {
  const variants = {
    default: 'bg-blue-50 border-blue-100',
    success: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-amber-50 border-amber-100'
  };

  const iconBg = {
    default: 'bg-blue-100',
    success: 'bg-emerald-100',
    warning: 'bg-amber-100'
  };

  return (
    <div className={`card p-4 ${variants[variant]}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg[variant]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {description && <p className="text-sm text-gray-600 mt-0.5">{description}</p>}
        </div>
      </div>
      {items && (
        <ul className="space-y-2 ml-13">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-gray-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Dashboard({ cycleInfo, viewMode }) {
  const { t, i18n } = useTranslation();
  const { canAccess } = useSubscription();
  const [showPartnerShare, setShowPartnerShare] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { cycleDay, cycleLength, phaseData, daysUntilPeriod, nextPeriodDate, phase } = cycleInfo;

  const locale = i18n.language.startsWith('ja') ? 'ja-JP' : 'en-US';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

  const affirmations = t(`affirmations.${phase}`, { returnObjects: true }) || [];
  const motivationalMessage = affirmations[dayOfYear % affirmations.length] || '';

  const dailyTipsArr = t(`dailyTips.${phase}`, { returnObjects: true }) || [];
  const dailyTip = dailyTipsArr[dayOfYear % dailyTipsArr.length] || '';

  const phaseBgLight = {
    menstrual: 'from-rose-50/80 to-red-50/80',
    follicular: 'from-pink-50/80 to-rose-50/80',
    ovulatory: 'from-amber-50/80 to-orange-50/80',
    luteal: 'from-violet-50/80 to-purple-50/80'
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Main Phase Card - Combined with Days Until Period */}
      <div className={`card p-6 bg-gradient-to-br ${phaseBgLight[phase]} border-0 relative overflow-hidden`}>
        <div className="flex flex-col items-center text-center">
          {/* Phase Kanji - Decorative */}
          {phaseKanji[phase] && (
            <div className="absolute top-4 right-4 opacity-10">
              <span className="text-7xl font-display" style={{ color: 'var(--accent)' }}>
                {phaseKanji[phase].kanji}
              </span>
            </div>
          )}

          {/* Cycle Ring */}
          <CycleRing cycleDay={cycleDay} cycleLength={cycleLength} phase={phase} />

          {/* Phase Name */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium shadow-lg" style={{ background: 'var(--accent)' }}>
              <span className="text-lg opacity-90">{t(`phases.${phase}.kanji`)}</span>
              {t(`phases.${phase}.name`)}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted mt-3 text-sm max-w-xs">
            {t(`phases.${phase}.description`)}
          </p>

          {/* Days Until Period - Integrated */}
          <div className="mt-4 pt-4 border-t border-white/30 w-full">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-bark">
                <span className="font-display text-xl">{daysUntilPeriod}</span>
                <span className="text-sm text-muted ml-1">{t('dashboard.daysUntilPeriod')}</span>
              </span>
              <span className="text-xs text-muted">· {formatDate(nextPeriodDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Affirmation */}
      <div className="card p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-bark italic">"{motivationalMessage}"</p>
          </div>
        </div>
      </div>

      {/* Today's Tip */}
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-bark text-sm">{t('dailyTip.title')}</h3>
            <p className="text-sm text-muted mt-1">{dailyTip}</p>
          </div>
        </div>
      </div>

      {/* Phase-specific content */}
      {viewMode === 'personal' ? (
        <PersonalView phaseData={phaseData} phase={phase} />
      ) : (
        <PartnerView
          phase={phase}
          cycleDay={cycleDay}
          cycleLength={cycleLength}
          daysUntilPeriod={daysUntilPeriod}
          onShare={() => {
            if (canAccess('partnerShare')) {
              setShowPartnerShare(true);
            } else {
              setShowUpgradeModal(true);
            }
          }}
          isPremium={canAccess('partnerShare')}
        />
      )}

      {/* Partner Share Modal */}
      {showPartnerShare && (
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

function PersonalView({ phaseData, phase }) {
  const { t } = useTranslation();
  const [workoutsExpanded, setWorkoutsExpanded] = useState(false);

  const lifestyleTips = t(`phaseTips.${phase}.lifestyle`, { returnObjects: true }) || [];
  const exerciseTips = t(`phaseTips.${phase}.exercise`, { returnObjects: true }) || [];

  return (
    <div className="space-y-3">
      {/* Energy & Hormones */}
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-bark">{t('dashboard.energyHormones')}</h3>
            <p className="text-sm text-muted mt-1">{t(`phases.${phase}.energy`)}</p>
          </div>
        </div>
      </div>

      {/* Lifestyle - Always Visible (Not Collapsible) */}
      <div className="card p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="font-medium text-bark pt-2">{t('tips.lifestyle')}</h3>
        </div>
        <TipsList items={lifestyleTips} />
      </div>

      {/* Nutrition/Recipe */}
      <NutritionSection phaseData={phaseData} phase={phase} />

      {/* Skin */}
      <SkinSection phaseData={phaseData} phase={phase} />

      {/* Exercise - Tips always visible, videos collapsible */}
      <div className="card overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-bark pt-2">{t('tips.exercise')}</h3>
          </div>
          <TipsList items={exerciseTips} />
        </div>

        {/* Collapsible Videos Section */}
        <button
          onClick={() => setWorkoutsExpanded(!workoutsExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-washi/50 transition-colors border-t border-gray-100"
        >
          <span className="text-sm font-medium text-terra">{t('workouts.videos')}</span>
          <svg
            className={`w-5 h-5 text-muted transition-transform duration-300 ${workoutsExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`expandable-content ${workoutsExpanded ? 'expanded' : ''}`}>
          <div className="px-4 pb-4">
            <Workouts phase={phase} embedded />
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerView({ phase, cycleDay, cycleLength, daysUntilPeriod, onShare, isPremium }) {
  const { t, i18n } = useTranslation();

  const support = t(`partnerTips.${phase}.support`, { returnObjects: true }) || [];
  const avoid = t(`partnerTips.${phase}.avoid`, { returnObjects: true }) || [];
  const energy = t(`phases.${phase}.energy`);
  const phaseName = t(`phases.${phase}.name`);
  const kanji = t(`phases.${phase}.kanji`);

  const phaseColors = {
    menstrual: 'from-rose-50 to-red-50 border-rose-200',
    follicular: 'from-pink-50 to-rose-50 border-pink-200',
    ovulatory: 'from-amber-50 to-orange-50 border-amber-200',
    luteal: 'from-violet-50 to-purple-50 border-violet-200'
  };

  return (
    <div className="space-y-4">
      {/* Intro Card */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-terra/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-bark mb-1">{t('partner.shareWithPartner')}</h3>
            <p className="text-sm text-muted">{t('partner.shareDescription')}</p>
          </div>
        </div>

        {/* What can be shared */}
        <div className="mt-4 p-3 bg-washi/50 rounded-xl">
          <p className="text-xs font-medium text-bark mb-2">{t('partner.whatCanShare')}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-muted">
              <span>📍</span> {t('partner.shareItems.phase')}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-muted">
              <span>💭</span> {t('partner.shareItems.feelings')}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-muted">
              <span>💚</span> {t('partner.shareItems.support')}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-muted">
              <span>🍳</span> {t('partner.shareItems.nutrition')}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-muted">
              <span>📅</span> {t('partner.shareItems.dates')}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onShare}
          className="w-full mt-4 py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(145deg, var(--terra) 0%, #c4664a 100%)',
            boxShadow: '0 4px 12px rgba(181, 88, 47, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {t('partner.customizeShare')}
          {!isPremium && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">Premium</span>
          )}
        </button>
      </div>

      {/* Preview Card */}
      <div className={`card bg-gradient-to-br ${phaseColors[phase]} border overflow-hidden`}>
        {/* Preview Label */}
        <div className="px-4 py-2 bg-bark/5 border-b border-white/50">
          <p className="text-xs text-center text-muted font-medium">{t('partner.previewLabel')}</p>
        </div>

        {/* Header */}
        <div className="p-4 text-center border-b border-white/50">
          <div className="text-2xl font-display text-terra mb-1">巡</div>
          <div className="text-xs text-muted">{t('dashboard.partnerGuide')}</div>
        </div>

        {/* Phase Info */}
        <div className="p-4 text-center">
          <p className="text-sm text-muted mb-1">{t('partnerShare.sheIsIn')}</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl font-display">{kanji}</span>
            <h2 className="text-xl font-display text-bark">{phaseName}</h2>
          </div>
          <p className="text-sm text-muted">
            {t('dashboard.day')} {cycleDay} / {cycleLength}
          </p>
        </div>

        {/* Energy/Feeling */}
        <div className="px-4 pb-3">
          <p className="text-sm text-center text-muted italic">{energy}</p>
        </div>

        {/* Support Tips - Condensed */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">💚</span>
            <h3 className="font-medium text-bark text-sm">{t('partner.howToSupport')}</h3>
          </div>
          <ul className="space-y-1">
            {support.slice(0, 2).map((tip, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-terra mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
            {support.length > 2 && (
              <li className="text-xs text-terra">+{support.length - 2} {t('partner.more')}</li>
            )}
          </ul>
        </div>

        {/* What to Avoid - Condensed */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🚫</span>
            <h3 className="font-medium text-bark text-sm">{t('partner.whatToAvoid')}</h3>
          </div>
          <ul className="space-y-1">
            {avoid.slice(0, 2).map((tip, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Days Until Period */}
        <div className="px-4 pb-3 text-center">
          <p className="text-xs text-muted">
            📅 {t('partnerShare.nextPeriodIn')} ~{daysUntilPeriod} {t('insights.days')}
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/50 text-center border-t border-white/50">
          <p className="text-xs text-terra font-display">巡 meguri</p>
        </div>
      </div>
    </div>
  );
}
