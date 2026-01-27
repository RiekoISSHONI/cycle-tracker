import { formatDate, getMotivationalMessage } from '../utils/cycleData';

export function Dashboard({ cycleInfo, viewMode }) {
  const { cycleDay, phaseData, daysUntilPeriod, isFertileWindow, nextPeriodDate } = cycleInfo;

  const motivationalMessage = getMotivationalMessage(cycleInfo.phase);

  return (
    <div className="space-y-6">
      {/* Main Phase Card */}
      <div className={`bg-gradient-to-br ${phaseData.color} rounded-2xl p-6 text-white shadow-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-4xl">{phaseData.emoji}</span>
            <h2 className="text-2xl font-bold mt-2">{phaseData.name}</h2>
            <p className="text-white/90 mt-1">{phaseData.description}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">Day {cycleDay}</div>
            <div className="text-sm text-white/80">of your cycle</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm">
          <p className="text-sm italic">"{motivationalMessage}"</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="text-3xl font-bold text-pink-600">{daysUntilPeriod}</div>
          <div className="text-sm text-gray-600">days until next period</div>
          <div className="text-xs text-gray-400 mt-1">{formatDate(nextPeriodDate)}</div>
        </div>

        <div className={`rounded-xl p-4 shadow-md border ${
          isFertileWindow
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-gray-100'
        }`}>
          <div className="text-3xl">{isFertileWindow ? '🌟' : '○'}</div>
          <div className="text-sm text-gray-600">
            {isFertileWindow ? 'Fertile Window' : 'Not in fertile window'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {isFertileWindow ? 'Higher chance of conception' : 'Lower fertility'}
          </div>
        </div>
      </div>

      {/* Hormone Info */}
      <div className={`${phaseData.bgColor} ${phaseData.borderColor} border rounded-xl p-4`}>
        <h3 className={`font-semibold ${phaseData.textColor} flex items-center gap-2`}>
          <span>🧬</span> Hormones
        </h3>
        <p className="text-gray-700 text-sm mt-2">{phaseData.hormones}</p>
        <p className="text-gray-600 text-sm mt-2">
          <span className="font-medium">Energy Level:</span> {phaseData.energy}
        </p>
      </div>

      {/* Phase-specific Tips */}
      {viewMode === 'personal' ? (
        <PersonalTips phaseData={phaseData} />
      ) : (
        <PartnerTips phaseData={phaseData} />
      )}
    </div>
  );
}

function PersonalTips({ phaseData }) {
  const tips = phaseData.forHer;

  return (
    <div className="space-y-4">
      <TipSection
        icon="🥗"
        title="Nutrition"
        items={tips.nutrition}
        bgColor={phaseData.bgColor}
        borderColor={phaseData.borderColor}
        textColor={phaseData.textColor}
      />
      <TipSection
        icon="🏃‍♀️"
        title="Exercise"
        items={tips.exercise}
        bgColor={phaseData.bgColor}
        borderColor={phaseData.borderColor}
        textColor={phaseData.textColor}
      />
      <TipSection
        icon="✨"
        title="Lifestyle"
        items={tips.lifestyle}
        bgColor={phaseData.bgColor}
        borderColor={phaseData.borderColor}
        textColor={phaseData.textColor}
      />
      <div className={`${phaseData.bgColor} ${phaseData.borderColor} border rounded-xl p-4`}>
        <h3 className={`font-semibold ${phaseData.textColor} flex items-center gap-2`}>
          <span>⏰</span> Fasting Recommendation
        </h3>
        <p className="text-gray-700 text-sm mt-2">{tips.fasting}</p>
      </div>
    </div>
  );
}

function PartnerTips({ phaseData }) {
  const tips = phaseData.forPartner;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-700 flex items-center gap-2">
          <span>💡</span> Understanding Her Right Now
        </h3>
        <p className="text-gray-700 text-sm mt-2">{tips.understand}</p>
      </div>

      <TipSection
        icon="💝"
        title="How to Support Her"
        items={tips.support}
        bgColor="bg-green-50"
        borderColor="border-green-200"
        textColor="text-green-700"
      />

      <TipSection
        icon="⚠️"
        title="What to Avoid"
        items={tips.avoid}
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
        textColor="text-orange-700"
      />
    </div>
  );
}

function TipSection({ icon, title, items, bgColor, borderColor, textColor }) {
  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-4`}>
      <h3 className={`font-semibold ${textColor} flex items-center gap-2`}>
        <span>{icon}</span> {title}
      </h3>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
