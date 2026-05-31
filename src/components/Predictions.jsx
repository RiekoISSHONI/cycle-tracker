import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  predictNextPeriod,
  analyzeCycleDayPatterns,
  getPredictionsForDay,
  getWeeklyPredictions
} from '../utils/predictions';

function ConfidenceBadge({ confidence }) {
  const colors = {
    high: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-gray-100 text-gray-600',
    default: 'bg-gray-100 text-gray-500'
  };

  const labels = {
    high: 'High confidence',
    medium: 'Medium',
    low: 'Learning',
    default: 'Estimate'
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[confidence] || colors.default}`}>
      {labels[confidence] || 'Estimate'}
    </span>
  );
}

function MoodEnergyIndicator({ value, max = 5, type = 'mood' }) {
  if (!value) return <span className="text-gray-400">—</span>;

  const colors = {
    mood: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'],
    energy: ['#6b7280', '#9ca3af', '#fbbf24', '#f59e0b', '#ef4444']
  };

  const color = colors[type][Math.round(value) - 1] || '#9ca3af';

  return (
    <div className="flex items-center gap-1">
      <span className="text-lg font-semibold" style={{ color }}>
        {value.toFixed(1)}
      </span>
      <span className="text-xs text-gray-400">/ {max}</span>
    </div>
  );
}

function WeeklyForecast({ predictions, t }) {
  const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-600 mb-3">{t('predictions.weekAhead')}</h4>
      <div className="grid grid-cols-7 gap-1">
        {predictions.map((pred, i) => (
          <div
            key={i}
            className={`text-center p-2 rounded-lg ${i === 0 ? 'bg-terra/10 ring-1 ring-terra/20' : 'bg-gray-50'}`}
          >
            <div className="text-[10px] text-gray-500 mb-1">
              {i === 0 ? t('predictions.today') : i === 1 ? t('predictions.tomorrow') : `D${pred.cycleDay}`}
            </div>
            <div
              className="w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{
                backgroundColor: pred.mood
                  ? `hsl(${(pred.mood / 5) * 120}, 60%, 50%)`
                  : '#d1d5db'
              }}
            >
              {pred.mood ? pred.mood.toFixed(0) : '?'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400"></span> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400"></span> High
        </span>
      </div>
    </div>
  );
}

export function PredictionsCard({ cycleInfo, checkins, periodHistory, cycleStats }) {
  const { t } = useTranslation();

  const predictions = useMemo(() => {
    const patterns = analyzeCycleDayPatterns(checkins);
    const todayPrediction = getPredictionsForDay(
      cycleInfo.cycleDay,
      patterns,
      cycleInfo.cycleLength
    );
    const weeklyPredictions = getWeeklyPredictions(
      cycleInfo.cycleDay,
      patterns,
      cycleInfo.cycleLength
    );
    const periodPrediction = predictNextPeriod(periodHistory, cycleStats);

    return {
      today: todayPrediction,
      weekly: weeklyPredictions,
      period: periodPrediction,
      hasData: checkins && checkins.length > 0
    };
  }, [cycleInfo, checkins, periodHistory, cycleStats]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{t('predictions.title')}</h3>
        <ConfidenceBadge confidence={predictions.today.confidence} />
      </div>

      {/* Period Prediction */}
      {predictions.period && (
        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-rose-600 font-medium">{t('predictions.nextPeriod')}</div>
              <div className="text-2xl font-bold text-rose-700">
                {predictions.period.daysUntil === 0
                  ? t('predictions.today')
                  : predictions.period.daysUntil === 1
                    ? t('predictions.tomorrow')
                    : `${predictions.period.daysUntil} ${t('predictions.days')}`}
              </div>
              {predictions.period.range.daysRange > 0 && (
                <div className="text-xs text-rose-500 mt-1">
                  ± {Math.ceil(predictions.period.range.daysRange / 2)} {t('predictions.days')}
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {predictions.period.basedOn > 1 && (
            <div className="text-[10px] text-rose-400 mt-2">
              {t('predictions.basedOn', { count: predictions.period.basedOn })}
            </div>
          )}
        </div>
      )}

      {/* Today's Predictions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-pink-50 rounded-xl">
          <div className="text-xs text-pink-600 mb-1">{t('predictions.expectedMood')}</div>
          <MoodEnergyIndicator value={predictions.today.mood} type="mood" />
        </div>
        <div className="p-3 bg-amber-50 rounded-xl">
          <div className="text-xs text-amber-600 mb-1">{t('predictions.expectedEnergy')}</div>
          <MoodEnergyIndicator value={predictions.today.energy} type="energy" />
        </div>
      </div>

      {/* Likely Symptoms */}
      {predictions.today.symptoms && predictions.today.symptoms.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">{t('predictions.likelySymptoms')}</div>
          <div className="flex flex-wrap gap-2">
            {predictions.today.symptoms.map(symptom => (
              <span
                key={symptom}
                className="px-2 py-1 bg-violet-100 text-violet-600 rounded-full text-xs"
              >
                {t(`checkin.symptomsList.${symptom}`)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expected Flow */}
      {predictions.today.flow && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">{t('predictions.expectedFlow')}</div>
          <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-xs">
            {t(`checkin.flowLevels.${predictions.today.flow}`)}
          </span>
        </div>
      )}

      {/* Weekly Forecast */}
      <WeeklyForecast predictions={predictions.weekly} t={t} />

      {/* Data message */}
      {!predictions.hasData && (
        <p className="text-xs text-gray-400 text-center mt-4">
          {t('predictions.logMore')}
        </p>
      )}
    </div>
  );
}
