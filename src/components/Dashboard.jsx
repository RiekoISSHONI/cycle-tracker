import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, getMotivationalMessage, getDailyTip } from '../utils/cycleData';
import { NutritionSection } from './NutritionSection';
import { SkinSection } from './SkinSection';
import { Workouts } from './Workouts';

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
          <span className="font-medium text-bark">{title}</span>
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
  const { t } = useTranslation();
  const { cycleDay, cycleLength, phaseData, daysUntilPeriod, nextPeriodDate, phase } = cycleInfo;
  const motivationalMessage = getMotivationalMessage(phase);
  const dailyTip = getDailyTip(phase);

  const phaseBgLight = {
    menstrual: 'from-rose-50/80 to-red-50/80',
    follicular: 'from-pink-50/80 to-rose-50/80',
    ovulatory: 'from-amber-50/80 to-orange-50/80',
    luteal: 'from-violet-50/80 to-purple-50/80'
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Main Phase Card */}
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
              {phaseKanji[phase] && (
                <span className="text-lg opacity-90">{phaseKanji[phase].kanji}</span>
              )}
              {phaseData.name}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted mt-3 text-sm max-w-xs">
            {phaseData.description}
          </p>
        </div>
      </div>

      {/* Days Until Period */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-terra/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-display font-medium text-bark">{daysUntilPeriod} <span className="text-base font-normal text-muted">{t('insights.days')}</span></div>
            <div className="text-sm text-muted">{t('dashboard.daysUntilPeriod')}</div>
          </div>
        </div>
        <div className="text-right text-sm text-muted">
          {formatDate(nextPeriodDate)}
        </div>
      </div>

      {/* Today's Tip */}
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-ochre/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-ochre" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-bark">{t('dailyTip.title')}</h3>
            <p className="text-sm text-muted mt-1">{dailyTip}</p>
          </div>
        </div>
      </div>

      {/* Affirmation */}
      <div className="card p-4 bg-gradient-to-br from-forest/5 to-forest/10 border-forest/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-bark">{t('dailyTip.affirmation')}</h3>
            <p className="text-sm text-forest mt-1 italic">"{motivationalMessage}"</p>
          </div>
        </div>
      </div>

      {/* Phase-specific content */}
      {viewMode === 'personal' ? (
        <PersonalView phaseData={phaseData} phase={phase} />
      ) : (
        <PartnerView phaseData={phaseData} />
      )}
    </div>
  );
}

function PersonalView({ phaseData, phase }) {
  const { t } = useTranslation();
  const tips = phaseData.forHer;

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
            <p className="text-sm text-muted mt-1">{phaseData.energy}</p>
            {phaseData.hormones && (
              <p className="text-sm text-muted/70 mt-2">{phaseData.hormones}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lifestyle */}
      <CollapsibleSection
        icon={<svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
        title={t('tips.lifestyle')}
        iconBg="bg-violet-100"
        iconColor="text-violet-500"
      >
        <TipsList items={tips.lifestyle} />
      </CollapsibleSection>

      {/* Nutrition/Recipe */}
      <NutritionSection phaseData={phaseData} phase={phase} />

      {/* Skin */}
      <SkinSection phaseData={phaseData} phase={phase} />

      {/* Exercise */}
      <CollapsibleSection
        icon={<svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        title={t('tips.exercise')}
        iconBg="bg-rose-100"
        iconColor="text-rose-500"
      >
        <TipsList items={tips.exercise} />
        <div className="mt-4">
          <Workouts phase={phase} embedded />
        </div>
      </CollapsibleSection>
    </div>
  );
}

function PartnerView({ phaseData }) {
  const { t } = useTranslation();
  const tips = phaseData.forPartner;

  return (
    <div className="space-y-3">
      <PartnerTipCard
        icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
        title={t('partner.understanding')}
        description={tips.understand}
        variant="default"
      />

      <PartnerTipCard
        icon={<svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        title={t('partner.howToSupport')}
        items={tips.support}
        variant="success"
      />

      <PartnerTipCard
        icon={<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        title={t('partner.whatToAvoid')}
        items={tips.avoid}
        variant="warning"
      />
    </div>
  );
}
