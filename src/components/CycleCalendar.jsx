import { CYCLE_PHASES } from '../utils/cycleData';

export function CycleCalendar({ cycleInfo }) {
  const { cycleDay, cycleLength } = cycleInfo;

  // Generate array of days for the cycle
  const days = Array.from({ length: cycleLength }, (_, i) => i + 1);

  // Calculate phase for each day
  const getPhaseForDay = (day) => {
    const ratio = cycleLength / 28;
    const menstrualEnd = Math.round(5 * ratio);
    const follicularEnd = Math.round(13 * ratio);
    const ovulatoryEnd = Math.round(17 * ratio);

    if (day <= menstrualEnd) return 'menstrual';
    if (day <= follicularEnd) return 'follicular';
    if (day <= ovulatoryEnd) return 'ovulatory';
    return 'luteal';
  };

  const phaseColors = {
    menstrual: 'bg-red-400',
    follicular: 'bg-pink-400',
    ovulatory: 'bg-yellow-400',
    luteal: 'bg-indigo-400'
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">Your Cycle Overview</h3>

      {/* Phase Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {Object.entries(CYCLE_PHASES).map(([key, phase]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${phaseColors[key]}`} />
            <span className="text-gray-600">{phase.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const phase = getPhaseForDay(day);
          const isToday = day === cycleDay;

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                transition-all duration-200
                ${phaseColors[phase]}
                ${isToday
                  ? 'ring-2 ring-offset-2 ring-gray-800 text-white scale-110 z-10'
                  : 'text-white/90 hover:scale-105'
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Current Position */}
      <div className="mt-4 text-center text-sm text-gray-600">
        You are on <span className="font-semibold text-pink-600">Day {cycleDay}</span> of {cycleLength}
      </div>
    </div>
  );
}
