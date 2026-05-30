import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function TrendChart({ data, color, label }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  return (
    <div className="mt-3">
      <div className="flex items-end gap-1 h-20">
        {data.slice(-14).map((point, i) => {
          const height = ((point.value - min) / range) * 100;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${Math.max(height, 10)}%`,
                backgroundColor: color,
                opacity: 0.4 + (i / data.length) * 0.6
              }}
              title={`Day ${point.cycleDay}: ${point.value}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>14 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function SymptomBar({ symptom, count, total, t }) {
  const percentage = (count / total) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24 truncate">
        {t(`checkin.symptomsList.${symptom}`)}
      </span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8">{count}x</span>
    </div>
  );
}

export function Insights({ checkins, cycleData }) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    if (!checkins || checkins.length === 0) {
      return null;
    }

    // Mood data for chart
    const moodData = checkins
      .filter(c => c.mood)
      .map(c => ({ cycleDay: c.cycleDay, value: c.mood }));

    // Energy data for chart
    const energyData = checkins
      .filter(c => c.energy)
      .map(c => ({ cycleDay: c.cycleDay, value: c.energy }));

    // Average mood and energy
    const avgMood = moodData.length > 0
      ? (moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length).toFixed(1)
      : null;

    const avgEnergy = energyData.length > 0
      ? (energyData.reduce((sum, d) => sum + d.value, 0) / energyData.length).toFixed(1)
      : null;

    // Symptom frequency
    const symptomCounts = {};
    checkins.forEach(c => {
      (c.symptoms || []).forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      moodData,
      energyData,
      avgMood,
      avgEnergy,
      topSymptoms,
      totalCheckins: checkins.length
    };
  }, [checkins]);

  if (!stats) {
    return (
      <div className="space-y-6 pb-4">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('insights.title')}</h3>
          <p className="text-gray-500">{t('insights.noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
        <h2 className="text-xl font-bold text-gray-800">{t('insights.title')}</h2>
        <p className="text-gray-600 mt-1">
          {t('insights.lastCycles', { count: stats.totalCheckins })} check-ins
        </p>
      </div>

      {/* Averages */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-pink-500">{stats.avgMood || '-'}</div>
          <div className="text-sm text-gray-600 mt-1">{t('checkin.mood')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-amber-500">{stats.avgEnergy || '-'}</div>
          <div className="text-sm text-gray-600 mt-1">{t('checkin.energy')}</div>
        </div>
      </div>

      {/* Mood Trends */}
      {stats.moodData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800">{t('insights.moodTrends')}</h3>
          <TrendChart data={stats.moodData} color="#ec4899" label="Mood" />
        </div>
      )}

      {/* Energy Trends */}
      {stats.energyData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800">{t('insights.energyPatterns')}</h3>
          <TrendChart data={stats.energyData} color="#f59e0b" label="Energy" />
        </div>
      )}

      {/* Symptom Patterns */}
      {stats.topSymptoms.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">{t('insights.symptomPatterns')}</h3>
          <div className="space-y-3">
            {stats.topSymptoms.map(([symptom, count]) => (
              <SymptomBar
                key={symptom}
                symptom={symptom}
                count={count}
                total={stats.totalCheckins}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cycle Info */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">{t('insights.cycleHistory')}</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {cycleData.cycleLength} {t('insights.days')}
            </div>
            <div className="text-sm text-gray-500">{t('insights.averageCycle')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
