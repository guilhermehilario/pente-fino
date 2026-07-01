import { useState, useCallback, useEffect, useRef } from 'react';
import { mockCompanies, mockPoliticians } from '../data/mockData';

// ─── ViewState types (simplified, no parentView) ────────────────────────────

export type ViewState =
  | { type: 'search' }
  | { type: 'company'; companyId: number }
  | { type: 'person'; personId: number }
  | { type: 'company-detail'; companyId: number }
  | { type: 'politician-detail'; politicianId: number }
  | { type: 'graph'; centerType?: 'politician' | 'company'; centerId?: number }
  | { type: 'cross-reference'; searchQuery?: string }
  | { type: 'profile' };

// ─── History entry ──────────────────────────────────────────────────────────

export interface NavEntry {
  view: ViewState;
  title: string;
  timestamp: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

// Incrementada sempre que o schema do ViewState muda (ex: adicionar companyId/personId)
const STORAGE_VERSION = 3;
const STORAGE_KEY = `pega-corrupcao-nav-history-v${STORAGE_VERSION}`;
const MAX_ENTRIES = 50;

function resolveTitle(view: ViewState): string {
  switch (view.type) {
    case 'search':
      return 'Busca';
    case 'company': {
      const c = mockCompanies[view.companyId];
      return c ? c.name : 'Dashboard da Empresa';
    }
    case 'person': {
      const p = mockPoliticians[view.personId];
      return p ? p.name : 'Dashboard da Pessoa';
    }
    case 'company-detail': {
      const c = mockCompanies[view.companyId];
      return c ? c.name : 'Detalhes da Empresa';
    }
    case 'politician-detail': {
      const p = mockPoliticians[view.politicianId];
      return p ? p.name : 'Detalhes do Político';
    }
    case 'graph':
      return 'Mapa de Conexões';
    case 'cross-reference':
      return 'Dashboard de Cruzamento';
    case 'profile':
      return 'Meu Perfil';
  }
}

/** Valida se um valor bruto do localStorage é uma NavEntry com schema correto. */
function isValidEntry(raw: unknown): raw is NavEntry {
  if (!raw || typeof raw !== 'object') return false;
  const entry = raw as Record<string, unknown>;

  // Deve ter view, title (string) e timestamp (number)
  if (typeof entry.title !== 'string' || typeof entry.timestamp !== 'number') return false;

  const v = entry.view;
  if (!v || typeof v !== 'object') return false;
  const view = v as Record<string, unknown>;

  // type é obrigatório em qualquer ViewState
  if (typeof view.type !== 'string') return false;

  // Valida campos obrigatórios por tipo
  switch (view.type) {
    case 'search':
      return true; // sem campos adicionais
    case 'company':
    case 'company-detail':
      return typeof view.companyId === 'number';
    case 'person':
      return typeof view.personId === 'number';
    case 'politician-detail':
      return typeof view.politicianId === 'number';
    case 'graph':
      if (view.centerType !== undefined && view.centerType !== 'politician' && view.centerType !== 'company') return false;
      if (view.centerId !== undefined && typeof view.centerId !== 'number') return false;
      return true;
    case 'cross-reference':
      return true;
    case 'profile':
      return true;
    default:
      return false; // tipo desconhecido
  }
}

function loadHistory(): NavEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filtra apenas entradas com schema válido
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

function saveHistory(entries: NavEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage may be full — trim aggressively and retry once
    try {
      const trimmed = entries.slice(-10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // give up
    }
  }
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useNavigationHistory(initialView: ViewState) {
  const [history, setHistory] = useState<NavEntry[]>(() => {
    const stored = loadHistory();
    if (stored.length === 0) {
      return [{ view: initialView, title: resolveTitle(initialView), timestamp: Date.now() }];
    }
    return stored;
  });
  const [canGoForward, setCanGoForward] = useState(false);
  // Track last navigation direction for transition animations
  const [lastDirection, setLastDirection] = useState<'forward' | 'backward'>('forward');

  // Track forward entries for canGoForward indicator
  const forwardStackRef = useRef<NavEntry[]>([]);
  // Track initialView in a ref so we don't re-run the effect when it changes
  const initialRef = useRef(initialView);
  // Keep a mutable ref to the latest history for the popstate handler
  const historyRef = useRef(history);
  historyRef.current = history;

  // ── Persist to localStorage on every change ──
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // ── Sync with browser history API ──
  useEffect(() => {
    // Set initial history state if not already set
    const currentState = window.history.state;
    if (!currentState || !currentState.entries) {
      try {
        window.history.replaceState(
          { entries: JSON.stringify(history) },
          ''
        );
      } catch {}
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;

      if (state?.entries) {
        try {
          const restored: NavEntry[] = JSON.parse(state.entries);
          if (Array.isArray(restored) && restored.length > 0) {
            const currentLen = historyRef.current.length;

            // Determine navigation direction by comparing stack sizes
            if (restored.length < currentLen) {
              // User went back → store the skipped entries in forward stack
              forwardStackRef.current = historyRef.current.slice(restored.length);
              setLastDirection('backward');
            } else if (restored.length > currentLen) {
              // User went forward → remove entries from forward stack
              const diff = restored.length - currentLen;
              forwardStackRef.current = forwardStackRef.current.slice(diff);
              setLastDirection('forward');
            } else {
              // Same length — can happen after replaceState or goTo.
              // Default to 'backward' since this is typically a browser back action.
              setLastDirection('backward');
            }

            setHistory(restored);
            setCanGoForward(forwardStackRef.current.length > 0);
            return;
          }
        } catch {}
      }

      // No valid state — user navigated to a non-app browser history entry.
      // Reset to the initial screen to keep app and browser in sync.
      const fallbackEntry: NavEntry = {
        view: initialRef.current,
        title: resolveTitle(initialRef.current),
        timestamp: Date.now(),
      };
      setHistory([fallbackEntry]);
      setLastDirection('backward');
      setCanGoForward(false);
      forwardStackRef.current = [];
      try {
        window.history.replaceState({ entries: JSON.stringify([fallbackEntry]) }, '');
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const current: ViewState = history[history.length - 1]?.view ?? initialRef.current;
  const canGoBack = history.length > 1;

  /** Navigate forward — pushes a new entry onto the stack. Clears forward stack. */
  const push = useCallback((view: ViewState) => {
    const entry: NavEntry = { view, title: resolveTitle(view), timestamp: Date.now() };

    // Read latest history from ref (always up-to-date after each render)
    const newHistory = [...historyRef.current, entry];
    const trimmed = newHistory.length > MAX_ENTRIES ? newHistory.slice(-MAX_ENTRIES) : newHistory;

    setHistory(trimmed);
    setLastDirection('forward');

    try {
      window.history.pushState({ entries: JSON.stringify(trimmed) }, '');
    } catch {}

    forwardStackRef.current = [];
    setCanGoForward(false);
  }, []);

  /** Go back one step using browser history API. Does nothing if already at the root. */
  const back = useCallback(() => {
    if (historyRef.current.length <= 1) return;
    setLastDirection('backward');
    window.history.back(); // Triggers popstate → updates history
  }, []);

  /** Go forward one step using browser history API. */
  const forward = useCallback(() => {
    setLastDirection('forward');
    window.history.forward(); // Triggers popstate → updates history
  }, []);

  /**
   * Jump to a specific index in the history stack.
   * Directly updates the app state and syncs the browser via replaceState,
   * avoiding the fragility of window.history.go() + popstate synchronization.
   */
  const goTo = useCallback((index: number) => {
    const entries = historyRef.current;
    const prevLen = entries.length;
    if (index < 0 || index >= prevLen) return;
    if (index === prevLen - 1) return;

    // Determine direction for transition animations
    setLastDirection(index < prevLen - 1 ? 'backward' : 'forward');

    // Slice history to the target index (inclusive) and update directly
    const targetEntries = entries.slice(0, index + 1);
    setHistory(targetEntries);

    // Sync browser state so back/forward remain usable
    try {
      window.history.replaceState({ entries: JSON.stringify(targetEntries) }, '');
    } catch {}

    // Clear forward stack since we're jumping within the current history
    forwardStackRef.current = [];
    setCanGoForward(false);
  }, []);

  /**
   * Replace the last entry in the stack with a new view.
   * Unlike `push()`, this does not add a new history entry — it replaces the
   * current one. Useful when navigating from a summary view to its detail
   * (e.g., CompanyDashboard → CompanyDetailScreen) where both represent the
   * same entity at different detail levels.
   */
  const replace = useCallback((view: ViewState) => {
    const entry: NavEntry = { view, title: resolveTitle(view), timestamp: Date.now() };

    // Read latest history from ref (always up-to-date after each render)
    const currentHistory = historyRef.current;
    const updated = currentHistory.length === 0 ? [entry] : [...currentHistory.slice(0, -1), entry];

    setHistory(updated);

    try {
      window.history.replaceState({ entries: JSON.stringify(updated) }, '');
    } catch {}

    forwardStackRef.current = [];
    setCanGoForward(false);
  }, []);

  /** Clear history and reset to the initial view. Cannot go forward after reset. */
  const reset = useCallback(() => {
    const entry: NavEntry = {
      view: initialRef.current,
      title: resolveTitle(initialRef.current),
      timestamp: Date.now(),
    };
    const updated = [entry];

    try {
      window.history.replaceState({ entries: JSON.stringify(updated) }, '');
    } catch {}

    forwardStackRef.current = [];
    setCanGoForward(false);
    setHistory(updated);
  }, []);

  const navEntries = history;

  return { current, canGoBack, canGoForward, lastDirection, navEntries, push, back, forward, replace, goTo, reset } as const;
}
