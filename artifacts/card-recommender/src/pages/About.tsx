import { motion } from "framer-motion";
import { Brain, ChevronRight, Database, TrendingUp, Zap, Code2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { associationRules } from "@/data/associationRules";
import { cardsData } from "@/data/cards";

const steps = [
  {
    icon: Database,
    title: "Transaction Database",
    desc: "User spending preferences are encoded as itemsets — sets of items (cashback, travel, fuel, etc.) that a user selects together.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: TrendingUp,
    title: "Frequent Itemset Mining",
    desc: "The Apriori algorithm scans transactions to identify itemsets that appear frequently (above a minimum support threshold).",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Rule Generation",
    desc: "From frequent itemsets, association rules are generated in the form A → B. Rules above the confidence threshold are kept.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Zap,
    title: "Card Recommendation",
    desc: "Triggered rules are mapped to financial card attributes. Cards matching the consequents are ranked by a composite score.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const metrics = [
  {
    name: "Support",
    formula: "P(A ∪ B)",
    desc: "The fraction of transactions that contain both A and B. High support means the pattern is common in the dataset.",
    example: "45% of users interested in fuel also prefer cashback cards.",
    color: "text-primary",
  },
  {
    name: "Confidence",
    formula: "P(B | A) = Support(A ∪ B) / Support(A)",
    desc: "The conditional probability that B is selected given A is already selected. Measures rule reliability.",
    example: "82% of users who travel also prefer lounge access — so if a user selects travel, lounge is recommended with 82% confidence.",
    color: "text-accent",
  },
  {
    name: "Lift",
    formula: "Confidence(A → B) / Support(B)",
    desc: "How much more likely B is selected with A than without it. Lift > 1 means A and B are positively correlated.",
    example: "Lift of 2.1 for travel → premium means users who travel are 2.1x more likely to want premium cards.",
    color: "text-yellow-500",
  },
];

const techStack = [
  { name: "React 19", desc: "UI framework" },
  { name: "TypeScript", desc: "Type safety" },
  { name: "Vite", desc: "Build tool" },
  { name: "Tailwind CSS", desc: "Styling" },
  { name: "Framer Motion", desc: "Animations" },
  { name: "Recharts", desc: "Data charts" },
  { name: "Wouter", desc: "Routing" },
  { name: "Shadcn/ui", desc: "Components" },
];

export default function About() {
  const topRule = [...associationRules].sort((a, b) => b.confidence - a.confidence)[0];

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" /> About This Project
          </Badge>
          <h1 className="text-3xl font-bold mb-4">
            Smart Card Comparison &<br />
            <span className="text-primary">Association Rule Mining</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A final-year AI/ML project demonstrating the Apriori algorithm applied to financial card
            recommendations. Users receive personalized card suggestions backed by mathematical
            association metrics — support, confidence, and lift — explained in plain English.
          </p>
        </motion.div>
      </div>

      {/* Dataset stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { label: "Cards in Dataset", value: cardsData.length, color: "text-primary" },
          { label: "Association Rules", value: associationRules.length, color: "text-accent" },
          { label: "Card Categories", value: 9, color: "text-yellow-500" },
          { label: "Banks Covered", value: new Set(cardsData.map(c => c.bank_name)).size, color: "text-purple-500" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl border border-border bg-card text-center"
          >
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* How the algorithm works */}
      <div className="mb-14">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          How the Apriori Algorithm Works
        </h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-5 rounded-xl border border-border bg-card"
            >
              <div className={`w-10 h-10 rounded-lg ${step.bg} flex items-center justify-center shrink-0`}>
                <step.icon className={`w-5 h-5 ${step.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground">Step {i + 1}</span>
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metrics explained */}
      <div className="mb-14">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Key Metrics Explained
        </h2>
        <div className="space-y-5">
          {metrics.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <h3 className={`text-lg font-bold ${m.color}`}>{m.name}</h3>
                <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">
                  {m.formula}
                </code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{m.desc}</p>
              <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                <p className="text-xs font-medium text-muted-foreground">
                  <span className="text-foreground font-semibold">Example:</span> {m.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live example rule */}
      {topRule && (
        <div className="mb-14">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Example Rule from Dataset
          </h2>
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">If user selects</span>
              {topRule.antecedent.map(a => (
                <span key={a} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-medium capitalize">
                  {a.replace(/_/g, " ")}
                </span>
              ))}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">then recommend</span>
              {topRule.consequent.map(c => (
                <span key={c} className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full font-medium capitalize">
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{topRule.description}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="text-xl font-bold text-primary">{Math.round(topRule.support * 100)}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Support</div>
                <div className="text-xs text-muted-foreground">P(A ∪ B)</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <div className="text-xl font-bold text-accent">{Math.round(topRule.confidence * 100)}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Confidence</div>
                <div className="text-xs text-muted-foreground">P(B|A)</div>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <div className="text-xl font-bold text-yellow-500">{topRule.lift.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Lift</div>
                <div className="text-xs text-muted-foreground">Conf/P(B)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apriori pseudocode */}
      <div className="mb-14">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Apriori Algorithm (Pseudocode)
        </h2>
        <div className="p-5 rounded-xl border border-border bg-card font-mono text-sm overflow-x-auto">
          <pre className="text-muted-foreground whitespace-pre leading-relaxed">
{`Input:  D = transaction database
        min_sup = minimum support threshold
        min_conf = minimum confidence threshold

L1 = {frequent 1-itemsets}

for k = 2; L(k-1) ≠ ∅; k++ do
  Ck = apriori_gen(L(k-1))    // Generate candidates
  
  for each transaction t ∈ D do
    Ct = subset(Ck, t)          // Get candidates in t
    for each candidate c ∈ Ct do
      c.count++
  
  L(k) = {c ∈ Ck | c.count/|D| ≥ min_sup}

L = ∪k L(k)

// Rule generation from frequent itemsets
for each l ∈ L do
  for each non-empty subset a ⊆ l do
    b = l - a
    confidence = support(l) / support(a)
    if confidence ≥ min_conf then
      output rule: a → b
`}
          </pre>
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="text-xl font-bold mb-6">Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl border border-border bg-card text-center hover:border-primary/40 transition-colors"
            >
              <div className="font-semibold text-sm">{tech.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{tech.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-xl border border-border bg-card/50 text-center">
          <p className="text-sm text-muted-foreground">
            Built as a demonstration of AI/ML concepts — Association Rule Mining using the Apriori algorithm
            applied to real-world financial card data. No backend required — all computation runs in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
