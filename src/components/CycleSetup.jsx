import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/telemetry';
import { PHASES, PHASE_ORDER, CORAL, CORAL_D } from '../utils/phases';
import { LogoMark } from './LogoMark';

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

  // Phase preview using actual design-system colours
  const phasePreviews = PHASE_ORDER.map((key) => {
    const p = PHASES[key];
    return { key, accent: p.accent, name: p.clinicalEn, description: p.poemEn.split('.')[0] + '.' };
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      {/* Background decoration — warm gold & green blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: PHASES.ki.soft }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: PHASES.me.soft }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 32 : 8,
                background: i <= step ? CORAL_D : 'var(--line)',
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center animate-fade-in">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center logo-pulse"
                style={{
                  background: '#F2E88C',
                }}
              >
                <LogoMark fontSize={42} color="#fff" bgColor="#F2E88C" />
              </div>

              <h1 className="text-3xl font-display mb-3" style={{ color: 'var(--ink)' }}>
                {t('onboarding.welcome')}
              </h1>
              <p className="mb-8 leading-relaxed" style={{ color: 'var(--ink3)' }}>
                {t('onboarding.description')}
              </p>

              {/* Phase preview cards — actual phase colours */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {phasePreviews.map((phase, i) => (
                  <div
                    key={phase.key}
                    className="card p-4 text-left"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mb-2"
                      style={{ background: phase.accent }}
                    />
                    <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                      {phase.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--ink3)' }}>
                      {phase.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleNext}
                  className="cta-circle"
                  aria-label={t('onboarding.getStarted')}
                  style={{
                    width: 64, height: 64,
                    borderRadius: '50%',
                    border: 'none',
                    background: '#F2E88C',
                    boxShadow: '0 4px 16px rgba(242,232,140,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#3A3226" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
                <span style={{
                  fontFamily: '"M PLUS Rounded 1c", sans-serif',
                  fontSize: 13, fontWeight: 600, color: 'var(--ink3)',
                }}>
                  {t('onboarding.getStarted')}
                </span>
              </div>

              <p className="text-xs mt-2" style={{ color: 'var(--ink3)' }}>
                {t('onboarding.dataPrivacy')}
              </p>
            </div>
          )}

          {/* Step 1: Last period dates */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: PHASES.sei.soft }}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={PHASES.sei.accent}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--ink)' }}>
                  {t('onboarding.whenLastPeriod')}
                </h2>
                <p style={{ color: 'var(--ink3)' }}>
                  {t('onboarding.helpsCalculate')}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Period Start Date */}
                <div className="card p-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                    {t('onboarding.periodStart')}
                  </label>
                  <input
                    type="date"
                    value={lastPeriodStart}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                    max={today}
                    required
                    className="w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                      '--tw-ring-color': `${CORAL_D}44`,
                    }}
                  />
                  {lastPeriodStart && (
                    <p className="text-sm mt-2" style={{ color: 'var(--ink3)' }}>
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
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                    {t('onboarding.periodEnd')}
                  </label>
                  <input
                    type="date"
                    value={lastPeriodEnd}
                    onChange={(e) => setLastPeriodEnd(e.target.value)}
                    min={lastPeriodStart}
                    max={today}
                    className="w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                      '--tw-ring-color': `${CORAL_D}44`,
                    }}
                  />
                  {lastPeriodEnd && (
                    <p className="text-sm mt-2" style={{ color: 'var(--ink3)' }}>
                      {new Date(lastPeriodEnd).toLocaleDateString(locale, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {lastPeriodStart && lastPeriodEnd && (
                        <span className="ml-2" style={{ color: CORAL_D }}>
                          ({Math.ceil((new Date(lastPeriodEnd) - new Date(lastPeriodStart)) / (1000 * 60 * 60 * 24)) + 1} {t('insights.days')})
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'var(--ink3)' }}>{t('onboarding.periodEndOptional')}</p>
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
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: PHASES.ki.soft }}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={CORAL_D}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--ink)' }}>
                  {t('onboarding.howLong')}
                </h2>
                <p style={{ color: 'var(--ink3)' }}>
                  {t('onboarding.countDays')}
                </p>
              </div>

              <div className="card p-6 mb-6">
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold" style={{ color: 'var(--ink)' }}>{cycleLength}</span>
                  <span className="text-xl ml-2" style={{ color: 'var(--ink3)' }}>{t('insights.days')}</span>
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

                <div className="flex justify-between text-sm" style={{ color: 'var(--ink3)' }}>
                  <span>21 {t('insights.days')}</span>
                  <span className="font-medium" style={{ color: CORAL_D }}>28 (avg)</span>
                  <span>35 {t('insights.days')}</span>
                </div>
              </div>

              <p className="text-center text-sm mb-6" style={{ color: 'var(--ink3)' }}>
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
