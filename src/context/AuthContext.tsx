import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  name: string;
  email: string;
  avatar: string; // initials fallback
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

// ─── Storage ────────────────────────────────────────────────────────────────

const AUTH_KEY = 'pega-corrupcao-auth';
const USERS_KEY = 'pega-corrupcao-users';

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((u): u is StoredUser => u && typeof u.name === 'string' && typeof u.email === 'string' && typeof u.password === 'string');
    return [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // silently give up
  }
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string' && typeof parsed.email === 'string') {
      return { name: parsed.name, email: parsed.email, avatar: getInitials(parsed.name) };
    }
    return null;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ name: user.name, email: user.email }));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadSession();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    const users = loadUsers();

    // Verifica se e-mail já está cadastrado
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

    const newStored: StoredUser = { name, email, password };
    saveUsers([...users, newStored]);

    // Loga automaticamente após cadastro
    const newUser: AuthUser = { name, email, avatar: getInitials(name) };
    setUser(newUser);
    saveSession(newUser);
    return true;
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found || found.password !== password) {
      return false;
    }

    const authUser: AuthUser = { name: found.name, email: found.email, avatar: getInitials(found.name) };
    setUser(authUser);
    saveSession(authUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
