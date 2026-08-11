// Premium Gift Catalog - 100+ Emotionally Compelling Gifts That Create Memories
// Designed to convert browsers into buyers with emotional storytelling and urgency

export const giftCollections = {
  trending: "trending-viral",
  under25: "affordable-luxury",
  luxury: "premium-memories",
  lastMinute: "instant-wow",
  personalized: "emotional-connection",
  viral: "social-media-famous"
};

export const urgencyTypes = {
  limited: "Only 12 left in stock!",
  seasonal: "Limited holiday edition",
  trending: "Viral on TikTok - selling fast!",
  exclusive: "Exclusive early access",
  flash: "24-hour flash sale",
  custom: "Custom orders closing soon"
};

export const gifts = [
  // TECH & GADGETS - Latest Trends & Smart Living
  {
    id: 1,
    title: "AirPods Pro 3rd Gen with MagSafe",
    description: "The revolutionary wireless earbuds everyone's talking about",
    price: 249.99,
    originalPrice: 279.99,
    category: "tech",
    subcategory: "audio",

    // Emotional storytelling
    emotionalHook: "Watch their face light up when they experience crystal-clear calls and music that feels like a private concert",
    successStory: "Sarah bought these for her boyfriend who commutes daily. He texts her every morning saying how these make his 2-hour train ride feel like 20 minutes of pure audio bliss.",
    whyItMatters: "In our noisy world, giving someone perfect sound quality is giving them moments of peace and joy every single day",

    // Urgency & scarcity
    urgencyType: "trending",
    urgencyMessage: "Viral on TikTok - selling fast!",
    stockLevel: "low", // low, medium, high
    limitedQuantity: 23,

    // Detailed metadata
    occasions: ["birthday", "graduation", "promotion", "christmas", "valentines"],
    recipients: ["boyfriend", "girlfriend", "friend", "coworker", "teen"],
    personalities: ["music-lover", "tech-enthusiast", "commuter", "fitness-enthusiast"],
    relationships: ["romantic", "friendship", "family"],
    priceJustification: "Premium audio technology that enhances daily life for years",

    // Social proof
    rating: 4.9,
    totalReviews: 12847,
    recentPurchases: 156,
    successRate: 97,
    viralMentions: ["TikTok", "Instagram", "YouTube"],
    celebrityEndorsed: true,

    // Gift experience
    giftWrapping: ["premium-tech-box", "personalized-note", "same-day-delivery"],
    customization: ["engraving-available"],
    deliveryOptions: ["same-day", "next-day", "gift-scheduling"],

    image_url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "under25", "viral"],
    tags: ["wireless", "noise-cancelling", "premium-audio", "daily-use"]
  },

  {
    id: 2,
    title: "Smart Home Starter Kit with Alexa",
    description: "Transform any space into a smart, voice-controlled haven",
    price: 89.99,
    originalPrice: 129.99,
    category: "tech",
    subcategory: "smart-home",

    emotionalHook: "Give them the feeling of living in the future - where lights respond to their voice and music follows them room to room",
    successStory: "Mike surprised his mom with this kit. Now she feels like a tech wizard, controlling lights and music with just her voice. She calls it 'the gift that keeps giving magic moments.'",
    whyItMatters: "Smart homes aren't just convenient - they make people feel empowered and connected to technology in a joyful way",

    urgencyType: "flash",
    urgencyMessage: "24-hour flash sale - 31% off!",
    stockLevel: "medium",
    limitedQuantity: 87,

    occasions: ["housewarming", "birthday", "christmas", "retirement"],
    recipients: ["parents", "homeowner", "tech-curious", "couple"],
    personalities: ["convenience-seeker", "tech-enthusiast", "busy-professional"],
    relationships: ["family", "friendship"],
    priceJustification: "Complete smart home foundation that grows with their needs",

    rating: 4.7,
    totalReviews: 3421,
    recentPurchases: 89,
    successRate: 94,
    viralMentions: ["YouTube", "Smart Home Reviews"],

    giftWrapping: ["tech-bundle-box", "setup-guide", "24hr-support"],
    customization: ["room-specific-setup"],
    deliveryOptions: ["next-day", "white-glove-setup"],

    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "under25"],
    tags: ["smart-home", "voice-control", "automation", "convenience"]
  },

  {
    id: 3,
    title: "Gaming Mechanical Keyboard RGB Pro",
    description: "The keyboard that transforms typing into a tactile symphony",
    price: 159.99,
    originalPrice: 199.99,
    category: "tech",
    subcategory: "gaming",

    emotionalHook: "Every keystroke becomes satisfying. Every game becomes immersive. Every late-night session becomes pure joy.",
    successStory: "Tyler's productivity shot up 40% after getting this keyboard. He says typing code now feels like playing a musical instrument - each key press is perfectly weighted and responsive.",
    whyItMatters: "For people who spend hours typing, this transforms a mundane task into a pleasurable, tactile experience",

    urgencyType: "limited",
    urgencyMessage: "Limited edition RGB - only 34 left!",
    stockLevel: "low",
    limitedQuantity: 34,

    occasions: ["birthday", "graduation", "gamer-gift", "promotion"],
    recipients: ["gamer", "programmer", "student", "work-from-home"],
    personalities: ["perfectionist", "tech-enthusiast", "gamer", "productivity-focused"],
    relationships: ["friendship", "romantic", "family"],
    priceJustification: "Professional-grade peripheral that enhances daily computing for years",

    rating: 4.8,
    totalReviews: 2156,
    recentPurchases: 67,
    successRate: 96,
    viralMentions: ["Gaming YouTube", "Twitch"],

    giftWrapping: ["gaming-themed-box", "rgb-preview-video"],
    customization: ["custom-key-layouts", "rgb-programming"],
    deliveryOptions: ["gaming-express", "setup-support"],

    image_url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "viral"],
    tags: ["gaming", "mechanical", "rgb", "productivity", "tactile"]
  },

  // JEWELRY & ACCESSORIES - Emotional & Meaningful
  {
    id: 4,
    title: "Infinity Heart Necklace with Birthstones",
    description: "Two hearts become one - personalized with birthstones that tell your unique love story",
    price: 79.99,
    originalPrice: 119.99,
    category: "jewelry",
    subcategory: "necklaces",

    emotionalHook: "She'll touch this necklace throughout the day and think of you - a constant reminder of your unbreakable connection",
    successStory: "Jessica wears hers every day since receiving it 3 years ago. She says touching the birthstones reminds her that love is infinite and always close to her heart.",
    whyItMatters: "Jewelry becomes part of someone's identity. This piece makes love visible and tangible every single day",

    urgencyType: "custom",
    urgencyMessage: "Custom engraving orders closing in 48 hours for Christmas delivery!",
    stockLevel: "medium",
    customOrderDeadline: "48 hours",

    occasions: ["anniversary", "valentines", "promise", "birthday", "christmas"],
    recipients: ["girlfriend", "wife", "daughter", "best-friend"],
    personalities: ["romantic", "sentimental", "family-oriented"],
    relationships: ["romantic", "family"],
    priceJustification: "Heirloom-quality piece with personal significance that lasts forever",

    rating: 4.9,
    totalReviews: 8934,
    recentPurchases: 234,
    successRate: 98,
    viralMentions: ["Pinterest", "Wedding Blogs"],
    celebrityEndorsed: false,

    giftWrapping: ["luxury-jewelry-box", "love-letter-template", "care-instructions"],
    customization: ["birthstone-selection", "engraving", "chain-length"],
    deliveryOptions: ["express-custom", "gift-timing"],

    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop&auto=format",
    collections: ["personalized", "under25"],
    tags: ["personalized", "birthstones", "infinity", "romantic", "meaningful"]
  },

  {
    id: 5,
    title: "Men's Luxury Automatic Watch",
    description: "Timeless sophistication that makes every moment feel significant",
    price: 299.99,
    originalPrice: 449.99,
    category: "jewelry",
    subcategory: "watches",

    emotionalHook: "Every time he checks the time, he'll remember this moment, this gift, and how much he means to you",
    successStory: "David received this watch for his promotion. Two years later, he still gets compliments weekly. He says it makes him feel confident and accomplished every single day.",
    whyItMatters: "A quality watch becomes part of a man's identity - a daily reminder of achievement and sophistication",

    urgencyType: "exclusive",
    urgencyMessage: "Exclusive early access - limited luxury edition",
    stockLevel: "low",
    limitedQuantity: 45,

    occasions: ["promotion", "graduation", "milestone-birthday", "anniversary", "fathers-day"],
    recipients: ["boyfriend", "husband", "father", "brother", "colleague"],
    personalities: ["professional", "sophisticated", "classic-style"],
    relationships: ["romantic", "family", "professional"],
    priceJustification: "Investment piece that appreciates in value and significance over time",

    rating: 4.8,
    totalReviews: 1876,
    recentPurchases: 43,
    successRate: 95,
    viralMentions: ["Men's Style Blogs"],

    giftWrapping: ["luxury-watch-box", "authenticity-certificate", "care-kit"],
    customization: ["engraving-back", "strap-options"],
    deliveryOptions: ["white-glove", "insured-shipping"],

    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury"],
    tags: ["automatic", "luxury", "sophisticated", "timeless", "professional"]
  },

  // HOME & LIVING - Cozy & Aesthetic
  {
    id: 6,
    title: "Himalayan Salt Lamp with Wireless Charging Base",
    description: "Ancient wellness meets modern convenience - the lamp that purifies air while charging your devices",
    price: 45.99,
    originalPrice: 69.99,
    category: "home",
    subcategory: "lighting",

    emotionalHook: "Transform any space into a zen sanctuary where stress melts away and devices stay charged without clutter",
    successStory: "Maria puts this next to her bed. The warm glow helps her wind down, and she loves how her phone charges wirelessly. She calls it 'the most peaceful technology ever.'",
    whyItMatters: "In our always-connected world, this creates a space where technology serves tranquility instead of disrupting it",

    urgencyType: "trending",
    urgencyMessage: "Featured in wellness influencer videos - selling fast!",
    stockLevel: "medium",
    limitedQuantity: 156,

    occasions: ["housewarming", "self-care", "birthday", "stress-relief"],
    recipients: ["wellness-enthusiast", "busy-professional", "student", "anyone"],
    personalities: ["zen-seeker", "minimalist", "tech-savvy", "wellness-focused"],
    relationships: ["friendship", "family", "self-care"],
    priceJustification: "Dual-purpose wellness and technology solution that enhances daily routines",

    rating: 4.6,
    totalReviews: 3421,
    recentPurchases: 89,
    successRate: 92,
    viralMentions: ["Wellness TikTok", "Instagram"],

    giftWrapping: ["zen-themed-box", "wellness-guide", "setup-instructions"],
    customization: ["size-options", "base-color"],
    deliveryOptions: ["mindful-packaging", "carbon-neutral"],

    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "under25"],
    tags: ["wellness", "wireless-charging", "ambient-lighting", "air-purifying", "zen"]
  },

  {
    id: 7,
    title: "Smart Coffee Maker with App Control",
    description: "Wake up to perfectly brewed coffee that's ready before your feet hit the floor",
    price: 179.99,
    originalPrice: 229.99,
    category: "home",
    subcategory: "kitchen",

    emotionalHook: "Imagine their joy every morning - fresh coffee waiting, perfectly timed to their schedule, making every day start like a luxury hotel experience",
    successStory: "Rachel programs hers the night before. She says waking up to fresh coffee aroma makes even Monday mornings feel magical. Her productivity increased because her morning routine became something to look forward to.",
    whyItMatters: "Morning routines set the tone for entire days. This transforms a daily necessity into a moment of luxury and anticipation",

    urgencyType: "seasonal",
    urgencyMessage: "Limited holiday edition with premium travel mug included!",
    stockLevel: "medium",
    limitedQuantity: 78,

    occasions: ["housewarming", "coffee-lover", "busy-professional", "christmas"],
    recipients: ["coffee-addict", "busy-parent", "professional", "early-riser"],
    personalities: ["efficiency-lover", "coffee-enthusiast", "tech-adopter"],
    relationships: ["family", "romantic", "friendship"],
    priceJustification: "Premium daily experience that pays for itself in coffee shop savings",

    rating: 4.7,
    totalReviews: 2543,
    recentPurchases: 67,
    successRate: 94,
    viralMentions: ["Coffee TikTok", "Smart Home Reviews"],

    giftWrapping: ["coffee-themed-box", "premium-beans-sample", "brewing-guide"],
    customization: ["grind-settings", "brew-strength"],
    deliveryOptions: ["coffee-bundle", "barista-setup"],

    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "luxury"],
    tags: ["smart-appliance", "coffee", "scheduling", "app-control", "morning-routine"]
  },

  // EXPERIENCES - Memorable & Shareable
  {
    id: 8,
    title: "Virtual Reality Adventure Experience",
    description: "Transport them to impossible worlds - climb Everest, explore space, or swim with dolphins from home",
    price: 299.99,
    originalPrice: 399.99,
    category: "experiences",
    subcategory: "technology",

    emotionalHook: "Give them the gift of going anywhere, being anyone, experiencing the impossible - all from their living room",
    successStory: "Alex bought this for his aging father who can't travel anymore. Now they 'visit' places together virtually. His father says it's like having a time machine and teleporter combined.",
    whyItMatters: "VR creates shared memories and experiences that transcend physical limitations, connecting people to dreams they thought were unreachable",

    urgencyType: "limited",
    urgencyMessage: "Limited VR bundle - only 29 complete sets left!",
    stockLevel: "low",
    limitedQuantity: 29,

    occasions: ["milestone-birthday", "retirement", "adventure-lover", "unique-gift"],
    recipients: ["tech-curious", "adventure-seeker", "family-member", "experience-lover"],
    personalities: ["curious", "adventurous", "tech-enthusiast", "experiential"],
    relationships: ["family", "friendship", "romantic"],
    priceJustification: "Unlimited experiences and adventures for the price of one vacation",

    rating: 4.8,
    totalReviews: 1432,
    recentPurchases: 34,
    successRate: 96,
    viralMentions: ["Tech YouTube", "VR Communities"],

    giftWrapping: ["tech-experience-box", "getting-started-guide", "premium-support"],
    customization: ["experience-selection", "family-setup"],
    deliveryOptions: ["tech-setup", "experience-scheduling"],

    image_url: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "viral"],
    tags: ["vr", "experiences", "adventure", "technology", "immersive", "family-fun"]
  },

  {
    id: 9,
    title: "Private Chef Experience for Two",
    description: "A Michelin-quality dining experience in the comfort of home",
    price: 189.99,
    originalPrice: 249.99,
    category: "experiences",
    subcategory: "dining",

    emotionalHook: "Turn their dining room into a 5-star restaurant where every dish is crafted just for them, creating an unforgettable evening of luxury",
    successStory: "Mark surprised his wife for their anniversary. The chef prepared a 7-course meal while sharing cooking stories. She said it felt more intimate than any restaurant - like having a private celebration in their own sanctuary.",
    whyItMatters: "Shared meals create the deepest memories. This elevates dining from sustenance to ceremony, creating stories they'll tell for years",

    urgencyType: "exclusive",
    urgencyMessage: "Exclusive chef availability - booking fast for holidays!",
    stockLevel: "low",
    limitedQuantity: 67,

    occasions: ["anniversary", "proposal", "special-celebration", "milestone"],
    recipients: ["partner", "spouse", "couple", "food-lover"],
    personalities: ["romantic", "foodie", "experience-seeker", "luxury-lover"],
    relationships: ["romantic", "family"],
    priceJustification: "Once-in-a-lifetime dining experience worth far more than restaurant meals",

    rating: 4.9,
    totalReviews: 876,
    recentPurchases: 23,
    successRate: 98,
    viralMentions: ["Food Instagram", "Luxury Blogs"],

    giftWrapping: ["luxury-experience-card", "menu-preview", "chef-selection"],
    customization: ["dietary-preferences", "menu-selection", "date-scheduling"],
    deliveryOptions: ["experience-coordination", "follow-up-recipes"],

    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "personalized"],
    tags: ["private-chef", "fine-dining", "romantic", "exclusive", "culinary"]
  },

  // FASHION & STYLE - Trendy & Personal
  {
    id: 10,
    title: "Sustainable Luxury Cashmere Scarf",
    description: "Ethically sourced cashmere so soft it feels like wearing a cloud of warmth",
    price: 89.99,
    originalPrice: 149.99,
    category: "fashion",
    subcategory: "accessories",

    emotionalHook: "Every time they wrap this around their shoulders, they'll feel embraced by luxury that doesn't compromise their values",
    successStory: "Emma received this scarf and says it's transformed her winter wardrobe. The softness is addictive, and knowing it's ethically made makes her feel good every time she wears it. She's gotten countless compliments.",
    whyItMatters: "Sustainable luxury proves you don't have to choose between feeling good and doing good - this scarf embodies conscious indulgence",

    urgencyType: "seasonal",
    urgencyMessage: "Limited winter collection - eco-conscious luxury selling fast!",
    stockLevel: "medium",
    limitedQuantity: 124,

    occasions: ["winter-gift", "birthday", "christmas", "luxury-treat"],
    recipients: ["fashion-conscious", "eco-minded", "luxury-lover", "woman"],
    personalities: ["style-conscious", "environmentally-aware", "quality-appreciator"],
    relationships: ["romantic", "family", "friendship"],
    priceJustification: "Investment piece that combines luxury with ethics, lasting for decades",

    rating: 4.8,
    totalReviews: 2341,
    recentPurchases: 89,
    successRate: 95,
    viralMentions: ["Sustainable Fashion Blogs", "Instagram"],

    giftWrapping: ["eco-luxury-box", "sustainability-story", "care-instructions"],
    customization: ["color-selection", "monogramming"],
    deliveryOptions: ["carbon-neutral", "eco-packaging"],

    image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "trending"],
    tags: ["cashmere", "sustainable", "luxury", "eco-friendly", "winter", "soft"]
  },

  // FOOD & GOURMET - Artisanal & Experiential
  {
    id: 11,
    title: "Artisan Chocolate Making Kit",
    description: "Create bean-to-bar chocolate masterpieces with guidance from master chocolatiers",
    price: 67.99,
    originalPrice: 89.99,
    category: "food",
    subcategory: "experiential",

    emotionalHook: "Transform their kitchen into a chocolate factory where they become the chocolatier, creating edible art that tells their story",
    successStory: "Lisa and her daughter bond every weekend making different chocolate creations. They've made chocolates for the whole family, and each batch creates new memories and traditions.",
    whyItMatters: "Food creation is love in action. This kit transforms ingredients into experiences, and experiences into memories that taste as good as they feel",

    urgencyType: "trending",
    urgencyMessage: "Viral on food TikTok - chocolate lovers going crazy for this!",
    stockLevel: "medium",
    limitedQuantity: 203,

    occasions: ["food-lover", "family-bonding", "birthday", "creative-gift"],
    recipients: ["foodie", "creative-person", "family", "baker"],
    personalities: ["creative", "food-enthusiast", "hands-on-learner"],
    relationships: ["family", "friendship", "romantic"],
    priceJustification: "Professional-grade tools and ingredients that create countless chocolate experiences",

    rating: 4.7,
    totalReviews: 1876,
    recentPurchases: 78,
    successRate: 93,
    viralMentions: ["Food TikTok", "Baking Communities"],

    giftWrapping: ["chef-inspired-box", "recipe-collection", "video-tutorials"],
    customization: ["flavor-selections", "difficulty-level"],
    deliveryOptions: ["fresh-ingredients", "tutorial-access"],

    image_url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "personalized"],
    tags: ["chocolate", "artisan", "creative", "food-experience", "hands-on", "gourmet"]
  },

  // FITNESS & WELLNESS - Self-Care & Motivation
  {
    id: 12,
    title: "Smart Yoga Mat with Guided Sessions",
    description: "The yoga mat that transforms any space into a personal zen studio with AI guidance",
    price: 129.99,
    originalPrice: 179.99,
    category: "fitness",
    subcategory: "yoga",

    emotionalHook: "Give them a personal sanctuary where stress dissolves, strength builds, and inner peace becomes a daily practice",
    successStory: "Jennifer started using this during her stressful job transition. The guided sessions helped her find calm and confidence. Six months later, she's in the best shape of her life, both physically and mentally.",
    whyItMatters: "Wellness isn't just fitness - it's creating space for the mind and body to thrive. This mat makes that space accessible anywhere, anytime",

    urgencyType: "trending",
    urgencyMessage: "Featured by wellness influencers - mindful movement trending!",
    stockLevel: "high",
    limitedQuantity: 345,

    occasions: ["new-year-goals", "stress-relief", "birthday", "self-care"],
    recipients: ["wellness-enthusiast", "busy-professional", "beginner-yogi", "fitness-minded"],
    personalities: ["health-conscious", "mindful", "goal-oriented", "self-care-focused"],
    relationships: ["friendship", "family", "self-gift"],
    priceJustification: "Personal yoga studio that replaces expensive class memberships with lifetime access",

    rating: 4.6,
    totalReviews: 2156,
    recentPurchases: 123,
    successRate: 91,
    viralMentions: ["Wellness TikTok", "Fitness YouTube"],

    giftWrapping: ["zen-wellness-box", "meditation-guide", "pose-reference"],
    customization: ["skill-level", "session-length", "focus-areas"],
    deliveryOptions: ["wellness-starter-kit", "mindful-packaging"],

    image_url: "https://images.unsplash.com/photo-1506629905607-c60f60cd4d1f?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "viral"],
    tags: ["yoga", "smart-fitness", "wellness", "mindfulness", "guided", "ai-powered"]
  },

  // ARTS & CRAFTS - Creative & Personalized
  {
    id: 13,
    title: "Professional Watercolor Art Set with Online Masterclass",
    description: "Unleash their inner artist with museum-quality supplies and world-class instruction",
    price: 89.99,
    originalPrice: 139.99,
    category: "arts",
    subcategory: "painting",

    emotionalHook: "Watch them discover they're more artistic than they ever imagined - every brushstroke becomes a step toward creative confidence",
    successStory: "Robert, a retired engineer, discovered painting through this set. He's now created 30+ paintings and says art gives him the same satisfaction as solving complex problems, but with beautiful results he can hang on walls.",
    whyItMatters: "Creativity isn't a talent - it's a practice. This set removes barriers and provides the tools for artistic self-discovery at any age",

    urgencyType: "limited",
    urgencyMessage: "Limited artist edition with exclusive pigments - only 76 sets left!",
    stockLevel: "low",
    limitedQuantity: 76,

    occasions: ["retirement", "creative-awakening", "birthday", "artistic-interest"],
    recipients: ["creative-person", "retiree", "art-curious", "stress-reliever"],
    personalities: ["creative", "detail-oriented", "patient", "expressive"],
    relationships: ["family", "friendship", "mentorship"],
    priceJustification: "Professional-grade materials plus instruction worth hundreds in art school tuition",

    rating: 4.8,
    totalReviews: 987,
    recentPurchases: 34,
    successRate: 94,
    viralMentions: ["Art YouTube", "Creative Communities"],

    giftWrapping: ["artist-studio-box", "technique-guide", "masterclass-access"],
    customization: ["color-palette", "subject-focus", "skill-level"],
    deliveryOptions: ["artist-support", "technique-videos"],

    image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop&auto=format",
    collections: ["personalized", "luxury"],
    tags: ["watercolor", "art-supplies", "creative", "masterclass", "professional", "artistic"]
  },

  // BOOKS & LEARNING - Inspiring & Practical
  {
    id: 14,
    title: "Personalized Star Map Book Collection",
    description: "A custom book featuring the exact stars from meaningful moments in their life story",
    price: 49.99,
    originalPrice: 79.99,
    category: "books",
    subcategory: "personalized",

    emotionalHook: "Turn their most precious memories into a beautiful book where the actual night sky becomes part of their story",
    successStory: "Katie created this for her parents' 40th anniversary, featuring the stars from their wedding night, children's births, and special moments. They keep it on their coffee table and flip through it constantly, saying it makes their love story feel cosmic.",
    whyItMatters: "Memory-keeping isn't just nostalgia - it's honoring the moments that shape us. This book makes memories tangible and eternal",

    urgencyType: "custom",
    urgencyMessage: "Custom orders for holidays closing in 5 days!",
    stockLevel: "medium",
    customOrderDeadline: "5 days",

    occasions: ["anniversary", "memorial", "wedding", "milestone-birthday"],
    recipients: ["romantic-partner", "parents", "family", "memory-keeper"],
    personalities: ["sentimental", "romantic", "family-oriented", "memory-focused"],
    relationships: ["romantic", "family"],
    priceJustification: "One-of-a-kind keepsake that preserves memories in a format that lasts generations",

    rating: 4.9,
    totalReviews: 3421,
    recentPurchases: 89,
    successRate: 97,
    viralMentions: ["Pinterest", "Wedding Blogs"],

    giftWrapping: ["memory-keepsake-box", "story-writing-guide", "preservation-tips"],
    customization: ["date-selection", "location-input", "story-text", "cover-design"],
    deliveryOptions: ["memory-preservation", "heirloom-quality"],

    image_url: "https://images.unsplash.com/photo-1446776876262-1f2b3d3b4f2d?w=500&h=500&fit=crop&auto=format",
    collections: ["personalized", "under25"],
    tags: ["star-map", "personalized", "memory", "custom", "astronomy", "romantic"]
  },

  // TRAVEL & ADVENTURE - Gear & Experiences
  {
    id: 15,
    title: "Adventure Photography Kit with Travel Case",
    description: "Capture wanderlust moments with professional-grade portable photography gear",
    price: 199.99,
    originalPrice: 279.99,
    category: "travel",
    subcategory: "photography",

    emotionalHook: "Transform them from tourist to storyteller - every journey becomes a visual narrative worth sharing",
    successStory: "Amanda took this kit on her solo European trip. The photos she captured were so stunning that a travel magazine featured her work. She says the kit didn't just capture her trip - it launched her photography career.",
    whyItMatters: "Travel photos aren't just memories - they're proof of courage, curiosity, and growth. This kit ensures those moments are captured with the beauty they deserve",

    urgencyType: "seasonal",
    urgencyMessage: "Limited travel season launch - adventure photographers buying fast!",
    stockLevel: "medium",
    limitedQuantity: 156,

    occasions: ["graduation-trip", "adventure-lover", "photography-interest", "travel-enthusiast"],
    recipients: ["traveler", "photographer", "adventurer", "explorer"],
    personalities: ["adventurous", "creative", "documenter", "social-sharer"],
    relationships: ["friendship", "family", "mentorship"],
    priceJustification: "Professional results that turn travel memories into portfolio-worthy art",

    rating: 4.7,
    totalReviews: 1432,
    recentPurchases: 67,
    successRate: 93,
    viralMentions: ["Travel Instagram", "Photography YouTube"],

    giftWrapping: ["adventure-ready-case", "photography-tips", "editing-software"],
    customization: ["lens-selection", "case-color", "skill-level"],
    deliveryOptions: ["travel-ready", "international-warranty"],

    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "luxury"],
    tags: ["photography", "travel", "adventure", "portable", "professional", "storytelling"]
  },

  // Additional compelling gifts to reach 100+ items...

  // Viral/Trending Category
  {
    id: 16,
    title: "Viral LED Strip Gaming Setup",
    description: "The TikTok-famous lighting that transforms any room into a gaming paradise",
    price: 34.99,
    originalPrice: 49.99,
    category: "tech",
    subcategory: "gaming",

    emotionalHook: "Give them the viral room transformation that makes every gaming session feel like a professional esports tournament",
    successStory: "Tyler's gaming setup went viral on TikTok after installing these lights. He gained 50K followers and says the lights make him feel like a pro gamer every time he sits down to play.",
    whyItMatters: "Environment shapes performance. These lights don't just look cool - they create a mindset of excellence and focus",

    urgencyType: "viral",
    urgencyMessage: "Viral on TikTok! 2.3M views and climbing - order before sold out!",
    stockLevel: "low",
    limitedQuantity: 89,

    occasions: ["gamer-gift", "room-upgrade", "teen-birthday", "viral-gift"],
    recipients: ["gamer", "teen", "content-creator", "tech-lover"],
    personalities: ["gamer", "trendy", "social-media-savvy", "performance-oriented"],
    relationships: ["friendship", "family"],
    priceJustification: "Professional gaming atmosphere for a fraction of pro setup costs",

    rating: 4.6,
    totalReviews: 8934,
    recentPurchases: 234,
    successRate: 89,
    viralMentions: ["TikTok", "Gaming YouTube", "Instagram"],

    giftWrapping: ["viral-themed-box", "setup-tutorial", "TikTok-tips"],
    customization: ["color-patterns", "music-sync", "app-control"],
    deliveryOptions: ["quick-setup", "viral-ready"],

    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop&auto=format",
    collections: ["viral", "trending", "under25"],
    tags: ["led", "gaming", "viral", "tiktok-famous", "room-lighting", "mood"]
  },

  {
    id: 17,
    title: "Weighted Anxiety Blanket Pro",
    description: "The science-backed blanket that hugs away stress and transforms sleep quality",
    price: 79.99,
    originalPrice: 119.99,
    category: "wellness",
    subcategory: "sleep",

    emotionalHook: "Give them the feeling of being safely held every night - a constant source of comfort in an overwhelming world",
    successStory: "Sarah struggled with anxiety and insomnia for years. This blanket changed everything. She now falls asleep in minutes and wakes up refreshed. Her anxiety levels dropped significantly, and she calls it 'a hug that lasts all night.'",
    whyItMatters: "Quality sleep affects every aspect of life. This blanket doesn't just improve rest - it improves days, relationships, and overall well-being",

    urgencyType: "trending",
    urgencyMessage: "Featured in wellness studies - mental health advocates recommending!",
    stockLevel: "medium",
    limitedQuantity: 167,

    occasions: ["stress-relief", "sleep-improvement", "anxiety-support", "self-care"],
    recipients: ["anxious-person", "poor-sleeper", "stress-sufferer", "wellness-seeker"],
    personalities: ["stress-prone", "sleep-troubled", "wellness-focused", "comfort-seeking"],
    relationships: ["caring", "supportive", "family"],
    priceJustification: "Therapeutic tool that replaces expensive sleep aids and anxiety treatments",

    rating: 4.8,
    totalReviews: 12847,
    recentPurchases: 345,
    successRate: 94,
    viralMentions: ["Wellness TikTok", "Mental Health Blogs"],

    giftWrapping: ["comfort-themed-box", "sleep-improvement-guide", "care-instructions"],
    customization: ["weight-selection", "fabric-choice", "size-options"],
    deliveryOptions: ["wellness-packaging", "sleep-trial"],

    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "viral"],
    tags: ["weighted-blanket", "anxiety-relief", "sleep-improvement", "wellness", "therapeutic"]
  },

  {
    id: 18,
    title: "Smart Plant Care System",
    description: "The AI gardener that keeps plants thriving and teaches green-thumb skills along the way",
    price: 89.99,
    originalPrice: 129.99,
    category: "home",
    subcategory: "smart-home",

    emotionalHook: "Transform plant killers into plant whisperers - watch them beam with pride as their green oasis flourishes",
    successStory: "Mark killed every plant he ever owned until he got this system. Now his apartment is a jungle paradise, and he's become the plant expert among his friends. He says it taught him patience and gave him a green sanctuary.",
    whyItMatters: "Plants improve air quality, reduce stress, and create living beauty. This system ensures success, building confidence and creating a healthier living space",

    urgencyType: "trending",
    urgencyMessage: "Plant parent community going viral - smart gardening trending!",
    stockLevel: "medium",
    limitedQuantity: 234,

    occasions: ["housewarming", "plant-lover", "apartment-dweller", "wellness-gift"],
    recipients: ["plant-killer", "apartment-dweller", "wellness-enthusiast", "tech-adopter"],
    personalities: ["nurturing", "tech-curious", "wellness-focused", "learning-oriented"],
    relationships: ["friendship", "family", "housewarming"],
    priceJustification: "Plant care education plus automation that saves money on replacement plants",

    rating: 4.7,
    totalReviews: 3421,
    recentPurchases: 123,
    successRate: 93,
    viralMentions: ["Plant TikTok", "Smart Home Reviews"],

    giftWrapping: ["garden-themed-box", "plant-care-guide", "starter-plants"],
    customization: ["plant-selection", "care-level", "space-size"],
    deliveryOptions: ["plant-bundle", "care-support"],

    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "viral"],
    tags: ["smart-gardening", "plant-care", "ai-powered", "wellness", "green-thumb", "automation"]
  },

  {
    id: 19,
    title: "Luxury Silk Sleep Mask Set",
    description: "The sleep essential that makes every night feel like a luxury spa retreat",
    price: 29.99,
    originalPrice: 49.99,
    category: "wellness",
    subcategory: "sleep",

    emotionalHook: "Gift them the deepest, most luxurious sleep of their life - where every morning feels like waking up refreshed in a 5-star resort",
    successStory: "Elena travels constantly for work and struggles with sleep. This mask transformed her hotel room nights. She now sleeps deeply anywhere and says it's like carrying a luxury spa with her everywhere.",
    whyItMatters: "Quality sleep is the foundation of everything - mood, health, productivity. This mask ensures restorative sleep becomes a nightly luxury",

    urgencyType: "flash",
    urgencyMessage: "Flash sale - 40% off luxury sleep sets!",
    stockLevel: "high",
    limitedQuantity: 456,

    occasions: ["self-care", "travel-gift", "sleep-improvement", "luxury-treat"],
    recipients: ["traveler", "light-sleeper", "luxury-lover", "wellness-seeker"],
    personalities: ["luxury-appreciator", "sleep-focused", "self-care-oriented", "quality-seeker"],
    relationships: ["self-care", "friendship", "romantic"],
    priceJustification: "Hotel-quality sleep luxury for the price of one night in a premium hotel",

    rating: 4.6,
    totalReviews: 5678,
    recentPurchases: 189,
    successRate: 91,
    viralMentions: ["Sleep TikTok", "Luxury Blogs"],

    giftWrapping: ["spa-luxury-box", "sleep-ritual-guide", "travel-case"],
    customization: ["silk-color", "personalization", "set-contents"],
    deliveryOptions: ["luxury-packaging", "spa-experience"],

    image_url: "https://images.unsplash.com/photo-1587222318667-31212ce2828d?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "under25"],
    tags: ["silk", "sleep-mask", "luxury", "travel", "spa-quality", "wellness"]
  },

  {
    id: 20,
    title: "Personalized Recipe Book Creation Kit",
    description: "Transform family recipes and cooking memories into a beautiful heirloom cookbook",
    price: 59.99,
    originalPrice: 89.99,
    category: "food",
    subcategory: "personalized",

    emotionalHook: "Turn their cooking legacy into a beautiful book that preserves family flavors and stories for generations",
    successStory: "Maria created a cookbook of her grandmother's recipes before she passed. Now the whole family cooks from it during holidays, and each dish brings back memories and stories. It's become the family's most treasured possession.",
    whyItMatters: "Food connects us to culture, memory, and love. This kit preserves not just recipes, but the stories and traditions that make meals meaningful",

    urgencyType: "seasonal",
    urgencyMessage: "Holiday family tradition season - memory preservation trending!",
    stockLevel: "medium",
    limitedQuantity: 178,

    occasions: ["family-gift", "memory-preservation", "cooking-enthusiast", "heritage"],
    recipients: ["family-cook", "memory-keeper", "grandparent", "foodie"],
    personalities: ["family-oriented", "traditional", "memory-focused", "cooking-passionate"],
    relationships: ["family", "generational"],
    priceJustification: "Priceless family history preservation in a beautiful, usable format",

    rating: 4.9,
    totalReviews: 2341,
    recentPurchases: 67,
    successRate: 96,
    viralMentions: ["Family TikTok", "Heritage Blogs"],

    giftWrapping: ["heritage-themed-box", "recipe-collection-guide", "preservation-tips"],
    customization: ["book-design", "recipe-layout", "family-photos", "story-sections"],
    deliveryOptions: ["heirloom-quality", "family-delivery"],

    image_url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&h=500&fit=crop&auto=format",
    collections: ["personalized", "under25"],
    tags: ["recipe-book", "family-heritage", "cooking", "personalized", "memory-preservation", "heirloom"]
  },

  // BEAUTY & SELF-CARE - Indulgent & Transformative
  {
    id: 21,
    title: "Professional LED Face Mask Therapy",
    description: "NASA-inspired light therapy that transforms skin from home - like having a spa dermatologist on call",
    price: 149.99,
    originalPrice: 199.99,
    category: "beauty",
    subcategory: "skincare",

    emotionalHook: "Watch them glow with confidence as their skin transforms into the radiant complexion they've always dreamed of",
    successStory: "Jessica struggled with acne scars for years. After 3 months with this device, her skin completely transformed. She now takes selfies confidently and says it gave her back her self-esteem.",
    whyItMatters: "Confidence comes from feeling beautiful in your own skin. This device doesn't just improve appearance - it restores self-love and confidence",

    urgencyType: "trending",
    urgencyMessage: "Featured by skincare influencers - anti-aging technology trending!",
    stockLevel: "medium",
    limitedQuantity: 123,

    occasions: ["self-care", "birthday", "skincare-enthusiast", "confidence-boost"],
    recipients: ["skincare-lover", "anti-aging", "self-care-focused", "beauty-enthusiast"],
    personalities: ["beauty-conscious", "tech-adopter", "self-improvement", "confidence-seeking"],
    relationships: ["romantic", "friendship", "self-care"],
    priceJustification: "Professional dermatology treatments at home for fraction of clinic costs",

    rating: 4.7,
    totalReviews: 2876,
    recentPurchases: 78,
    successRate: 94,
    viralMentions: ["Skincare TikTok", "Beauty YouTube"],

    giftWrapping: ["spa-luxury-box", "skincare-routine-guide", "progress-tracking"],
    customization: ["treatment-intensity", "session-length"],
    deliveryOptions: ["skincare-consultation", "results-guarantee"],

    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop&auto=format",
    collections: ["trending", "luxury"],
    tags: ["led-therapy", "anti-aging", "skincare", "professional", "at-home-spa", "confidence"]
  },

  {
    id: 22,
    title: "Organic Essential Oils Luxury Collection",
    description: "12 pure essential oils that transform any space into an aromatherapy sanctuary",
    price: 67.99,
    originalPrice: 99.99,
    category: "beauty",
    subcategory: "aromatherapy",

    emotionalHook: "Give them the power to shift their mood with a single drop - stress to calm, tired to energized, chaos to zen",
    successStory: "Rachel uses different oils for different moods. Lavender for sleep, peppermint for energy, eucalyptus for focus. She says it's like having a personal mood therapist in tiny bottles.",
    whyItMatters: "Scent is directly connected to emotion and memory. This collection provides natural tools for emotional well-being and stress management",

    urgencyType: "seasonal",
    urgencyMessage: "Limited organic harvest collection - natural wellness trending!",
    stockLevel: "high",
    limitedQuantity: 298,

    occasions: ["stress-relief", "wellness-gift", "aromatherapy-lover", "self-care"],
    recipients: ["wellness-enthusiast", "stress-sufferer", "natural-living", "mood-enhancer"],
    personalities: ["wellness-focused", "natural-lifestyle", "stress-manager", "sensory-oriented"],
    relationships: ["caring", "wellness-support", "friendship"],
    priceJustification: "Therapeutic-grade oils that replace expensive spa treatments and mood medications",

    rating: 4.8,
    totalReviews: 4321,
    recentPurchases: 156,
    successRate: 95,
    viralMentions: ["Wellness TikTok", "Natural Living Blogs"],

    giftWrapping: ["wellness-collection-box", "aromatherapy-guide", "blend-recipes"],
    customization: ["scent-preferences", "mood-focus", "concentration-levels"],
    deliveryOptions: ["wellness-consultation", "refill-program"],

    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format",
    collections: ["wellness", "under25"],
    tags: ["essential-oils", "aromatherapy", "organic", "wellness", "mood-enhancement", "natural"]
  },

  // GAMING & ENTERTAINMENT - Immersive & Social
  {
    id: 23,
    title: "Wireless Gaming Headset Pro",
    description: "7.1 surround sound that makes every game feel like a cinematic experience",
    price: 119.99,
    originalPrice: 169.99,
    category: "tech",
    subcategory: "gaming",

    emotionalHook: "Transform them from player to champion - hear every footstep, every whisper, every victory with crystal clarity",
    successStory: "Jake's gaming performance improved dramatically with spatial audio. He went from casual player to tournament qualifier and says the competitive edge comes from hearing details others miss.",
    whyItMatters: "Gaming is about immersion and competition. Superior audio doesn't just enhance entertainment - it provides competitive advantage and deeper engagement",

    urgencyType: "limited",
    urgencyMessage: "Gaming tournament edition - only 67 pro sets remaining!",
    stockLevel: "low",
    limitedQuantity: 67,

    occasions: ["gamer-gift", "competitive-gaming", "birthday", "achievement-reward"],
    recipients: ["gamer", "competitor", "streamer", "audio-enthusiast"],
    personalities: ["competitive", "performance-focused", "immersion-seeker", "tech-enthusiast"],
    relationships: ["friendship", "family", "gaming-community"],
    priceJustification: "Professional gaming equipment that enhances performance and enjoyment",

    rating: 4.6,
    totalReviews: 5467,
    recentPurchases: 123,
    successRate: 92,
    viralMentions: ["Gaming YouTube", "Twitch Streamers"],

    giftWrapping: ["gaming-pro-box", "setup-optimization", "tournament-tips"],
    customization: ["eq-settings", "mic-sensitivity", "comfort-fit"],
    deliveryOptions: ["gaming-setup", "pro-configuration"],

    image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&h=500&fit=crop&auto=format",
    collections: ["gaming", "trending"],
    tags: ["gaming-headset", "wireless", "surround-sound", "competitive", "pro-gaming", "immersive"]
  },

  {
    id: 24,
    title: "Retro Arcade Gaming Console",
    description: "500+ classic games that bring back the magic of childhood gaming",
    price: 89.99,
    originalPrice: 129.99,
    category: "tech",
    subcategory: "retro-gaming",

    emotionalHook: "Gift them a time machine to their happiest gaming memories - where every game was an adventure and every level was pure joy",
    successStory: "Tom and his dad now have weekly gaming sessions playing the same games they enjoyed 30 years ago. It's bridged the generational gap and created new memories from old favorites.",
    whyItMatters: "Nostalgia isn't just remembering - it's feeling joy again. This console reconnects people with simpler times and pure fun",

    urgencyType: "trending",
    urgencyMessage: "Nostalgia gaming viral trend - retro enthusiasts buying fast!",
    stockLevel: "medium",
    limitedQuantity: 189,

    occasions: ["nostalgic-gift", "family-gaming", "birthday", "generational-bonding"],
    recipients: ["retro-gamer", "family", "nostalgia-lover", "classic-gaming-fan"],
    personalities: ["nostalgic", "family-oriented", "classic-gaming", "simple-pleasure"],
    relationships: ["family", "generational", "friendship"],
    priceJustification: "Hundreds of classic games for less than the cost of a few modern titles",

    rating: 4.7,
    totalReviews: 3421,
    recentPurchases: 98,
    successRate: 94,
    viralMentions: ["Retro Gaming YouTube", "Nostalgia TikTok"],

    giftWrapping: ["retro-themed-box", "gaming-history", "family-gaming-guide"],
    customization: ["game-favorites", "difficulty-levels"],
    deliveryOptions: ["family-setup", "multi-generational"],

    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=500&fit=crop&auto=format",
    collections: ["retro", "family"],
    tags: ["retro-gaming", "classic-games", "nostalgia", "family-fun", "arcade", "vintage"]
  },

  // LUXURY FASHION - Statement & Sophisticated
  {
    id: 25,
    title: "Italian Leather Briefcase Heritage Collection",
    description: "Handcrafted Tuscan leather briefcase that gets more beautiful with every business victory",
    price: 249.99,
    originalPrice: 349.99,
    category: "fashion",
    subcategory: "luxury-accessories",

    emotionalHook: "Every business meeting becomes more confident, every handshake more powerful, every day more successful with this symbol of achievement",
    successStory: "Marcus carried this briefcase to his biggest client presentation and landed the deal. He says the briefcase made him feel like the successful executive he was becoming. Two years later, it's weathered beautifully and carries stories of victories.",
    whyItMatters: "Professional image affects opportunities and confidence. This briefcase isn't just storage - it's a statement of competence and success",

    urgencyType: "exclusive",
    urgencyMessage: "Heritage collection exclusive access - luxury craftsmanship limited!",
    stockLevel: "low",
    limitedQuantity: 34,

    occasions: ["promotion", "graduation", "career-milestone", "professional-achievement"],
    recipients: ["professional", "executive", "graduate", "career-focused"],
    personalities: ["ambitious", "professional", "quality-appreciator", "success-oriented"],
    relationships: ["professional", "mentorship", "achievement"],
    priceJustification: "Investment piece that enhances professional image and lasts for decades",

    rating: 4.9,
    totalReviews: 876,
    recentPurchases: 23,
    successRate: 97,
    viralMentions: ["Professional Style Blogs", "LinkedIn"],

    giftWrapping: ["executive-presentation-box", "leather-care-kit", "success-story"],
    customization: ["monogramming", "interior-layout", "strap-options"],
    deliveryOptions: ["executive-service", "professional-presentation"],

    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "professional"],
    tags: ["italian-leather", "briefcase", "professional", "luxury", "heritage", "executive"]
  },

  {
    id: 26,
    title: "Artisan Silk Scarf Collection",
    description: "Three hand-painted silk scarves that transform any outfit into art",
    price: 129.99,
    originalPrice: 189.99,
    category: "fashion",
    subcategory: "accessories",

    emotionalHook: "Turn everyday outfits into fashion statements - each scarf tells a story of artisan craftsmanship and personal style",
    successStory: "Isabella wears a different scarf depending on her mood. Colleagues always compliment her style, and she feels like each scarf gives her a different confident personality. She says they're like wearable art that makes her feel sophisticated.",
    whyItMatters: "Style is self-expression. These scarves provide versatility and elegance, allowing personal reinvention through beautiful craftsmanship",

    urgencyType: "limited",
    urgencyMessage: "Artisan collection limited - handcrafted fashion selling fast!",
    stockLevel: "medium",
    limitedQuantity: 78,

    occasions: ["style-upgrade", "professional-wardrobe", "sophisticated-gift", "fashion-lover"],
    recipients: ["fashion-conscious", "professional-woman", "style-enthusiast", "art-lover"],
    personalities: ["style-conscious", "sophisticated", "artistic", "versatile"],
    relationships: ["romantic", "friendship", "professional"],
    priceJustification: "Three handcrafted pieces that multiply wardrobe options exponentially",

    rating: 4.8,
    totalReviews: 1234,
    recentPurchases: 56,
    successRate: 96,
    viralMentions: ["Fashion Instagram", "Style Blogs"],

    giftWrapping: ["fashion-collection-box", "styling-guide", "care-instructions"],
    customization: ["pattern-selection", "color-palette"],
    deliveryOptions: ["fashion-consultation", "styling-service"],

    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "fashion"],
    tags: ["silk-scarves", "artisan", "fashion", "handcrafted", "style", "versatile"]
  },

  // FOOD & GOURMET - Experiential & Artisanal
  {
    id: 27,
    title: "Gourmet Coffee Roasting Experience Kit",
    description: "Learn the art of coffee roasting from bean to perfect cup with master roaster guidance",
    price: 89.99,
    originalPrice: 139.99,
    category: "food",
    subcategory: "experiential",

    emotionalHook: "Transform them from coffee drinker to coffee artisan - where every morning cup becomes a moment of pride and craftsmanship",
    successStory: "Kevin went from instant coffee to roasting his own beans. His friends now come over just for his coffee, and he says the ritual of roasting has become his favorite meditation. He's saving money and drinking the best coffee of his life.",
    whyItMatters: "Coffee is ritual, community, and comfort. This kit elevates a daily habit into a skill, hobby, and source of pride",

    urgencyType: "seasonal",
    urgencyMessage: "Limited roasting season launch - coffee artisans joining fast!",
    stockLevel: "medium",
    limitedQuantity: 167,

    occasions: ["coffee-lover", "hobby-starter", "skill-building", "artisan-interest"],
    recipients: ["coffee-enthusiast", "learning-oriented", "hands-on-person", "quality-seeker"],
    personalities: ["craft-oriented", "quality-focused", "learning-enthusiast", "ritual-lover"],
    relationships: ["hobby-support", "skill-development", "friendship"],
    priceJustification: "Professional roasting skills and equipment that saves money on premium coffee",

    rating: 4.7,
    totalReviews: 2156,
    recentPurchases: 89,
    successRate: 93,
    viralMentions: ["Coffee YouTube", "Roasting Communities"],

    giftWrapping: ["artisan-coffee-box", "roasting-guide", "bean-selection"],
    customization: ["roast-preferences", "origin-selection", "equipment-level"],
    deliveryOptions: ["bean-subscription", "roasting-support"],

    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format",
    collections: ["experiential", "artisan"],
    tags: ["coffee-roasting", "artisan", "experiential", "skill-building", "gourmet", "craft"]
  },

  {
    id: 28,
    title: "Molecular Gastronomy Starter Kit",
    description: "Create restaurant-quality molecular gastronomy dishes that amaze and delight",
    price: 119.99,
    originalPrice: 179.99,
    category: "food",
    subcategory: "experiential",

    emotionalHook: "Transform their kitchen into a culinary laboratory where food becomes art and dinner becomes theater",
    successStory: "Chef-wannabe Lisa now creates dishes that look like science experiments but taste like heaven. Her dinner parties have become legendary events where guests experience food they've never imagined possible.",
    whyItMatters: "Cooking creativity brings joy and wonder. This kit transforms meal preparation into entertainment and artistry",

    urgencyType: "trending",
    urgencyMessage: "Culinary innovation trending - food scientists buying fast!",
    stockLevel: "low",
    limitedQuantity: 45,

    occasions: ["foodie-gift", "creative-cooking", "dinner-party-host", "culinary-adventure"],
    recipients: ["adventurous-cook", "foodie", "entertainment-host", "creative-person"],
    personalities: ["creative", "experimental", "entertainment-focused", "culinary-curious"],
    relationships: ["foodie-friendship", "creative-support", "entertaining"],
    priceJustification: "Professional molecular techniques for fraction of culinary school cost",

    rating: 4.6,
    totalReviews: 987,
    recentPurchases: 34,
    successRate: 91,
    viralMentions: ["Food TikTok", "Culinary YouTube"],

    giftWrapping: ["science-kitchen-box", "technique-videos", "recipe-collection"],
    customization: ["technique-focus", "difficulty-level", "dietary-restrictions"],
    deliveryOptions: ["culinary-support", "technique-tutorials"],

    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&auto=format",
    collections: ["experiential", "creative"],
    tags: ["molecular-gastronomy", "culinary-art", "food-science", "creative-cooking", "experimental", "gourmet"]
  },

  // KIDS & FAMILY - Educational & Fun
  {
    id: 29,
    title: "STEM Robotics Building Kit",
    description: "Build, code, and play with robots that teach engineering while having incredible fun",
    price: 79.99,
    originalPrice: 119.99,
    category: "kids",
    subcategory: "educational",

    emotionalHook: "Watch their eyes light up as they build their first robot and see their creation come to life through their own programming",
    successStory: "8-year-old Emma built her first robot and now wants to be an engineer. Her confidence in math and science has skyrocketed, and she spends hours creating new robot friends instead of watching TV.",
    whyItMatters: "STEM education shapes future opportunities. This kit makes learning feel like play while building critical thinking and confidence",

    urgencyType: "trending",
    urgencyMessage: "Educational technology trending - future engineers joining fast!",
    stockLevel: "high",
    limitedQuantity: 234,

    occasions: ["birthday", "educational-gift", "STEM-encouragement", "curious-kid"],
    recipients: ["curious-child", "future-engineer", "tech-interested-kid", "learning-focused"],
    personalities: ["curious", "builder", "problem-solver", "tech-interested"],
    relationships: ["parent-child", "educational-support", "family"],
    priceJustification: "Engineering education and entertainment that builds valuable future skills",

    rating: 4.8,
    totalReviews: 4567,
    recentPurchases: 167,
    successRate: 95,
    viralMentions: ["Educational TikTok", "Parent Blogs"],

    giftWrapping: ["STEM-learning-box", "parent-guide", "project-ideas"],
    customization: ["age-appropriate", "skill-level", "interest-focus"],
    deliveryOptions: ["educational-support", "learning-tracking"],

    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop&auto=format",
    collections: ["educational", "trending"],
    tags: ["STEM", "robotics", "educational", "coding", "engineering", "kids", "learning"]
  },

  {
    id: 30,
    title: "Family Board Game Adventure Collection",
    description: "Five award-winning games that transform family time into epic adventures and lasting memories",
    price: 69.99,
    originalPrice: 99.99,
    category: "kids",
    subcategory: "family-games",

    emotionalHook: "Reconnect your family through laughter, strategy, and shared victories - where every game night becomes a treasured memory",
    successStory: "The Johnson family was always on devices until they started weekly game nights. Now their kids choose family game time over screen time, and their relationships have deepened through fun and friendly competition.",
    whyItMatters: "Family connection creates emotional security and joy. These games provide structure for quality time and relationship building",

    urgencyType: "seasonal",
    urgencyMessage: "Family connection season - quality time collections trending!",
    stockLevel: "medium",
    limitedQuantity: 156,

    occasions: ["family-bonding", "screen-time-alternative", "holiday-family-time", "relationship-building"],
    recipients: ["families", "parents", "game-lovers", "connection-seekers"],
    personalities: ["family-oriented", "fun-loving", "competitive", "connection-focused"],
    relationships: ["family", "multi-generational", "bonding"],
    priceJustification: "Years of family entertainment and relationship building in one collection",

    rating: 4.9,
    totalReviews: 3421,
    recentPurchases: 123,
    successRate: 97,
    viralMentions: ["Family TikTok", "Parenting Blogs"],

    giftWrapping: ["family-fun-box", "game-night-guide", "snack-suggestions"],
    customization: ["age-ranges", "game-types", "family-size"],
    deliveryOptions: ["family-experience", "game-support"],

    image_url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop&auto=format",
    collections: ["family", "connection"],
    tags: ["board-games", "family-time", "connection", "entertainment", "strategy", "bonding"]
  },

  // PETS - Love & Care
  {
    id: 31,
    title: "Smart Pet Camera with Treat Dispenser",
    description: "Stay connected with your furry best friend and dispense love even when you're away",
    price: 99.99,
    originalPrice: 149.99,
    category: "pets",
    subcategory: "technology",

    emotionalHook: "Never miss a moment with your pet - see their happy face, hear their voice, and reward their good behavior from anywhere in the world",
    successStory: "Sarah travels for work and was heartbroken leaving her dog. Now she checks in daily, gives treats, and says her dog waits by the camera for their 'virtual playtime.' Both their separation anxiety disappeared.",
    whyItMatters: "Pets are family members who provide unconditional love. This camera maintains that bond even during necessary separations",

    urgencyType: "trending",
    urgencyMessage: "Pet technology trending - loving pet parents buying fast!",
    stockLevel: "medium",
    limitedQuantity: 178,

    occasions: ["pet-lover", "travel-frequently", "pet-anxiety", "new-pet-owner"],
    recipients: ["pet-owner", "traveler", "pet-anxious", "technology-adopter"],
    personalities: ["pet-devoted", "tech-savvy", "caring", "connection-focused"],
    relationships: ["pet-love", "caregiving", "family"],
    priceJustification: "Peace of mind and pet connection worth far more than pet-sitting costs",

    rating: 4.7,
    totalReviews: 2876,
    recentPurchases: 89,
    successRate: 94,
    viralMentions: ["Pet TikTok", "Dog Lover Communities"],

    giftWrapping: ["pet-love-box", "setup-guide", "training-tips"],
    customization: ["pet-size", "treat-preferences", "camera-angle"],
    deliveryOptions: ["pet-setup", "behavior-support"],

    image_url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop&auto=format",
    collections: ["pets", "technology"],
    tags: ["pet-camera", "smart-home", "pet-care", "technology", "connection", "treat-dispenser"]
  },

  // HEALTH & FITNESS - Motivation & Results
  {
    id: 32,
    title: "Smart Fitness Mirror Personal Trainer",
    description: "Transform any wall into a personal gym with AI-powered fitness coaching",
    price: 399.99,
    originalPrice: 599.99,
    category: "fitness",
    subcategory: "smart-equipment",

    emotionalHook: "Give them a personal trainer who never judges, never cancels, and helps them achieve their strongest, most confident self",
    successStory: "Mike went from couch potato to marathon runner using this mirror. Having a 'trainer' at home eliminated every excuse. He lost 40 pounds, gained confidence, and says working out became addictive when it became convenient.",
    whyItMatters: "Fitness transforms lives beyond physical appearance - it builds confidence, energy, and mental strength. This mirror eliminates barriers to consistent exercise",

    urgencyType: "limited",
    urgencyMessage: "Fitness revolution edition - only 23 smart mirrors left!",
    stockLevel: "low",
    limitedQuantity: 23,

    occasions: ["new-year-goals", "fitness-journey", "health-transformation", "motivation-boost"],
    recipients: ["fitness-beginner", "busy-professional", "gym-intimidated", "convenience-seeker"],
    personalities: ["goal-oriented", "convenience-focused", "health-conscious", "tech-adopter"],
    relationships: ["health-support", "motivation", "lifestyle"],
    priceJustification: "Personal trainer and gym membership for life at fraction of ongoing costs",

    rating: 4.8,
    totalReviews: 1432,
    recentPurchases: 34,
    successRate: 96,
    viralMentions: ["Fitness YouTube", "Health TikTok"],

    giftWrapping: ["fitness-transformation-box", "workout-plan", "nutrition-guide"],
    customization: ["fitness-level", "goal-setting", "workout-types"],
    deliveryOptions: ["fitness-setup", "coaching-support"],

    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&auto=format",
    collections: ["fitness", "luxury"],
    tags: ["smart-fitness", "personal-trainer", "home-gym", "ai-coaching", "motivation", "health"]
  },

  {
    id: 33,
    title: "Meditation Cushion with Guided App",
    description: "Create a sacred space for mindfulness with ergonomic design and expert meditation guidance",
    price: 49.99,
    originalPrice: 79.99,
    category: "wellness",
    subcategory: "meditation",

    emotionalHook: "Give them a daily escape to inner peace - where stress melts away and clarity emerges through gentle guidance",
    successStory: "Anna struggled with anxiety until she started daily meditation on this cushion. Six months later, her stress levels have plummeted, her sleep improved, and she feels more centered than ever. She calls it her 'peace pillow.'",
    whyItMatters: "Mental health is the foundation of everything. This cushion creates a dedicated space for stress relief and emotional well-being",

    urgencyType: "trending",
    urgencyMessage: "Mindfulness movement trending - mental wellness prioritized!",
    stockLevel: "high",
    limitedQuantity: 289,

    occasions: ["stress-relief", "mindfulness-journey", "mental-health-support", "wellness-gift"],
    recipients: ["stressed-person", "mindfulness-curious", "anxiety-sufferer", "wellness-seeker"],
    personalities: ["introspective", "wellness-focused", "stress-prone", "mindful"],
    relationships: ["caring-support", "wellness-journey", "mental-health"],
    priceJustification: "Mental health tool that replaces expensive therapy sessions with daily practice",

    rating: 4.6,
    totalReviews: 3421,
    recentPurchases: 156,
    successRate: 92,
    viralMentions: ["Wellness TikTok", "Mindfulness Blogs"],

    giftWrapping: ["zen-wellness-box", "meditation-guide", "mindfulness-journal"],
    customization: ["firmness-level", "height-adjustment", "color-choice"],
    deliveryOptions: ["wellness-support", "mindfulness-coaching"],

    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&auto=format",
    collections: ["wellness", "under25"],
    tags: ["meditation", "mindfulness", "stress-relief", "wellness", "mental-health", "zen"]
  },

  // OUTDOOR & ADVENTURE - Freedom & Discovery
  {
    id: 34,
    title: "Portable Solar Power Station",
    description: "Adventure without limits - clean energy that powers your devices anywhere nature calls",
    price: 179.99,
    originalPrice: 249.99,
    category: "outdoor",
    subcategory: "power-solutions",

    emotionalHook: "Give them the freedom to adventure anywhere while staying connected - where remote becomes accessible and off-grid becomes comfortable",
    successStory: "Trail photographer Jake can now spend weeks in remote locations capturing perfect shots. The solar station powers his camera gear indefinitely, letting him focus on art instead of battery anxiety. His best work comes from his longest adventures.",
    whyItMatters: "Modern adventure requires balancing technology with nature. This station enables longer, more comfortable outdoor experiences without environmental impact",

    urgencyType: "seasonal",
    urgencyMessage: "Adventure season launch - outdoor enthusiasts preparing for summer!",
    stockLevel: "medium",
    limitedQuantity: 134,

    occasions: ["outdoor-enthusiast", "camping-lover", "adventure-gift", "off-grid-living"],
    recipients: ["adventurer", "camper", "photographer", "outdoor-worker"],
    personalities: ["adventure-seeking", "self-sufficient", "environmentally-conscious", "freedom-loving"],
    relationships: ["adventure-support", "freedom-enabling", "outdoor-community"],
    priceJustification: "Unlimited outdoor power replacing expensive generator rentals and battery purchases",

    rating: 4.7,
    totalReviews: 1876,
    recentPurchases: 67,
    successRate: 94,
    viralMentions: ["Outdoor YouTube", "Adventure Blogs"],

    giftWrapping: ["adventure-ready-box", "outdoor-guide", "solar-optimization"],
    customization: ["power-capacity", "output-options", "portability-level"],
    deliveryOptions: ["adventure-support", "outdoor-consultation"],

    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format",
    collections: ["outdoor", "eco-friendly"],
    tags: ["solar-power", "outdoor", "portable", "adventure", "eco-friendly", "off-grid"]
  },

  {
    id: 35,
    title: "Stargazing Telescope with App Guide",
    description: "Unlock the universe with precision optics and AI-guided celestial navigation",
    price: 189.99,
    originalPrice: 269.99,
    category: "outdoor",
    subcategory: "astronomy",

    emotionalHook: "Transform night sky wonder into cosmic discovery - where every star becomes a story and every planet becomes an adventure",
    successStory: "Father-daughter duo Mark and Emma now have weekly stargazing dates. Emma can identify constellations and track planets, and Mark says these moments create the deepest conversations and strongest bonds they've ever shared.",
    whyItMatters: "Wonder and curiosity drive learning and connection. This telescope transforms abstract space into tangible discovery and family bonding",

    urgencyType: "seasonal",
    urgencyMessage: "Clear sky season optimal - astronomy enthusiasts preparing!",
    stockLevel: "medium",
    limitedQuantity: 89,

    occasions: ["astronomy-interest", "family-bonding", "educational-gift", "wonder-inspiring"],
    recipients: ["curious-person", "family", "space-enthusiast", "learning-lover"],
    personalities: ["curious", "wonder-seeking", "educational", "bonding-focused"],
    relationships: ["family", "educational-support", "wonder-sharing"],
    priceJustification: "Professional astronomy education and family bonding experiences for years",

    rating: 4.8,
    totalReviews: 2341,
    recentPurchases: 78,
    successRate: 95,
    viralMentions: ["Space YouTube", "Astronomy Communities"],

    giftWrapping: ["astronomy-explorer-box", "star-charts", "observation-journal"],
    customization: ["magnification-level", "portability", "app-features"],
    deliveryOptions: ["astronomy-support", "observation-guidance"],

    image_url: "https://images.unsplash.com/photo-1446776876262-1f2b3d3b4f2d?w=500&h=500&fit=crop&auto=format",
    collections: ["educational", "family"],
    tags: ["telescope", "astronomy", "stargazing", "educational", "family-bonding", "discovery"]
  },

  // CREATIVE & ARTISTIC - Expression & Skill
  {
    id: 36,
    title: "Digital Art Tablet Professional",
    description: "Transform digital creativity with pressure-sensitive precision that rivals traditional art",
    price: 159.99,
    originalPrice: 229.99,
    category: "arts",
    subcategory: "digital-art",

    emotionalHook: "Unleash their digital creativity with tools that respond to every nuance of artistic expression - where imagination becomes limitless",
    successStory: "Graphic designer Maria doubled her freelance income after upgrading to this tablet. The precision and pressure sensitivity allow her to create art that clients say 'feels more alive' than her previous digital work.",
    whyItMatters: "Digital art is the future of creative expression. This tablet removes technical barriers, letting creativity flow naturally into professional-quality work",

    urgencyType: "limited",
    urgencyMessage: "Professional artist edition - only 56 tablets left!",
    stockLevel: "low",
    limitedQuantity: 56,

    occasions: ["artist-gift", "creative-professional", "digital-art-interest", "skill-upgrading"],
    recipients: ["artist", "designer", "creative-professional", "art-student"],
    personalities: ["creative", "professional", "detail-oriented", "tech-artistic"],
    relationships: ["creative-support", "professional-development", "artistic-growth"],
    priceJustification: "Professional art tool that pays for itself through improved creative output",

    rating: 4.9,
    totalReviews: 1432,
    recentPurchases: 45,
    successRate: 97,
    viralMentions: ["Digital Art YouTube", "Design Communities"],

    giftWrapping: ["artist-professional-box", "software-bundle", "technique-tutorials"],
    customization: ["pressure-sensitivity", "size-preference", "software-compatibility"],
    deliveryOptions: ["artist-setup", "professional-support"],

    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop&auto=format",
    collections: ["professional", "creative"],
    tags: ["digital-art", "tablet", "professional", "creative", "precision", "artistic"]
  },

  // LUXURY EXPERIENCES - Memorable & Exclusive
  {
    id: 37,
    title: "Private Wine Tasting Master Class",
    description: "Become a wine connoisseur with exclusive tastings and sommelier secrets",
    price: 299.99,
    originalPrice: 449.99,
    category: "experiences",
    subcategory: "luxury-education",

    emotionalHook: "Transform them from wine drinker to wine expert - where every sip becomes sophisticated and every dinner becomes elevated",
    successStory: "Business executive Tom impressed major clients with his wine knowledge gained from this class. He says learning about wine opened doors professionally and personally, making him more confident at business dinners and social events.",
    whyItMatters: "Wine knowledge is cultural sophistication that enhances professional and social experiences. This education provides confidence and enjoyment for life",

    urgencyType: "exclusive",
    urgencyMessage: "Exclusive sommelier access - luxury education limited availability!",
    stockLevel: "low",
    limitedQuantity: 28,

    occasions: ["sophistication-gift", "wine-lover", "professional-development", "luxury-experience"],
    recipients: ["wine-enthusiast", "professional", "sophistication-seeker", "experience-lover"],
    personalities: ["sophisticated", "learning-oriented", "professional", "luxury-appreciator"],
    relationships: ["professional-support", "luxury-sharing", "sophistication"],
    priceJustification: "Lifetime wine expertise and confidence for fraction of sommelier course costs",

    rating: 4.9,
    totalReviews: 567,
    recentPurchases: 18,
    successRate: 98,
    viralMentions: ["Wine Blogs", "Luxury Lifestyle"],

    giftWrapping: ["luxury-experience-card", "wine-journal", "tasting-notes"],
    customization: ["wine-preferences", "knowledge-level", "experience-length"],
    deliveryOptions: ["luxury-coordination", "sommelier-connection"],

    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "experiences"],
    tags: ["wine-tasting", "sommelier", "luxury", "education", "sophistication", "experience"]
  },

  {
    id: 38,
    title: "Handcrafted Jewelry Making Workshop",
    description: "Create heirloom jewelry with ancient techniques and precious metals",
    price: 189.99,
    originalPrice: 289.99,
    category: "experiences",
    subcategory: "creative-workshop",

    emotionalHook: "Give them the ancient joy of creating beauty with their hands - where every piece becomes a story and every skill becomes eternal",
    successStory: "Retirement gift recipient Carol discovered a passion she never knew existed. She now creates jewelry for her entire family and says working with her hands has brought peace and purpose to her golden years.",
    whyItMatters: "Creating with hands connects us to ancient human traditions and provides meditative satisfaction that screen-based activities can't match",

    urgencyType: "seasonal",
    urgencyMessage: "Artisan workshop season - creative experiences trending!",
    stockLevel: "medium",
    limitedQuantity: 67,

    occasions: ["retirement-gift", "creative-awakening", "hands-on-learning", "artisan-interest"],
    recipients: ["creative-person", "retiree", "hands-on-learner", "jewelry-lover"],
    personalities: ["creative", "hands-on", "detail-oriented", "artistic"],
    relationships: ["creative-support", "skill-development", "artistic-growth"],
    priceJustification: "Lifetime artisan skills plus precious materials and expert instruction",

    rating: 4.8,
    totalReviews: 876,
    recentPurchases: 34,
    successRate: 95,
    viralMentions: ["Craft Communities", "Artisan Blogs"],

    giftWrapping: ["artisan-workshop-box", "technique-guide", "material-kit"],
    customization: ["metal-preference", "technique-focus", "skill-level"],
    deliveryOptions: ["workshop-coordination", "artisan-support"],

    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop&auto=format",
    collections: ["experiences", "artisan"],
    tags: ["jewelry-making", "workshop", "handcrafted", "artisan", "creative", "heirloom"]
  },

  // SMART HOME & AUTOMATION - Convenience & Future
  {
    id: 39,
    title: "Smart Home Security System Complete",
    description: "Professional-grade security with smart monitoring that protects what matters most",
    price: 199.99,
    originalPrice: 299.99,
    category: "tech",
    subcategory: "smart-home",

    emotionalHook: "Give them peace of mind that follows them everywhere - where home security becomes invisible protection and constant comfort",
    successStory: "Single mom Jennifer feels safe for the first time in years. The system alerts her to every visitor and she can see her kids arrive home safely from work. She says it's like having a guardian angel watching over her family.",
    whyItMatters: "Safety is fundamental to well-being. This system doesn't just protect property - it provides the peace of mind that lets families truly relax at home",

    urgencyType: "trending",
    urgencyMessage: "Home security trending - families prioritizing safety!",
    stockLevel: "medium",
    limitedQuantity: 145,

    occasions: ["new-home", "safety-concern", "family-protection", "peace-of-mind"],
    recipients: ["homeowner", "family", "safety-conscious", "tech-adopter"],
    personalities: ["security-minded", "family-protective", "tech-savvy", "peace-seeking"],
    relationships: ["family-safety", "protective-care", "home-security"],
    priceJustification: "Professional security monitoring for fraction of monthly service costs",

    rating: 4.8,
    totalReviews: 3421,
    recentPurchases: 123,
    successRate: 96,
    viralMentions: ["Home Security Reviews", "Family Safety Blogs"],

    giftWrapping: ["security-protection-box", "installation-guide", "family-safety-tips"],
    customization: ["coverage-area", "monitoring-level", "alert-preferences"],
    deliveryOptions: ["professional-installation", "security-consultation"],

    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format",
    collections: ["smart-home", "family"],
    tags: ["home-security", "smart-monitoring", "family-safety", "peace-of-mind", "protection", "automation"]
  },

  {
    id: 40,
    title: "Voice-Controlled Smart Lighting System",
    description: "Transform any space with lighting that responds to mood, schedule, and voice commands",
    price: 129.99,
    originalPrice: 189.99,
    category: "tech",
    subcategory: "smart-home",

    emotionalHook: "Give them the power to create perfect ambiance with just their voice - where lighting becomes an extension of emotion and lifestyle",
    successStory: "Interior designer Alex uses voice control to create different moods for clients instantly. Soft lighting for relaxation, bright white for productivity, colorful for entertainment. Clients are amazed by the instant atmosphere transformation.",
    whyItMatters: "Lighting affects mood, productivity, and well-being. Smart control makes optimizing environment effortless and enjoyable",

    urgencyType: "seasonal",
    urgencyMessage: "Smart home autumn setup - cozy lighting season trending!",
    stockLevel: "high",
    limitedQuantity: 267,

    occasions: ["home-improvement", "mood-enhancement", "smart-home-starter", "ambiance-lover"],
    recipients: ["homeowner", "mood-conscious", "tech-enthusiast", "ambiance-creator"],
    personalities: ["atmosphere-focused", "convenience-loving", "tech-adopter", "mood-sensitive"],
    relationships: ["home-improvement", "comfort-enhancing", "lifestyle"],
    priceJustification: "Professional lighting design control for fraction of designer consultation costs",

    rating: 4.6,
    totalReviews: 4567,
    recentPurchases: 189,
    successRate: 93,
    viralMentions: ["Smart Home TikTok", "Interior Design Blogs"],

    giftWrapping: ["smart-home-box", "setup-tutorial", "mood-lighting-guide"],
    customization: ["room-coverage", "color-options", "brightness-range"],
    deliveryOptions: ["smart-setup", "lighting-consultation"],

    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format",
    collections: ["smart-home", "trending"],
    tags: ["smart-lighting", "voice-control", "mood-lighting", "home-automation", "ambiance", "convenience"]
  },

  // MUSIC & AUDIO - Immersive & Emotional
  {
    id: 41,
    title: "Vintage Vinyl Record Player Modern",
    description: "Classic vinyl warmth meets modern convenience - where music becomes a ritual of pure joy",
    price: 179.99,
    originalPrice: 249.99,
    category: "music",
    subcategory: "audio-equipment",

    emotionalHook: "Rediscover music as it was meant to be heard - where every album becomes an event and every song tells a richer story",
    successStory: "Music lover David started collecting vinyl after getting this turntable. He says digital music feels flat now compared to the warmth and ritual of vinyl. His Sunday morning coffee and vinyl sessions have become his favorite life moments.",
    whyItMatters: "Music shapes emotions and memories. Vinyl listening creates intentional, immersive experiences that digital streaming can't replicate",

    urgencyType: "trending",
    urgencyMessage: "Vinyl revival trending - music purists rediscovering analog warmth!",
    stockLevel: "medium",
    limitedQuantity: 156,

    occasions: ["music-lover", "nostalgia-gift", "vinyl-collector", "audio-enthusiast"],
    recipients: ["music-enthusiast", "vinyl-collector", "nostalgia-lover", "audio-purist"],
    personalities: ["music-passionate", "quality-appreciator", "ritual-loving", "nostalgic"],
    relationships: ["music-sharing", "quality-appreciation", "cultural"],
    priceJustification: "Lifetime music enjoyment enhancement that makes every album a premium experience",

    rating: 4.7,
    totalReviews: 2156,
    recentPurchases: 89,
    successRate: 94,
    viralMentions: ["Music YouTube", "Vinyl Communities"],

    giftWrapping: ["vintage-music-box", "vinyl-care-guide", "album-recommendations"],
    customization: ["cartridge-quality", "connectivity-options", "aesthetic-style"],
    deliveryOptions: ["audio-setup", "vinyl-starter-pack"],

    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&auto=format",
    collections: ["music", "vintage"],
    tags: ["vinyl", "turntable", "analog-audio", "music-ritual", "vintage", "high-fidelity"]
  },

  {
    id: 42,
    title: "Wireless Surround Sound System",
    description: "Transform any room into a concert hall with cinema-quality audio that follows you",
    price: 299.99,
    originalPrice: 449.99,
    category: "music",
    subcategory: "audio-systems",

    emotionalHook: "Immerse them in sound so rich and detailed that every movie becomes epic and every song becomes emotional",
    successStory: "Home theater enthusiast Carlos says this system made him fall in love with movies again. The surround sound is so immersive that friends prefer watching movies at his place over going to theaters. It's transformed his living room into entertainment central.",
    whyItMatters: "Audio quality transforms entertainment from passive consumption to emotional experience. Great sound creates lasting memories",

    urgencyType: "limited",
    urgencyMessage: "Premium audio edition - only 67 systems remaining!",
    stockLevel: "low",
    limitedQuantity: 67,

    occasions: ["home-theater", "music-lover", "entertainment-upgrade", "audio-enthusiast"],
    recipients: ["entertainment-lover", "audio-enthusiast", "movie-fan", "music-passionate"],
    personalities: ["quality-focused", "entertainment-oriented", "immersion-seeking", "social-host"],
    relationships: ["entertainment-sharing", "social-hosting", "quality-appreciation"],
    priceJustification: "Theater-quality audio system for fraction of professional installation costs",

    rating: 4.8,
    totalReviews: 1432,
    recentPurchases: 45,
    successRate: 96,
    viralMentions: ["Home Theater YouTube", "Audio Communities"],

    giftWrapping: ["premium-audio-box", "setup-optimization", "acoustic-guide"],
    customization: ["room-acoustics", "power-output", "connectivity-options"],
    deliveryOptions: ["audio-installation", "acoustic-tuning"],

    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "entertainment"],
    tags: ["surround-sound", "wireless-audio", "home-theater", "premium-audio", "immersive", "entertainment"]
  },

  // LUXURY ACCESSORIES - Sophisticated & Timeless
  {
    id: 43,
    title: "Premium Fountain Pen Collection",
    description: "Experience the lost art of beautiful writing with instruments that inspire eloquence",
    price: 149.99,
    originalPrice: 219.99,
    category: "luxury",
    subcategory: "writing-instruments",

    emotionalHook: "Transform writing from task to art - where every signature becomes elegant and every note becomes meaningful",
    successStory: "Executive Patricia started using fountain pens for important documents and found that the slower, more deliberate writing improved her thinking. Colleagues notice her handwritten notes have a personal touch that makes communications more impactful.",
    whyItMatters: "In a digital world, handwritten communication stands out as personal and thoughtful. Quality writing instruments make the act of writing pleasurable",

    urgencyType: "exclusive",
    urgencyMessage: "Executive collection exclusive - limited luxury craftsmanship!",
    stockLevel: "low",
    limitedQuantity: 45,

    occasions: ["executive-gift", "graduation", "professional-milestone", "writing-enthusiast"],
    recipients: ["professional", "executive", "writer", "quality-appreciator"],
    personalities: ["sophisticated", "detail-oriented", "traditional", "quality-focused"],
    relationships: ["professional-respect", "sophistication", "mentorship"],
    priceJustification: "Heirloom writing instruments that enhance professional image for decades",

    rating: 4.9,
    totalReviews: 567,
    recentPurchases: 23,
    successRate: 98,
    viralMentions: ["Executive Blogs", "Luxury Communities"],

    giftWrapping: ["luxury-writing-box", "calligraphy-guide", "premium-ink-set"],
    customization: ["nib-size", "engraving", "ink-color-preference"],
    deliveryOptions: ["executive-presentation", "writing-consultation"],

    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format",
    collections: ["luxury", "professional"],
    tags: ["fountain-pen", "luxury-writing", "professional", "sophisticated", "heirloom", "executive"]
  },

  {
    id: 44,
    title: "Handcrafted Leather Wallet Heritage",
    description: "A wallet that tells the story of craftsmanship and becomes more beautiful with every use",
    price: 89.99,
    originalPrice: 139.99,
    category: "fashion",
    subcategory: "accessories",

    emotionalHook: "Every time they reach for this wallet, they'll feel the quality and think of your thoughtfulness - a daily reminder of good taste",
    successStory: "Business owner James has carried the same handcrafted wallet for 8 years. It's developed a beautiful patina and holds memories from business trips worldwide. He says it feels like a trusted companion that gets better with age.",
    whyItMatters: "Quality accessories reflect personal values and create lasting impressions. A well-made wallet becomes part of daily identity",

    urgencyType: "limited",
    urgencyMessage: "Heritage craftsmanship limited - artisan leather collection selling fast!",
    stockLevel: "medium",
    limitedQuantity: 123,

    occasions: ["graduation", "professional-milestone", "father's-day", "quality-appreciation"],
    recipients: ["professional-man", "quality-appreciator", "traditional-style", "business-owner"],
    personalities: ["quality-focused", "traditional", "professional", "detail-oriented"],
    relationships: ["professional-respect", "quality-appreciation", "traditional"],
    priceJustification: "Lifetime accessory that improves with age and reflects quality standards",

    rating: 4.8,
    totalReviews: 2341,
    recentPurchases: 78,
    successRate: 95,
    viralMentions: ["Men's Style Blogs", "Leather Craft Communities"],

    giftWrapping: ["heritage-leather-box", "leather-care-guide", "craftsmanship-story"],
    customization: ["monogramming", "leather-color", "interior-layout"],
    deliveryOptions: ["artisan-presentation", "leather-care-kit"],

    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&auto=format",
    collections: ["heritage", "traditional"],
    tags: ["handcrafted", "leather-wallet", "heritage", "artisan", "quality", "traditional"]
  },

  // SUBSCRIPTION & ONGOING EXPERIENCES - Continuous Joy
  {
    id: 45,
    title: "Monthly Artisan Coffee Discovery",
    description: "A journey through world's finest coffee beans with stories from passionate farmers",
    price: 79.99,
    originalPrice: 119.99,
    category: "subscriptions",
    subcategory: "coffee",

    emotionalHook: "Transform their morning routine into a monthly adventure - where every cup transports them to a new coffee region",
    successStory: "Coffee enthusiast Maria looks forward to her monthly coffee delivery like Christmas morning. She's learned about farming practices worldwide and says each cup now tells a story of the farmers who grew it. Her coffee knowledge has made her the go-to expert among friends.",
    whyItMatters: "Subscription gifts provide ongoing joy and anticipation. Coffee subscriptions combine daily pleasure with cultural education",

    urgencyType: "seasonal",
    urgencyMessage: "Coffee harvest season - premium beans limited availability!",
    stockLevel: "high",
    limitedQuantity: 345,

    occasions: ["coffee-lover", "monthly-surprise", "cultural-exploration", "morning-ritual"],
    recipients: ["coffee-enthusiast", "cultural-curious", "quality-seeker", "routine-enhancer"],
    personalities: ["curious", "quality-appreciator", "culturally-interested", "routine-loving"],
    relationships: ["ongoing-thoughtfulness", "cultural-sharing", "quality-appreciation"],
    priceJustification: "Year of premium coffee exploration for less than weekly coffee shop visits",

    rating: 4.7,
    totalReviews: 4567,
    recentPurchases: 234,
    successRate: 94,
    viralMentions: ["Coffee Communities", "Subscription Blogs"],

    giftWrapping: ["coffee-exploration-box", "origin-maps", "tasting-journal"],
    customization: ["roast-preferences", "origin-focus", "grind-options"],
    deliveryOptions: ["monthly-surprise", "gift-messaging"],

    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format",
    collections: ["subscriptions", "cultural"],
    tags: ["coffee-subscription", "artisan", "monthly-delivery", "cultural-exploration", "premium", "ongoing"]
  },

  {
    id: 46,
    title: "Quarterly Book Club Surprise Box",
    description: "Curated literary adventures with discussion guides and author insights",
    price: 59.99,
    originalPrice: 89.99,
    category: "subscriptions",
    subcategory: "books",

    emotionalHook: "Feed their mind with quarterly literary surprises that spark conversations and expand perspectives",
    successStory: "Busy executive Lisa rediscovered her love of reading through this subscription. The carefully selected books and discussion guides helped her start a book club at work. She says it's brought intellectual stimulation back into her life and created deeper workplace relationships.",
    whyItMatters: "Reading enriches life and connects people through shared stories. Curated selections introduce readers to books they might never discover",

    urgencyType: "trending",
    urgencyMessage: "Literary community trending - mindful reading prioritized!",
    stockLevel: "medium",
    limitedQuantity: 189,

    occasions: ["book-lover", "intellectual-gift", "reading-encouragement", "literary-exploration"],
    recipients: ["reader", "intellectual", "book-club-member", "learning-lover"],
    personalities: ["intellectual", "curious", "literary", "discussion-oriented"],
    relationships: ["intellectual-connection", "learning-support", "cultural-sharing"],
    priceJustification: "Year of literary discovery and discussion for less than monthly bookstore visits",

    rating: 4.8,
    totalReviews: 1876,
    recentPurchases: 67,
    successRate: 96,
    viralMentions: ["Book Communities", "Literary Blogs"],

    giftWrapping: ["literary-exploration-box", "discussion-guides", "reading-journal"],
    customization: ["genre-preferences", "reading-level", "discussion-style"],
    deliveryOptions: ["quarterly-surprise", "book-club-support"],

    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop&auto=format",
    collections: ["subscriptions", "intellectual"],
    tags: ["book-subscription", "literary", "quarterly-delivery", "discussion", "curated", "intellectual"]
  },

  // HOBBY & SKILL DEVELOPMENT - Growth & Mastery
  {
    id: 47,
    title: "Professional Photography Course Kit",
    description: "Master photography from basics to advanced with professional equipment and expert instruction",
    price: 189.99,
    originalPrice: 279.99,
    category: "education",
    subcategory: "photography",

    emotionalHook: "Transform them from snapshot taker to visual storyteller - where every photo becomes a work of art",
    successStory: "Retirement gift recipient Frank discovered photography and now sells prints at local galleries. He says learning photography gave him a new purpose and way to see beauty in everyday moments. His family treasures the professional-quality photos he now takes at gatherings.",
    whyItMatters: "Photography teaches us to see beauty and capture memories professionally. This skill enriches life and preserves precious moments",

    urgencyType: "limited",
    urgencyMessage: "Professional photography edition - only 78 complete kits left!",
    stockLevel: "low",
    limitedQuantity: 78,

    occasions: ["skill-development", "retirement-hobby", "creative-interest", "photography-enthusiasm"],
    recipients: ["creative-learner", "retiree", "photography-curious", "visual-artist"],
    personalities: ["creative", "detail-oriented", "patient", "observant"],
    relationships: ["skill-support", "creative-development", "learning-encouragement"],
    priceJustification: "Professional photography education and equipment for fraction of formal course costs",

    rating: 4.8,
    totalReviews: 1432,
    recentPurchases: 45,
    successRate: 95,
    viralMentions: ["Photography YouTube", "Learning Communities"],

    giftWrapping: ["photography-learning-box", "technique-guides", "inspiration-book"],
    customization: ["skill-level", "photography-focus", "equipment-preference"],
    deliveryOptions: ["learning-support", "technique-consultation"],

    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop&auto=format",
    collections: ["education", "creative"],
    tags: ["photography-course", "professional-learning", "skill-development", "creative", "education", "visual-arts"]
  },

  {
    id: 48,
    title: "Gourmet Cooking Masterclass Series",
    description: "Learn professional cooking techniques from world-class chefs in your own kitchen",
    price: 149.99,
    originalPrice: 229.99,
    category: "education",
    subcategory: "culinary",

    emotionalHook: "Transform their kitchen into a culinary school where every meal becomes a masterpiece and every technique builds confidence",
    successStory: "Home cook Rachel went from basic meals to hosting dinner parties that friends rave about. The step-by-step video instruction and professional techniques gave her confidence to experiment. She now teaches cooking classes in her community.",
    whyItMatters: "Cooking skills provide daily satisfaction and enable generosity through feeding others. Professional techniques elevate everyday cooking to art",

    urgencyType: "seasonal",
    urgencyMessage: "Holiday cooking season - culinary skills trending for entertaining!",
    stockLevel: "medium",
    limitedQuantity: 156,

    occasions: ["cooking-enthusiast", "skill-building", "entertaining-improvement", "culinary-interest"],
    recipients: ["home-cook", "entertainer", "culinary-curious", "skill-builder"],
    personalities: ["creative", "hospitable", "detail-oriented", "learning-focused"],
    relationships: ["culinary-support", "entertaining-enhancement", "skill-development"],
    priceJustification: "Professional culinary education for fraction of cooking school tuition",

    rating: 4.7,
    totalReviews: 2876,
    recentPurchases: 123,
    successRate: 93,
    viralMentions: ["Cooking YouTube", "Culinary Communities"],

    giftWrapping: ["chef-training-box", "recipe-collection", "technique-videos"],
    customization: ["cuisine-focus", "skill-level", "dietary-preferences"],
    deliveryOptions: ["culinary-support", "chef-consultation"],

    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&auto=format",
    collections: ["education", "culinary"],
    tags: ["cooking-course", "culinary-education", "chef-techniques", "skill-development", "gourmet", "masterclass"]
  },

  // MINDFULNESS & SPIRITUALITY - Inner Peace & Growth
  {
    id: 49,
    title: "Zen Garden Creation Kit Complete",
    description: "Create a personal sanctuary for meditation and mindful moments",
    price: 69.99,
    originalPrice: 109.99,
    category: "wellness",
    subcategory: "mindfulness",

    emotionalHook: "Give them a daily escape to tranquility - where stress dissolves through the simple act of creating patterns in sand",
    successStory: "Stressed executive Mark created his zen garden on his office desk. Taking 5 minutes to rake patterns helps him reset between meetings. Colleagues say he's become noticeably calmer and more focused. He calls it his 'desktop vacation.'",
    whyItMatters: "Mindfulness practices reduce stress and increase focus. A zen garden provides a tactile, meditative experience that grounds the mind",

    urgencyType: "trending",
    urgencyMessage: "Mindfulness practices trending - stress relief prioritized!",
    stockLevel: "high",
    limitedQuantity: 267,

    occasions: ["stress-relief", "mindfulness-journey", "office-wellness", "meditation-practice"],
    recipients: ["stressed-professional", "mindfulness-practitioner", "meditation-curious", "wellness-seeker"],
    personalities: ["stress-prone", "mindful", "introspective", "peace-seeking"],
    relationships: ["wellness-support", "stress-relief", "mindfulness-encouragement"],
    priceJustification: "Daily stress relief and mindfulness practice for less than single therapy session",

    rating: 4.6,
    totalReviews: 3421,
    recentPurchases: 156,
    successRate: 92,
    viralMentions: ["Wellness TikTok", "Mindfulness Blogs"],

    giftWrapping: ["zen-wellness-box", "mindfulness-guide", "meditation-tips"],
    customization: ["garden-size", "sand-type", "accessory-selection"],
    deliveryOptions: ["wellness-setup", "mindfulness-consultation"],

    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format",
    collections: ["wellness", "mindfulness"],
    tags: ["zen-garden", "mindfulness", "stress-relief", "meditation", "tranquility", "office-wellness"]
  },

  {
    id: 50,
    title: "Crystal Healing Collection Starter",
    description: "Discover the ancient practice of crystal healing with authentic stones and guidance",
    price: 79.99,
    originalPrice: 119.99,
    category: "wellness",
    subcategory: "spiritual",

    emotionalHook: "Connect them to earth's natural energy through beautiful crystals that inspire calm and positive intention",
    successStory: "Wellness enthusiast Emma started with this collection and found that holding different crystals during meditation deepened her practice. She says each stone has its own energy that helps her focus on different healing intentions. Her meditation space has become a sanctuary.",
    whyItMatters: "Whether through belief or beauty, crystals provide focal points for intention-setting and mindfulness practice",

    urgencyType: "seasonal",
    urgencyMessage: "Spiritual wellness trending - natural healing prioritized!",
    stockLevel: "medium",
    limitedQuantity: 189,

    occasions: ["spiritual-journey", "wellness-exploration", "mindfulness-practice", "healing-support"],
    recipients: ["spiritual-seeker", "wellness-enthusiast", "meditation-practitioner", "natural-healing"],
    personalities: ["spiritual", "wellness-focused", "intuitive", "nature-connected"],
    relationships: ["spiritual-support", "wellness-journey", "healing-encouragement"],
    priceJustification: "Complete crystal education and collection for less than individual healing session costs",

    rating: 4.5,
    totalReviews: 1876,
    recentPurchases: 89,
    successRate: 89,
    viralMentions: ["Spiritual TikTok", "Wellness Communities"],

    giftWrapping: ["spiritual-wellness-box", "crystal-guide", "intention-journal"],
    customization: ["crystal-selection", "healing-focus", "practice-level"],
    deliveryOptions: ["spiritual-consultation", "healing-guidance"],

    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format",
    collections: ["wellness", "spiritual"],
    tags: ["crystal-healing", "spiritual", "wellness", "mindfulness", "natural-healing", "meditation"]
  }
];

// Gift Collections for Easy Discovery
export const giftGuides = {
  "viral-tiktok-gifts": {
    title: "Viral TikTok Gifts Everyone Wants",
    description: "The gifts breaking the internet and flying off shelves",
    giftIds: [16, 17, 18, 1, 12, 22, 33, 40],
    urgency: "These are selling out fast due to viral popularity!",
    badge: "🔥 TRENDING"
  },

  "luxury-memories": {
    title: "Luxury Gifts That Create Lasting Memories",
    description: "Investment pieces that become family heirlooms",
    giftIds: [5, 8, 9, 15, 25, 32, 37, 42, 43],
    urgency: "Limited luxury editions - exclusive access ending soon!",
    badge: "💎 LUXURY"
  },

  "under-50-expensive": {
    title: "Gifts Under $50 That Feel Expensive",
    description: "Budget-friendly gifts with premium appeal",
    giftIds: [19, 14, 20, 16, 6, 33, 49, 22],
    urgency: "Flash pricing - luxury experience at fraction of cost!",
    badge: "💰 VALUE"
  },

  "last-minute-wow": {
    title: "Last-Minute Gifts That Don't Look Last-Minute",
    description: "Quick shipping gifts that still create wow moments",
    giftIds: [1, 16, 19, 6, 12, 22, 40, 44],
    urgency: "Express shipping available - still time for perfect gift!",
    badge: "⚡ QUICK SHIP"
  },

  "emotional-connection": {
    title: "Personalized Gifts That Make Them Cry Happy Tears",
    description: "Custom gifts that show how much you really care",
    giftIds: [4, 14, 20, 8, 9, 38, 47, 50],
    urgency: "Custom order deadlines approaching - secure your date now!",
    badge: "❤️ PERSONAL"
  },

  "tech-innovators": {
    title: "Tech Gifts for Digital Pioneers",
    description: "Cutting-edge technology that impresses tech enthusiasts",
    giftIds: [1, 2, 3, 23, 31, 32, 39, 40],
    urgency: "Latest tech selling fast - early adopters buying now!",
    badge: "🚀 TECH"
  },

  "wellness-sanctuary": {
    title: "Wellness Gifts for Mind, Body & Soul",
    description: "Self-care essentials that restore and rejuvenate",
    giftIds: [6, 12, 17, 21, 22, 33, 49, 50],
    urgency: "Wellness trending - self-care prioritized globally!",
    badge: "🧘 WELLNESS"
  },

  "creative-souls": {
    title: "Creative Gifts for Artistic Expression",
    description: "Tools and experiences that unleash creativity",
    giftIds: [11, 13, 27, 28, 36, 38, 47, 48],
    urgency: "Creative renaissance happening - artistic tools in demand!",
    badge: "🎨 CREATIVE"
  },

  "home-transformation": {
    title: "Home Gifts That Transform Spaces",
    description: "Smart solutions that make homes more beautiful and functional",
    giftIds: [2, 6, 7, 18, 39, 40, 41, 42],
    urgency: "Home improvement season - comfort upgrades trending!",
    badge: "🏠 HOME"
  },

  "experience-collectors": {
    title: "Experience Gifts That Create Stories",
    description: "Memorable adventures and learning opportunities",
    giftIds: [8, 9, 37, 38, 45, 46, 47, 48],
    urgency: "Experience gifts booking fast - memories over materials!",
    badge: "🌟 EXPERIENCE"
  },

  "subscription-surprises": {
    title: "Subscription Gifts That Keep Giving",
    description: "Monthly joy delivered with curated surprises",
    giftIds: [45, 46],
    urgency: "Limited subscription spots - ongoing joy in high demand!",
    badge: "📦 ONGOING"
  },

  "family-bonding": {
    title: "Family Gifts That Bring Everyone Together",
    description: "Gifts that create connection and shared memories",
    giftIds: [24, 29, 30, 35, 39, 41],
    urgency: "Family time precious - connection gifts prioritized!",
    badge: "👨‍👩‍👧‍👦 FAMILY"
  }
};

// Social Proof Data
export const socialProof = {
  totalHappyCustomers: 127834,
  averageRating: 4.8,
  giftsSentThisMonth: 23567,
  viralMentions: 2340000,
  celebrityEndorsements: 47,
  satisfactionRate: 97.3
};

// Urgency Messaging System
export const createUrgency = (gift) => {
  const urgencyMessages = {
    stock: `Only ${gift.limitedQuantity} left in stock!`,
    viral: `Viral on social media - ${gift.recentPurchases} bought in last 24 hours!`,
    seasonal: "Limited seasonal availability - won't be back until next year!",
    custom: `Custom orders closing in ${gift.customOrderDeadline}!`,
    flash: "Flash sale ending in hours - save while you can!"
  };

  return urgencyMessages[gift.urgencyType] || "High demand item - order soon!";
};

export default gifts;