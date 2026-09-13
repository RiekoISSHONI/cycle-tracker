/**
 * Mood Prediction Engine
 *
 * Predicts expected mood based on:
 * 1. Historical check-in data for the same cycle day
 * 2. Phase-based mood averages from user's own data
 * 3. Overall trend direction within the current cycle
 *
 * All computation runs client-side on localStorage data.
 */

import { getPhaseKeyForDay } from './phases';

/**
 * Phase-based mood baselines (population average).
 * Used as fallback when user has < 2 cycles of data.
 */
const PHASE_BASELINES = {
  sei: 2.6,  // menstrual — lower mood typical
  me:  3.6,  // follicular — rising
  ki:  4.2,  // ovulatory — peak
  mi:  3.0,  // luteal — declining
};

/**
 * Calculate predicted mood for a given cycle day
 * @param {Object} params
 * @param {number} params.cycleDay - Current day in cycle (1-based)
 * @param {number} params.cycleLength - Cycle length (default 28)
 * @param {Array} params.checkins - All historical check-in entries
 * @returns {Object|null} { predicted: number, confidence: 'low'|'medium'|'high', basis: string }
 */
export function predictMood({ cycleDay, cycleLength = 28, checkins = [] }) {
  if (!checkins || checkins.length === 0) {
    return null;
  }

  const phaseKey = getPhaseKeyForDay(cycleDay, cycleLength);
  const moodCheckins = checkins.filter(c => c.mood && c.cycleDay);

  if (moodCheckins.length < 3) {
    // Not enough data — return phase baseline
    const baseline = PHASE_BASELINES[phaseKey];
    return {
      predicted: Math.round(baseline),
      exact: baseline,
      confidence: 'low',
      basis: 'phase_baseline',
    };
  }

  // Strategy 1: Same cycle day (±1 day window)
  const sameDayEntries = moodCheckins.filter(
    c => Math.abs(c.cycleDay - cycleDay) <= 1
  );

  // Strategy 2: Same phase entries
  const samePhaseEntries = moodCheckins.filter(c => {
    const entryPhase = getPhaseKeyForDay(c.cycleDay, cycleLength);
    return entryPhase === phaseKey;
  });

  let predicted;
  let confidence;
  let basis;

  if (sameDayEntries.length >= 3) {
    // Strong signal: multiple entries for this cycle day
    predicted = weightedAverage(sameDayEntries.map(c => c.mood));
    confidence = 'high';
    basis = 'cycle_day_history';
  } else if (samePhaseEntries.length >= 3) {
    // Moderate signal: average for this phase from user's data
    predicted = weightedAverage(samePhaseEntries.map(c => c.mood));
    confidence = sameDayEntries.length > 0 ? 'medium' : 'medium';
    basis = 'phase_history';
  } else {
    // Low signal: blend user's overall average with phase baseline
    const userAvg = moodCheckins.reduce((s, c) => s + c.mood, 0) / moodCheckins.length;
    const baseline = PHASE_BASELINES[phaseKey];
    predicted = userAvg * 0.4 + baseline * 0.6;
    confidence = 'low';
    basis = 'blended_baseline';
  }

  return {
    predicted: Math.max(1, Math.min(5, Math.round(predicted))),
    exact: Math.max(1, Math.min(5, predicted)),
    confidence,
    basis,
  };
}

/**
 * Weighted average — more recent entries count more
 */
function weightedAverage(values) {
  if (values.length === 0) return 3;
  if (values.length === 1) return values[0];

  // Give later entries (more recent) higher weight
  let totalWeight = 0;
  let weightedSum = 0;
  values.forEach((v, i) => {
    const weight = 1 + (i / values.length); // 1.0 → 2.0
    weightedSum += v * weight;
    totalWeight += weight;
  });
  return weightedSum / totalWeight;
}

/**
 * Generate a mood trend description for the current phase
 * @param {Object} params
 * @param {string} params.phaseKey - Current phase key
 * @param {number} params.predictedMood - Predicted mood value
 * @param {string} params.lang - 'en' | 'ja'
 * @returns {string} Human-readable prediction text
 */
export function getMoodPredictionText({ phaseKey, predictedMood, confidence, lang = 'en' }) {
  const isJa = lang === 'ja';

  if (confidence === 'low') {
    return isJa
      ? 'データを集めています…チェックインを続けると予測が正確になります'
      : 'Gathering data… keep checking in for better predictions';
  }

  const moodWords = {
    en: { 1: 'low', 2: 'below average', 3: 'neutral', 4: 'good', 5: 'great' },
    ja: { 1: '低め', 2: 'やや低め', 3: '普通', 4: '良い', 5: '最高' },
  };

  const phaseNames = {
    en: { sei: 'menstrual phase', me: 'follicular phase', ki: 'ovulation', mi: 'luteal phase' },
    ja: { sei: '生理期', me: '卵胞期', ki: '排卵期', mi: '黄体期' },
  };

  const mood = moodWords[lang][predictedMood] || moodWords[lang][3];
  const phase = phaseNames[lang][phaseKey] || '';

  if (isJa) {
    return `${phase}では、あなたの気分は${mood}の傾向があります`;
  }
  return `During your ${phase}, your mood tends to be ${mood}`;
}

/**
 * Get mood history summary for insights
 * @param {Array} checkins
 * @param {number} cycleLength
 * @returns {Object} { byPhase: {sei: avg, ...}, trend: 'stable'|'improving'|'declining' }
 */
export function getMoodSummary(checkins = [], cycleLength = 28) {
  const moodCheckins = checkins.filter(c => c.mood && c.cycleDay);
  if (moodCheckins.length < 3) return null;

  // Average mood per phase
  const byPhase = {};
  const phaseEntries = { sei: [], me: [], ki: [], mi: [] };

  moodCheckins.forEach(c => {
    const pk = getPhaseKeyForDay(c.cycleDay, cycleLength);
    if (phaseEntries[pk]) {
      phaseEntries[pk].push(c.mood);
    }
  });

  for (const [pk, entries] of Object.entries(phaseEntries)) {
    byPhase[pk] = entries.length > 0
      ? entries.reduce((s, v) => s + v, 0) / entries.length
      : null;
  }

  // Overall trend (compare first half to second half of entries)
  const mid = Math.floor(moodCheckins.length / 2);
  const firstHalf = moodCheckins.slice(0, mid);
  const secondHalf = moodCheckins.slice(mid);

  const firstAvg = firstHalf.reduce((s, c) => s + c.mood, 0) / (firstHalf.length || 1);
  const secondAvg = secondHalf.reduce((s, c) => s + c.mood, 0) / (secondHalf.length || 1);

  let trend = 'stable';
  if (secondAvg - firstAvg > 0.3) trend = 'improving';
  if (firstAvg - secondAvg > 0.3) trend = 'declining';

  return { byPhase, trend };
}
