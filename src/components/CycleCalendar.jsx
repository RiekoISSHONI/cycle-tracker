import { useTranslation } from 'react-i18next';
import { CYCLE_PHASES } from '../utils/cycleData';

export function CycleCalendar({ cycleInfo }) {
  const { t } = useTranslation();
  const { cycleDay, cycleLength, phase } = cycleInfo;

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

  const phaseStyles = {
    menstrual: {
      bg: 'bg-rose-100',
      activeBg: 'bg-rose-500',
      text: 'text-rose-700',
      activeText: 'text-white'
    },
    follicular: {
      bg: 'bg-pink-100',
      activeBg: 'bg-pink-500',
      text: 'text-pink-700',
      activeText: 'text-white'
    },
    ovulatory: {
      bg: 'bg-amber-100',
      activeBg: 'bg-amber-500',
      text: 'text-amber-700',
      activeText: 'text-white'
    },
    luteal: {
      bg: 'bg-violet-100',
      activeBg: 'bg-violet-500',
      text: 'text-violet-700',
      activeText: 'text-white'
    }
  };

  const phaseInfo = [
    { key: 'menstrual', name: t('phases.menstrual.name'), color: 'bg-rose-500', range: `1-${Math.round(5 * cycleLength / 28)} ${t('insights.days')}` },
    { key: 'follicular', name: t('phases.follicular.name'), color: 'bg-pink-500', range: `${Math.round(5 * cycleLength / 28) + 1}-${Math.round(13 * cycleLength / 28)} ${t('insights.days')}` },
    { key: 'ovulatory', name: t('phases.ovulatory.name'), color: 'bg-amber-500', range: `${Math.round(13 * cycleLength / 28) + 1}-${Math.round(17 * cycleLength / 28)} ${t('insights.days')}` },
    { key: 'luteal', name: t('phases.luteal.name'), color: 'bg-violet-500', range: `${Math.round(17 * cycleLength / 28) + 1}-${cycleLength} ${t('insights.days')}` }
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Current Status */}
      <div className="card p-5">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{t('dashboard.day')} {t('dashboard.ofCycle')}</div>
          <div className="text-3xl font-bold text-gray-900">{cycleDay}</div>
          <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full ${phaseStyles[phase].bg} ${phaseStyles[phase].text}`}>
            <div className={`w-2 h-2 rounded-full ${phaseStyles[phase].activeBg}`} />
            <span className="text-sm font-medium">{t(`phases.${phase}.name`)}</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-4">{t('calendar.cycleOverview')}</h3>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayPhase = getPhaseForDay(day);
            const isToday = day === cycleDay;
            const styles = phaseStyles[dayPhase];

            return (
              <div
                key={day}
                className={`
                  calendar-day
                  ${isToday ? `${styles.activeBg} ${styles.activeText} shadow-lg` : `${styles.bg} ${styles.text}`}
                  ${isToday ? 'today' : 'hover:scale-105'}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Legend */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-4">{t('calendar.phaseGuide')}</h3>

        <div className="space-y-3">
          {phaseInfo.map((p) => {
            const isCurrentPhase = p.key === phase;
            return (
              <div
                key={p.key}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isCurrentPhase ? 'bg-gray-50 ring-1 ring-gray-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${p.color}`} />
                  <div>
                    <div className={`font-medium ${isCurrentPhase ? 'text-gray-900' : 'text-gray-700'}`}>
                      {p.name}
                      {isCurrentPhase && (
                        <span className="ml-2 text-xs text-pink-500 font-semibold">{t('calendar.current')}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{p.range}</div>
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cycle Summary */}
      <div className="card p-5 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{t('calendar.yourCycle')}</h4>
            <p className="text-sm text-gray-600">{cycleLength} {t('calendar.daysAverage')}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {t('settings.aboutDescription')}
        </p>
      </div>
    </div>
  );
}
