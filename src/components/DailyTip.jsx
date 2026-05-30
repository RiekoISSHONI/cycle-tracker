import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const TIPS = {
  menstrual: {
    en: [
      "Your body is doing incredible work right now. Rest is productive.",
      "Iron-rich foods like spinach and red meat help replenish what you're losing.",
      "Warm baths with Epsom salts can help ease cramps naturally.",
      "This is the perfect time for journaling and self-reflection.",
      "Gentle stretching can help with lower back pain during this phase."
    ],
    ja: [
      "あなたの体は今、素晴らしい仕事をしています。休息は生産的です。",
      "ほうれん草や赤身肉などの鉄分豊富な食品が、失われたものを補います。",
      "エプソムソルト入りの温かいお風呂は、生理痛を自然に和らげます。",
      "日記を書いたり、自己内省をするのに最適な時期です。",
      "軽いストレッチは、この時期の腰痛を和らげるのに役立ちます。"
    ]
  },
  follicular: {
    en: [
      "Your energy is building! It's the perfect time to start new projects.",
      "Try new foods and recipes - your body is more adaptable now.",
      "This is your brain's peak learning phase. Take on new challenges!",
      "High-intensity workouts feel easier during this phase.",
      "Social activities will feel more energizing now than any other time."
    ],
    ja: [
      "エネルギーが高まっています！新しいプロジェクトを始めるのに最適な時期です。",
      "新しい食べ物やレシピを試してみて - 今、体はより適応しやすいです。",
      "脳の学習ピーク期です。新しい挑戦をしましょう！",
      "この時期は高強度のワークアウトが楽に感じられます。",
      "社交活動が他のどの時期よりも活力を与えてくれます。"
    ]
  },
  ovulatory: {
    en: [
      "You're at your most magnetic! Schedule important meetings now.",
      "Your communication skills are at their peak - have that difficult conversation.",
      "This is the best time for date nights and connecting with your partner.",
      "Push your fitness limits - you're strongest during ovulation.",
      "Your skin is glowing naturally - embrace minimal makeup days!"
    ],
    ja: [
      "最も魅力的な時期です！重要な会議を今スケジュールしましょう。",
      "コミュニケーション能力がピークです - 難しい会話をするのに最適。",
      "デートナイトやパートナーとのつながりに最適な時期です。",
      "フィットネスの限界に挑戦 - 排卵期は最も強い時期です。",
      "肌が自然に輝いています - ミニマルメイクの日を楽しんで！"
    ]
  },
  luteal: {
    en: [
      "Cravings are normal - choose dark chocolate for magnesium benefits.",
      "Focus on completing tasks rather than starting new ones.",
      "Extra sleep isn't laziness - your body needs more rest now.",
      "Reduce caffeine to help with any anxiety or mood swings.",
      "Cozy activities like reading and baking match your energy perfectly."
    ],
    ja: [
      "食欲増加は正常です - マグネシウム摂取のためにダークチョコレートを選んで。",
      "新しいことを始めるより、タスクを完了することに集中。",
      "余分な睡眠は怠けではありません - 今、体はより多くの休息を必要としています。",
      "不安や気分の変動を和らげるためにカフェインを減らしましょう。",
      "読書やお菓子作りなど、居心地の良い活動があなたのエネルギーにぴったり。"
    ]
  }
};

const AFFIRMATIONS = {
  menstrual: {
    en: [
      "I honor my body's need for rest and renewal.",
      "I release what no longer serves me.",
      "I am allowed to slow down and just be."
    ],
    ja: [
      "私は体の休息と再生の必要性を尊重します。",
      "もう必要のないものを手放します。",
      "ゆっくりして、ただ存在することが許されています。"
    ]
  },
  follicular: {
    en: [
      "I embrace new beginnings with open arms.",
      "My creativity flows freely and abundantly.",
      "I am capable of achieving my dreams."
    ],
    ja: [
      "私は新しい始まりを両手を広げて受け入れます。",
      "創造性が自由に豊かに流れます。",
      "私は夢を達成する能力があります。"
    ]
  },
  ovulatory: {
    en: [
      "I radiate confidence and attract positive connections.",
      "My voice deserves to be heard.",
      "I shine brightly and inspire others."
    ],
    ja: [
      "私は自信を放ち、ポジティブなつながりを引き寄せます。",
      "私の声は聞かれる価値があります。",
      "私は明るく輝き、他の人にインスピレーションを与えます。"
    ]
  },
  luteal: {
    en: [
      "I am patient and gentle with myself.",
      "I trust my body's wisdom.",
      "I deserve comfort and self-care."
    ],
    ja: [
      "私は自分自身に忍耐強く優しくします。",
      "私は体の知恵を信頼します。",
      "私は快適さとセルフケアに値します。"
    ]
  }
};

const RECIPES = {
  menstrual: {
    en: {
      name: "Iron-Rich Lentil Soup",
      description: "Warming soup packed with iron and anti-inflammatory spices",
      ingredients: ["red lentils", "turmeric", "ginger", "spinach", "garlic"]
    },
    ja: {
      name: "鉄分たっぷりレンズ豆スープ",
      description: "鉄分と抗炎症スパイスたっぷりの温かいスープ",
      ingredients: ["赤レンズ豆", "ターメリック", "生姜", "ほうれん草", "にんにく"]
    }
  },
  follicular: {
    en: {
      name: "Fresh Spring Salad",
      description: "Light and energizing with fermented foods for gut health",
      ingredients: ["mixed greens", "avocado", "kimchi", "chickpeas", "lemon"]
    },
    ja: {
      name: "フレッシュ春サラダ",
      description: "腸の健康のための発酵食品を含む軽くて活力のあるサラダ",
      ingredients: ["ミックスグリーン", "アボカド", "キムチ", "ひよこ豆", "レモン"]
    }
  },
  ovulatory: {
    en: {
      name: "Rainbow Buddha Bowl",
      description: "Colorful, fiber-rich bowl to support estrogen metabolism",
      ingredients: ["quinoa", "broccoli", "carrots", "edamame", "tahini"]
    },
    ja: {
      name: "レインボーブッダボウル",
      description: "エストロゲン代謝をサポートするカラフルで食物繊維豊富なボウル",
      ingredients: ["キヌア", "ブロッコリー", "にんじん", "枝豆", "タヒニ"]
    }
  },
  luteal: {
    en: {
      name: "Comforting Sweet Potato Curry",
      description: "Complex carbs and magnesium to support serotonin",
      ingredients: ["sweet potato", "coconut milk", "chickpeas", "spinach", "curry spices"]
    },
    ja: {
      name: "心温まるさつまいもカレー",
      description: "セロトニンをサポートする複合炭水化物とマグネシウム",
      ingredients: ["さつまいも", "ココナッツミルク", "ひよこ豆", "ほうれん草", "カレースパイス"]
    }
  }
};

export function DailyTip({ phase }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ja') ? 'ja' : 'en';

  const { tip, affirmation, recipe } = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    const tips = TIPS[phase]?.[lang] || TIPS.follicular[lang];
    const affirmations = AFFIRMATIONS[phase]?.[lang] || AFFIRMATIONS.follicular[lang];
    const recipeData = RECIPES[phase]?.[lang] || RECIPES.follicular[lang];

    return {
      tip: tips[dayOfYear % tips.length],
      affirmation: affirmations[dayOfYear % affirmations.length],
      recipe: recipeData
    };
  }, [phase, lang]);

  return (
    <div className="space-y-4">
      {/* Daily Tip */}
      <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
            💡
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{t('dailyTip.title')}</h3>
            <p className="text-gray-600 mt-1">{tip}</p>
          </div>
        </div>
      </div>

      {/* Affirmation */}
      <div className="card p-5 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
            ✨
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{t('dailyTip.affirmation')}</h3>
            <p className="text-gray-600 mt-1 italic">"{affirmation}"</p>
          </div>
        </div>
      </div>

      {/* Recipe Suggestion */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
            🥗
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{t('recipes.title')}</h3>
            <h4 className="text-pink-600 font-medium mt-1">{recipe.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {recipe.ingredients.map((ing, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
