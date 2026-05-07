import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Zap, CheckCircle2, Circle, ChevronRight, Info,
  TrendingUp, Target, BarChart3, Bookmark, BookmarkCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CardVisual } from "@/components/CardVisual";
import { cardsData } from "@/data/cards";
import { associationRules } from "@/data/associationRules";
import { getRecommendations, UserPreferences, Recommendation } from "@/lib/apriori";
import { addBookmark, removeBookmark, isBookmarked, recordRecommendationSession, recordRuleTrigger } from "@/lib/localStorage";
import { Link } from "wouter";

const preferenceConfig: { key: keyof UserPreferences; label: string; description: string; icon: string }[] = [
  { key: "cashback", label: "Cashback", description: "Prefer direct cash returns on spending", icon: "💰" },
  { key: "travel", label: "Travel", description: "Frequent flyer or hotel stays", icon: "✈️" },
  { key: "fuel", label: "Fuel", description: "Regular petrol/diesel expenses", icon: "⛽" },
  { key: "shopping", label: "Shopping", description: "Retail and lifestyle purchases", icon: "🛍️" },
  { key: "dining", label: "Dining", description: "Restaurants and food delivery", icon: "🍽️" },
  { key: "entertainment", label: "Entertainment", description: "Movies, events, subscriptions", icon: "🎬" },
  { key: "zero_annual_fee", label: "Zero Annual Fee", description: "No recurring card charges", icon: "🆓" },
  { key: "reward_points", label: "Reward Points", description: "Accumulate points for redemptions", icon: "⭐" },
  { key: "lounge_access", label: "Lounge Access", description: "Airport lounge privileges", icon: "🛋️" },
  { key: "student", label: "Student", description: "Student-friendly with relaxed eligibility", icon: "🎓" },
  { key: "premium", label: "Premium", description: "Exclusive high-tier benefits", icon: "👑" },
  { key: "online_shopping", label: "Online Shopping", description: "E-commerce platforms", icon: "🌐" },
];

const defaultPreferences: UserPreferences = {
  cashback: false, travel: false, fuel: false, shopping: false,
  dining: false, entertainment: false, zero_annual_fee: false,
  reward_points: false, lounge_access: false, student: false,
  premium: false, online_shopping: false,
};

function ScoreBadge({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(rec.card.id));

  function toggleBookmark() {
    if (bookmarked) {
      removeBookmark(rec.card.id);
    } else {
      addBookmark(rec.card.id);
    }
    setBookmarked(!bookmarked);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
      data-testid={`card-recommendation-${rec.card.id}`}
    >
      <div className="flex gap-5 flex-col sm:flex-row">
        <div className="shrink-0 flex justify-center">
          <div className="scale-75 origin-top-left -mb-10 -mr-10 sm:scale-100 sm:mb-0 sm:mr-0">
            <CardVisual card={rec.card} />
          </div>
        </div>
        <div className="flex-1 min-w-0 pt-2 sm:pt-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  #{index + 1}
                </span>
                <h3 className="font-bold text-base">{rec.card.card_name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{rec.card.bank_name} · {rec.card.card_type}</p>
            </div>
            <button
              data-testid={`button-bookmark-${rec.card.id}`}
              onClick={toggleBookmark}
              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Matching percentage bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-muted-foreground">Match Score</span>
              <span className="font-bold text-primary">{rec.matchingPercentage}%</span>
            </div>
            <Progress value={rec.matchingPercentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/40 rounded-lg">
            <ScoreBadge label="Confidence" value={`${rec.confidence}%`} color="text-accent" />
            <ScoreBadge label="Support" value={`${rec.support}%`} color="text-blue-500" />
            <ScoreBadge label="Lift" value={rec.lift.toFixed(1)} color="text-yellow-500" />
          </div>

          {/* Reasons */}
          {rec.reasons.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Why recommended
              </p>
              <div className="space-y-1.5">
                {rec.reasons.slice(0, 2).map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Triggered rules */}
          {rec.triggeredRules.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Rules fired ({rec.triggeredRules.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {rec.triggeredRules.map(r => (
                  <span key={r.id} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {r.antecedent.join(" + ")} → {r.consequent[0]}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Link href={`/cards/${rec.card.id}`}>
              <Button size="sm" variant="outline" className="text-xs gap-1" data-testid={`button-view-${rec.card.id}`}>
                View Details <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
            <Link href={`/compare?ids=${rec.card.id}`}>
              <Button size="sm" variant="ghost" className="text-xs gap-1" data-testid={`button-compare-${rec.card.id}`}>
                <BarChart3 className="w-3 h-3" /> Compare
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Recommendations() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedCount = Object.values(preferences).filter(Boolean).length;

  function togglePref(key: keyof UserPreferences) {
    setPreferences(p => ({ ...p, [key]: !p[key] }));
    setResults(null);
  }

  function analyze() {
    setIsAnalyzing(true);
    setTimeout(() => {
      const recs = getRecommendations(preferences, cardsData, associationRules);
      setResults(recs);
      recordRecommendationSession();
      recs.forEach(r => r.triggeredRules.forEach(rule => recordRuleTrigger(rule.id)));
      setIsAnalyzing(false);
    }, 700);
  }

  function reset() {
    setPreferences(defaultPreferences);
    setResults(null);
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Card Matching</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Select your spending preferences. The Apriori algorithm will mine association rules and rank the best cards for you.
        </p>
      </div>

      {/* Step 1: Preferences */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
            Select Your Preferences
            {selectedCount > 0 && (
              <Badge variant="secondary" className="ml-1">{selectedCount} selected</Badge>
            )}
          </h2>
          {selectedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-xs text-muted-foreground">
              Reset
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {preferenceConfig.map((pref) => {
            const active = preferences[pref.key];
            return (
              <button
                key={pref.key}
                data-testid={`toggle-pref-${pref.key}`}
                onClick={() => togglePref(pref.key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  active
                    ? "border-primary bg-primary/10 shadow-sm shadow-primary/20"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {active ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xl mb-1">{pref.icon}</div>
                    <div className={`text-sm font-semibold ${active ? "text-primary" : ""}`}>{pref.label}</div>
                    <div className="text-xs text-muted-foreground leading-snug">{pref.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Analyze */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          size="lg"
          disabled={selectedCount === 0 || isAnalyzing}
          onClick={analyze}
          className="gap-2 min-w-40"
          data-testid="button-analyze"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Run Apriori Analysis
            </>
          )}
        </Button>
        {selectedCount === 0 && (
          <p className="text-sm text-muted-foreground">Select at least one preference to get recommendations.</p>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {results !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
              <h2 className="font-semibold">
                Recommendation Results
              </h2>
              <Badge className="bg-accent/10 text-accent border-accent/20">
                {results.length} cards found
              </Badge>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-xl">
                <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No strong matches found</p>
                <p className="text-sm text-muted-foreground mt-1">Try selecting different or additional preferences.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {results.map((rec, i) => (
                  <RecommendationCard key={rec.card.id} rec={rec} index={i} />
                ))}
              </div>
            )}

            {/* Triggered Rules Summary */}
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-5 rounded-xl border border-border bg-card"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  All Triggered Association Rules
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted-foreground border-b border-border">
                        <th className="text-left pb-2">Rule</th>
                        <th className="text-right pb-2">Support</th>
                        <th className="text-right pb-2">Confidence</th>
                        <th className="text-right pb-2">Lift</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(
                        new Map(
                          results
                            .flatMap(r => r.triggeredRules)
                            .map(r => [r.id, r])
                        ).values()
                      ).map(rule => (
                        <tr key={rule.id} className="border-b border-border/50 last:border-0">
                          <td className="py-2.5 pr-4">
                            <span className="text-primary">{rule.antecedent.join(" + ")}</span>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span className="text-accent">{rule.consequent.join(" + ")}</span>
                          </td>
                          <td className="text-right py-2.5 font-medium">{Math.round(rule.support * 100)}%</td>
                          <td className="text-right py-2.5 font-medium text-accent">{Math.round(rule.confidence * 100)}%</td>
                          <td className="text-right py-2.5 font-medium text-yellow-500">{rule.lift.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
