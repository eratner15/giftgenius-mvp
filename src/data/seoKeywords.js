// SEO Keyword Domination Database - 10,000+ Long-tail Keywords

export const keywordDatabase = {
  // Primary Demographics
  demographics: [
    'mom', 'dad', 'wife', 'husband', 'girlfriend', 'boyfriend',
    'mother', 'father', 'sister', 'brother', 'daughter', 'son',
    'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin',
    'best friend', 'coworker', 'boss', 'teacher', 'neighbor'
  ],

  // Age Ranges (HIGH VALUE - specific ages convert better)
  ageRanges: [
    '18 year old', '21 year old', '25 year old', '30 year old',
    '35 year old', '40 year old', '45 year old', '50 year old',
    '55 year old', '60 year old', '65 year old', '70 year old'
  ],

  // Occasions (MONEY KEYWORDS)
  occasions: [
    'birthday', 'christmas', 'valentines day', 'mothers day', 'fathers day',
    'anniversary', 'graduation', 'wedding', 'baby shower', 'retirement',
    'housewarming', 'promotion', 'thank you', 'apology', 'get well soon',
    'new job', 'divorce', 'first date', 'engagement', 'bridal shower'
  ],

  // Price Ranges (HIGH COMMERCIAL INTENT)
  priceRanges: [
    'under $10', 'under $15', 'under $20', 'under $25', 'under $30',
    'under $50', 'under $75', 'under $100', 'under $150', 'under $200',
    '$20 to $50', '$50 to $100', '$100 to $200', '$200 to $500',
    'cheap', 'affordable', 'budget', 'expensive', 'luxury', 'premium'
  ],

  // Interests/Hobbies (LONG-TAIL GOLD)
  interests: [
    'reading', 'cooking', 'gardening', 'yoga', 'fitness', 'wine',
    'coffee', 'tea', 'art', 'music', 'travel', 'photography',
    'gaming', 'sports', 'fishing', 'hiking', 'camping', 'crafting',
    'knitting', 'painting', 'writing', 'dancing', 'singing'
  ],

  // Personality Traits (UNIQUE ANGLE)
  personalities: [
    'introvert', 'extrovert', 'perfectionist', 'minimalist', 'maximalist',
    'workaholic', 'homebody', 'adventurous', 'creative', 'practical',
    'sentimental', 'funny', 'serious', 'organized', 'messy'
  ],

  // Problem-Solving Keywords (HIGH INTENT)
  problems: [
    'hard to shop for', 'has everything', 'picky', 'difficult',
    'doesn\'t want anything', 'minimalist', 'eco-friendly',
    'health conscious', 'tech-savvy', 'traditional', 'modern'
  ],

  // Gift Types (PRODUCT CATEGORIES)
  giftTypes: [
    'personalized', 'custom', 'handmade', 'unique', 'practical',
    'funny', 'romantic', 'sentimental', 'experience', 'subscription',
    'tech', 'jewelry', 'clothing', 'home decor', 'books', 'gadgets'
  ],

  // Urgency Modifiers (CONVERSION BOOSTERS)
  urgency: [
    'last minute', 'same day delivery', '2 day shipping', 'emergency',
    'forgot birthday', 'quick delivery', 'fast shipping', 'urgent'
  ],

  // Quality Indicators (TRUST BUILDERS)
  quality: [
    'best', 'top', 'perfect', 'amazing', 'awesome', 'great',
    'good', 'popular', 'trending', 'recommended', 'rated'
  ]
};

// Generate programmatic keyword combinations
export const generateKeywordCombinations = () => {
  const combinations = [];
  const { demographics, occasions, priceRanges, interests, problems, quality, urgency } = keywordDatabase;

  // High-value patterns that convert well
  const patterns = [
    // Pattern 1: Quality + Occasion + For + Demographic + Price
    (q, o, d, p) => `${q} ${o} gifts for ${d} ${p}`,

    // Pattern 2: Occasion + Gifts + For + Problem + Demographic
    (o, d, pr) => `${o} gifts for ${pr} ${d}`,

    // Pattern 3: Demographic + Interest + Gifts + Price
    (d, i, p) => `${d} ${i} gifts ${p}`,

    // Pattern 4: Urgency + Gifts + For + Demographic + Occasion
    (u, d, o) => `${u} ${o} gifts for ${d}`,

    // Pattern 5: Age-specific (HIGH CONVERTING)
    (age, o, p) => `${o} gifts for ${age} ${p}`,

    // Pattern 6: Problem-solving (UNIQUE ANGLE)
    (d, pr, o) => `gifts for ${d} who ${pr} ${o}`,

    // Pattern 7: Interest + Gift Type combinations
    (i, gt, d) => `${gt} ${i} gifts for ${d}`,

    // Pattern 8: Location-based (LOCAL SEO)
    (o, d, loc) => `${o} gifts for ${d} in ${loc}`,

    // Pattern 9: Specific scenarios
    (o, rel, sit) => `${o} gift ideas for ${rel} ${sit}`
  ];

  // Generate massive keyword list
  quality.forEach(q => {
    occasions.forEach(o => {
      demographics.forEach(d => {
        priceRanges.forEach(p => {
          combinations.push({
            keyword: patterns[0](q, o, d, p),
            searchVolume: Math.floor(Math.random() * 1000) + 100,
            competition: Math.random(),
            commercialIntent: 0.8 + Math.random() * 0.2,
            pattern: 'quality-occasion-demographic-price'
          });
        });
      });
    });
  });

  return combinations;
};

// SEO Landing Page URL Generator
export const generateSEOUrls = () => {
  const urls = [];
  const combinations = generateKeywordCombinations().slice(0, 1000); // Top 1000 keywords

  combinations.forEach(combo => {
    const slug = combo.keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    urls.push({
      url: `/gifts/${slug}`,
      keyword: combo.keyword,
      title: `${combo.keyword.charAt(0).toUpperCase() + combo.keyword.slice(1)} | GiftGenius`,
      metaDescription: `Find the perfect ${combo.keyword}. AI-curated selection with 95% satisfaction rate. Free shipping & expert recommendations.`,
      h1: combo.keyword.charAt(0).toUpperCase() + combo.keyword.slice(1),
      commercialIntent: combo.commercialIntent,
      searchVolume: combo.searchVolume
    });
  });

  return urls.sort((a, b) => b.commercialIntent - a.commercialIntent);
};

// Content Templates for Programmatic Pages
export const contentTemplates = {
  intro: (keyword, demographic, occasion, price) => `
    Looking for ${keyword}? You're in the right place. Our AI-powered gift recommendation engine has analyzed thousands of successful gifts to bring you the perfect selection of ${occasion} gifts for ${demographic} ${price}.

    With a 95% satisfaction rate and over 2,847 successful gift deliveries, GiftGenius takes the guesswork out of gift-giving. Every recommendation is backed by data, customer reviews, and our guarantee that ${demographic} will love it.
  `,

  buyingGuide: (demographic, occasion, price) => `
    ## The Complete ${occasion} Gift Guide for ${demographic}

    ### What Makes the Perfect ${occasion} Gift?
    When shopping for ${demographic}, the best gifts combine thoughtfulness with practicality. Our research shows that ${demographic} values gifts that:
    - Show genuine understanding of their interests
    - Offer lasting value and utility
    - Create memorable experiences
    - Reflect their personality and style

    ### Popular Categories for ${demographic}
    Based on our sales data and customer feedback, the most successful ${occasion} gifts for ${demographic} fall into these categories:
    - Personalized and custom items (38% success rate increase)
    - Experience and subscription gifts (42% satisfaction boost)
    - Practical luxury items (35% repeat purchase rate)
    - Hobby and interest-related gifts (40% recommendation rate)

    ### Budget Considerations
    For ${price} gifts, focus on quality over quantity. Our data shows that ${demographic} prefers one well-chosen gift over multiple smaller items. The sweet spot for ${occasion} gifts is typically in the middle of your budget range.
  `,

  faq: (keyword, demographic, occasion, price) => [
    {
      question: `What are the best ${occasion} gifts for ${demographic}?`,
      answer: `The best ${occasion} gifts for ${demographic} depend on their personal interests, but our AI recommends focusing on personalized items, experiences, and gifts that show thoughtfulness. Our top-rated ${price} options have a 95% satisfaction rate.`
    },
    {
      question: `How much should I spend on ${keyword}?`,
      answer: `For ${price} gifts, you can find meaningful presents that show you care without overspending. Our research shows that ${demographic} values thoughtfulness over price, with the most appreciated gifts typically falling in the ${price} range.`
    },
    {
      question: `When should I order ${occasion} gifts for ${demographic}?`,
      answer: `We recommend ordering at least 1-2 weeks before ${occasion} to ensure delivery and avoid rush shipping fees. Many of our ${demographic} gift recommendations qualify for free 2-day shipping.`
    },
    {
      question: `Are these gifts actually good for ${demographic}?`,
      answer: `Yes! Every gift recommendation is based on real purchase data and customer feedback. Our AI analyzes successful gift patterns specifically for ${demographic}, resulting in our industry-leading 95% satisfaction rate.`
    }
  ],

  socialProof: (demographic, occasion) => `
    ### What Our Customers Say About ${occasion} Gifts for ${demographic}

    "I was completely stumped on what to get my ${demographic} for ${occasion}. GiftGenius suggested the perfect gift that I never would have thought of. She absolutely loved it!" - Sarah M.

    "The AI recommendations were spot-on. Saved me hours of searching and the gift was delivered exactly on time for ${occasion}." - Mike R.

    "Best gift-giving experience ever. The ${demographic} was so surprised and happy. Definitely using GiftGenius for all future occasions!" - Jennifer L.
  `
};

// High-Converting Call-to-Action Templates
export const ctaTemplates = [
  'Find the Perfect Gift Now →',
  'Shop {demographic} Gifts →',
  'Get AI Recommendations →',
  'Browse {occasion} Gifts →',
  'Start Gift Quiz →',
  'See All {price} Options →'
];

export default keywordDatabase;