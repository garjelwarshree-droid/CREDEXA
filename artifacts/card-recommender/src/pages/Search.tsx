import { useState, useEffect, useMemo } from "react";
import { useSearch, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, X, Star, ChevronRight, TrendingUp, Bookmark, BookmarkCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardVisual } from "@/components/CardVisual";
import { cardsData, Card } from "@/data/cards";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/localStorage";
import { Link } from "wouter";

const cardTypes = ["Credit", "Debit", "Cashback", "Travel", "Fuel", "Shopping", "Student", "Premium", "Virtual"] as const;
const banks = [...new Set(cardsData.map(c => c.bank_name))].sort();

type SortOption = "rating" | "fee_asc" | "fee_desc" | "cashback";

function CardRow({ card, index }: { card: Card; index: number }) {
  const [saved, setSaved] = useState(() => isBookmarked(card.id));

  function toggle() {
    if (saved) removeBookmark(card.id);
    else addBookmark(card.id);
    setSaved(!saved);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
      data-testid={`search-result-${card.id}`}
    >
      <div className="shrink-0 flex justify-center sm:justify-start">
        <div className="scale-[0.65] origin-top-left w-[220px] h-[140px] overflow-visible">
          <CardVisual card={card} showLink={false} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold">{card.card_name}</h3>
              <Badge variant="secondary" className="text-xs">{card.card_type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{card.bank_name}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{card.card_rating}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 mb-3 line-clamp-2">{card.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            Annual: {card.annual_fee === 0 ? "FREE" : `₹${card.annual_fee}`}
          </span>
          {card.cashback_percentage > 0 && (
            <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
              {card.cashback_percentage}% Cashback
            </span>
          )}
          {card.lounge_access && (
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
              Lounge
            </span>
          )}
          {card.travel_benefits && (
            <span className="text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full">
              Travel
            </span>
          )}
          {card.fuel_surcharge_waiver && (
            <span className="text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded-full">
              Fuel Waiver
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/cards/${card.id}`}>
            <Button size="sm" variant="outline" className="text-xs gap-1" data-testid={`button-view-${card.id}`}>
              Details <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
          <Link href={`/compare?ids=${card.id}`}>
            <Button size="sm" variant="ghost" className="text-xs gap-1" data-testid={`button-compare-${card.id}`}>
              <TrendingUp className="w-3 h-3" /> Compare
            </Button>
          </Link>
          <button
            data-testid={`button-bookmark-${card.id}`}
            onClick={toggle}
            className={`px-2 py-1.5 rounded-md border text-xs transition-colors flex items-center gap-1 ${
              saved ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Search() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const [, setLocation] = useLocation();

  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    params.get("type") ? [params.get("type")!] : []
  );
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxFee, setMaxFee] = useState(Infinity);
  const [minCashback, setMinCashback] = useState(0);
  const [filterBenefits, setFilterBenefits] = useState({
    travel: false, lounge: false, fuel: false, shopping: false, dining: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...cardsData];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        c =>
          c.card_name.toLowerCase().includes(q) ||
          c.bank_name.toLowerCase().includes(q) ||
          c.card_type.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q)) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) result = result.filter(c => selectedTypes.includes(c.card_type));
    if (selectedBanks.length > 0) result = result.filter(c => selectedBanks.includes(c.bank_name));
    if (minRating > 0) result = result.filter(c => c.card_rating >= minRating);
    if (maxFee < Infinity) result = result.filter(c => c.annual_fee <= maxFee);
    if (minCashback > 0) result = result.filter(c => c.cashback_percentage >= minCashback);
    if (filterBenefits.travel) result = result.filter(c => c.travel_benefits);
    if (filterBenefits.lounge) result = result.filter(c => c.lounge_access);
    if (filterBenefits.fuel) result = result.filter(c => c.fuel_surcharge_waiver);
    if (filterBenefits.shopping) result = result.filter(c => c.shopping_benefits);
    if (filterBenefits.dining) result = result.filter(c => c.dining_benefits);

    switch (sortBy) {
      case "rating": result.sort((a, b) => b.card_rating - a.card_rating); break;
      case "fee_asc": result.sort((a, b) => a.annual_fee - b.annual_fee); break;
      case "fee_desc": result.sort((a, b) => b.annual_fee - a.annual_fee); break;
      case "cashback": result.sort((a, b) => b.cashback_percentage - a.cashback_percentage); break;
    }

    return result;
  }, [query, selectedTypes, selectedBanks, minRating, maxFee, minCashback, filterBenefits, sortBy]);

  function toggleType(t: string) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function toggleBank(b: string) {
    setSelectedBanks(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }

  function toggleBenefit(key: keyof typeof filterBenefits) {
    setFilterBenefits(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function clearAll() {
    setQuery(""); setSelectedTypes([]); setSelectedBanks([]);
    setMinRating(0); setMaxFee(Infinity); setMinCashback(0);
    setFilterBenefits({ travel: false, lounge: false, fuel: false, shopping: false, dining: false });
  }

  const hasFilters = query || selectedTypes.length || selectedBanks.length || minRating || maxFee < Infinity || minCashback || Object.values(filterBenefits).some(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Search bar */}
      <div className="mb-6">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search"
              type="search"
              placeholder="Search cards, banks, features..."
              className="pl-10 h-11"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="gap-2 h-11"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="icon" className="h-11 w-11" onClick={clearAll} data-testid="button-clear-filters">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span>{filtered.length} cards</span>
          <span className="ml-auto">Sort:</span>
          {([
            { val: "rating", label: "Rating" },
            { val: "fee_asc", label: "Fee: Low" },
            { val: "fee_desc", label: "Fee: High" },
            { val: "cashback", label: "Cashback" },
          ] as const).map(opt => (
            <button
              key={opt.val}
              data-testid={`sort-${opt.val}`}
              onClick={() => setSortBy(opt.val)}
              className={`px-2.5 py-1 rounded-full border transition-colors ${
                sortBy === opt.val ? "border-primary bg-primary/10 text-primary font-medium" : "border-border"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className="shrink-0 w-56 overflow-hidden"
            >
              <div className="space-y-6">
                {/* Card Type */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Card Type</p>
                  <div className="space-y-1">
                    {cardTypes.map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          data-testid={`filter-type-${t.toLowerCase()}`}
                          checked={selectedTypes.includes(t)}
                          onChange={() => toggleType(t)}
                          className="rounded border-border accent-primary"
                        />
                        <span className="text-sm group-hover:text-foreground text-muted-foreground transition-colors">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Annual Fee */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Annual Fee</p>
                  <div className="space-y-1">
                    {[
                      { label: "Free only", val: 0 },
                      { label: "Up to ₹500", val: 500 },
                      { label: "Up to ₹2,000", val: 2000 },
                      { label: "Up to ₹15,000", val: 15000 },
                      { label: "Any", val: Infinity },
                    ].map(opt => (
                      <label key={opt.label} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="fee"
                          checked={opt.val === 0 ? maxFee === 0 : maxFee === opt.val}
                          onChange={() => setMaxFee(opt.val)}
                          className="accent-primary"
                          data-testid={`filter-fee-${opt.label.replace(/\W+/g, "-")}`}
                        />
                        <span className="text-sm group-hover:text-foreground text-muted-foreground transition-colors">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Min Rating */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Min Rating</p>
                  <div className="space-y-1">
                    {[0, 3, 4, 4.5].map(r => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                          {r === 0 ? "Any" : (<><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{r}+</>)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Benefits</p>
                  <div className="space-y-1">
                    {(Object.keys(filterBenefits) as (keyof typeof filterBenefits)[]).map(b => (
                      <label key={b} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          data-testid={`filter-benefit-${b}`}
                          checked={filterBenefits[b]}
                          onChange={() => toggleBenefit(b)}
                          className="rounded border-border accent-primary"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors capitalize">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Banks */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bank</p>
                  <div className="space-y-1 max-h-44 overflow-y-auto">
                    {banks.map(b => (
                      <label key={b} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          data-testid={`filter-bank-${b.replace(/\W+/g, "-")}`}
                          checked={selectedBanks.includes(b)}
                          onChange={() => toggleBank(b)}
                          className="rounded border-border accent-primary"
                        />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <SearchIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No cards match your filters</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or clearing filters</p>
              <Button variant="ghost" size="sm" className="mt-4" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((card, i) => (
                <CardRow key={card.id} card={card} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
