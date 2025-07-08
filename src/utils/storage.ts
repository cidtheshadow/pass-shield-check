
import { SearchHistoryItem } from '@/components/SearchHistory';

const STORAGE_KEY = 'securepass_history';

export const saveSearchToHistory = (
  type: 'email' | 'password',
  query: string,
  hasBreaches: boolean,
  breachCount?: number
): void => {
  try {
    const existing = getSearchHistory();
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      type,
      query: type === 'password' ? '*'.repeat(query.length) : query, // Mask passwords in history
      timestamp: Date.now(),
      hasBreaches,
      breachCount,
    };

    // Remove duplicate entries for the same query
    const filtered = existing.filter(item => 
      !(item.type === type && item.query === newItem.query)
    );

    const updated = [newItem, ...filtered].slice(0, 10); // Keep only last 10 searches
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving search to history:', error);
  }
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading search history:', error);
    return [];
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};
