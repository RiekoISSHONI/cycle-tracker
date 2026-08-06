// Daily inspirational quotes — one per day, cycles through all before repeating.
// 60 quotes = ~2 months of unique content.

const QUOTES = [
  { ja: '自分のペースで、自分の花を咲かせよう。', en: 'Bloom at your own pace.', author: null },
  { ja: '体は毎日あなたに語りかけている。耳を傾けて。', en: 'Your body speaks to you every day. Listen.', author: null },
  { ja: '休むことは怠けることではない。', en: 'Rest is not laziness — it is repair.', author: null },
  { ja: '月のように、あなたも満ち欠けを繰り返す。それでいい。', en: 'Like the moon, you wax and wane. And that is enough.', author: null },
  { ja: '強さとは、毎日同じでいることではない。', en: "Strength isn't being the same every day.", author: null },
  { ja: '今日の自分に優しくする。それが明日の力になる。', en: 'Be gentle with yourself today. It becomes tomorrow’s strength.', author: null },
  { ja: '巡りの中に、あなたの知恵がある。', en: 'There is wisdom in your cycle.', author: null },
  { ja: '自分を大切にすることは、わがままではない。', en: 'Taking care of yourself is not selfish.', author: null },
  { ja: '嵐の後には、必ず静けさが来る。', en: 'After the storm, stillness always comes.', author: null },
  { ja: '一歩ずつ。それだけで十分。', en: 'One step at a time is enough.', author: null },
  { ja: '完璧でなくていい。あなたはもう十分。', en: "You don't need to be perfect. You are already enough.", author: null },
  { ja: '自分の体を信じて。それはあなたの味方。', en: 'Trust your body. It is on your side.', author: null },
  { ja: '今この瞬間、あなたは成長している。', en: 'In this very moment, you are growing.', author: null },
  { ja: '深呼吸。あなたはちゃんとここにいる。', en: 'Breathe deep. You are right where you need to be.', author: null },
  { ja: '比べるのは昨日の自分だけでいい。', en: 'The only person to compare yourself to is who you were yesterday.', author: null },
  { ja: '波があるから、海は美しい。', en: 'It is the waves that make the ocean beautiful.', author: null },
  { ja: '小さな一歩も、前に進んでいること。', en: 'Even a small step forward is still forward.', author: null },
  { ja: '自分の季節を生きよう。', en: 'Live your own season.', author: null },
  { ja: '涙は弱さではない。心が洗われている証。', en: 'Tears are not weakness. They are your heart cleansing itself.', author: null },
  { ja: 'あなたの感情には、すべて意味がある。', en: 'Every emotion you feel has meaning.', author: null },
  { ja: '今日という日は、二度と来ない。だから大切に。', en: 'Today will never come again. Honour it.', author: null },
  { ja: '変化を恐れないで。それは成長の印。', en: "Don't fear change. It is the mark of growth.", author: null },
  { ja: '自分にかける言葉を、もっと優しくしよう。', en: 'Speak to yourself the way you would to someone you love.', author: null },
  { ja: '静かな時間にこそ、本当の自分が見える。', en: 'In quiet moments, your true self becomes visible.', author: null },
  { ja: 'すべては巡る。良い時も、辛い時も。', en: 'Everything cycles. The good days and the hard ones.', author: null },
  { ja: '心と体は繋がっている。どちらも大切に。', en: 'Mind and body are connected. Honour both.', author: null },
  { ja: '朝がくるたび、新しいチャンスが生まれる。', en: 'Every morning brings a fresh chance.', author: null },
  { ja: '自分を許すことも、強さのひとつ。', en: 'Forgiving yourself is also a kind of strength.', author: null },
  { ja: '誰かと比べなくていい。あなたの旅はあなたのもの。', en: 'Your journey is yours alone. No comparisons needed.', author: null },
  { ja: '感じることを、恐れないで。', en: "Don't be afraid to feel.", author: null },
  { ja: '体が求めるものに、正直でいよう。', en: 'Be honest about what your body asks for.', author: null },
  { ja: '立ち止まることも、旅の一部。', en: 'Pausing is part of the journey.', author: null },
  { ja: '光は、暗闇を知ってこそ輝く。', en: 'Light shines brightest when you have known the dark.', author: null },
  { ja: '今日できることを、ひとつだけ。', en: 'Just one thing today. That is plenty.', author: null },
  { ja: 'あなたの存在そのものが、誰かの光。', en: 'Your existence alone is a light for someone.', author: null },
  { ja: '笑顔は最高のセルフケア。', en: 'A smile is the simplest self-care.', author: null },
  { ja: '不安な時こそ、足元を見よう。', en: 'When anxious, look down at the ground beneath your feet.', author: null },
  { ja: '自然のリズムに身を任せてみよう。', en: "Surrender to nature's rhythm.", author: null },
  { ja: '完璧な日なんてない。でも、美しい日はある。', en: 'There are no perfect days. But there are beautiful ones.', author: null },
  { ja: '呼吸を整えれば、心も整う。', en: 'Steady your breath and your mind will follow.', author: null },
  { ja: 'あなたが思うより、あなたは強い。', en: 'You are stronger than you think.', author: null },
  { ja: '今日の優しさが、明日の自分をつくる。', en: "Today's kindness builds tomorrow's you.", author: null },
  { ja: '体の声を無視しないで。それはSOSかもしれない。', en: "Don't ignore your body's voice. It may be an SOS.", author: null },
  { ja: '一人の時間は、贅沢ではなく必要なもの。', en: 'Time alone is a necessity, not a luxury.', author: null },
  { ja: '季節が変わるように、あなたも変わっていい。', en: 'Just as seasons change, so can you.', author: null },
  { ja: 'ありのままで、もう十分美しい。', en: 'As you are, you are already beautiful.', author: null },
  { ja: '焦らなくていい。花は急いで咲かない。', en: "No need to rush. Flowers don't hurry to bloom.", author: null },
  { ja: '今日を乗り越えた自分を、褒めてあげよう。', en: 'Praise yourself for making it through today.', author: null },
  { ja: '弱さを見せることは、信頼の証。', en: 'Showing vulnerability is a sign of trust.', author: null },
  { ja: '自分の内側に、答えはもうある。', en: 'The answer is already inside you.', author: null },
  { ja: 'ゆっくりでいい。確実に前に進んでいるから。', en: "Slow is fine. You're still moving forward.", author: null },
  { ja: '心が疲れたら、体を休めよう。体が疲れたら、心を休めよう。', en: 'When your mind is tired, rest your body. When your body is tired, rest your mind.', author: null },
  { ja: '毎日が練習。失敗しても、また始められる。', en: 'Every day is practice. You can always begin again.', author: null },
  { ja: '大切なのは、どれだけ遠くに行くかではなく、どの方向に向かっているか。', en: "What matters isn't how far you've gone, but which direction you're heading.", author: null },
  { ja: '昨日の雨が、今日の花を咲かせる。', en: "Yesterday's rain grows today's flowers.", author: null },
  { ja: '無理をしない勇気も、立派な強さ。', en: 'The courage not to push yourself is also real strength.', author: null },
  { ja: '手放すことで、新しいものが入ってくる。', en: 'Letting go makes space for something new.', author: null },
  { ja: '夜が暗いほど、星は明るく輝く。', en: 'The darker the night, the brighter the stars.', author: null },
  { ja: 'あなたの物語は、まだ続いている。', en: 'Your story is still being written.', author: null },
  { ja: '今ここに生きている。それだけで奇跡。', en: 'Being alive, right here, right now — that alone is a miracle.', author: null },
];

/**
 * Returns today's quote. Cycles through all 60 quotes before repeating.
 * Uses day-of-year mod pool-size so every day gets a unique quote.
 */
export function getDailyQuote(lang = 'en') {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % QUOTES.length;
  const q = QUOTES[index];
  return {
    text: lang === 'ja' ? q.ja : q.en,
    author: q.author,
  };
}
