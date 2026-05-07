import { Card } from "../data/cards";
import { AssociationRule } from "../data/associationRules";

export type UserPreferences = {
  cashback: boolean;
  travel: boolean;
  fuel: boolean;
  shopping: boolean;
  dining: boolean;
  entertainment: boolean;
  zero_annual_fee: boolean;
  reward_points: boolean;
  lounge_access: boolean;
  student: boolean;
  premium: boolean;
  online_shopping: boolean;
};

export type Recommendation = {
  card: Card;
  matchingPercentage: number;
  confidence: number;
  support: number;
  lift: number;
  reasons: string[];
  triggeredRules: AssociationRule[];
  score: number;
};

export function generateFrequentItemsets(transactions: string[][], minSupport: number): Map<string, number> {
  const itemCounts = new Map<string, number>();
  const totalTransactions = transactions.length;

  // Count 1-itemsets
  for (const t of transactions) {
    for (const item of t) {
      itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
    }
  }

  const frequentItemsets = new Map<string, number>();
  for (const [item, count] of itemCounts.entries()) {
    const support = count / totalTransactions;
    if (support >= minSupport) {
      frequentItemsets.set(item, support);
    }
  }
  // In a real Apriori, we would generate k-itemsets, but for frontend scope, 
  // we rely on the pre-mined rules in data files.
  return frequentItemsets;
}

export function generateAssociationRules(frequentItemsets: Map<string, number>, transactions: string[][], minConfidence: number): AssociationRule[] {
  // Mocked for the frontend implementation. We use pre-calculated rules from src/data/associationRules.ts.
  return [];
}

function getActivePreferences(prefs: UserPreferences): string[] {
  const active: string[] = [];
  if (prefs.cashback) active.push("cashback");
  if (prefs.travel) active.push("travel");
  if (prefs.fuel) active.push("fuel");
  if (prefs.shopping) active.push("shopping");
  if (prefs.dining) active.push("dining");
  if (prefs.entertainment) active.push("entertainment");
  if (prefs.zero_annual_fee) active.push("zero_annual_fee");
  if (prefs.reward_points) active.push("reward_points");
  if (prefs.lounge_access) active.push("lounge_access");
  if (prefs.student) active.push("student");
  if (prefs.premium) active.push("premium");
  if (prefs.online_shopping) active.push("online_shopping");
  return active;
}

export function calculateCardScore(card: Card, activePreferences: string[]): number {
  let score = 0;
  let matches = 0;
  
  if (activePreferences.includes("zero_annual_fee") && card.annual_fee === 0) matches++;
  if (activePreferences.includes("cashback") && card.cashback_percentage > 0) matches++;
  if (activePreferences.includes("reward_points") && card.reward_points_per_100 > 0) matches++;
  if (activePreferences.includes("travel") && card.travel_benefits) matches++;
  if (activePreferences.includes("lounge_access") && card.lounge_access) matches++;
  if (activePreferences.includes("fuel") && card.fuel_surcharge_waiver) matches++;
  if (activePreferences.includes("shopping") && card.shopping_benefits) matches++;
  if (activePreferences.includes("dining") && card.dining_benefits) matches++;
  if (activePreferences.includes("entertainment") && card.entertainment_benefits) matches++;
  if (activePreferences.includes("student") && card.card_type === "Student") matches++;
  if (activePreferences.includes("premium") && card.card_type === "Premium") matches++;
  if (activePreferences.includes("online_shopping") && card.tags.some(t => ["online-shopping", "amazon", "flipkart", "all-online-spends"].includes(t))) matches++;

  const maxPossible = activePreferences.length || 1;
  return (matches / maxPossible) * 100;
}

export function getRecommendations(preferences: UserPreferences, cards: Card[], rules: AssociationRule[]): Recommendation[] {
  const activePrefs = getActivePreferences(preferences);
  
  if (activePrefs.length === 0) {
    return [];
  }

  // Find rules where the antecedent is a subset of active preferences
  const triggeredRules = rules.filter(rule => {
    return rule.antecedent.every(item => activePrefs.includes(item));
  });

  const recommendations: Recommendation[] = [];

  for (const card of cards) {
    const baseScore = calculateCardScore(card, activePrefs);
    
    // Calculate rule-based boost
    let ruleBoost = 0;
    let maxConfidence = 0;
    let maxSupport = 0;
    let maxLift = 0;
    const applicableRules: AssociationRule[] = [];
    const reasons: string[] = [];

    for (const rule of triggeredRules) {
      const matchType = rule.applicable_card_types.includes(card.card_type);
      const matchConsequent = rule.consequent.some(c => {
        if (c === "high_cashback_cards" && card.cashback_percentage >= 5) return true;
        if (c === "premium" && card.card_type === "Premium") return true;
        if (c === "low_income_requirement" && card.min_income_required === 0) return true;
        if (c === "reward_points" && card.reward_points_per_100 >= 2) return true;
        if (c === "lounge_access" && card.lounge_access) return true;
        if (c === "cashback" && card.cashback_percentage > 0) return true;
        if (c === "zero_annual_fee" && card.annual_fee === 0) return true;
        if (c === "dining" && card.dining_benefits) return true;
        if (c === "online_shopping" && card.tags.includes("online-shopping")) return true;
        if (c === "shopping" && card.shopping_benefits) return true;
        return false;
      });

      if (matchType || matchConsequent) {
        applicableRules.push(rule);
        ruleBoost += (rule.confidence * rule.lift * 10);
        
        if (rule.confidence > maxConfidence) maxConfidence = rule.confidence;
        if (rule.support > maxSupport) maxSupport = rule.support;
        if (rule.lift > maxLift) maxLift = rule.lift;
        
        reasons.push(rule.description);
      }
    }

    const finalScore = baseScore + ruleBoost;

    // Only suggest cards that have at least some relevance
    if (finalScore > 10 || applicableRules.length > 0) {
      recommendations.push({
        card,
        matchingPercentage: Math.min(100, Math.round(baseScore)),
        confidence: Math.round(maxConfidence * 100),
        support: Math.round(maxSupport * 100),
        lift: Math.round(maxLift * 10) / 10,
        reasons: Array.from(new Set(reasons)), // unique reasons
        triggeredRules: applicableRules,
        score: finalScore
      });
    }
  }

  // Sort by final score descending
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10); // top 10
}
