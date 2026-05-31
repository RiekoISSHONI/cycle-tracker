/**
 * Prediction utilities based on historical cycle data
 * Uses check-in history to predict mood, energy, symptoms by cycle day
 */

/**
 * Predict next period date based on historical cycle lengths
 * @param {Array} periodHistory - Array of period start dates (ISO strings)
 * @param {Object} cycleStats - Calculated cycle statistics
 * @returns {Object} Prediction with confidence
 */
export function predictNextPeriod(periodHistory, cycleStats) {
  if (!periodHistory || periodHistory.length === 0) {
    return null;
  }

  const lastPeriod = new Date(periodHistory[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Use average cycle length, or default to 28
  const avgLength = cycleStats?.averageLength || 28;
  const variance = cycleStats ? cycleStats.maxLength - cycleStats.minLength : 0;

  // Calculate predicted date
  const predictedDate = new Date(lastPeriod);
  predictedDate.setDate(predictedDate.getDate() + avgLength);

  // Calculate days until
  const daysUntil = Math.ceil((predictedDate - today) / (1000 * 60 * 60 * 24));

  // Calculate confidence based on data amount and consistency
  let confidence = 'low';
  if (periodHistory.length >= 6 && variance <= 3) {
    confidence = 'high';
  } else if (periodHistory.length >= 3 && variance <= 5) {
    confidence = 'medium';
  }

  // Calculate range
  const earliestDate = new Date(lastPeriod);
  earliestDate.setDate(earliestDate.getDate() + (cycleStats?.minLength || avgLength - 2));

  const latestDate = new Date(lastPeriod);
  latestDate.setDate(latestDate.getDate() + (cycleStats?.maxLength || avgLength + 2));

  return {
    predictedDate,
    daysUntil: Math.max(0, daysUntil),
    confidence,
    range: {
      earliest: earliestDate,
      latest: latestDate,
      daysRange: variance || 4
    },
    basedOn: periodHistory.length
  };
}

/**
 * Analyze patterns by cycle day from check-in history
 * @param {Array} checkins - Array of check-in objects with cycleDay
 * @returns {Object} Patterns grouped by cycle day
 */
export function analyzeCycleDayPatterns(checkins) {
  if (!checkins || checkins.length === 0) {
    return null;
  }

  // Group check-ins by cycle day
  const byDay = {};

  checkins.forEach(checkin => {
    const day = checkin.cycleDay;
    if (!day) return;

    if (!byDay[day]) {
      byDay[day] = {
        moods: [],
        energies: [],
        symptoms: {},
        flows: [],
        count: 0
      };
    }

    byDay[day].count++;

    if (checkin.mood) byDay[day].moods.push(checkin.mood);
    if (checkin.energy) byDay[day].energies.push(checkin.energy);
    if (checkin.flow && checkin.flow !== 'none') byDay[day].flows.push(checkin.flow);

    (checkin.symptoms || []).forEach(s => {
      byDay[day].symptoms[s] = (byDay[day].symptoms[s] || 0) + 1;
    });
  });

  // Calculate averages and patterns
  const patterns = {};

  Object.keys(byDay).forEach(day => {
    const data = byDay[day];

    patterns[day] = {
      avgMood: data.moods.length > 0
        ? Math.round((data.moods.reduce((a, b) => a + b, 0) / data.moods.length) * 10) / 10
        : null,
      avgEnergy: data.energies.length > 0
        ? Math.round((data.energies.reduce((a, b) => a + b, 0) / data.energies.length) * 10) / 10
        : null,
      likelySymptoms: Object.entries(data.symptoms)
        .filter(([_, count]) => count / data.count >= 0.3) // At least 30% occurrence
        .sort((a, b) => b[1] - a[1])
        .map(([symptom]) => symptom),
      flowPattern: getMostCommon(data.flows),
      dataPoints: data.count
    };
  });

  return patterns;
}

/**
 * Get predictions for a specific cycle day
 * @param {number} cycleDay - The cycle day to predict
 * @param {Object} patterns - Analyzed patterns
 * @param {number} cycleLength - Total cycle length
 * @returns {Object} Predictions for the day
 */
export function getPredictionsForDay(cycleDay, patterns, cycleLength = 28) {
  if (!patterns) {
    return getDefaultPredictions(cycleDay, cycleLength);
  }

  // Look for exact day match or nearby days
  const exactMatch = patterns[cycleDay];

  if (exactMatch && exactMatch.dataPoints >= 2) {
    return {
      mood: exactMatch.avgMood,
      energy: exactMatch.avgEnergy,
      symptoms: exactMatch.likelySymptoms,
      flow: exactMatch.flowPattern,
      confidence: exactMatch.dataPoints >= 4 ? 'high' : 'medium',
      basedOn: exactMatch.dataPoints
    };
  }

  // Try nearby days for interpolation
  const nearby = [];
  for (let offset = -2; offset <= 2; offset++) {
    const day = cycleDay + offset;
    if (patterns[day] && patterns[day].dataPoints >= 1) {
      nearby.push(patterns[day]);
    }
  }

  if (nearby.length > 0) {
    const avgMood = nearby.filter(n => n.avgMood !== null);
    const avgEnergy = nearby.filter(n => n.avgEnergy !== null);

    return {
      mood: avgMood.length > 0
        ? Math.round((avgMood.reduce((a, b) => a + b.avgMood, 0) / avgMood.length) * 10) / 10
        : null,
      energy: avgEnergy.length > 0
        ? Math.round((avgEnergy.reduce((a, b) => a + b.avgEnergy, 0) / avgEnergy.length) * 10) / 10
        : null,
      symptoms: [...new Set(nearby.flatMap(n => n.likelySymptoms))].slice(0, 3),
      flow: nearby.find(n => n.flowPattern)?.flowPattern || null,
      confidence: 'low',
      basedOn: nearby.reduce((sum, n) => sum + n.dataPoints, 0)
    };
  }

  return getDefaultPredictions(cycleDay, cycleLength);
}

/**
 * Get default phase-based predictions when no historical data
 */
function getDefaultPredictions(cycleDay, cycleLength) {
  const phase = getPhase(cycleDay, cycleLength);

  const defaults = {
    menstrual: { mood: 3, energy: 2, symptoms: ['cramps', 'fatigue'], flow: 'medium' },
    follicular: { mood: 4, energy: 4, symptoms: [], flow: null },
    ovulatory: { mood: 4.5, energy: 5, symptoms: [], flow: null },
    luteal: { mood: 3, energy: 3, symptoms: ['bloating', 'cravings'], flow: null }
  };

  return {
    ...defaults[phase],
    confidence: 'default',
    basedOn: 0
  };
}

/**
 * Get phase for a cycle day
 */
function getPhase(cycleDay, cycleLength) {
  const ratio = cycleLength / 28;
  const menstrualEnd = Math.round(5 * ratio);
  const follicularEnd = Math.round(13 * ratio);
  const ovulatoryEnd = Math.round(17 * ratio);

  if (cycleDay <= menstrualEnd) return 'menstrual';
  if (cycleDay <= follicularEnd) return 'follicular';
  if (cycleDay <= ovulatoryEnd) return 'ovulatory';
  return 'luteal';
}

/**
 * Get most common value from array
 */
function getMostCommon(arr) {
  if (!arr || arr.length === 0) return null;

  const counts = {};
  arr.forEach(v => { counts[v] = (counts[v] || 0) + 1; });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Generate weekly predictions
 * @param {number} currentDay - Current cycle day
 * @param {Object} patterns - Analyzed patterns
 * @param {number} cycleLength - Total cycle length
 * @returns {Array} Predictions for next 7 days
 */
export function getWeeklyPredictions(currentDay, patterns, cycleLength = 28) {
  const predictions = [];

  for (let i = 0; i < 7; i++) {
    let day = currentDay + i;
    if (day > cycleLength) day = day - cycleLength;

    predictions.push({
      cycleDay: day,
      dayOffset: i,
      ...getPredictionsForDay(day, patterns, cycleLength)
    });
  }

  return predictions;
}

/**
 * Calculate prediction accuracy score
 * @param {Array} checkins - Historical check-ins
 * @returns {Object} Accuracy metrics
 */
export function calculatePredictionAccuracy(checkins) {
  if (!checkins || checkins.length < 10) {
    return { accuracy: null, message: 'Need more data' };
  }

  // Split data: use 70% for training, 30% for testing
  const sortedCheckins = [...checkins].sort((a, b) => new Date(a.date) - new Date(b.date));
  const splitIndex = Math.floor(sortedCheckins.length * 0.7);

  const trainingData = sortedCheckins.slice(0, splitIndex);
  const testData = sortedCheckins.slice(splitIndex);

  const patterns = analyzeCycleDayPatterns(trainingData);

  let moodHits = 0;
  let moodTotal = 0;
  let energyHits = 0;
  let energyTotal = 0;

  testData.forEach(checkin => {
    const prediction = getPredictionsForDay(checkin.cycleDay, patterns);

    if (checkin.mood && prediction.mood) {
      moodTotal++;
      if (Math.abs(checkin.mood - prediction.mood) <= 1) {
        moodHits++;
      }
    }

    if (checkin.energy && prediction.energy) {
      energyTotal++;
      if (Math.abs(checkin.energy - prediction.energy) <= 1) {
        energyHits++;
      }
    }
  });

  return {
    moodAccuracy: moodTotal > 0 ? Math.round((moodHits / moodTotal) * 100) : null,
    energyAccuracy: energyTotal > 0 ? Math.round((energyHits / energyTotal) * 100) : null,
    overallAccuracy: (moodTotal + energyTotal) > 0
      ? Math.round(((moodHits + energyHits) / (moodTotal + energyTotal)) * 100)
      : null,
    dataPoints: checkins.length
  };
}
