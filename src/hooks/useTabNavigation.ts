import { useState, useCallback, useRef } from 'react';
import type { ViewState, NavEntry } from './useNavigationHistory';
import { resolveTitle } from './useNavigationHistory';

// ─── Tab data ───────────────────────────────────────────────────────────────

export interface TabData {
  id: string;
  entries: NavEntry[];
  current: ViewState;
  lastDirection: 'forward' | 'backward';
}

interface TabState {
  tabs: TabData[];
  activeTabId: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_ENTRIES = 50;

function makeEntry(view: ViewState): NavEntry {
  return { view, title: resolveTitle(view), timestamp: Date.now() };
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useTabNavigation(initialView: ViewState) {
  const idCounter = useRef(1);

  const [state, setState] = useState<TabState>(() => {
    const id = `tab-${idCounter.current++}`;
    return {
      tabs: [{ id, entries: [makeEntry(initialView)], current: initialView, lastDirection: 'forward' as const }],
      activeTabId: id,
    };
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Helpers ──

  const updateState = useCallback((updater: (prev: TabState) => TabState) => {
    setState(prev => updater(prev));
  }, []);

  const updateActiveTab = useCallback((updater: (tab: TabData) => TabData) => {
    updateState(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => (t.id === prev.activeTabId ? updater(t) : t)),
    }));
  }, [updateState]);

  // ── Tab lifecycle ──

  const createTab = useCallback(() => {
    const id = `tab-${idCounter.current++}`;
    const newTab: TabData = {
      id,
      entries: [makeEntry(initialView)],
      current: initialView,
      lastDirection: 'forward',
    };
    updateState(prev => ({
      tabs: [...prev.tabs, newTab],
      activeTabId: id,
    }));
  }, [initialView, updateState]);

  const closeTab = useCallback((tabId: string) => {
    updateState(prev => {
      if (prev.tabs.length <= 1) return prev;
      const closedIndex = prev.tabs.findIndex(t => t.id === tabId);
      const filtered = prev.tabs.filter(t => t.id !== tabId);
      let newActiveId = prev.activeTabId;
      if (tabId === prev.activeTabId) {
        const newIndex = Math.min(closedIndex, filtered.length - 1);
        newActiveId = filtered[newIndex]?.id ?? filtered[0]?.id ?? '';
      }
      return { tabs: filtered, activeTabId: newActiveId };
    });
  }, [updateState]);

  const switchTab = useCallback((tabId: string) => {
    updateState(prev => (prev.tabs.some(t => t.id === tabId) ? { ...prev, activeTabId: tabId } : prev));
  }, [updateState]);

  // ── Navigation operations (on active tab) ──

  const push = useCallback((view: ViewState) => {
    const entry = makeEntry(view);
    updateActiveTab(tab => {
      const newEntries = [...tab.entries, entry];
      const trimmed = newEntries.length > MAX_ENTRIES ? newEntries.slice(-MAX_ENTRIES) : newEntries;
      return { ...tab, entries: trimmed, current: view, lastDirection: 'forward' };
    });
  }, [updateActiveTab]);

  const back = useCallback(() => {
    updateActiveTab(tab => {
      if (tab.entries.length <= 1) return tab;
      const newEntries = tab.entries.slice(0, -1);
      return { ...tab, entries: newEntries, current: newEntries[newEntries.length - 1].view, lastDirection: 'backward' };
    });
  }, [updateActiveTab]);

  const goTo = useCallback((index: number) => {
    updateActiveTab(tab => {
      if (index < 0 || index >= tab.entries.length || index === tab.entries.length - 1) return tab;
      const newEntries = tab.entries.slice(0, index + 1);
      return {
        ...tab,
        entries: newEntries,
        current: newEntries[newEntries.length - 1].view,
        lastDirection: index < tab.entries.length - 1 ? 'backward' : 'forward',
      };
    });
  }, [updateActiveTab]);

  const replace = useCallback((view: ViewState) => {
    const entry = makeEntry(view);
    updateActiveTab(tab => {
      const updated = tab.entries.length === 0 ? [entry] : [...tab.entries.slice(0, -1), entry];
      return { ...tab, entries: updated, current: view, lastDirection: 'forward' };
    });
  }, [updateActiveTab]);

  const reset = useCallback(() => {
    const entry = makeEntry(initialView);
    updateActiveTab(tab => ({
      ...tab,
      entries: [entry],
      current: initialView,
      lastDirection: 'forward',
    }));
  }, [initialView, updateActiveTab]);

  // ── Derived values ──

  const { tabs, activeTabId } = state;
  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  return {
    tabs,
    activeTabId,
    current: activeTab?.current ?? initialView,
    canGoBack: (activeTab?.entries.length ?? 0) > 1,
    lastDirection: activeTab?.lastDirection ?? 'forward',
    navEntries: activeTab?.entries ?? [],
    push,
    back,
    goTo,
    replace,
    reset,
    createTab,
    closeTab,
    switchTab,
  } as const;
}
