/**
 * Product recommendations for each cycle phase
 * These are example products - replace with actual affiliate links
 */

export const PHASE_PRODUCTS = {
  menstrual: {
    teas: [
      {
        name: 'Ginger Root Tea',
        brand: 'Traditional Medicinals',
        description: 'Warming ginger to ease cramps and aid circulation',
        image: '/products/ginger-tea.jpg',
        amazonSearch: 'Traditional+Medicinals+Ginger+Tea'
      },
      {
        name: 'Red Date Ginger Tea',
        brand: 'Prince of Peace',
        description: 'TCM formula for blood nourishment during menstruation',
        image: '/products/red-date-tea.jpg',
        amazonSearch: 'red+date+ginger+tea'
      },
      {
        name: 'Rose Bud Tea',
        brand: 'Buddha Teas',
        description: 'Promotes blood circulation and emotional balance',
        image: '/products/rose-tea.jpg',
        amazonSearch: 'organic+rose+bud+tea'
      }
    ],
    foods: [
      {
        name: 'Organic Goji Berries',
        brand: 'Navitas Organics',
        description: 'Blood-building superfood rich in iron',
        image: '/products/goji.jpg',
        amazonSearch: 'organic+goji+berries'
      },
      {
        name: 'Bone Broth Powder',
        brand: 'Ancient Nutrition',
        description: 'Warming, nourishing protein for recovery',
        image: '/products/bone-broth.jpg',
        amazonSearch: 'Ancient+Nutrition+bone+broth'
      },
      {
        name: 'Dark Chocolate (85%)',
        brand: 'Lindt Excellence',
        description: 'Magnesium-rich for cramp relief',
        image: '/products/dark-chocolate.jpg',
        amazonSearch: 'Lindt+85+dark+chocolate'
      }
    ],
    supplements: [
      {
        name: 'Iron + Vitamin C',
        brand: 'MegaFood',
        description: 'Replenish iron lost during menstruation',
        image: '/products/iron.jpg',
        amazonSearch: 'MegaFood+Blood+Builder'
      },
      {
        name: 'Magnesium Glycinate',
        brand: 'Pure Encapsulations',
        description: 'Reduces cramps and supports relaxation',
        image: '/products/magnesium.jpg',
        amazonSearch: 'Pure+Encapsulations+Magnesium+Glycinate'
      }
    ]
  },
  follicular: {
    teas: [
      {
        name: 'Chrysanthemum Tea',
        brand: 'Prince of Peace',
        description: 'Cooling tea to balance rising energy',
        image: '/products/chrysanthemum.jpg',
        amazonSearch: 'chrysanthemum+tea+organic'
      },
      {
        name: 'Green Tea Matcha',
        brand: 'Jade Leaf',
        description: 'Sustained energy without the crash',
        image: '/products/matcha.jpg',
        amazonSearch: 'Jade+Leaf+Matcha'
      },
      {
        name: 'Goji Berry Tea',
        brand: 'Buddha Teas',
        description: 'Nourishes liver and kidney yin',
        image: '/products/goji-tea.jpg',
        amazonSearch: 'goji+berry+tea'
      }
    ],
    foods: [
      {
        name: 'Black Sesame Seeds',
        brand: 'Kevala',
        description: 'TCM superfood for kidney yin and blood',
        image: '/products/black-sesame.jpg',
        amazonSearch: 'organic+black+sesame+seeds'
      },
      {
        name: 'Fermented Kimchi',
        brand: "Mother in Law's",
        description: 'Probiotic-rich for gut health',
        image: '/products/kimchi.jpg',
        amazonSearch: 'Mother+in+Laws+Kimchi'
      },
      {
        name: 'Flax Seeds',
        brand: 'Spectrum Essentials',
        description: 'Phytoestrogens to support estrogen balance',
        image: '/products/flax.jpg',
        amazonSearch: 'organic+ground+flax+seed'
      }
    ],
    supplements: [
      {
        name: 'B-Complex',
        brand: 'Garden of Life',
        description: 'Energy and mood support',
        image: '/products/b-complex.jpg',
        amazonSearch: 'Garden+of+Life+B+Complex'
      },
      {
        name: 'Probiotics for Women',
        brand: 'Garden of Life',
        description: 'Support gut and hormonal health',
        image: '/products/probiotics.jpg',
        amazonSearch: 'Garden+of+Life+Probiotics+Women'
      }
    ]
  },
  ovulatory: {
    teas: [
      {
        name: 'Jasmine Green Tea',
        brand: 'Twinings',
        description: 'Light and uplifting for peak energy',
        image: '/products/jasmine.jpg',
        amazonSearch: 'jasmine+green+tea+organic'
      },
      {
        name: 'Lotus Leaf Tea',
        brand: 'TeaVivre',
        description: 'Traditional tea for clarity and balance',
        image: '/products/lotus.jpg',
        amazonSearch: 'lotus+leaf+tea'
      },
      {
        name: 'Peppermint Tea',
        brand: 'Traditional Medicinals',
        description: 'Refreshing and cooling',
        image: '/products/peppermint.jpg',
        amazonSearch: 'Traditional+Medicinals+Peppermint'
      }
    ],
    foods: [
      {
        name: 'Raw Almonds',
        brand: 'Blue Diamond',
        description: 'Healthy fats for hormone production',
        image: '/products/almonds.jpg',
        amazonSearch: 'raw+almonds+organic'
      },
      {
        name: 'Mung Bean Noodles',
        brand: 'Ka-Me',
        description: 'Cooling TCM food for balance',
        image: '/products/mung-noodles.jpg',
        amazonSearch: 'mung+bean+noodles'
      },
      {
        name: 'Fresh Berries Mix',
        brand: 'Organic',
        description: 'Antioxidant-rich for vibrant energy',
        image: '/products/berries.jpg',
        amazonSearch: 'organic+frozen+berries+mix'
      }
    ],
    supplements: [
      {
        name: 'Omega-3 Fish Oil',
        brand: 'Nordic Naturals',
        description: 'Anti-inflammatory support',
        image: '/products/omega3.jpg',
        amazonSearch: 'Nordic+Naturals+Omega+3'
      },
      {
        name: 'Zinc',
        brand: 'Thorne',
        description: 'Supports hormone balance',
        image: '/products/zinc.jpg',
        amazonSearch: 'Thorne+Zinc'
      }
    ]
  },
  luteal: {
    teas: [
      {
        name: 'Cinnamon Tea',
        brand: 'Celestial Seasonings',
        description: 'Warming support for yang energy',
        image: '/products/cinnamon-tea.jpg',
        amazonSearch: 'cinnamon+tea+organic'
      },
      {
        name: 'Longan Red Date Tea',
        brand: 'Prince of Peace',
        description: 'TCM formula for blood and qi',
        image: '/products/longan-tea.jpg',
        amazonSearch: 'longan+red+date+tea'
      },
      {
        name: 'Chamomile Tea',
        brand: 'Traditional Medicinals',
        description: 'Calming for PMS and better sleep',
        image: '/products/chamomile.jpg',
        amazonSearch: 'Traditional+Medicinals+Chamomile'
      }
    ],
    foods: [
      {
        name: 'Walnuts',
        brand: 'California',
        description: 'Warms kidney yang, supports brain',
        image: '/products/walnuts.jpg',
        amazonSearch: 'organic+walnuts'
      },
      {
        name: 'Sweet Potato Chips',
        brand: 'Jackson\'s Honest',
        description: 'Healthy carbs for serotonin',
        image: '/products/sweet-potato.jpg',
        amazonSearch: 'sweet+potato+chips+healthy'
      },
      {
        name: 'Roasted Chestnuts',
        brand: 'Galil',
        description: 'TCM food to strengthen kidney yang',
        image: '/products/chestnuts.jpg',
        amazonSearch: 'roasted+chestnuts+snack'
      }
    ],
    supplements: [
      {
        name: 'Magnesium Glycinate',
        brand: 'Pure Encapsulations',
        description: 'Reduce PMS symptoms and cramps',
        image: '/products/magnesium.jpg',
        amazonSearch: 'Pure+Encapsulations+Magnesium+Glycinate'
      },
      {
        name: 'Vitamin B6',
        brand: 'Thorne',
        description: 'Mood and hormone support for PMS',
        image: '/products/b6.jpg',
        amazonSearch: 'Thorne+Vitamin+B6'
      },
      {
        name: 'Evening Primrose Oil',
        brand: 'Nature Made',
        description: 'Traditional support for PMS',
        image: '/products/evening-primrose.jpg',
        amazonSearch: 'Evening+Primrose+Oil'
      }
    ]
  }
};

export function getAmazonSearchUrl(searchTerm) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
}

export function getProductUrl(product) {
  return getAmazonSearchUrl(product.amazonSearch);
}
