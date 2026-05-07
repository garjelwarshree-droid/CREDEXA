import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, TrendingUp, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { CardVisual } from "@/components/CardVisual";
import { cardsData, Card } from "@/data/cards";

const CHART_COLORS = ["hsl(235 85% 60%)", "hsl(158 75% 45%)", "hsl(38 92% 50%)", "hsl(280 65% 60%)"];

function getRadarData(cards: Card[]) {
  return [
    { metric: "Cashback", ...Object.fromEntries(cards.map(c => [c.card_name, Math.min(10, c.cashback_percentage * 1.5)])) },
    { metric: "Rewards", ...Object.fromEntries(cards.map(c => [c.card_name, Math.min(10, c.reward_points_per_100 / 1.5)])) },
    { metric: "Travel", ...Object.fromEntries(cards.map(c => [c.card_name, (c.travel_benefits ? 7 : 0) + (c.lounge_access ? 3 : 0)])) },
    { metric: "Fuel", ...Object.fromEntries(cards.map(c => [c.card_name, c.fuel_surcharge_waiver ? 8 : 2])) },
    { metric: "Shopping", ...Object.fromEntries(cards.map(c => [c.card_name, c.shopping_benefits ? 8 : 2])) },
    { metric: "Dining", ...Object.fromEntries(cards.map(c => [c.card_name, c.dining_benefits ? 8 : 2])) },
  ];
}

function feeBars(cards: Card[]) {
  return cards.map(c => ({
    name: c.card_name.length > 16 ? c.card_name.slice(0, 14) + "…" : c.card_name,
    "Annual Fee (₹)": c.annual_fee,
    "Joining Fee (₹)": c.joining_fee,
  }));
}

const comparisonRows: { label: string; key: keyof Card; format?: (v: unknown) => string; highlight?: "low" | "high" }[] = [
  { label: "Annual Fee", key: "annual_fee", format: v => v === 0 ? "FREE" : `₹${v}`, highlight: "low" },
  { label: "Joining Fee", key: "joining_fee", format: v => v === 0 ? "FREE" : `₹${v}`, highlight: "low" },
  { label: "Cashback %", key: "cashback_percentage", format: v => `${v}%`, highlight: "high" },
  { label: "Reward Points/₹100", key: "reward_points_per_100", format: v => `${v} pts`, highlight: "high" },
  { label: "Interest Rate", key: "interest_rate", format: v => `${v}% / mo`, highlight: "low" },
  { label: "Min Income", key: "min_income_required", format: v => v === 0 ? "No min" : `₹${(v as number).toLocaleString()}`, highlight: "low" },
  { label: "Card Rating", key: "card_rating", format: v => `${v} / 5`, highlight: "high" },
  { label: "Travel Benefits", key: "travel_benefits", format: v => v ? "Yes" : "No" },
  { label: "Lounge Access", key: "lounge_access", format: v => v ? "Yes" : "No" },
  { label: "Fuel Waiver", key: "fuel_surcharge_waiver", format: v => v ? "Yes" : "No" },
  { label: "Shopping Benefits", key: "shopping_benefits", format: v => v ? "Yes" : "No" },
  { label: "Dining Benefits", key: "dining_benefits", format: v => v ? "Yes" : "No" },
  { label: "Entertainment", key: "entertainment_benefits", format: v => v ? "Yes" : "No" },
  { label: "Welcome Bonus", key: "welcome_bonus", format: v => v as string },
];

export default function Compare() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialIds = (params.get("ids") || "").split(",").filter(Boolean);

  const [selectedCards, setSelectedCards] = useState<Card[]>(
    () => initialIds.map(id => cardsData.find(c => c.id === id)).filter(Boolean) as Card[]
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSearch = searchQuery
    ? cardsData.filter(
        c =>
          !selectedCards.find(sc => sc.id === c.id) &&
          (c.card_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.bank_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.card_type.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  function addCard(card: Card) {
    if (selectedCards.length < 4 && !selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(prev => [...prev, card]);
      setSearchQuery("");
    }
  }

  function removeCard(id: string) {
    setSelectedCards(prev => prev.filter(c => c.id !== id));
  }

  function getBestValue(key: keyof Card, highlight?: "low" | "high"): string | null {
    if (!highlight || selectedCards.length < 2) return null;
    const vals = selectedCards.map(c => c[key] as number);
    if (vals.some(v => typeof v !== "number")) return null;
    const best = highlight === "high" ? Math.max(...vals) : Math.min(...vals);
    return selectedCards.find(c => (c[key] as number) === best)?.id ?? null;
  }

  const radarData = selectedCards.length > 0 ? getRadarData(selectedCards) : [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Card Comparison</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Compare up to 4 financial cards side-by-side. Best values are highlighted in green.
        </p>
      </div>

      {/* Card selector */}
      {selectedCards.length < 4 && (
        <div className="mb-6 relative max-w-sm">
          <Input
            data-testid="input-card-search"
            placeholder="Search to add a card..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          {filteredSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
              {filteredSearch.map(card => (
                <button
                  key={card.id}
                  data-testid={`button-add-card-${card.id}`}
                  onClick={() => addCard(card)}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm flex items-center justify-between"
                >
                  <span>
                    <span className="font-medium">{card.card_name}</span>
                    <span className="text-muted-foreground ml-2">{card.bank_name}</span>
                  </span>
                  <Badge variant="secondary" className="text-xs shrink-0">{card.card_type}</Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedCards.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No cards selected</p>
          <p className="text-sm text-muted-foreground mt-1">Search for cards to compare them side-by-side</p>
        </div>
      ) : (
        <>
          {/* Card visuals row */}
          <div className="overflow-x-auto mb-8">
            <div
              className="grid gap-4 min-w-max"
              style={{ gridTemplateColumns: `180px repeat(${selectedCards.length}, minmax(200px, 1fr))` }}
            >
              <div />
              {selectedCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    <CardVisual card={card} showLink={false} />
                    <button
                      data-testid={`button-remove-${card.id}`}
                      onClick={() => removeCard(card.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: CHART_COLORS[i] }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-xl border border-border mb-8">
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground w-44">Feature</th>
                  {selectedCards.map(card => (
                    <th key={card.id} className="text-center px-4 py-3 font-semibold">
                      {card.card_name.length > 18 ? card.card_name.slice(0, 16) + "…" : card.card_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, ri) => {
                  const bestId = getBestValue(row.key, row.highlight);
                  return (
                    <tr key={row.key} className={`border-b border-border/50 last:border-0 ${ri % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="px-5 py-3 text-muted-foreground font-medium">{row.label}</td>
                      {selectedCards.map(card => {
                        const val = row.format ? row.format(card[row.key]) : String(card[row.key]);
                        const isBest = bestId === card.id;
                        const isBool = typeof card[row.key] === "boolean";
                        return (
                          <td
                            key={card.id}
                            className={`px-4 py-3 text-center font-medium ${
                              isBest ? "text-green-500 dark:text-green-400" : ""
                            }`}
                            data-testid={`cell-${row.key}-${card.id}`}
                          >
                            {isBool ? (
                              card[row.key] ? (
                                <Check className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <Minus className="w-4 h-4 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              <span className={isBest ? "underline decoration-dotted" : ""}>{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar chart */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 text-sm">Benefit Radar</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  {selectedCards.map((card, i) => (
                    <Radar
                      key={card.id}
                      name={card.card_name}
                      dataKey={card.card_name}
                      stroke={CHART_COLORS[i]}
                      fill={CHART_COLORS[i]}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Fee bar chart */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 text-sm">Fee Comparison (₹)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={feeBars(selectedCards)} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="Annual Fee (₹)" fill="hsl(235 85% 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Joining Fee (₹)" fill="hsl(158 75% 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
