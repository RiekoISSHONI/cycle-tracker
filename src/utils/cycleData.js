/**
 * Science-backed cycle phase data
 * The menstrual cycle is divided into 4 main phases with specific recommendations
 * Based on peer-reviewed research on hormonal fluctuations and their effects
 */

export const CYCLE_PHASES = {
  menstrual: {
    name: 'Menstrual Phase',
    days: [1, 5],
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    description: 'Your body is shedding the uterine lining. Hormones are at their lowest, and FSH begins rising to prepare the next cycle.',
    hormones: 'Estrogen and progesterone at lowest levels. FSH begins rising to stimulate follicle development.',
    energy: 'Energy varies individually - research shows no consistent performance decline',
    forHer: {
      skin: {
        condition: 'Skin stabilizing. Premenstrual breakouts begin healing as hormones reset.',
        science: 'Low hormones mean relatively stable sebum production. Any acne from the luteal phase starts to heal as inflammation decreases.',
        tcm: 'Blood deficiency (xue xu) manifests as pale, dry complexion lacking luster. The skin reflects internal blood status.',
        care: [
          'Focus on deep hydration - use rich moisturizers',
          'Gentle, fragrance-free products only',
          'Hydrating sheet masks with hyaluronic acid',
          'Avoid harsh exfoliants - skin is sensitive',
          'Use facial oils (rosehip, jojoba) to restore glow',
          'Get extra sleep for skin repair'
        ],
        tcmCare: [
          'Gua sha with rose quartz to promote blood flow',
          'Pearl powder masks - traditional brightening',
          'Goji berry-infused products for blood nourishment'
        ]
      },
      nutrition: [
        'Iron-rich foods essential - RDA is 18mg/day for menstruating women (vs 8mg for men)',
        'Include vitamin C with iron foods to boost absorption',
        'Leafy greens, red meat, legumes, fortified cereals',
        'Anti-inflammatory foods (fatty fish, turmeric, ginger)',
        'Magnesium for cramps (dark chocolate, nuts, seeds)'
      ],
      tcmNutrition: {
        principle: 'Moving Blood & Warming the Uterus',
        foods: [
          'Red dates (hong zao) - nourishes blood and qi',
          'Ginger tea - warms the uterus and promotes circulation',
          'Brown sugar water - traditional remedy for cramps',
          'Dang gui (angelica root) soup - the "female ginseng"',
          'Warming bone broths with goji berries',
          'Black chicken soup - deeply nourishing'
        ],
        avoid: [
          'Cold and raw foods (salads, ice cream, cold drinks)',
          'Iced beverages - constricts blood flow',
          'Excessive spicy food - can increase bleeding'
        ],
        tea: 'Rose bud tea or ginger red date tea'
      },
      exercise: [
        'Train as you feel - research shows no performance impairment',
        'Some may prefer gentler activities due to discomfort',
        'Walking, yoga, and stretching if energy is low',
        'Listen to your body - individual variation is significant'
      ],
      lifestyle: [
        'Prioritize sleep for recovery',
        'Good time for reflection and planning',
        'Take warm baths to ease cramps',
        'Practice self-compassion',
        'Reduce commitments if needed'
      ],
      fasting: 'Listen to your body during this phase.'
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
    description: 'Estrogen rises steadily as your body prepares for ovulation. Many experience improved mood and energy.',
    hormones: 'Estrogen rising steadily. FSH stimulates follicle maturation. Insulin sensitivity improves.',
    energy: 'Increasing energy - estrogen may enhance endurance and recovery',
    forHer: {
      skin: {
        condition: 'Skin improving daily. Sebum production at its lowest as estrogen rises.',
        science: 'Rising estrogen regulates sebum production - research shows lowest oiliness occurs as estrogen approaches its peak. Skin barrier function improves.',
        tcm: 'Yin energy rising brings moisture and luster back to the skin. Blood is building, showing as healthy color.',
        care: [
          'Great time for gentle exfoliation (AHA/BHA)',
          'Vitamin C serums for brightening',
          'Lighter moisturizers as skin balances',
          'Try new skincare products now - skin is resilient',
          'Focus on anti-aging treatments',
          'Hydrating toners with niacinamide'
        ],
        tcmCare: [
          'Jade roller massage to move qi and reduce puffiness',
          'Green tea-based products - antioxidant and cooling',
          'White fungus (snow fungus) masks for deep hydration'
        ]
      },
      nutrition: [
        'Better insulin sensitivity - 68.5% time in target glucose range (research data)',
        'BMR is at its lowest - adjust portions if needed',
        'Fresh foods, salads, and smoothies',
        'Fermented foods support gut-hormone connection',
        'Lean proteins and omega-3 rich foods'
      ],
      tcmNutrition: {
        principle: 'Nourishing Yin & Building Blood',
        foods: [
          'Black sesame seeds - nourishes kidney yin and blood',
          'Goji berries (gou qi zi) - tonifies liver and kidney',
          'Eggs - excellent for building yin',
          'Seaweed and kelp - nourishes yin, rich in minerals',
          'Duck meat - cooling and yin-nourishing',
          'Tofu and soy products - gentle yin tonics'
        ],
        avoid: [
          'Excessive spicy or heating foods',
          'Too much caffeine - depletes yin',
          'Overly greasy foods'
        ],
        tea: 'Chrysanthemum tea or goji berry tea'
      },
      exercise: [
        'Strength training may be optimally timed - estrogen aids recovery',
        'Cardio and endurance activities',
        'Try new workout routines',
        'Group fitness classes',
        'Building phase - good time to increase training load'
      ],
      lifestyle: [
        'Start new projects - energy supports initiation',
        'Studies suggest improved verbal working memory',
        'Good time for learning and skill acquisition',
        'Social activities and networking',
        'Schedule brainstorming and creative work'
      ],
      fasting: 'Listen to your body during this phase.'
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
    description: 'LH surge triggers ovulation. Estrogen peaks, then drops. Many feel confident and energetic.',
    hormones: 'LH surge triggers ovulation. Estrogen at peak then drops. Testosterone rises briefly. Progesterone begins rising.',
    energy: 'Peak energy for many - but watch for injury risk',
    forHer: {
      skin: {
        condition: 'Your best skin days! Lowest sebum production, clearest complexion.',
        science: 'Research confirms lowest oiliness at ovulation due to peak estrogen. Skin is at its most balanced and resilient.',
        tcm: 'Yin at its peak, skin shows abundant "shen" (spirit/radiance). The face reflects inner vitality and balance.',
        care: [
          'Minimal routine needed - skin is thriving',
          'Light, non-comedogenic products',
          'Focus on maintenance, not correction',
          'Great time for professional treatments (facials)',
          'Photograph your skin - this is your baseline!',
          'SPF is essential - skin is more photosensitive'
        ],
        tcmCare: [
          'Facial acupressure for maintaining glow',
          'Rosewater mists to preserve radiance',
          'Light gua sha to keep qi flowing'
        ]
      },
      nutrition: [
        'Fiber-rich foods help metabolize excess estrogen',
        'Cruciferous vegetables (broccoli, cauliflower, kale)',
        'Lighter meals with fresh produce',
        'Anti-inflammatory foods',
        'Stay well hydrated'
      ],
      tcmNutrition: {
        principle: 'Harmonizing Yin & Yang for Transformation',
        foods: [
          'Lotus seeds - calms the heart, supports fertility',
          'Chinese yam (shan yao) - strengthens spleen and kidney',
          'Lean proteins - supports the transformation',
          'Fresh fruits - natural cooling balance',
          'Asparagus - clears heat and nourishes yin',
          'Mung beans - gentle cooling properties'
        ],
        avoid: [
          'Excessive alcohol - disrupts qi flow',
          'Very cold foods - can shock the system',
          'Heavy, greasy meals'
        ],
        tea: 'Jasmine tea or lotus leaf tea'
      },
      exercise: [
        'CAUTION: ACL injury risk peaks now (research shows 88% of muscular injuries occur around ovulation)',
        'Peak joint laxity - be mindful during high-impact activities',
        'Warm up thoroughly before any exercise',
        'Strength training with proper form',
        'Consider lower-impact cardio options'
      ],
      lifestyle: [
        'Verbal fluency may peak - good for presentations',
        'Schedule important communications',
        'Network and socialize',
        'Studies show enhanced emotional memory consolidation',
        'Great time for difficult conversations'
      ],
      fasting: 'Listen to your body during this phase.'
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
    description: 'Progesterone dominates. Your metabolism speeds up and body temperature rises slightly.',
    hormones: 'Progesterone dominant. Core body temperature elevated. Both hormones drop premenstrually triggering PMS in some.',
    energy: 'Variable energy - elevated core temperature may cause fatigue',
    forHer: {
      skin: {
        condition: 'Premenstrual acne peaks. 63% of women experience breakouts 7-10 days before their period.',
        science: 'Research confirms progesterone and androgens increase sebum production. Premenstrual acne is documented in 63% of women, typically appearing 7-10 days before menstruation.',
        tcm: 'Liver qi stagnation causes skin eruptions. Heat rising manifests as redness and breakouts. Dampness shows as oiliness and congestion.',
        care: [
          'Start acne prevention 7-10 days before expected period',
          'Double cleanse to remove excess oil',
          'Salicylic acid (BHA) for pore clearing',
          'Spot treatments with benzoyl peroxide or tea tree',
          'Clay masks 1-2x per week for oil control',
          'Non-comedogenic, oil-free moisturizers',
          'Don\'t pick at breakouts - scarring risk is higher'
        ],
        tcmCare: [
          'Green tea compresses to reduce inflammation',
          'Mung bean masks to clear heat and detoxify',
          'Facial acupressure on Liver 3 point for qi flow',
          'Avoid greasy skincare - increases dampness'
        ]
      },
      nutrition: [
        'BMR increases 100-300 kcal/day - slight appetite increase is normal',
        'Insulin resistance increases - blood sugar less stable',
        'Complex carbs support serotonin and mood',
        'Magnesium-rich foods (dark chocolate, nuts, leafy greens)',
        'B-vitamins for energy and mood stability',
        'Reduce caffeine and alcohol which can worsen symptoms'
      ],
      tcmNutrition: {
        principle: 'Warming Yang & Supporting Kidney Energy',
        foods: [
          'Walnuts - warms kidney yang, supports brain',
          'Lamb or mutton - strongly warming',
          'Cinnamon - warms the interior, promotes circulation',
          'Fennel seeds - warms digestive system',
          'Sweet potato - nourishes spleen qi',
          'Chestnuts - strengthens kidney yang'
        ],
        avoid: [
          'Cold and raw foods - depletes yang',
          'Excessive dairy - creates dampness',
          'Too much sugar - weakens spleen'
        ],
        tea: 'Cinnamon tea or longan red date tea'
      },
      exercise: [
        'Injury risk is lower than ovulatory phase',
        'Elevated core temperature - stay hydrated, avoid overheating',
        'Moderate intensity may feel better than high intensity',
        'Yoga, pilates, swimming, walking',
        'Late luteal: scale back if energy drops'
      ],
      lifestyle: [
        'Focus on completing projects, not starting new ones',
        'Detail-oriented and administrative tasks',
        'Increased amygdala reactivity - emotions may feel stronger',
        'Extra self-care and rest',
        'Prepare for the upcoming menstrual phase'
      ],
      fasting: 'Listen to your body during this phase.'
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
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return phaseMessages[dayOfYear % phaseMessages.length];
}

/**
 * Get a daily tip for the current phase
 */
export function getDailyTip(phase) {
  const tips = {
    menstrual: [
      "Your body is doing incredible work right now. Rest is productive.",
      "Iron-rich foods like spinach and red meat help replenish what you're losing.",
      "Warm baths with Epsom salts can help ease cramps naturally.",
      "This is the perfect time for journaling and self-reflection.",
      "Gentle stretching can help with lower back pain during this phase."
    ],
    follicular: [
      "Your energy is building! It's the perfect time to start new projects.",
      "Try new foods and recipes - your body is more adaptable now.",
      "This is your brain's peak learning phase. Take on new challenges!",
      "High-intensity workouts feel easier during this phase.",
      "Social activities will feel more energizing now than any other time."
    ],
    ovulatory: [
      "You're at your most magnetic! Schedule important meetings now.",
      "Your communication skills are at their peak - have that difficult conversation.",
      "This is the best time for date nights and connecting with your partner.",
      "Push your fitness limits - you're strongest during ovulation.",
      "Your skin is glowing naturally - embrace minimal makeup days!"
    ],
    luteal: [
      "Cravings are normal - choose dark chocolate for magnesium benefits.",
      "Focus on completing tasks rather than starting new ones.",
      "Extra sleep isn't laziness - your body needs more rest now.",
      "Reduce caffeine to help with any anxiety or mood swings.",
      "Cozy activities like reading and baking match your energy perfectly."
    ]
  };

  const phaseTips = tips[phase] || tips.follicular;
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return phaseTips[dayOfYear % phaseTips.length];
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
