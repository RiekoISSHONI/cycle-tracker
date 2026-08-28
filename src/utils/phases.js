// Phase system — Japanese seasonal journey (Sunshine & Bloom palette)
// Four phases, each with a kanji, season, and cheerful colour.

export const PHASES = {
  sei: {
    key: 'sei', kanji: '静', name: '静寂', reading: 'せいじゃく', en: 'Stillness',
    clinical: '生理期', clinicalEn: 'Menstrual', season: '冬', seasonEn: 'Winter', days: 5,
    accent: '#E8A4B8', deep: '#D0819A', soft: '#FDE9F0', tint: '#FEF3F7',
    line: 'rgba(232,164,184,0.20)', emoji: '🌙',
    poem: 'めぐりの始まり。内に還り、静かに養う時。',
    poemEn: 'The cycle begins again. A time to turn inward and quietly restore.',
    energy: '低い · 休息のとき',
  },
  me: {
    key: 'me', kanji: '芽', name: '萌芽', reading: 'ほうが', en: 'Budding',
    clinical: '卵胞期', clinicalEn: 'Follicular', season: '春', seasonEn: 'Spring', days: 8,
    accent: '#6CC98C', deep: '#4EA86C', soft: '#E0F5E8', tint: '#F0FBF3',
    line: 'rgba(108,201,140,0.20)', emoji: '🌱',
    poem: '芽吹きの季節。新しい力が静かに満ちてゆく。',
    poemEn: 'The season of budding. New energy quietly rises within.',
    energy: '上昇 · 芽吹きのとき',
  },
  ki: {
    key: 'ki', kanji: '輝', name: '輝き', reading: 'かがやき', en: 'Radiance',
    clinical: '排卵期', clinicalEn: 'Ovulation', season: '夏', seasonEn: 'Summer', days: 3,
    accent: '#F0C543', deep: '#D4A72C', soft: '#FEF5D4', tint: '#FFFAEB',
    line: 'rgba(240,197,67,0.22)', emoji: '☀️',
    poem: 'エネルギーと自信がピーク。最も輝いている時期。',
    poemEn: 'Energy and confidence peak. Your most radiant days.',
    energy: '最高 · 輝きのとき',
  },
  mi: {
    key: 'mi', kanji: '実', name: '結実', reading: 'けつじつ', en: 'Ripening',
    clinical: '黄体期', clinicalEn: 'Luteal', season: '秋', seasonEn: 'Autumn', days: 12,
    accent: '#F0A878', deep: '#D48C5E', soft: '#FDE9DC', tint: '#FEF4EE',
    line: 'rgba(240,168,120,0.20)', emoji: '🍂',
    poem: '実りと内省の季節。ゆっくりと整えてゆく。',
    poemEn: 'A season of ripening and reflection. Slowly, gently, restore your balance.',
    energy: '下降 · 整えるとき',
  },
};

export const PHASE_ORDER = ['sei', 'me', 'ki', 'mi'];
export const CYCLE_LEN = 28;

// Neutrals — warm sunny palette
export const CREAM  = '#FFFBF2';
export const CREAM2 = '#F5EDDB';
export const CARD   = '#FFFFFF';
export const INK    = '#3A3226';
export const INK2   = '#8C7E6E';
export const INK3   = '#B5A898';
export const LINE   = 'rgba(58,50,38,0.08)';
export const LINE2  = 'rgba(58,50,38,0.05)';

// Legacy aliases
export const PAPER  = CREAM;
export const PAPER2 = CREAM2;

// Brand chrome (golden sunflower — the app's signature colour)
export const CORAL  = '#F0C543';
export const CORAL_D = '#D4A72C';

// Font stacks
export const MARU    = '"Zen Kaku Gothic New", "Hiragino Kaku Gothic ProN", system-ui, sans-serif';
export const PMINCHO = '"Shippori Mincho B1", serif';
export const GOTHIC  = MARU;
export const MINCHO  = PMINCHO;
export const OLDMIN  = PMINCHO;

// Phase ranges in cycle-days
export const PHASE_RANGES = (() => {
  let acc = 0;
  const out = {};
  for (const k of PHASE_ORDER) {
    const d = PHASES[k].days;
    out[k] = [acc, acc + d];
    acc += d;
  }
  return out;
})();

export function phaseForDay(day) {
  for (const k of PHASE_ORDER) {
    const [s, e] = PHASE_RANGES[k];
    if (day >= s && day < e) return k;
  }
  return 'mi';
}

export function dayToAngle(day) {
  return (day / CYCLE_LEN) * 360;
}

export function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function arcPath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = polar(cx, cy, r, startDeg);
  const [x2, y2] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export function phaseKeyFromLegacy(legacyPhase) {
  const map = { menstrual: 'sei', follicular: 'me', ovulatory: 'ki', luteal: 'mi' };
  return map[legacyPhase] || 'ki';
}

export function getPhaseKeyForDay(cycleDay, cycleLength = 28) {
  const ratio = cycleLength / 28;
  const scaledRanges = {};
  let acc = 0;
  for (const k of PHASE_ORDER) {
    const d = Math.round(PHASES[k].days * ratio);
    scaledRanges[k] = [acc, acc + d];
    acc += d;
  }
  const day = ((cycleDay - 1) % cycleLength);
  for (const k of PHASE_ORDER) {
    const [s, e] = scaledRanges[k];
    if (day >= s && day < e) return k;
  }
  return 'mi';
}
