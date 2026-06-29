import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pega-corrupcao-search-history';
const MAX_ITEMS = 8;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string');
    return [];
  } catch {
    return [];
  }
}

function saveHistory(entries: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full — silently give up
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(loadHistory);

  /** Add a query to the top of the history (deduped, max MAX_ITEMS). */
  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      saveHistory(updated);
      return updated;
    });
  }, []);

  /** Remove a single entry. */
  const removeSearch = useCallback((query: string) => {
    setHistory((prev) => {
      const updated = prev.filter((s) => s !== query);
      saveHistory(updated);
      return updated;
    });
  }, []);

  /** Clear all history. */
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { searchHistory: history, addSearch, removeSearch, clearHistory } as const;
}
