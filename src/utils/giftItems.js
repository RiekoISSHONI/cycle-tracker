// Phase-specific gift recommendations with affiliate links
export const GIFT_ITEMS = {
  menstrual: [
    {
      id: 'menstrual-tea',
      name: 'Ginger Red Date Tea',
      nameJa: '生姜なつめ茶',
      emoji: '☕',
      description: 'Warming & soothing',
      affiliateUrl: 'https://www.amazon.com/s?k=ginger+red+date+tea'
    },
    {
      id: 'menstrual-chocolate',
      name: 'Dark Chocolate',
      nameJa: 'ダークチョコレート',
      emoji: '🍫',
      description: 'Magnesium boost',
      affiliateUrl: 'https://www.amazon.com/s?k=dark+chocolate+70+percent'
    },
    {
      id: 'menstrual-heating',
      name: 'Heating Pad',
      nameJa: 'ホットパッド',
      emoji: '🔥',
      description: 'Cramp relief',
      affiliateUrl: 'https://www.amazon.com/s?k=heating+pad+menstrual'
    },
    {
      id: 'menstrual-bath',
      name: 'Epsom Bath Salts',
      nameJa: 'エプソムソルト',
      emoji: '🛁',
      description: 'Relaxation & recovery',
      affiliateUrl: 'https://www.amazon.com/s?k=epsom+salt+lavender'
    }
  ],
  follicular: [
    {
      id: 'follicular-tea',
      name: 'Green Tea',
      nameJa: '緑茶',
      emoji: '🍵',
      description: 'Energy & antioxidants',
      affiliateUrl: 'https://www.amazon.com/s?k=organic+green+tea'
    },
    {
      id: 'follicular-flowers',
      name: 'Fresh Flowers',
      nameJa: '生花',
      emoji: '💐',
      description: 'Brighten her space',
      affiliateUrl: 'https://www.amazon.com/s?k=fresh+flower+delivery'
    },
    {
      id: 'follicular-journal',
      name: 'New Journal',
      nameJa: 'ジャーナル',
      emoji: '📓',
      description: 'For her new ideas',
      affiliateUrl: 'https://www.amazon.com/s?k=beautiful+journal+notebook'
    },
    {
      id: 'follicular-smoothie',
      name: 'Smoothie Maker',
      nameJa: 'スムージーメーカー',
      emoji: '🥤',
      description: 'Fresh & energizing',
      affiliateUrl: 'https://www.amazon.com/s?k=portable+smoothie+blender'
    }
  ],
  ovulatory: [
    {
      id: 'ovulatory-skincare',
      name: 'Glow Serum',
      nameJa: '美容液',
      emoji: '✨',
      description: 'Enhance her radiance',
      affiliateUrl: 'https://www.amazon.com/s?k=vitamin+c+serum+glow'
    },
    {
      id: 'ovulatory-datenight',
      name: 'Date Night Set',
      nameJa: 'デートナイトセット',
      emoji: '🕯️',
      description: 'Candles & ambiance',
      affiliateUrl: 'https://www.amazon.com/s?k=romantic+candle+set'
    },
    {
      id: 'ovulatory-jewelry',
      name: 'Delicate Jewelry',
      nameJa: 'アクセサリー',
      emoji: '💎',
      description: 'She\'s glowing',
      affiliateUrl: 'https://www.amazon.com/s?k=minimalist+jewelry+women'
    },
    {
      id: 'ovulatory-perfume',
      name: 'Light Perfume',
      nameJa: '香水',
      emoji: '🌸',
      description: 'Fresh & floral',
      affiliateUrl: 'https://www.amazon.com/s?k=light+floral+perfume+women'
    }
  ],
  luteal: [
    {
      id: 'luteal-chocolate',
      name: 'Chocolate Box',
      nameJa: 'チョコレートボックス',
      emoji: '🍫',
      description: 'Comfort & magnesium',
      affiliateUrl: 'https://www.amazon.com/s?k=luxury+chocolate+box'
    },
    {
      id: 'luteal-tea',
      name: 'Chamomile Tea',
      nameJa: 'カモミールティー',
      emoji: '🌼',
      description: 'Calming & soothing',
      affiliateUrl: 'https://www.amazon.com/s?k=organic+chamomile+tea'
    },
    {
      id: 'luteal-blanket',
      name: 'Cozy Blanket',
      nameJa: 'ブランケット',
      emoji: '🧣',
      description: 'Comfort & warmth',
      affiliateUrl: 'https://www.amazon.com/s?k=soft+cozy+blanket'
    },
    {
      id: 'luteal-snacks',
      name: 'Healthy Snack Box',
      nameJa: 'ヘルシースナック',
      emoji: '🥜',
      description: 'Satisfy cravings',
      affiliateUrl: 'https://www.amazon.com/s?k=healthy+snack+box+gift'
    }
  ]
};

export function getGiftItems(phase) {
  return GIFT_ITEMS[phase] || GIFT_ITEMS.follicular;
}
