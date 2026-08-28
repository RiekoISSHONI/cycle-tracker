// Phase system — Japanese seasonal journey (Sunshine & Bloom palette)
// Four phases, each with a kanji, season, and cheerful colour.

export const PHASES = {
  sei: {
    key: 'sei', kanji: '静', name: '静寂', reading: 'せいじゃく', en: 'Stillness',
    clinical: '生理期', clinicalEn: 'Menstrual', season: '冬', seasonEn: 'Winter', days: 5,
    accent: '#E4849E', deep: '#CC6482', soft: '#FDE4ED', tint: '#FEF0F5',
    line: 'rgba(228,132,158,0.22)', emoji: '🌙',
    poem: 'めぐりの始まり。内に還り、静かに養う時。',
    poemEn: 'The cycle begins again. A time to turn inward and quietly restore.',
    energy: '低い · 休息のとき',
  },
  me: {
    key: 'me', kanji: '芽', name: '萌芽', reading: 'ほうが', en: 'Budding',
    clinical: '卵胞期', clinicalEn: 'Follicular', season: '春', seasonEn: 'Spring', days: 8,
    accent: '#44C474', deep: '#2CA85A', soft: '#DCFAE6', tint: '#EDFDF3',
    line: 'rgba(68,196,116,0.22)', emoji: '🌱',
    poem: '芽吹きの季節。新しい力が静かに満ちてゆく。',
    poemEn: 'The season of budding. New energy quietly rises within.',
    energy: '上昇 · 芽吹きのとき',
  },
  ki: {
    key: 'ki', kanji: '輝', name: '輝き', reading: 'かがやき', en: 'Radiance',
    clinical: '排卵期', clinicalEn: 'Ovulation', season: '夏', seasonEn: 'Summer', days: 3,
    accent: '#F0B818', deep: '#D49E00', soft: '#FEF0C4', tint: '#FFF8E0',
    line: 'rgba(240,184,24,0.24)', emoji: '☀️',
    poem: 'エネルギーと自信がピーク。最も輝いている時期。',
    poemEn: 'Energy and confidence peak. Your most radiant days.',
    energy: '最高 · 輝きのとき',
  },
  mi: {
    key: 'mi', kanji: '実', name: '結実', reading: 'けつじつ', en: 'Ripening',
    clinical: '黄体期', clinicalEn: 'Luteal', season: '秋', seasonEn: 'Autumn', days: 12,
    accent: '#F08848', deep: '#D47030', soft: '#FDE3D4', tint: '#FEF2EA',
    line: 'rgba(240,136,72,0.22)', emoji: '🍂',
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

// Brand chrome (rich gold — the app's signature colour)
export const CORAL  = '#F0B818';
export const CORAL_D = '#D49E00';

// Font stacks
export const MARU    = '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", system-ui, sans-serif';
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
