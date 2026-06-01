/**
 * Curated product recommendations backed by both modern science and TCM
 * Each product is selected based on research evidence AND traditional use
 *
 * Partner brands are flagged for future revenue partnerships
 * isPartner: true = direct brand partnership (future revenue)
 * isPartner: false/undefined = affiliate link
 */

// Partner brands configuration - for future direct partnerships
export const PARTNER_BRANDS = {
  forher: {
    name: 'for her.',
    nameJa: 'フォーハー',
    description: 'Women\'s wellness soups based on TCM & Eastern medicine',
    descriptionJa: '漢方・東洋医学に基づく女性のためのウェルネススープ',
    website: 'https://forher.jp',
    logo: '/partners/forher-logo.png',
    isActive: true
  }
  // Add more partner brands here as partnerships develop
};

export const PHASE_PRODUCTS = {
  menstrual: {
    soups: [
      {
        name: 'for her. Omamori Soup Set',
        nameJa: 'for her. おまもりスープセット',
        brand: 'for her.',
        description: 'Postpartum & menstrual recovery soups by TCM specialists.',
        evidence: 'Developed with postpartum doulas and herbal medicine experts',
        tcmUse: 'Based on Eastern medicine, Ayurveda, and TCM principles',
        directUrl: 'https://forher.jp/collections/商品一覧',
        isPartner: true
      },
      {
        name: 'for her. Beets & Goji Potage',
        nameJa: 'ビーツとクコの実の美活ポタージュ',
        brand: 'for her.',
        description: 'Antioxidant-rich potage with goji berries for blood nourishment.',
        evidence: 'Beets increase nitric oxide; goji improves hemoglobin levels',
        tcmUse: 'Gou Qi Zi (goji) nourishes liver blood and kidney yin',
        directUrl: 'https://forher.jp/products/ビーツとクコの実の美活ポタージュ',
        isPartner: true
      },
      {
        name: 'Si Wu Tang (Four Things Soup)',
        brand: 'Eu Yan Sang / TCM Brands',
        description: 'The #1 TCM formula for women. Nourishes and moves blood.',
        evidence: 'Studies show it increases hemoglobin, reduces menstrual pain, regulates cycles',
        tcmUse: 'Si Wu Tang: Dang Gui, Shu Di, Bai Shao, Chuan Xiong - tonifies and invigorates blood',
        amazonSearch: 'Si+Wu+Tang+four+things+soup+herbal'
      },
      {
        name: 'Dang Gui Ginger Lamb Soup',
        brand: 'Herbal Pack',
        description: 'Warming soup for cold-type menstrual pain. Classic winter tonic.',
        evidence: 'Dang Gui shown to improve blood circulation and reduce uterine contractions',
        tcmUse: 'Dang Gui Bu Xue Tang variation - warms yang, nourishes blood, expels cold',
        amazonSearch: 'Dang+Gui+angelica+soup+herbal+pack'
      },
      {
        name: 'Black Chicken Herbal Soup',
        brand: 'Eu Yan Sang',
        description: 'Wu Ji (black chicken) deeply nourishes blood and yin.',
        evidence: 'Black chicken higher in carnosine and antioxidants than regular chicken',
        tcmUse: 'Wu Ji Bai Feng: supreme blood and yin tonic for women',
        amazonSearch: 'black+chicken+herbal+soup+mix'
      },
      {
        name: 'Red Date Longan Soup Mix',
        brand: 'Greenmax',
        description: 'Sweet warming soup to replenish blood and calm the mind.',
        evidence: 'Jujube and longan shown to reduce anxiety and improve sleep quality',
        tcmUse: 'Gui Pi Tang base herbs - tonifies heart blood, calms shen (spirit)',
        amazonSearch: 'red+date+longan+soup+mix'
      }
    ],
    teas: [
      {
        name: 'Ginger Root Tea',
        brand: 'Traditional Medicinals',
        description: 'Clinically shown to reduce menstrual pain. TCM: warms uterus, moves blood stasis.',
        evidence: 'Multiple studies show ginger reduces dysmenorrhea as effectively as ibuprofen',
        tcmUse: 'Warms the middle jiao, dispels cold, promotes blood circulation',
        amazonSearch: 'Traditional+Medicinals+Ginger+Tea+organic'
      },
      {
        name: 'Red Date & Ginger Tea',
        brand: 'Prince of Peace',
        description: 'Iron-rich red dates + warming ginger. TCM classic for menstruation.',
        evidence: 'Red dates (jujube) shown to increase hemoglobin and reduce fatigue',
        tcmUse: 'Hong Zao tonifies blood and qi, calms the spirit',
        amazonSearch: 'red+date+ginger+tea+instant'
      }
    ],
    foods: [
      {
        name: 'Organic Goji Berries',
        brand: 'Navitas Organics',
        description: 'Rich in iron, vitamin C, antioxidants. TCM blood tonic.',
        evidence: 'Studies show improved energy, immune function, and antioxidant status',
        tcmUse: 'Gou Qi Zi nourishes liver blood and kidney yin',
        amazonSearch: 'Navitas+organic+goji+berries'
      },
      {
        name: 'Grass-Fed Bone Broth',
        brand: 'Kettle & Fire',
        description: 'Collagen, minerals, amino acids for recovery. TCM: deeply nourishing.',
        evidence: 'Provides glycine, proline for gut healing and joint support',
        tcmUse: 'Animal broths tonify qi, blood, and essence (jing)',
        amazonSearch: 'Kettle+Fire+bone+broth'
      },
      {
        name: 'Dark Chocolate 85%',
        brand: 'Lindt Excellence',
        description: 'High magnesium reduces cramps. Contains iron and antioxidants.',
        evidence: 'Magnesium supplementation proven to reduce menstrual pain',
        tcmUse: 'Bitter flavor clears heat, supports heart',
        amazonSearch: 'Lindt+Excellence+85+dark+chocolate'
      }
    ],
    supplements: [
      {
        name: 'Magnesium Glycinate',
        brand: 'Pure Encapsulations',
        description: 'Most absorbable form. Reduces cramps, supports sleep.',
        evidence: 'Meta-analyses confirm magnesium reduces menstrual pain significantly',
        tcmUse: 'Supports liver function, relaxes tendons and muscles',
        amazonSearch: 'Pure+Encapsulations+Magnesium+Glycinate'
      },
      {
        name: 'Iron Bisglycinate',
        brand: 'Thorne',
        description: 'Gentle, non-constipating iron to replenish blood loss.',
        evidence: 'Iron bisglycinate has superior absorption with fewer GI side effects',
        tcmUse: 'Tonifies blood, prevents blood deficiency',
        amazonSearch: 'Thorne+Iron+Bisglycinate'
      }
    ],
    skincare: [
      {
        name: 'Hyaluronic Acid Serum',
        brand: 'The Ordinary',
        description: 'Deep hydration for dry, dull menstrual phase skin.',
        evidence: 'HA holds 1000x its weight in water, proven to increase skin hydration',
        tcmUse: 'Replenishes yin fluids lost during menstruation',
        amazonSearch: 'The+Ordinary+Hyaluronic+Acid+Serum'
      },
      {
        name: 'Rosehip Seed Oil',
        brand: 'Trilogy',
        description: 'Rich in vitamins A & C. Restores glow to tired skin.',
        evidence: 'Studies show improved skin elasticity and brightness',
        tcmUse: 'Nourishes blood, restores luster to blood-deficient skin',
        amazonSearch: 'Trilogy+Rosehip+Oil'
      },
      {
        name: 'Gentle Cream Cleanser',
        brand: 'CeraVe',
        description: 'Non-stripping cleanser for sensitive menstrual phase skin.',
        evidence: 'Ceramides restore skin barrier, gentle surfactants preserve moisture',
        tcmUse: 'Protects wei qi (defensive energy) of skin',
        amazonSearch: 'CeraVe+Hydrating+Cream+Cleanser'
      }
    ]
  },
  follicular: {
    soups: [
      {
        name: 'for her. Shiitake Cashew Soup',
        nameJa: '椎茸とカシューナッツのクリームスープ',
        brand: 'for her.',
        description: 'Creamy soup supporting energy and emotional balance.',
        evidence: 'Shiitake contains beta-glucans for immune support; cashews provide magnesium',
        tcmUse: 'Xiang Gu (shiitake) tonifies qi, supports immune wei qi',
        directUrl: 'https://forher.jp/products/soup-5',
        isPartner: true
      },
      {
        name: 'Liu Wei Di Huang Soup',
        brand: 'TCM Herbal Pack',
        description: 'Six Ingredient Rehmannia - classic yin nourishing formula.',
        evidence: 'Studies show improved kidney function and reduced fatigue',
        tcmUse: 'Liu Wei Di Huang Wan base - nourishes kidney and liver yin',
        amazonSearch: 'Liu+Wei+Di+Huang+herbal+soup'
      },
      {
        name: 'Goji & Chrysanthemum Soup',
        brand: 'Herbal Mix',
        description: 'Cooling yin tonic for the rising energy phase.',
        evidence: 'Goji and chrysanthemum both have proven antioxidant effects',
        tcmUse: 'Qi Ju Di Huang variation - nourishes yin, clears liver heat',
        amazonSearch: 'goji+chrysanthemum+soup+herbal'
      },
      {
        name: 'Snow Fungus Lotus Soup',
        brand: 'Greenmax',
        description: 'Bai Mu Er (snow fungus) - beauty and yin tonic.',
        evidence: 'Snow fungus contains polysaccharides that support skin hydration',
        tcmUse: 'Yin Er moistens lungs, nourishes yin, benefits the skin',
        amazonSearch: 'snow+fungus+lotus+seed+soup'
      }
    ],
    teas: [
      {
        name: 'Green Tea Matcha',
        brand: 'Jade Leaf Organic',
        description: 'L-theanine for calm focus. Antioxidants support estrogen metabolism.',
        evidence: 'EGCG in green tea supports healthy estrogen balance',
        tcmUse: 'Clears heat, benefits the eyes, calms the mind',
        amazonSearch: 'Jade+Leaf+organic+matcha'
      },
      {
        name: 'Chrysanthemum Tea',
        brand: 'Buddha Teas',
        description: 'Cooling tea for rising energy phase. Supports liver and eyes.',
        evidence: 'Contains luteolin and apigenin with anti-inflammatory effects',
        tcmUse: 'Ju Hua clears liver heat, brightens the eyes',
        amazonSearch: 'chrysanthemum+tea+organic'
      }
    ],
    foods: [
      {
        name: 'Black Sesame Seeds',
        brand: 'Kevala Organic',
        description: 'Calcium, iron, zinc. TCM kidney and blood tonic.',
        evidence: 'High in lignans that support hormone balance',
        tcmUse: 'Hei Zhi Ma nourishes liver and kidney, moistens intestines',
        amazonSearch: 'Kevala+organic+black+sesame+seeds'
      },
      {
        name: 'Ground Flaxseed',
        brand: 'Spectrum Essentials',
        description: 'Lignans support estrogen balance. Omega-3 reduces inflammation.',
        evidence: 'Flax lignans shown to modulate estrogen metabolism',
        tcmUse: 'Moistens intestines, supports healthy bowel movements',
        amazonSearch: 'Spectrum+ground+flaxseed+organic'
      },
      {
        name: 'Kimchi (Probiotic)',
        brand: 'Mother In Laws',
        description: 'Live probiotics support gut-hormone axis. Fermented vegetables.',
        evidence: 'Gut microbiome crucial for estrogen metabolism (estrobolome)',
        tcmUse: 'Fermented foods support spleen qi and digestion',
        amazonSearch: 'Mother+in+Laws+Kimchi'
      }
    ],
    supplements: [
      {
        name: 'B-Complex',
        brand: 'Thorne Basic B Complex',
        description: 'Methylated B vitamins for energy and hormone synthesis.',
        evidence: 'B vitamins essential for estrogen metabolism in liver',
        tcmUse: 'Supports qi transformation and blood production',
        amazonSearch: 'Thorne+Basic+B+Complex'
      },
      {
        name: 'Probiotics (Women)',
        brand: 'Garden of Life',
        description: '50 billion CFU with strains supporting vaginal and gut health.',
        evidence: 'Specific strains support healthy estrogen metabolism',
        tcmUse: 'Strengthens spleen qi, supports middle jiao',
        amazonSearch: 'Garden+of+Life+Probiotics+Women+50+billion'
      }
    ],
    skincare: [
      {
        name: 'Vitamin C Serum',
        brand: 'Skinceuticals C E Ferulic',
        description: 'Brightening serum - perfect for improving follicular skin.',
        evidence: 'L-ascorbic acid boosts collagen synthesis and brightens',
        tcmUse: 'Supports rising yang energy, brightens complexion',
        amazonSearch: 'Vitamin+C+Serum+Skinceuticals'
      },
      {
        name: 'Gentle Exfoliating Toner',
        brand: 'Paula\'s Choice BHA',
        description: 'Salicylic acid to refine pores as skin strengthens.',
        evidence: 'BHA penetrates pores, reduces congestion',
        tcmUse: 'Clears stagnation, promotes smooth qi flow in skin',
        amazonSearch: 'Paulas+Choice+BHA+Exfoliant'
      },
      {
        name: 'Green Tea Moisturizer',
        brand: 'Innisfree',
        description: 'Light, antioxidant-rich hydration for balanced skin.',
        evidence: 'EGCG in green tea has proven antioxidant benefits',
        tcmUse: 'Clears heat while moistening, balances skin',
        amazonSearch: 'Innisfree+Green+Tea+Moisturizer'
      }
    ]
  },
  ovulatory: {
    soups: [
      {
        name: 'Lotus Seed Lily Bulb Soup',
        brand: 'Herbal Mix',
        description: 'Calming soup to balance peak energy. Supports heart and spirit.',
        evidence: 'Lotus seeds contain alkaloids that promote calmness',
        tcmUse: 'Lian Zi and Bai He calm the heart, nourish yin without excess heat',
        amazonSearch: 'lotus+seed+lily+bulb+soup'
      },
      {
        name: 'Mung Bean Soup Mix',
        brand: 'Asian Best',
        description: 'Cooling detox soup for peak hormone phase.',
        evidence: 'Mung beans have documented antioxidant and anti-inflammatory effects',
        tcmUse: 'Lu Dou clears heat, resolves toxins, balances excess yang',
        amazonSearch: 'mung+bean+soup+mix'
      },
      {
        name: 'Chinese Yam Goji Soup',
        brand: 'TCM Pack',
        description: 'Balanced yin-yang soup for the transformative ovulation phase.',
        evidence: 'Chinese yam (dioscorea) supports hormonal health',
        tcmUse: 'Shan Yao strengthens spleen and kidney, harmonizes yin and yang',
        amazonSearch: 'chinese+yam+goji+soup+herbal'
      }
    ],
    teas: [
      {
        name: 'Peppermint Tea',
        brand: 'Traditional Medicinals',
        description: 'Cooling and refreshing. May help balance androgens.',
        evidence: 'Studies show spearmint/peppermint may reduce excess androgens',
        tcmUse: 'Bo He disperses wind-heat, soothes liver qi',
        amazonSearch: 'Traditional+Medicinals+Peppermint'
      },
      {
        name: 'Jasmine Green Tea',
        brand: 'Numi Organic',
        description: 'Light caffeine for peak energy. Calming jasmine aroma.',
        evidence: 'Green tea polyphenols support antioxidant status',
        tcmUse: 'Mo Li Hua soothes liver qi, uplifts mood',
        amazonSearch: 'Numi+organic+jasmine+green+tea'
      }
    ],
    foods: [
      {
        name: 'Raw Almonds',
        brand: 'Blue Diamond',
        description: 'Vitamin E for follicle health. Healthy fats for hormones.',
        evidence: 'Vitamin E shown to improve endometrial thickness',
        tcmUse: 'Moistens lungs, lubricates intestines',
        amazonSearch: 'Blue+Diamond+raw+almonds+whole+natural'
      },
      {
        name: 'Wild Salmon (Canned)',
        brand: 'Wild Planet',
        description: 'Omega-3 DHA/EPA and vitamin D for fertility support.',
        evidence: 'Omega-3s reduce inflammation and support ovulation',
        tcmUse: 'Tonifies qi and blood, warms yang',
        amazonSearch: 'Wild+Planet+wild+salmon'
      },
      {
        name: 'Cruciferous Sprouts',
        brand: 'Fresh or Seeds',
        description: 'Sulforaphane supports estrogen detox pathways.',
        evidence: 'DIM and I3C from crucifers support healthy estrogen metabolism',
        tcmUse: 'Clears heat, resolves toxins',
        amazonSearch: 'broccoli+sprouts+seeds+organic'
      }
    ],
    supplements: [
      {
        name: 'Omega-3 Fish Oil',
        brand: 'Nordic Naturals',
        description: 'Pharmaceutical grade EPA/DHA. Anti-inflammatory.',
        evidence: 'Omega-3s shown to support ovulation and reduce inflammation',
        tcmUse: 'Nourishes yin, moistens dryness',
        amazonSearch: 'Nordic+Naturals+Ultimate+Omega'
      },
      {
        name: 'Vitamin D3 + K2',
        brand: 'Thorne',
        description: 'Most women are deficient. Essential for fertility.',
        evidence: 'Vitamin D deficiency linked to ovulatory dysfunction',
        tcmUse: 'Supports kidney yang and bone health',
        amazonSearch: 'Thorne+Vitamin+D+K2'
      }
    ],
    skincare: [
      {
        name: 'Mineral Sunscreen SPF 50',
        brand: 'Supergoop',
        description: 'Essential - skin is more photosensitive at peak estrogen.',
        evidence: 'UV protection prevents hyperpigmentation during hormone peak',
        tcmUse: 'Protects wei qi, prevents heat damage',
        amazonSearch: 'Supergoop+Unseen+Sunscreen+SPF+50'
      },
      {
        name: 'Rosewater Face Mist',
        brand: 'Heritage Store',
        description: 'Maintain your natural glow with hydrating mist.',
        evidence: 'Rose has anti-inflammatory properties, hydrates without heaviness',
        tcmUse: 'Mei Gui Hua (rose) soothes liver qi, beautifies skin',
        amazonSearch: 'Heritage+Store+Rosewater'
      },
      {
        name: 'Light Gel Moisturizer',
        brand: 'Neutrogena Hydro Boost',
        description: 'Lightweight hydration - skin is already thriving.',
        evidence: 'Hyaluronic acid gel provides hydration without occlusion',
        tcmUse: 'Light formula supports abundant yin without creating dampness',
        amazonSearch: 'Neutrogena+Hydro+Boost+Gel+Cream'
      }
    ]
  },
  luteal: {
    soups: [
      {
        name: 'Ba Zhen Tang (Eight Treasure Soup)',
        brand: 'Eu Yan Sang',
        description: 'Combines Si Wu Tang + Si Jun Zi Tang. Tonifies qi AND blood.',
        evidence: 'Research shows improved energy, reduced PMS, better mood',
        tcmUse: 'Ba Zhen Tang - supreme formula to tonify both qi and blood together',
        amazonSearch: 'Ba+Zhen+Tang+eight+treasure+soup'
      },
      {
        name: 'Gui Pi Tang Soup Mix',
        brand: 'TCM Herbal',
        description: 'For PMS anxiety, insomnia, and overthinking.',
        evidence: 'Studies show improved sleep quality and reduced anxiety',
        tcmUse: 'Gui Pi Tang tonifies heart and spleen, calms the spirit',
        amazonSearch: 'Gui+Pi+Tang+herbal+soup'
      },
      {
        name: 'Xiao Yao San Soup',
        brand: 'Plum Flower',
        description: 'The "Free and Easy Wanderer" - #1 formula for PMS and liver qi stagnation.',
        evidence: 'Multiple clinical trials show efficacy for PMS symptoms',
        tcmUse: 'Xiao Yao San soothes liver qi, strengthens spleen, nourishes blood',
        amazonSearch: 'Xiao+Yao+San+free+easy+wanderer'
      },
      {
        name: 'Warming Lamb & Herb Soup',
        brand: 'Herbal Pack',
        description: 'Warms yang for the late luteal phase chill.',
        evidence: 'Lamb is high in iron, zinc, B12 - supports warmth and blood',
        tcmUse: 'Lamb + Du Zhong + Dang Gui warms kidney yang, nourishes blood',
        amazonSearch: 'lamb+herbal+soup+chinese'
      }
    ],
    teas: [
      {
        name: 'Chamomile Tea',
        brand: 'Traditional Medicinals',
        description: 'Calms anxiety, improves sleep. Reduces PMS symptoms.',
        evidence: 'Clinical trials show chamomile reduces anxiety and improves sleep',
        tcmUse: 'Calms the spirit, harmonizes the stomach',
        amazonSearch: 'Traditional+Medicinals+Chamomile'
      },
      {
        name: 'Cinnamon Tea',
        brand: 'Pukka',
        description: 'Balances blood sugar, reduces cravings. Warming for yang.',
        evidence: 'Cinnamon improves insulin sensitivity and reduces sugar cravings',
        tcmUse: 'Rou Gui warms kidney yang, disperses cold',
        amazonSearch: 'Pukka+cinnamon+tea'
      },
      {
        name: 'Longan Red Date Tea',
        brand: 'Greenmax',
        description: 'TCM classic for blood and qi. Calms the mind.',
        evidence: 'Longan contains iron and antioxidants, promotes calmness',
        tcmUse: 'Long Yan Rou tonifies heart blood, calms spirit',
        amazonSearch: 'longan+red+date+tea'
      }
    ],
    foods: [
      {
        name: 'Walnuts',
        brand: 'California Organic',
        description: 'Omega-3 ALA, melatonin for sleep. TCM kidney yang tonic.',
        evidence: 'Walnuts improve mood and contain natural melatonin',
        tcmUse: 'He Tao Ren warms kidney yang, nourishes brain',
        amazonSearch: 'organic+raw+walnuts'
      },
      {
        name: 'Sweet Potato',
        brand: 'Fresh or Frozen',
        description: 'Complex carbs support serotonin. Rich in vitamin A.',
        evidence: 'Complex carbs increase tryptophan uptake for serotonin production',
        tcmUse: 'Tonifies spleen qi, nourishes blood',
        amazonSearch: 'organic+sweet+potato'
      },
      {
        name: 'Pumpkin Seeds',
        brand: 'Go Raw Organic',
        description: 'High zinc and magnesium for PMS relief.',
        evidence: 'Zinc and magnesium both reduce PMS symptoms',
        tcmUse: 'Supports kidney function, rich in oils',
        amazonSearch: 'Go+Raw+organic+pumpkin+seeds'
      }
    ],
    supplements: [
      {
        name: 'Magnesium Glycinate',
        brand: 'Pure Encapsulations',
        description: 'Reduces PMS, improves sleep, eases anxiety.',
        evidence: 'Magnesium deficiency linked to PMS; supplementation helps',
        tcmUse: 'Relaxes liver qi, calms the spirit',
        amazonSearch: 'Pure+Encapsulations+Magnesium+Glycinate'
      },
      {
        name: 'Vitamin B6 (P5P)',
        brand: 'Thorne Pyridoxal 5-Phosphate',
        description: 'Active B6 for mood, reduces water retention.',
        evidence: 'B6 shown to significantly reduce PMS symptoms',
        tcmUse: 'Supports liver function and blood production',
        amazonSearch: 'Thorne+P5P'
      },
      {
        name: 'Vitex (Chaste Tree)',
        brand: 'Gaia Herbs',
        description: 'Traditional herb for PMS and cycle regulation.',
        evidence: 'Multiple studies show vitex reduces PMS symptoms',
        tcmUse: 'Regulates liver qi, harmonizes menstruation',
        amazonSearch: 'Gaia+Herbs+Vitex+Berry'
      }
    ],
    skincare: [
      {
        name: 'Salicylic Acid Cleanser',
        brand: 'CeraVe SA Cleanser',
        description: 'BHA cleanser to prevent luteal phase breakouts.',
        evidence: 'Salicylic acid penetrates pores, prevents acne formation',
        tcmUse: 'Clears heat and dampness that cause skin eruptions',
        amazonSearch: 'CeraVe+SA+Cleanser'
      },
      {
        name: 'Niacinamide Serum',
        brand: 'The Ordinary Niacinamide 10%',
        description: 'Controls oil, minimizes pores, calms inflammation.',
        evidence: 'Niacinamide proven to reduce sebum and inflammation',
        tcmUse: 'Clears heat without drying, balances skin',
        amazonSearch: 'The+Ordinary+Niacinamide+Zinc'
      },
      {
        name: 'Tea Tree Spot Treatment',
        brand: 'The Body Shop',
        description: 'Natural spot treatment for hormonal breakouts.',
        evidence: 'Tea tree oil has antibacterial properties comparable to benzoyl peroxide',
        tcmUse: 'Clears heat-toxins, resolves skin eruptions',
        amazonSearch: 'The+Body+Shop+Tea+Tree+Oil'
      },
      {
        name: 'Clay Mask',
        brand: 'Aztec Secret Indian Clay',
        description: 'Deep cleansing for oily, congested luteal skin.',
        evidence: 'Bentonite clay absorbs excess sebum and draws out impurities',
        tcmUse: 'Clears dampness and heat from skin',
        amazonSearch: 'Aztec+Secret+Indian+Healing+Clay'
      }
    ]
  }
};

export function getAmazonSearchUrl(searchTerm) {
  return `https://www.amazon.com/s?k=${searchTerm}`;
}

export function getProductUrl(product) {
  // Partner products use direct URLs (future revenue partnerships)
  if (product.isPartner && product.directUrl) {
    return product.directUrl;
  }
  // Fallback to Amazon affiliate search
  return getAmazonSearchUrl(product.amazonSearch);
}

export function isPartnerProduct(product) {
  return product.isPartner === true;
}

export function getPhaseProducts(phase) {
  const phaseData = PHASE_PRODUCTS[phase] || PHASE_PRODUCTS.follicular;
  return {
    teas: phaseData.teas || [],
    supplements: phaseData.supplements || [],
    skincare: phaseData.skincare || [],
    foods: phaseData.foods || [],
    soups: phaseData.soups || []
  };
}
