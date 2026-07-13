// Phase system — Japanese seasonal journey
// Four phases, each with a kanji, season, and traditional colour (washi)

export const PHASES = {
  sei: {
    key: 'sei', kanji: '静', name: '静寂', reading: 'せいじゃく', en: 'Stillness',
    clinical: '生理期', clinicalEn: 'Menstrual', season: '冬', seasonEn: 'Winter', days: 5,
    accent: '#9A3B50', deep: '#6E283A', soft: '#F2E2E2', tint: '#FBF1F0',
    line: 'rgba(154,59,80,0.22)',
    poem: 'めぐりの始まり。内に還り、静かに養う時。',
    poemEn: 'The cycle begins again. A time to turn inward and quietly restore.',
    energy: '低い · 休息のとき',
  },
  me: {
    key: 'me', kanji: '芽', name: '萌芽', reading: 'ほうが', en: 'Budding',
    clinical: '卵胞期', clinicalEn: 'Follicular', season: '春', seasonEn: 'Spring', days: 8,
    accent: '#7B9A4B', deep: '#516B2C', soft: '#E7EEDA', tint: '#F4F7EC',
    line: 'rgba(123,154,75,0.24)',
    poem: '芽吹きの季節。新しい力が静かに満ちてゆく。',
    poemEn: 'The season of budding. New energy quietly rises within.',
    energy: '上昇 · 芽吹きのとき',
  },
  ki: {
    key: 'ki', kanji: '輝', name: '輝き', reading: 'かがやき', en: 'Radiance',
    clinical: '排卵期', clinicalEn: 'Ovulation', season: '夏', seasonEn: 'Summer', days: 3,
    accent: '#C18D2B', deep: '#8C6212', soft: '#F3E7C9', tint: '#FAF3E1',
    line: 'rgba(193,141,43,0.26)',
    poem: 'エネルギーと自信がピーク。最も輝いている時期。',
    poemEn: 'Energy and confidence peak. Your most radiant days.',
    energy: '最高 · 輝きのとき',
  },
  mi: {
    key: 'mi', kanji: '実', name: '結実', reading: 'けつじつ', en: 'Ripening',
    clinical: '黄体期', clinicalEn: 'Luteal', season: '秋', seasonEn: 'Autumn', days: 12,
    accent: '#8A5E84', deep: '#5C3A57', soft: '#EBE0EB', tint: '#F5EEF4',
    line: 'rgba(138,94,132,0.22)',
    poem: '実りと内省の季節。ゆっくりと整えてゆく。',
    poemEn: 'A season of ripening and reflection. Slowly, gently, restore your balance.',
    energy: '下降 · 整えるとき',
  },
};

export const PHASE_ORDER = ['sei', 'me', 'ki', 'mi'];
export const CYCLE_LEN = 28;

// Neutrals
export const PAPER  = '#F4EEE2';
export const PAPER2 = '#EFE7D8';
export const CARD   = '#FCFAF4';
export const INK    = '#2A2520';
export const INK2   = '#766B5E';
export const INK3   = '#A89C8B';
export const LINE   = 'rgba(42,37,32,0.09)';
export const LINE2  = 'rgba(42,37,32,0.05)';

// Font stacks
export const MINCHO = '"Shippori Mincho B1", "Hiragino Mincho ProN", serif';
export const OLDMIN = '"Zen Old Mincho", "Hiragino Mincho ProN", serif';
export const GOTHIC = '"Zen Kaku Gothic New", "Hiragino Sans", system-ui, sans-serif';

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

// Map old phase names to new phase keys
export function phaseKeyFromLegacy(legacyPhase) {
  const map = { menstrual: 'sei', follicular: 'me', ovulatory: 'ki', luteal: 'mi' };
  return map[legacyPhase] || 'ki';
}

// Get the new phase key for a given cycle day with proportional scaling
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
