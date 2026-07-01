import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light';

export interface UserPreferences {
  /** Tema da aplicação */
  theme: ThemeMode;
  /** Filtros de busca salvos (persistidos entre sessões) */
  savedFilters: Record<string, string[]>;
  /** Layout compacto para tabelas e cards */
  compactView: boolean;
}

interface PreferencesContextType {
  preferences: UserPreferences;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSavedFilters: (filters: Record<string, string[]>) => void;
  clearSavedFilters: () => void;
  setCompactView: (compact: boolean) => void;
}

// ─── Storage ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pega-corrupcao-preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  savedFilters: {},
  compactView: false,
};

function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      savedFilters: parsed.savedFilters && typeof parsed.savedFilters === 'object' ? parsed.savedFilters : {},
      compactView: typeof parsed.compactView === 'boolean' ? parsed.compactView : false,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // silently give up
  }
}

// ─── Apply theme to document ────────────────────────────────────────────────

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  root.classList.toggle('theme-light', theme === 'light');
}

// ─── Context ────────────────────────────────────────────────────────────────

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const loaded = loadPreferences();
    applyTheme(loaded.theme);
    return loaded;
  });

  // Persist on every change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const setTheme = useCallback((theme: ThemeMode) => {
    setPreferences((prev) => ({ ...prev, theme }));
    applyTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences((prev) => {
      const newTheme: ThemeMode = prev.theme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      return { ...prev, theme: newTheme };
    });
  }, []);

  const setSavedFilters = useCallback((filters: Record<string, string[]>) => {
    setPreferences((prev) => ({ ...prev, savedFilters: filters }));
  }, []);

  const clearSavedFilters = useCallback(() => {
    setPreferences((prev) => ({ ...prev, savedFilters: {} }));
  }, []);

  const setCompactView = useCallback((compact: boolean) => {
    setPreferences((prev) => ({ ...prev, compactView: compact }));
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setTheme,
        toggleTheme,
        setSavedFilters,
        clearSavedFilters,
        setCompactView,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences deve ser usado dentro de um PreferencesProvider');
  }
  return context;
}
