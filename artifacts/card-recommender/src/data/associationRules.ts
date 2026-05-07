export type AssociationRule = {
  id: string;
  antecedent: string[]; 
  consequent: string[]; 
  support: number;      
  confidence: number;   
  lift: number;         
  description: string;  
  applicable_card_types: string[];
};

export type UserPreferencePattern = {
  id: string;
  preferences: string[];
  recommended_card_types: string[];
  recommended_tags: string[];
  explanation: string;
};

export const associationRules: AssociationRule[] = [
  {
    id: "r1",
    antecedent: ["fuel", "cashback"],
    consequent: ["high_cashback_cards"],
    support: 0.45,
    confidence: 0.78,
    lift: 1.6,
    description: "Users who spend frequently on fuel and prefer cashback usually opt for high-cashback fuel cards.",
    applicable_card_types: ["Fuel", "Cashback"]
  },
  {
    id: "r2",
    antecedent: ["travel", "lounge_access"],
    consequent: ["premium"],
    support: 0.38,
    confidence: 0.85,
    lift: 2.1,
    description: "Frequent travelers seeking lounge access show a strong affinity for Premium tier cards.",
    applicable_card_types: ["Premium", "Travel"]
  },
  {
    id: "r3",
    antecedent: ["student", "zero_annual_fee"],
    consequent: ["low_income_requirement"],
    support: 0.52,
    confidence: 0.91,
    lift: 1.8,
    description: "Students looking for zero annual fee cards typically need cards with zero minimum income requirements.",
    applicable_card_types: ["Student", "Virtual"]
  },
  {
    id: "r4",
    antecedent: ["online_shopping", "cashback"],
    consequent: ["high_cashback_cards"],
    support: 0.61,
    confidence: 0.88,
    lift: 1.7,
    description: "Online shoppers strongly prefer high cashback return rates over reward points.",
    applicable_card_types: ["Cashback", "Shopping", "Credit"]
  },
  {
    id: "r5",
    antecedent: ["dining", "entertainment"],
    consequent: ["reward_points"],
    support: 0.42,
    confidence: 0.76,
    lift: 1.5,
    description: "Users spending on lifestyle (dining and entertainment) generally benefit from accelerated reward point programs.",
    applicable_card_types: ["Shopping", "Credit", "Premium"]
  },
  {
    id: "r6",
    antecedent: ["travel", "premium"],
    consequent: ["lounge_access", "reward_points"],
    support: 0.35,
    confidence: 0.89,
    lift: 2.2,
    description: "Premium users who travel heavily demand unlimited lounge access and high reward multipliers.",
    applicable_card_types: ["Premium"]
  },
  {
    id: "r7",
    antecedent: ["shopping", "zero_annual_fee"],
    consequent: ["cashback"],
    support: 0.48,
    confidence: 0.81,
    lift: 1.4,
    description: "Budget-conscious shoppers prefer direct cashback rather than dealing with reward point catalogs.",
    applicable_card_types: ["Cashback"]
  },
  {
    id: "r8",
    antecedent: ["fuel", "travel"],
    consequent: ["reward_points"],
    support: 0.30,
    confidence: 0.72,
    lift: 1.3,
    description: "Road trippers benefit from cards that offer rewards convertible to travel benefits.",
    applicable_card_types: ["Fuel", "Travel"]
  },
  {
    id: "r9",
    antecedent: ["student", "online_shopping"],
    consequent: ["zero_annual_fee"],
    support: 0.55,
    confidence: 0.94,
    lift: 1.9,
    description: "Students who shop online almost exclusively choose cards with no recurring annual fees.",
    applicable_card_types: ["Student", "Virtual"]
  },
  {
    id: "r10",
    antecedent: ["dining", "lounge_access"],
    consequent: ["premium"],
    support: 0.33,
    confidence: 0.79,
    lift: 1.8,
    description: "Lifestyle-focused users who enjoy dining out and airport lounges lean towards premium offerings.",
    applicable_card_types: ["Premium", "Credit"]
  },
  {
    id: "r11",
    antecedent: ["reward_points", "shopping"],
    consequent: ["dining"],
    support: 0.40,
    confidence: 0.74,
    lift: 1.5,
    description: "Users maximizing reward points on shopping often use the same cards for dining benefits.",
    applicable_card_types: ["Shopping", "Credit"]
  },
  {
    id: "r12",
    antecedent: ["cashback", "entertainment"],
    consequent: ["online_shopping"],
    support: 0.47,
    confidence: 0.86,
    lift: 1.7,
    description: "Cashback seekers paying for entertainment also use their cards extensively for e-commerce.",
    applicable_card_types: ["Cashback", "Credit"]
  },
  {
    id: "r13",
    antecedent: ["zero_annual_fee", "fuel"],
    consequent: ["cashback"],
    support: 0.39,
    confidence: 0.77,
    lift: 1.6,
    description: "Users looking for no-fee fuel cards prefer straightforward cashback on their commutes.",
    applicable_card_types: ["Fuel", "Cashback"]
  },
  {
    id: "r14",
    antecedent: ["travel", "reward_points"],
    consequent: ["lounge_access"],
    support: 0.51,
    confidence: 0.92,
    lift: 2.0,
    description: "Travelers collecting reward points consider airport lounge access a mandatory feature.",
    applicable_card_types: ["Travel", "Premium"]
  },
  {
    id: "r15",
    antecedent: ["premium", "online_shopping"],
    consequent: ["reward_points"],
    support: 0.44,
    confidence: 0.83,
    lift: 1.8,
    description: "High-net-worth online shoppers prefer luxury reward catalogs over direct statement credits.",
    applicable_card_types: ["Premium", "Credit"]
  },
  {
    id: "r16",
    antecedent: ["student", "entertainment"],
    consequent: ["online_shopping", "zero_annual_fee"],
    support: 0.46,
    confidence: 0.88,
    lift: 2.1,
    description: "Students buying movie tickets/gaming subscriptions strongly prefer free cards usable online.",
    applicable_card_types: ["Student", "Virtual"]
  },
  {
    id: "r17",
    antecedent: ["dining", "cashback"],
    consequent: ["shopping"],
    support: 0.41,
    confidence: 0.75,
    lift: 1.4,
    description: "Users preferring direct cashback on meals also seek it for general retail shopping.",
    applicable_card_types: ["Cashback", "Shopping"]
  },
  {
    id: "r18",
    antecedent: ["lounge_access", "zero_annual_fee"],
    consequent: ["online_shopping"],
    support: 0.28,
    confidence: 0.68,
    lift: 1.3,
    description: "A rare segment seeks free lounge access via zero-fee cards, usually tied to specific online platforms.",
    applicable_card_types: ["Credit", "Cashback"]
  },
  {
    id: "r19",
    antecedent: ["travel", "dining"],
    consequent: ["premium"],
    support: 0.36,
    confidence: 0.81,
    lift: 1.9,
    description: "Users spending heavily on hotels and restaurants naturally progress to premium lifestyle cards.",
    applicable_card_types: ["Premium", "Travel"]
  },
  {
    id: "r20",
    antecedent: ["fuel", "student"],
    consequent: ["zero_annual_fee"],
    support: 0.31,
    confidence: 0.84,
    lift: 1.7,
    description: "Students commuting locally prioritize zero maintenance fees above all other perks.",
    applicable_card_types: ["Student"]
  }
];

export const userPreferencePatterns: UserPreferencePattern[] = [
  {
    id: "p1",
    preferences: ["online_shopping", "cashback", "zero_annual_fee"],
    recommended_card_types: ["Cashback", "Virtual"],
    recommended_tags: ["high-cashback", "amazon", "flipkart"],
    explanation: "You prefer a straightforward, no-cost way to save money on daily internet purchases."
  },
  {
    id: "p2",
    preferences: ["travel", "lounge_access", "premium"],
    recommended_card_types: ["Premium", "Travel"],
    recommended_tags: ["unlimited-lounge", "priority-pass", "luxury"],
    explanation: "You value comfort and status while flying globally, making premium travel cards your best fit."
  },
  {
    id: "p3",
    preferences: ["student", "zero_annual_fee", "entertainment"],
    recommended_card_types: ["Student", "Virtual", "Debit"],
    recommended_tags: ["movies", "zero-annual-fee", "basic"],
    explanation: "As a student, you need a free, accessible card that gives you perks on movies and outings."
  },
  {
    id: "p4",
    preferences: ["fuel", "cashback"],
    recommended_card_types: ["Fuel"],
    recommended_tags: ["fuel", "low-fee"],
    explanation: "Your daily commute is a major expense; a co-branded fuel card will yield the highest returns."
  },
  {
    id: "p5",
    preferences: ["shopping", "dining", "entertainment", "reward_points"],
    recommended_card_types: ["Shopping", "Credit"],
    recommended_tags: ["dining", "lifestyle", "movies"],
    explanation: "You have a vibrant lifestyle. Accelerated reward points on going out will maximize your value."
  },
  {
    id: "p6",
    preferences: ["travel", "reward_points"],
    recommended_card_types: ["Travel", "Credit"],
    recommended_tags: ["air-miles", "flight-vouchers"],
    explanation: "You are a strategic traveler who can leverage reward points by converting them into air miles."
  },
  {
    id: "p7",
    preferences: ["online_shopping", "premium", "reward_points"],
    recommended_card_types: ["Premium"],
    recommended_tags: ["milestone-rewards", "luxury"],
    explanation: "Your high online spend makes you eligible for elite milestone rewards and luxury catalogs."
  },
  {
    id: "p8",
    preferences: ["zero_annual_fee", "dining", "cashback"],
    recommended_card_types: ["Cashback", "Debit"],
    recommended_tags: ["dining-offers", "zero-annual-fee"],
    explanation: "You want savings on eating out without committing to a recurring credit card fee."
  },
  {
    id: "p9",
    preferences: ["fuel", "travel", "lounge_access"],
    recommended_card_types: ["Travel", "Premium"],
    recommended_tags: ["all-rounder", "priority-pass"],
    explanation: "A frequent traveler by both road and air needs an all-rounder card with lounge and surcharge waivers."
  },
  {
    id: "p10",
    preferences: ["student", "online_shopping", "cashback"],
    recommended_card_types: ["Virtual", "Student"],
    recommended_tags: ["instant-issuance", "app-managed"],
    explanation: "A tech-savvy student needs a digital-first, instant-cashback card managed via mobile app."
  }
];
