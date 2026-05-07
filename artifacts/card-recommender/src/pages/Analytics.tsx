import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, PieChart as PieIcon, TrendingUp, ArrowUpDown } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { cardsData } from "@/data/cards";
import { associationRules } from "@/data/associationRules";
import { getAnalyticsData, AnalyticsData } from "@/lib/localStorage";

const COLORS = [
  "hsl(235 85% 60%)",
  "hsl(158 75% 45%)",
  "hsl(38 92% 50%)",
  "hsl(0 84% 60%)",
  "hsl(280 65% 60%)",
  "hsl(200 85% 55%)",
  "hsl(45 93% 55%)",
  "hsl(320 70% 55%)",
  "hsl(175 60% 45%)",
];

function getCategoryDistribution() {
  const counts = cardsData.reduce((acc, c) => {
    acc[c.card_type] = (acc[c.card_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function getCashbackDistribution() {
  const ranges = { "0%": 0, "1-2%": 0, "3-4%": 0, "5%+": 0 };
  for (const c of cardsData) {
    if (c.cashback_percentage === 0) ranges["0%"]++;
    else if (c.cashback_percentage <= 2) ranges["1-2%"]++;
    else if (c.cashback_percentage <= 4) ranges["3-4%"]++;
    else ranges["5%+"]++;
  }
  return Object.entries(ranges).map(([name, value]) => ({ name, value }));
}

function getTopRatedCards() {
  return [...cardsData]
    .sort((a, b) => b.card_rating - a.card_rating)
    .slice(0, 8)
    .map(c => ({
      name: c.card_name.length > 18 ? c.card_name.slice(0, 16) + "…" : c.card_name,
      rating: c.card_rating,
      type: c.card_type,
    }));
}

function getFeeDistribution() {
  return [
    { name: "Free", count: cardsData.filter(c => c.annual_fee === 0).length },
    { name: "₹1-500", count: cardsData.filter(c => c.annual_fee > 0 && c.annual_fee <= 500).length },
    { name: "₹501-2K", count: cardsData.filter(c => c.annual_fee > 500 && c.annual_fee <= 2000).length },
    { name: "₹2K-15K", count: cardsData.filter(c => c.annual_fee > 2000 && c.annual_fee <= 15000).length },
    { name: "₹15K+", count: cardsData.filter(c => c.annual_fee > 15000).length },
  ];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sortRule, setSortRule] = useState<"confidence" | "support" | "lift">("confidence");

  useEffect(() => {
    setAnalytics(getAnalyticsData());
  }, []);

  const categoryData = getCategoryDistribution();
  const cashbackData = getCashbackDistribution();
  const topRated = getTopRatedCards();
  const feeData = getFeeDistribution();

  const sortedRules = [...associationRules].sort((a, b) => b[sortRule] - a[sortRule]);

  const globalStats = [
    { label: "Total Cards", value: cardsData.length, color: "text-primary" },
    { label: "Association Rules", value: associationRules.length, color: "text-accent" },
    { label: "Avg Rating", value: (cardsData.reduce((s, c) => s + c.card_rating, 0) / cardsData.length).toFixed(2), color: "text-yellow-500" },
    { label: "Free Cards", value: cardsData.filter(c => c.annual_fee === 0).length, color: "text-green-500" },
    { label: "Cards w/ Lounge", value: cardsData.filter(c => c.lounge_access).length, color: "text-blue-500" },
    { label: "Sessions Tracked", value: analytics?.recommendationsGenerated ?? 0, color: "text-purple-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Dataset insights, rule statistics, and your session analytics.
        </p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {globalStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-xl border border-border bg-card text-center"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Category Pie */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-primary" /> Card Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Rated */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Top Rated Cards
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topRated} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[3.5, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="rating" fill="hsl(38 92% 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Cashback distribution */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="font-semibold text-sm mb-4">Cashback % Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cashbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" fill="hsl(158 75% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee distribution */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="font-semibold text-sm mb-4">Annual Fee Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(235 85% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Association Rules Table */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            All Association Rules ({associationRules.length})
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
            {(["confidence", "support", "lift"] as const).map(key => (
              <button
                key={key}
                data-testid={`sort-${key}`}
                onClick={() => setSortRule(key)}
                className={`px-2.5 py-1 rounded-full border transition-colors capitalize ${
                  sortRule === key
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left pb-3 pr-4">Antecedent</th>
                <th className="text-left pb-3 pr-4">Consequent</th>
                <th className="text-right pb-3 pr-4">Support</th>
                <th className="text-right pb-3 pr-4">Confidence</th>
                <th className="text-right pb-3 pr-4">Lift</th>
                <th className="text-left pb-3">Card Types</th>
              </tr>
            </thead>
            <tbody>
              {sortedRules.map((rule, i) => (
                <motion.tr
                  key={rule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/40 last:border-0"
                  data-testid={`rule-row-${rule.id}`}
                >
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {rule.antecedent.map(a => (
                        <span key={a} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs capitalize">
                          {a.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {rule.consequent.map(c => (
                        <span key={c} className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs capitalize">
                          {c.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right font-medium">{Math.round(rule.support * 100)}%</td>
                  <td className="py-3 pr-4 text-right font-medium text-accent">{Math.round(rule.confidence * 100)}%</td>
                  <td className="py-3 pr-4 text-right font-medium text-yellow-500">{rule.lift.toFixed(2)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {rule.applicable_card_types.map(t => (
                        <span key={t} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
