import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/telemetry';

const PHASES_PREVIEW = [
  { name: 'Menstrual', color: 'bg-rose-500', description: 'Rest & restore' },
  { name: 'Follicular', color: 'bg-pink-500', description: 'Energy rising' },
  { name: 'Ovulatory', color: 'bg-amber-500', description: 'Peak power' },
  { name: 'Luteal', color: 'bg-violet-500', description: 'Wind down' },
];

export function CycleSetup({ onSave }) {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [lastPeriodEnd, setLastPeriodEnd] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  const today = new Date().toISOString().split('T')[0];
  const locale = i18n.language.startsWith('ja') ? 'ja-JP' : 'en-US';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lastPeriodStart) {
      trackEvent('onboarding_complete', { cycleLength: parseInt(cycleLength) });
      onSave({
        lastPeriodStart: lastPeriodStart,
        lastPeriodEnd: lastPeriodEnd || null,
        cycleLength: parseInt(cycleLength)
      });
    }
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Calculate slider percentage for styling
  const sliderPercent = ((cycleLength - 21) / (35 - 21)) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-pink-500' : i < step ? 'w-2 bg-pink-400' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-md">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-terra to-rose-600 flex items-center justify-center shadow-lg shadow-terra/30">
                <span className="text-4xl font-display text-white">巡</span>
              </div>

              <h1 className="text-3xl font-display text-bark mb-3">
                {t('onboarding.welcome')}
              </h1>
              <p className="text-muted mb-8 leading-relaxed">
                {t('onboarding.description')}
              </p>

              {/* Phase preview cards */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {PHASES_PREVIEW.map((phase, i) => (
                  <div
                    key={phase.name}
                    className="card p-4 text-left"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={`w-3 h-3 rounded-full ${phase.color} mb-2`} />
                    <div className="font-semibold text-gray-800 text-sm">{phase.name}</div>
                    <div className="text-xs text-gray-500">{phase.description}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="btn-primary w-full"
              >
                {t('onboarding.getStarted')}
              </button>

              <p className="text-xs text-gray-400 mt-4">
                {t('onboarding.dataPrivacy')}
              </p>
            </div>
          )}

          {/* Step 1: Last period dates */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display text-bark mb-2">
                  {t('onboarding.whenLastPeriod')}
                </h2>
                <p className="text-muted">
                  {t('onboarding.helpsCalculate')}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Period Start Date */}
                <div className="card p-5">
                  <label className="block text-sm font-medium text-bark mb-2">
                    {t('onboarding.periodStart')}
                  </label>
                  <input
                    type="date"
                    value={lastPeriodStart}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                    max={today}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-washi bg-white text-bark focus:outline-none focus:ring-2 focus:ring-terra/30 focus:border-terra"
                  />
                  {lastPeriodStart && (
                    <p className="text-sm text-muted mt-2">
                      {new Date(lastPeriodStart).toLocaleDateString(locale, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {/* Period End Date */}
                <div className="card p-5">
                  <label className="block text-sm font-medium text-bark mb-2">
                    {t('onboarding.periodEnd')}
                  </label>
                  <input
                    type="date"
                    value={lastPeriodEnd}
                    onChange={(e) => setLastPeriodEnd(e.target.value)}
                    min={lastPeriodStart}
                    max={today}
                    className="w-full h-12 px-4 rounded-xl border border-washi bg-white text-bark focus:outline-none focus:ring-2 focus:ring-terra/30 focus:border-terra"
                  />
                  {lastPeriodEnd && (
                    <p className="text-sm text-muted mt-2">
                      {new Date(lastPeriodEnd).toLocaleDateString(locale, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {lastPeriodStart && lastPeriodEnd && (
                        <span className="ml-2 text-terra">
                          ({Math.ceil((new Date(lastPeriodEnd) - new Date(lastPeriodStart)) / (1000 * 60 * 60 * 24)) + 1} {t('insights.days')})
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-muted mt-2">{t('onboarding.periodEndOptional')}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1">
                  {t('onboarding.back')}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!lastPeriodStart}
                  className={`btn-primary flex-1 ${!lastPeriodStart ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {t('onboarding.continue')}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Cycle length */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display text-bark mb-2">
                  {t('onboarding.howLong')}
                </h2>
                <p className="text-muted">
                  {t('onboarding.countDays')}
                </p>
              </div>

              <div className="card p-6 mb-6">
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-gray-900">{cycleLength}</span>
                  <span className="text-xl text-gray-500 ml-2">{t('insights.days')}</span>
                </div>

                <input
                  type="range"
                  min="21"
                  max="35"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  style={{ '--value': `${sliderPercent}%` }}
                  className="w-full mb-4"
                />

                <div className="flex justify-between text-sm text-gray-400">
                  <span>21 {t('insights.days')}</span>
                  <span className="text-pink-500 font-medium">28 (avg)</span>
                  <span>35 {t('insights.days')}</span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mb-6">
                {t('onboarding.notSure')}
              </p>

              <div className="flex gap-3">
                <button type="button" onClick={handleBack} className="btn-secondary flex-1">
                  {t('onboarding.back')}
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {t('onboarding.startTracking')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
