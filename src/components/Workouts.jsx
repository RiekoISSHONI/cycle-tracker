import { useTranslation } from 'react-i18next';

// Workout recommendations by phase with affiliate-ready structure
const WORKOUTS = {
  menstrual: [
    {
      id: 'menstrual-yoga',
      title: 'Gentle Restorative Yoga',
      duration: '20 min',
      instructor: 'Yoga With Adriene',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      affiliateTag: 'yoga_adriene',
      type: 'yoga'
    },
    {
      id: 'menstrual-stretch',
      title: 'Period Relief Stretches',
      duration: '15 min',
      instructor: 'Move With Nicole',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      affiliateTag: 'move_nicole',
      type: 'stretching'
    },
    {
      id: 'menstrual-walk',
      title: 'Calming Indoor Walk',
      duration: '30 min',
      instructor: 'Walk at Home',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example3',
      affiliateTag: 'walk_home',
      type: 'walking'
    }
  ],
  follicular: [
    {
      id: 'follicular-hiit',
      title: 'Energizing HIIT Cardio',
      duration: '25 min',
      instructor: 'Sydney Cummings',
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example4',
      affiliateTag: 'sydney_fit',
      type: 'hiit'
    },
    {
      id: 'follicular-dance',
      title: 'Fun Dance Workout',
      duration: '30 min',
      instructor: 'MadFit',
      thumbnail: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example5',
      affiliateTag: 'madfit',
      type: 'dance'
    },
    {
      id: 'follicular-strength',
      title: 'Full Body Strength',
      duration: '40 min',
      instructor: 'Caroline Girvan',
      thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example6',
      affiliateTag: 'caroline_girvan',
      type: 'strength'
    }
  ],
  ovulatory: [
    {
      id: 'ovulatory-power',
      title: 'Power Strength Training',
      duration: '45 min',
      instructor: 'Caroline Girvan',
      thumbnail: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example7',
      affiliateTag: 'caroline_girvan',
      type: 'strength'
    },
    {
      id: 'ovulatory-run',
      title: 'Interval Running',
      duration: '30 min',
      instructor: 'Nike Run Club',
      thumbnail: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example8',
      affiliateTag: 'nike_run',
      type: 'running'
    },
    {
      id: 'ovulatory-crossfit',
      title: 'CrossFit Style WOD',
      duration: '35 min',
      instructor: 'CrossFit HQ',
      thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example9',
      affiliateTag: 'crossfit',
      type: 'crossfit'
    }
  ],
  luteal: [
    {
      id: 'luteal-pilates',
      title: 'Sculpting Pilates',
      duration: '30 min',
      instructor: 'Blogilates',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example10',
      affiliateTag: 'blogilates',
      type: 'pilates'
    },
    {
      id: 'luteal-yoga',
      title: 'Calming Yoga Flow',
      duration: '25 min',
      instructor: 'Yoga With Adriene',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example11',
      affiliateTag: 'yoga_adriene',
      type: 'yoga'
    },
    {
      id: 'luteal-swim',
      title: 'Swimming Drills',
      duration: '35 min',
      instructor: 'Swim England',
      thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=example12',
      affiliateTag: 'swim_england',
      type: 'swimming'
    }
  ]
};

const TYPE_COLORS = {
  yoga: 'bg-purple-500',
  stretching: 'bg-teal-500',
  walking: 'bg-green-500',
  hiit: 'bg-red-500',
  dance: 'bg-pink-500',
  strength: 'bg-orange-500',
  running: 'bg-blue-500',
  crossfit: 'bg-amber-500',
  pilates: 'bg-indigo-500',
  swimming: 'bg-cyan-500'
};

function TypeBadge({ type }) {
  return (
    <div className={`px-2 py-1 ${TYPE_COLORS[type] || 'bg-gray-500'} rounded-lg text-white text-xs font-medium uppercase tracking-wide`}>
      {type}
    </div>
  );
}

function WorkoutCard({ workout, t }) {
  const handleClick = () => {
    // Track affiliate click (you can integrate analytics here)
    console.log('Affiliate click:', workout.affiliateTag);

    // Open video URL
    window.open(workout.videoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="card overflow-hidden text-left w-full hover:shadow-lg transition-all active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-gray-200">
        <img
          src={workout.thumbnail}
          alt={workout.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-white text-xs font-medium">
          {workout.duration}
        </div>
        <div className="absolute top-2 left-2">
          <TypeBadge type={workout.type} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-800">{workout.title}</h4>
        <p className="text-sm text-gray-500 mt-1">{workout.instructor}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-pink-500 font-medium">
            {t('workouts.affiliate')}
          </span>
          <span className="text-pink-500 flex items-center gap-1 text-sm font-medium">
            {t('workouts.watchNow')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}

export function Workouts({ phase }) {
  const { t } = useTranslation();
  const workouts = WORKOUTS[phase] || WORKOUTS.follicular;

  const phaseNames = {
    menstrual: t('phases.menstrual.name'),
    follicular: t('phases.follicular.name'),
    ovulatory: t('phases.ovulatory.name'),
    luteal: t('phases.luteal.name')
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-gray-800">{t('workouts.title')}</h3>
        <span className="text-sm text-pink-500">
          {t('workouts.forPhase', { phase: phaseNames[phase] })}
        </span>
      </div>

      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} t={t} />
        ))}
      </div>

      {/* Affiliate Disclosure */}
      <p className="text-xs text-gray-400 text-center px-4">
        Some links are affiliate partnerships. We may earn a commission at no extra cost to you.
      </p>
    </div>
  );
}
