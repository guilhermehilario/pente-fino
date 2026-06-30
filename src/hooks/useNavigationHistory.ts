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
  | { type: 'cross-reference' };

// ─── History entry ──────────────────────────────────────────────────────────

interface NavEntry {
  view: ViewState;
  title: string;
  timestamp: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

// Incrementada sempre que o schema do ViewState muda (ex: adicionar companyId/personId)
const STORAGE_VERSION = 2;
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

  // Track initialView in a ref so we don't re-run the effect when it changes
  const initialRef = useRef(initialView);

  // Persist to localStorage on every change
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const current: ViewState = history[history.length - 1]?.view ?? initialRef.current;
  const canGoBack = history.length > 1;

  /** Navigate forward — pushes a new entry onto the stack. */
  const push = useCallback((view: ViewState) => {
    setHistory((prev) => {
      const next: NavEntry = { view, title: resolveTitle(view), timestamp: Date.now() };
      const updated = [...prev, next];
      return updated.length > MAX_ENTRIES ? updated.slice(updated.length - MAX_ENTRIES) : updated;
    });
  }, []);

  /** Go back one step. Does nothing if already at the root. */
  const back = useCallback(() => {
    setHistory((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  }, []);

  /** Jump to a specific index in the history. Truncates everything after it. */
  const goTo = useCallback((index: number) => {
    setHistory((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      return prev.slice(0, index + 1);
    });
  }, []);

  /** Clear history and reset to the initial view. */
  const reset = useCallback(() => {
    const entry: NavEntry = {
      view: initialRef.current,
      title: resolveTitle(initialRef.current),
      timestamp: Date.now(),
    };
    setHistory([entry]);
    // useEffect will persist automatically
  }, []);

  const navEntries = history;

  return { current, canGoBack, navEntries, push, back, goTo, reset } as const;
}
