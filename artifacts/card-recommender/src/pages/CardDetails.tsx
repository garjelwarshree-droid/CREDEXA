import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bookmark, BookmarkCheck, Star, Check, X,
  TrendingUp, CreditCard, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { CardVisual } from "@/components/CardVisual";
import { cardsData } from "@/data/cards";
import { associationRules } from "@/data/associationRules";
import { addBookmark, removeBookmark, isBookmarked, recordCardView } from "@/lib/localStorage";

const benefitsList = [
  { key: "travel_benefits" as const, label: "Travel Benefits" },
  { key: "lounge_access" as const, label: "Airport Lounge Access" },
  { key: "fuel_surcharge_waiver" as const, label: "Fuel Surcharge Waiver" },
  { key: "shopping_benefits" as const, label: "Shopping Benefits" },
  { key: "dining_benefits" as const, label: "Dining Benefits" },
  { key: "entertainment_benefits" as const, label: "Entertainment Benefits" },
];

export default function CardDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const card = cardsData.find(c => c.id === id);
  const [bookmarked, setBookmarked] = useState(() => (id ? isBookmarked(id) : false));

  useEffect(() => {
    if (card) recordCardView(card.id, card.card_type);
  }, [card]);

  if (!card) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Card not found</h2>
        <p className="text-muted-foreground mb-6">The card you're looking for doesn't exist.</p>
        <Link href="/search">
          <Button>Browse Cards</Button>
        </Link>
      </div>
    );
  }

  function toggleBookmark() {
    if (bookmarked) removeBookmark(card!.id);
    else addBookmark(card!.id);
    setBookmarked(!bookmarked);
  }

  const applicableRules = associationRules.filter(r =>
    r.applicable_card_types.includes(card.card_type)
  );

  const relatedCards = cardsData
    .filter(c => c.id !== card.id && (c.card_type === card.card_type || c.bank_name === card.bank_name))
    .slice(0, 3);

  const stars = Math.floor(card.card_rating);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back */}
      <button
        data-testid="button-back"
        onClick={() => history.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-center"
        >
          <CardVisual card={card} showLink={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary">{card.card_type}</Badge>
            {card.annual_fee === 0 && (
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                Lifetime Free
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1">{card.card_name}</h1>
          <p className="text-muted-foreground mb-3">{card.bank_name}</p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">{card.card_rating}/5</span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{card.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {card.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              data-testid="button-bookmark-detail"
              onClick={toggleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                bookmarked
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {bookmarked ? "Bookmarked" : "Save Card"}
            </button>
            <Link href={`/compare?ids=${card.id}`}>
              <Button variant="outline" className="gap-2" data-testid="button-compare-detail">
                <TrendingUp className="w-4 h-4" /> Compare
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Annual Fee", value: card.annual_fee === 0 ? "FREE" : `₹${card.annual_fee}`, highlight: card.annual_fee === 0 },
          { label: "Joining Fee", value: card.joining_fee === 0 ? "FREE" : `₹${card.joining_fee}`, highlight: card.joining_fee === 0 },
          { label: "Cashback", value: `${card.cashback_percentage}%`, highlight: card.cashback_percentage >= 5 },
          { label: "Reward Points", value: `${card.reward_points_per_100}/₹100`, highlight: card.reward_points_per_100 >= 5 },
          { label: "Interest Rate", value: `${card.interest_rate}%/mo`, highlight: false },
          { label: "Min Income", value: card.min_income_required === 0 ? "No min" : `₹${(card.min_income_required / 100000).toFixed(0)}L/yr`, highlight: card.min_income_required === 0 },
          { label: "Welcome Bonus", value: card.welcome_bonus, highlight: false },
          { label: "Card Rating", value: `${card.card_rating} / 5`, highlight: card.card_rating >= 4.5 },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl border border-border bg-card"
            data-testid={`stat-${item.label.toLowerCase().replace(/ /g, "-")}`}
          >
            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
            <div className={`font-bold text-sm ${item.highlight ? "text-green-500 dark:text-green-400" : ""}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4">Benefits Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {benefitsList.map(b => {
            const active = card[b.key];
            return (
              <div
                key={b.key}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  active
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border bg-card opacity-50"
                }`}
              >
                {active ? (
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm font-medium ${active ? "" : "text-muted-foreground"}`}>
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applicable Association Rules */}
      {applicableRules.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Why This Card Works — Association Rules</h2>
          <div className="space-y-3">
            {applicableRules.slice(0, 4).map(rule => (
              <div key={rule.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
                  {rule.antecedent.map(a => (
                    <span key={a} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs capitalize">
                      {a.replace(/_/g, " ")}
                    </span>
                  ))}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  {rule.consequent.map(c => (
                    <span key={c} className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs capitalize">
                      {c.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{rule.description}</p>
                <div className="flex gap-4 text-xs font-medium">
                  <span>Support: <strong className="text-primary">{Math.round(rule.support * 100)}%</strong></span>
                  <span>Confidence: <strong className="text-accent">{Math.round(rule.confidence * 100)}%</strong></span>
                  <span>Lift: <strong className="text-yellow-500">{rule.lift.toFixed(1)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Cards */}
      {relatedCards.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Related Cards</h2>
          <div className="flex gap-5 flex-wrap">
            {relatedCards.map(rc => (
              <Link key={rc.id} href={`/cards/${rc.id}`}>
                <div className="flex flex-col items-center gap-2 cursor-pointer group" data-testid={`link-related-${rc.id}`}>
                  <CardVisual card={rc} showLink={false} className="group-hover:scale-105 transition-transform" />
                  <div className="text-center">
                    <p className="text-xs font-semibold">{rc.card_name}</p>
                    <p className="text-xs text-muted-foreground">{rc.bank_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
