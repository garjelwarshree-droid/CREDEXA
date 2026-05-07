import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkX, Heart, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardVisual } from "@/components/CardVisual";
import { cardsData } from "@/data/cards";
import { getBookmarks, removeBookmark } from "@/lib/localStorage";
import { Link } from "wouter";

export default function Bookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>(() => getBookmarks());

  const bookmarkedCards = bookmarkIds
    .map(id => cardsData.find(c => c.id === id))
    .filter(Boolean) as typeof cardsData;

  function handleRemove(id: string) {
    removeBookmark(id);
    setBookmarkIds(getBookmarks());
  }

  const categoryCount = bookmarkedCards.reduce(
    (acc, c) => ({ ...acc, [c.card_type]: (acc[c.card_type] || 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bookmark className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Saved Cards</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Cards you've bookmarked for quick access. Data is stored in your browser.
        </p>
      </div>

      {bookmarkedCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 border border-dashed border-border rounded-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No saved cards yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Bookmark cards while browsing or from AI recommendations to see them here.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/search">
              <Button variant="outline" data-testid="button-browse-cards">Browse Cards</Button>
            </Link>
            <Link href="/recommendations">
              <Button data-testid="button-get-recs">Get Recommendations</Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <div className="text-2xl font-bold text-primary">{bookmarkedCards.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Cards Saved</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center">
              <div className="text-2xl font-bold text-accent">{Object.keys(categoryCount).length}</div>
              <div className="text-xs text-muted-foreground mt-1">Categories</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-yellow-500">
                {bookmarkedCards.length > 0
                  ? (bookmarkedCards.reduce((s, c) => s + c.card_rating, 0) / bookmarkedCards.length).toFixed(1)
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Avg Rating</div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(categoryCount).map(([type, count]) => (
              <Badge key={type} variant="secondary" className="gap-1">
                {type} <span className="font-bold text-primary">{count}</span>
              </Badge>
            ))}
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bookmarkedCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-3"
                  data-testid={`bookmark-card-${card.id}`}
                >
                  <CardVisual card={card} />
                  <div className="w-full max-w-[340px]">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{card.card_name}</p>
                        <p className="text-xs text-muted-foreground">{card.bank_name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{card.card_type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {card.cashback_percentage > 0 && (
                        <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
                          {card.cashback_percentage}% Cashback
                        </span>
                      )}
                      {card.annual_fee === 0 && (
                        <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                          Zero Fee
                        </span>
                      )}
                      {card.lounge_access && (
                        <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                          Lounge
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/cards/${card.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full text-xs gap-1" data-testid={`button-view-${card.id}`}>
                          View <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Link href={`/compare?ids=${card.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs gap-1" data-testid={`button-compare-${card.id}`}>
                          <TrendingUp className="w-3 h-3" />
                        </Button>
                      </Link>
                      <button
                        data-testid={`button-remove-bookmark-${card.id}`}
                        onClick={() => handleRemove(card.id)}
                        className="px-2 py-1.5 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
                        title="Remove bookmark"
                      >
                        <BookmarkX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
