import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, CreditCard, Zap, Shield, TrendingUp, ChevronRight, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardVisual } from "@/components/CardVisual";
import { cardsData } from "@/data/cards";
import { associationRules } from "@/data/associationRules";
import { Link } from "wouter";

const categoryIcons: Record<string, string> = {
  Credit: "💳",
  Debit: "🏦",
  Cashback: "💰",
  Travel: "✈️",
  Fuel: "⛽",
  Shopping: "🛍️",
  Student: "🎓",
  Premium: "👑",
  Virtual: "🌐",
};

const categories = ["Credit", "Debit", "Cashback", "Travel", "Fuel", "Shopping", "Student", "Premium", "Virtual"];

const featuredCardIds = ["cb1", "p2", "t1", "f1", "s1", "v1"];
const featuredCards = featuredCardIds
  .map(id => cardsData.find(c => c.id === id))
  .filter(Boolean) as typeof cardsData;

const trendingRules = associationRules.slice(0, 3);

const stats = [
  { label: "Financial Cards", value: cardsData.length, suffix: "+" },
  { label: "Association Rules", value: associationRules.length, suffix: "+" },
  { label: "Card Categories", value: 9, suffix: "" },
  { label: "AI Match Accuracy", value: 92, suffix: "%" },
];

const howItWorks = [
  {
    step: 1,
    icon: CreditCard,
    title: "Select Preferences",
    desc: "Tell us your spending habits — cashback, travel, fuel, dining, and more.",
  },
  {
    step: 2,
    icon: Brain,
    title: "Apriori Analysis",
    desc: "Our engine mines frequent itemsets and generates association rules from your profile.",
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Smart Recommendations",
    desc: "Get ranked cards with confidence %, support %, lift values, and plain-English explanations.",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(235 85% 60% / 0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, hsl(158 75% 45% / 0.12) 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Powered by Apriori Association Rule Mining
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Discover Your
              <span className="block bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
                Perfect Financial Card
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              AI-driven recommendations using real Association Rule Mining. Select your spending
              preferences and get ranked cards with support, confidence, and lift metrics.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="input-hero-search"
                  type="search"
                  placeholder="Search cards, banks, features..."
                  className="pl-10 h-12 bg-card border-border"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-6" data-testid="button-hero-search">
                Search
              </Button>
            </form>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/recommendations">
                <Button size="lg" className="gap-2" data-testid="button-try-ai">
                  <Brain className="w-4 h-4" />
                  Try AI Matching
                </Button>
              </Link>
              <Link href="/compare">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-compare">
                  <TrendingUp className="w-4 h-4" />
                  Compare Cards
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-border/40 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Cards</h2>
              <p className="text-muted-foreground text-sm mt-1">Top-rated picks across categories</p>
            </div>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="gap-1 text-primary" data-testid="link-view-all-cards">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center gap-4"
              >
                <CardVisual card={card} />
                <div className="w-full max-w-[340px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{card.card_name}</p>
                      <p className="text-xs text-muted-foreground">{card.bank_name}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {card.card_type}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {card.cashback_percentage > 0 && (
                      <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-medium">
                        {card.cashback_percentage}% Cashback
                      </span>
                    )}
                    {card.lounge_access && (
                      <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                        Lounge Access
                      </span>
                    )}
                    {card.annual_fee === 0 && (
                      <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">
                        Zero Fee
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground text-sm mt-1">Find the right type for your lifestyle</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/search?type=${cat}`}>
                  <div
                    data-testid={`link-category-${cat.toLowerCase()}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <span className="text-2xl">{categoryIcons[cat]}</span>
                    <span className="text-xs font-medium text-center group-hover:text-primary transition-colors">
                      {cat}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Rules */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Trending Association Rules</h2>
              <p className="text-muted-foreground text-sm mt-1">Patterns discovered from user preference data</p>
            </div>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="gap-1 text-primary" data-testid="link-view-all-rules">
                All rules <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {trendingRules.map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-wrap gap-1 mb-3 text-sm font-medium">
                  {rule.antecedent.map((a) => (
                    <span key={a} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs capitalize">
                      {a.replace(/_/g, " ")}
                    </span>
                  ))}
                  <span className="text-muted-foreground self-center">→</span>
                  {rule.consequent.map((c) => (
                    <span key={c} className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs capitalize">
                      {c.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{rule.description}</p>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="text-center">
                    <div className="text-primary font-bold">{Math.round(rule.support * 100)}%</div>
                    <div className="text-muted-foreground">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-accent font-bold">{Math.round(rule.confidence * 100)}%</div>
                    <div className="text-muted-foreground">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-500 font-bold">{rule.lift.toFixed(1)}</div>
                    <div className="text-muted-foreground">Lift</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <p className="text-muted-foreground text-sm mt-1">Three steps to your perfect card match</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Step {step.step}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/recommendations">
              <Button size="lg" className="gap-2" data-testid="button-start-matching">
                <Shield className="w-4 h-4" />
                Start AI Matching
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
