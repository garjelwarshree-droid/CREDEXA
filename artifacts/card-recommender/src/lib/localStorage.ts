export type AnalyticsData = {
  totalViews: number;
  recommendationsGenerated: number;
  popularCategories: Record<string, number>;
  popularCards: Record<string, number>;
  ruleTriggers: Record<string, number>;
};

export function getBookmarks(): string[] {
  try {
    const data = localStorage.getItem("card_bookmarks");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addBookmark(cardId: string): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(cardId)) {
    bookmarks.push(cardId);
    localStorage.setItem("card_bookmarks", JSON.stringify(bookmarks));
  }
}

export function removeBookmark(cardId: string): void {
  let bookmarks = getBookmarks();
  bookmarks = bookmarks.filter(id => id !== cardId);
  localStorage.setItem("card_bookmarks", JSON.stringify(bookmarks));
}

export function isBookmarked(cardId: string): boolean {
  return getBookmarks().includes(cardId);
}

export function getAnalyticsData(): AnalyticsData {
  try {
    const data = localStorage.getItem("card_analytics");
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  
  return {
    totalViews: 0,
    recommendationsGenerated: 0,
    popularCategories: {},
    popularCards: {},
    ruleTriggers: {}
  };
}

function saveAnalyticsData(data: AnalyticsData): void {
  localStorage.setItem("card_analytics", JSON.stringify(data));
}

export function recordCardView(cardId: string, cardType: string): void {
  const data = getAnalyticsData();
  data.totalViews += 1;
  data.popularCards[cardId] = (data.popularCards[cardId] || 0) + 1;
  data.popularCategories[cardType] = (data.popularCategories[cardType] || 0) + 1;
  saveAnalyticsData(data);
}

export function recordRecommendationSession(): void {
  const data = getAnalyticsData();
  data.recommendationsGenerated += 1;
  saveAnalyticsData(data);
}

export function recordRuleTrigger(ruleId: string): void {
  const data = getAnalyticsData();
  data.ruleTriggers[ruleId] = (data.ruleTriggers[ruleId] || 0) + 1;
  saveAnalyticsData(data);
}
