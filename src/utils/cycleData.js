/**
 * Cycle phase data based on Dr. Mindy Pelz's research
 * The menstrual cycle is divided into 4 main phases with specific recommendations
 */

export const CYCLE_PHASES = {
  menstrual: {
    name: 'Menstrual Phase',
    days: [1, 5],
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    description: 'Time for rest and reflection. Your body is shedding the uterine lining.',
    hormones: 'Estrogen and progesterone are at their lowest levels.',
    energy: 'Low energy - honor your body\'s need for rest',
    forHer: {
      nutrition: [
        'Focus on iron-rich foods (leafy greens, red meat, legumes)',
        'Warm, nourishing soups and stews',
        'Anti-inflammatory foods (turmeric, ginger, fatty fish)',
        'Magnesium-rich foods for cramps (dark chocolate, nuts)',
        'Stay hydrated with warm herbal teas'
      ],
      exercise: [
        'Gentle yoga and stretching',
        'Light walking',
        'Restorative activities',
        'Avoid intense workouts - your body needs recovery'
      ],
      lifestyle: [
        'Prioritize sleep and rest',
        'Journal and reflect',
        'Take warm baths',
        'Practice self-compassion',
        'Reduce social commitments if possible'
      ],
      fasting: 'Best time for a 13-15 hour overnight fast. Avoid extended fasting.'
    },
    forPartner: {
      understand: 'She may experience cramps, fatigue, and mood changes. This is completely normal.',
      support: [
        'Offer to take on extra household tasks',
        'Bring her warm drinks or a heating pad',
        'Give her space if she needs it',
        'Be patient with mood fluctuations',
        'Plan low-key activities together'
      ],
      avoid: [
        'Don\'t take mood changes personally',
        'Avoid scheduling demanding activities',
        'Don\'t dismiss her discomfort'
      ]
    }
  },
  follicular: {
    name: 'Follicular Phase',
    days: [6, 13],
    color: 'from-pink-400 to-purple-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    description: 'Rising energy and creativity. Your body is preparing for ovulation.',
    hormones: 'Estrogen is rising, making you feel more energetic and confident.',
    energy: 'Increasing energy - great time to start new projects',
    forHer: {
      nutrition: [
        'Light, fresh foods - salads, smoothies',
        'Fermented foods for gut health',
        'Lean proteins',
        'Sprouted and fresh vegetables',
        'Phytoestrogen foods (flax seeds, chickpeas)'
      ],
      exercise: [
        'Try new workouts',
        'Cardio and high-energy activities',
        'Strength training',
        'Group fitness classes',
        'This is your peak performance time!'
      ],
      lifestyle: [
        'Start new projects',
        'Schedule important meetings',
        'Be social and connect with others',
        'Try new experiences',
        'Brain is primed for learning'
      ],
      fasting: 'Good time for longer fasts (15-17 hours). Your body handles fasting well now.'
    },
    forPartner: {
      understand: 'She\'s feeling more energetic, social, and adventurous. Her mood is typically upbeat.',
      support: [
        'Plan fun dates and adventures',
        'Support her new projects and ideas',
        'Engage in stimulating conversations',
        'Be spontaneous together',
        'Exercise or try new activities together'
      ],
      avoid: [
        'Don\'t hold her back from being social',
        'Avoid being a couch potato when she wants activity'
      ]
    }
  },
  ovulatory: {
    name: 'Ovulatory Phase',
    days: [14, 17],
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    description: 'Peak energy and confidence. You\'re at your most fertile and vibrant.',
    hormones: 'Estrogen peaks, testosterone rises, and LH surges trigger ovulation.',
    energy: 'Highest energy - you\'re glowing!',
    forHer: {
      nutrition: [
        'Raw fruits and vegetables',
        'Lighter meals - your metabolism is fastest',
        'Anti-inflammatory foods',
        'Fiber-rich foods to help metabolize estrogen',
        'Cruciferous vegetables (broccoli, cauliflower)'
      ],
      exercise: [
        'High-intensity interval training (HIIT)',
        'Heavy lifting - you\'re strongest now',
        'Competitive sports',
        'Push your limits!',
        'Group workouts for connection'
      ],
      lifestyle: [
        'Schedule important presentations',
        'Negotiate and communicate',
        'Network and socialize',
        'Your verbal skills peak now',
        'Great time for difficult conversations'
      ],
      fasting: 'Can do 15-17 hour fasts. Listen to your body.'
    },
    forPartner: {
      understand: 'She\'s at her most confident, communicative, and attractive. Libido is typically highest.',
      support: [
        'Compliment her - she\'ll receive it well',
        'Plan romantic dates',
        'Have meaningful conversations',
        'Be present and attentive',
        'This is a great time for intimacy'
      ],
      avoid: [
        'Don\'t be distant or distracted',
        'Avoid bringing up heavy conflicts'
      ]
    }
  },
  luteal: {
    name: 'Luteal Phase',
    days: [18, 28],
    color: 'from-indigo-400 to-purple-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    description: 'Winding down and preparing. Your body is focused on potential pregnancy support.',
    hormones: 'Progesterone rises then falls. This hormonal shift can cause PMS symptoms.',
    energy: 'Decreasing energy - focus on completion over starting',
    forHer: {
      nutrition: [
        'Complex carbohydrates to support serotonin',
        'Magnesium-rich foods (reduce cravings and cramps)',
        'B-vitamin rich foods for mood',
        'Roasted vegetables and warm foods',
        'Avoid excess salt, sugar, caffeine, and alcohol'
      ],
      exercise: [
        'Moderate intensity workouts',
        'Pilates and strength training',
        'Yoga - especially in the late luteal phase',
        'Walking and swimming',
        'Listen to your body - scale back if needed'
      ],
      lifestyle: [
        'Complete ongoing projects',
        'Organize and nest',
        'Administrative tasks',
        'Self-care and alone time',
        'Prepare for the upcoming menstrual phase'
      ],
      fasting: 'Reduce fasting to 13-15 hours. In the 5 days before your period, avoid fasting longer than 13 hours.'
    },
    forPartner: {
      understand: 'She may experience PMS - bloating, mood swings, cravings, and sensitivity. Be extra patient.',
      support: [
        'Be extra understanding and patient',
        'Help with tasks and reduce her load',
        'Provide healthy comfort foods',
        'Offer physical affection without expectations',
        'Create a calm, supportive environment'
      ],
      avoid: [
        'Don\'t pick fights or bring up sensitive topics',
        'Avoid commenting on mood or body changes',
        'Don\'t take irritability personally',
        'Avoid being critical or demanding'
      ]
    }
  }
};

/**
 * Calculate the current cycle day and phase
 * @param {Date} lastPeriodStart - The start date of the last period
 * @param {number} cycleLength - The average cycle length (default 28)
 * @returns {Object} Current cycle information
 */
export function calculateCycleInfo(lastPeriodStart, cycleLength = 28) {
  if (!lastPeriodStart) return null;

  const today = new Date();
  const startDate = new Date(lastPeriodStart);

  // Calculate days since last period
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate current cycle day (1-indexed)
  let cycleDay = (diffDays % cycleLength) + 1;
  if (cycleDay <= 0) cycleDay = cycleLength + cycleDay;

  // Determine current phase based on cycle day
  // Adjust phase days based on cycle length
  const phase = getPhaseForDay(cycleDay, cycleLength);

  // Calculate days until next period
  const daysUntilPeriod = cycleLength - cycleDay + 1;

  // Calculate next period date
  const nextPeriodDate = new Date(startDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + Math.ceil(diffDays / cycleLength + 1) * cycleLength);

  // Calculate ovulation day (typically around day 14 for a 28-day cycle)
  const ovulationDay = Math.round(cycleLength / 2);
  const daysUntilOvulation = ovulationDay - cycleDay;

  return {
    cycleDay,
    cycleLength,
    phase,
    phaseData: CYCLE_PHASES[phase],
    daysUntilPeriod: daysUntilPeriod > 0 ? daysUntilPeriod : cycleLength,
    daysUntilOvulation,
    nextPeriodDate,
    isOvulating: phase === 'ovulatory',
    isFertileWindow: cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1
  };
}

/**
 * Determine the phase for a given cycle day
 * @param {number} cycleDay - The current day of the cycle
 * @param {number} cycleLength - The total cycle length
 * @returns {string} The phase name
 */
function getPhaseForDay(cycleDay, cycleLength) {
  // Adjust phases proportionally for different cycle lengths
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
 * Get a motivational message for the current phase
 * @param {string} phase - The current phase
 * @returns {string} A motivational message
 */
export function getMotivationalMessage(phase) {
  const messages = {
    menstrual: [
      "Rest is productive. Honor your body's need to recharge.",
      "This is your winter - a time for introspection and renewal.",
      "Be gentle with yourself. This phase is about releasing and letting go."
    ],
    follicular: [
      "Your energy is building! This is the perfect time to plant new seeds.",
      "You're entering your spring - fresh starts and new beginnings await.",
      "Your creativity is heightened. Dream big and plan boldly!"
    ],
    ovulatory: [
      "You're in full bloom! Your confidence and charisma are at their peak.",
      "This is your summer - shine bright and share your gifts with the world.",
      "Your communication skills are supercharged. Speak your truth!"
    ],
    luteal: [
      "Time to harvest what you've planted. Focus on completing, not starting.",
      "This is your autumn - a time for reflection and preparation.",
      "Nourish yourself as you prepare for a new cycle."
    ]
  };

  const phaseMessages = messages[phase] || messages.menstrual;
  return phaseMessages[Math.floor(Math.random() * phaseMessages.length)];
}

/**
 * Format a date for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Generate a shareable code for partner access
 * @returns {string} A random 6-character code
 */
export function generateShareCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Calculate cycle statistics from period history
 * @param {Array} periodDates - Array of period start dates (ISO strings)
 * @returns {Object} Cycle statistics
 */
export function calculateCycleStats(periodDates) {
  if (!periodDates || periodDates.length < 2) {
    return {
      averageLength: 28,
      minLength: 28,
      maxLength: 28,
      isIrregular: false,
      cycleLengths: []
    };
  }

  const sorted = [...periodDates].sort((a, b) => new Date(a) - new Date(b));
  const cycleLengths = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const days = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (days > 0 && days < 60) {
      cycleLengths.push(days);
    }
  }

  if (cycleLengths.length === 0) {
    return {
      averageLength: 28,
      minLength: 28,
      maxLength: 28,
      isIrregular: false,
      cycleLengths: []
    };
  }

  const sum = cycleLengths.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / cycleLengths.length);
  const min = Math.min(...cycleLengths);
  const max = Math.max(...cycleLengths);
  const variance = max - min;

  return {
    averageLength: avg,
    minLength: min,
    maxLength: max,
    isIrregular: variance > 7,
    cycleLengths
  };
}

/**
 * Get prediction range for next period
 * @param {string} lastPeriodStart - Last period start date
 * @param {Object} stats - Cycle statistics
 * @returns {Object} Prediction range
 */
export function getPredictionRange(lastPeriodStart, stats) {
  const start = new Date(lastPeriodStart);

  const earliestDate = new Date(start);
  earliestDate.setDate(earliestDate.getDate() + stats.minLength);

  const expectedDate = new Date(start);
  expectedDate.setDate(expectedDate.getDate() + stats.averageLength);

  const latestDate = new Date(start);
  latestDate.setDate(latestDate.getDate() + stats.maxLength);

  return {
    earliest: earliestDate,
    expected: expectedDate,
    latest: latestDate,
    rangeInDays: stats.maxLength - stats.minLength
  };
}
