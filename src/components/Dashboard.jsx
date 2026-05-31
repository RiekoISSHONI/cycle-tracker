import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, getMotivationalMessage } from '../utils/cycleData';
import { NutritionSection } from './NutritionSection';

// Circular progress ring component
function CycleRing({ cycleDay, cycleLength, phaseData }) {
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = cycleDay / cycleLength;
  const offset = circumference - (progress * circumference);

  const phaseColors = {
    menstrual: '#e11d48',
    follicular: '#ec4899',
    ovulatory: '#f59e0b',
    luteal: '#8b5cf6'
  };

  const color = phaseColors[phaseData.name.toLowerCase().split(' ')[0]] || '#ec4899';

  return (
    <div className="cycle-ring-container">
      <svg width={size} height={size} className="progress-ring">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring__circle"
        />
      </svg>
      <div className="cycle-ring-content">
        <span className="text-5xl font-bold text-gray-900">{cycleDay}</span>
        <span className="text-gray-500 mt-1">/ {cycleLength}</span>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ icon, value, label, sublabel, accent = false }) {
  return (
    <div className={`card p-4 ${accent ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-2xl font-bold ${accent ? 'text-pink-600' : 'text-gray-900'}`}>
            {value}
          </div>
          <div className="text-sm text-gray-600 mt-0.5">{label}</div>
          {sublabel && (
            <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          accent ? 'bg-pink-100' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Expandable tip section
function TipSection({ icon, title, items, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            {icon}
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`expandable-content ${expanded ? 'expanded' : ''}`}>
        <div>
          <ul className="px-4 pb-4 space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Partner tip card
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

  const phaseGradients = {
    menstrual: 'from-rose-500 to-red-500',
    follicular: 'from-pink-500 to-rose-400',
    ovulatory: 'from-amber-400 to-orange-500',
    luteal: 'from-violet-500 to-purple-500'
  };

  const phaseBgLight = {
    menstrual: 'from-rose-50 to-red-50',
    follicular: 'from-pink-50 to-rose-50',
    ovulatory: 'from-amber-50 to-orange-50',
    luteal: 'from-violet-50 to-purple-50'
  };

  return (
    <div className="space-y-6 stagger-children pb-4">
      {/* Main Phase Card */}
      <div className={`card p-6 bg-gradient-to-br ${phaseBgLight[phase]} border-0`}>
        <div className="flex flex-col items-center text-center">
          {/* Cycle Ring */}
          <CycleRing cycleDay={cycleDay} cycleLength={cycleLength} phaseData={phaseData} />

          {/* Phase Name */}
          <div className="mt-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${phaseGradients[phase]} text-white font-medium shadow-lg`}>
              {phaseData.name}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-4 max-w-xs">
            {phaseData.description}
          </p>

          {/* Motivational Quote */}
          <div className="mt-4 px-4 py-3 bg-white/60 rounded-2xl">
            <p className="text-sm text-gray-700 italic">"{motivationalMessage}"</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={
            <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          value={daysUntilPeriod}
          label={t('dashboard.daysUntilPeriod')}
          sublabel={formatDate(nextPeriodDate)}
          accent
        />
        <StatCard
          icon={
            <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          value={`${Math.round((cycleDay / cycleLength) * 100)}%`}
          label={t('dashboard.cycleProgress')}
          sublabel={phaseData.name}
        />
      </div>

      {/* Energy & Hormones */}
      <div className="card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{t('dashboard.energyHormones')}</h3>
            <p className="text-sm text-gray-600 mt-1">{phaseData.energy}</p>
            <p className="text-sm text-gray-500 mt-2">{phaseData.hormones}</p>
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
      <h3 className="text-lg font-semibold text-gray-800 px-1">{t('dashboard.recommendationsForYou')}</h3>

      {/* Nutrition Section with TCM and Products */}
      <NutritionSection phaseData={phaseData} phase={phase} />

      <TipSection
        icon={<svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        title={t('tips.exercise')}
        items={tips.exercise}
      />

      <TipSection
        icon={<svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
        title={t('tips.lifestyle')}
        items={tips.lifestyle}
      />

      {/* Fasting recommendation */}
      <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{t('tips.fasting')}</h4>
            <p className="text-sm text-gray-600 mt-1">{tips.fasting}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerView({ phaseData }) {
  const { t } = useTranslation();
  const tips = phaseData.forPartner;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 px-1">{t('dashboard.partnerGuide')}</h3>

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
