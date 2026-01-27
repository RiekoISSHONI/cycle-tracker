import { useState } from 'react';
import { formatDate, getMotivationalMessage } from '../utils/cycleData';

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
        <span className="text-5xl font-bold text-gray-900">Day {cycleDay}</span>
        <span className="text-gray-500 mt-1">of {cycleLength}</span>
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
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
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
        <div className={`w-10 h-10 rounded-xl ${iconBg[variant]} flex items-center justify-center text-lg`}>
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
  const { cycleDay, cycleLength, phaseData, daysUntilPeriod, isFertileWindow, nextPeriodDate, phase } = cycleInfo;
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
          label="days until period"
          sublabel={formatDate(nextPeriodDate)}
          accent
        />
        <StatCard
          icon={
            isFertileWindow ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            )
          }
          value={isFertileWindow ? 'Yes' : 'No'}
          label="fertile window"
          sublabel={isFertileWindow ? 'Higher chance of conception' : 'Lower fertility'}
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
            <h3 className="font-semibold text-gray-800">Energy & Hormones</h3>
            <p className="text-sm text-gray-600 mt-1">{phaseData.energy}</p>
            <p className="text-sm text-gray-500 mt-2">{phaseData.hormones}</p>
          </div>
        </div>
      </div>

      {/* Phase-specific content */}
      {viewMode === 'personal' ? (
        <PersonalView phaseData={phaseData} />
      ) : (
        <PartnerView phaseData={phaseData} />
      )}
    </div>
  );
}

function PersonalView({ phaseData }) {
  const tips = phaseData.forHer;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 px-1">Recommendations for You</h3>

      <TipSection
        icon="🥗"
        title="Nutrition"
        items={tips.nutrition}
        defaultExpanded={true}
      />

      <TipSection
        icon="💪"
        title="Exercise"
        items={tips.exercise}
      />

      <TipSection
        icon="✨"
        title="Lifestyle"
        items={tips.lifestyle}
      />

      {/* Fasting recommendation */}
      <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-lg">
            ⏰
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Fasting Window</h4>
            <p className="text-sm text-gray-600 mt-1">{tips.fasting}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerView({ phaseData }) {
  const tips = phaseData.forPartner;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 px-1">Partner Guide</h3>

      <PartnerTipCard
        icon="💡"
        title="Understanding Her Right Now"
        description={tips.understand}
        variant="default"
      />

      <PartnerTipCard
        icon="💚"
        title="How to Support Her"
        items={tips.support}
        variant="success"
      />

      <PartnerTipCard
        icon="⚠️"
        title="What to Avoid"
        items={tips.avoid}
        variant="warning"
      />
    </div>
  );
}
