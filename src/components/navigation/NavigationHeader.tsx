import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, History, Plus, BookmarkPlus, X, Layers } from 'lucide-react';
import type { ViewState, NavEntry } from '../../hooks/useNavigationHistory';
import type { TabData } from '../../hooks/useTabNavigation';
import { UserProfileMenu } from '../ui/UserProfileMenu';
import { useAuth } from '../../context/AuthContext';

// ─── Props ──────────────────────────────────────────────────────────────────

interface NavigationHeaderProps {
  current: ViewState;
  canGoBack: boolean;
  canGoForward: boolean;
  navEntries: NavEntry[];
  tabs: TabData[];
  activeTabId: string;
  onBack: () => void;
  onForward: () => void;
  onGoTo: (index: number) => void;
  onNewTab?: () => void;
  onSwitchTab?: (tabId: string) => void;
  onCloseTab?: (tabId: string) => void;
  onProfileClick?: () => void;
}

// ─── Icon mapping per view type ────────────────────────────────────────────

const viewIcons: Record<ViewState['type'], string> = {
  search: '🔍',
  company: '🏢',
  person: '👤',
  'company-detail': '🏭',
  'politician-detail': '👤',
  graph: '🔗',
  'cross-reference': '⚖️',
};

// ─── Component ──────────────────────────────────────────────────────────────

export function NavigationHeader({
  current,
  canGoBack,
  canGoForward,
  navEntries,
  tabs,
  activeTabId,
  onBack,
  onForward,
  onGoTo,
  onNewTab,
  onSwitchTab,
  onCloseTab,
  onProfileClick,
}: NavigationHeaderProps) {
  const { isAuthenticated, user } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tabSwitcherRef = useRef<HTMLDivElement>(null);
  const tabSwitcherTriggerRef = useRef<HTMLDivElement>(null);
  const tabSwitcherTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showHistory) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    // Delay adding listener so the trigger click doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHistory]);

  // Close tab switcher on click outside
  useEffect(() => {
    if (!showTabSwitcher) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tabSwitcherRef.current &&
        !tabSwitcherRef.current.contains(e.target as Node) &&
        tabSwitcherTriggerRef.current &&
        !tabSwitcherTriggerRef.current.contains(e.target as Node)
      ) {
        setShowTabSwitcher(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTabSwitcher]);

  // Close on Escape for both
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowHistory(false);
        setShowTabSwitcher(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openTabSwitcher = () => {
    if (tabSwitcherTimer.current) clearTimeout(tabSwitcherTimer.current);
    setShowTabSwitcher(true);
  };

  const closeTabSwitcherDelayed = () => {
    tabSwitcherTimer.current = setTimeout(() => {
      setShowTabSwitcher(false);
    }, 200);
  };

  const cancelCloseTabSwitcher = () => {
    if (tabSwitcherTimer.current) clearTimeout(tabSwitcherTimer.current);
  };

  const currentTitle = navEntries.length > 0
    ? navEntries[navEntries.length - 1].title
    : '';

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="flex items-center gap-1 px-4 py-2 max-w-7xl mx-auto">
        {/* ── Back ── */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`p-2 rounded-lg transition-all ${
            canGoBack
              ? 'text-slate-300 hover:bg-slate-700/70 hover:text-white active:bg-slate-700 cursor-pointer'
              : 'text-slate-700 cursor-not-allowed'
          }`}
          title="Voltar (browser back)"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} />
        </button>

        {/* ── Forward ── */}
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className={`p-2 rounded-lg transition-all ${
            canGoForward
              ? 'text-slate-300 hover:bg-slate-700/70 hover:text-white active:bg-slate-700 cursor-pointer'
              : 'text-slate-700 cursor-not-allowed'
          }`}
          title="Avançar (browser forward)"
          aria-label="Avançar"
        >
          <ChevronRight size={20} />
        </button>        {/* ── New Tab ── */}
        {onNewTab && (
          <button
            onClick={onNewTab}
            className="p-2 rounded-lg transition-all text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 active:bg-emerald-600/30 cursor-pointer"
            title="Nova Aba"
            aria-label="Nova Aba">
            <Plus size={20} />
          </button>
        )}

        {/* ── Separator ── */}
        <div className="w-px h-6 bg-slate-700/60 mx-2 flex-shrink-0" />

        {/* ── Breadcrumb / History trigger ── */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <History size={16} className="text-slate-500 flex-shrink-0 hidden sm:block" />

          {/* Breadcrumb: show last few entries as clickable crumbs */}
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-none">
            {navEntries.length > 3 && (
              <span className="text-xs text-slate-500 flex-shrink-0">...</span>
            )}
            {navEntries.slice(-3).map((entry, idx) => {
              const isLast = idx === navEntries.slice(-3).length - 1;
              const globalIndex = navEntries.length - 3 + idx;
              const icon = viewIcons[entry.view.type] ?? '📄';

              // Last item with multiple tabs → acts as tab switcher trigger
              if (isLast && tabs.length > 1) {
                return (
                  <div
                    key={globalIndex}
                    ref={tabSwitcherTriggerRef}
                    className="relative"
                    onMouseEnter={openTabSwitcher}
                    onMouseLeave={closeTabSwitcherDelayed}
                  >
                    <button
                      onClick={() => setShowTabSwitcher(prev => !prev)}
                      className={`flex items-center gap-1.5 text-sm truncate max-w-[180px] px-2 py-1 rounded-md transition-all whitespace-nowrap text-blue-400 font-medium cursor-pointer hover:bg-blue-600/10 ${
                        showTabSwitcher ? 'bg-blue-600/15' : ''
                      }`}
                      title={`Página atual: ${entry.title} (${tabs.length} abas abertas)`}
                    >
                      <span className="flex-shrink-0 text-sm leading-none">{icon}</span>
                      <span key={entry.title} className="animate-title-enter truncate">
                        {entry.title}
                      </span>
                      <Layers size={14} className="text-blue-400/60 flex-shrink-0 ml-0.5" />
                    </button>

                    {/* Tab Switcher Popover */}
                    {showTabSwitcher && (
                      <div
                        ref={tabSwitcherRef}
                        className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                        onMouseEnter={cancelCloseTabSwitcher}
                        onMouseLeave={closeTabSwitcherDelayed}
                      >
                        <div className="px-4 py-3 border-b border-slate-700/50">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Layers size={14} />
                            Abas Abertas
                            <span className="text-slate-600 font-normal normal-case">({tabs.length})</span>
                          </p>
                        </div>
                        <div className="max-h-[40vh] overflow-y-auto py-1">
                          {tabs.map((tab) => {
                            const isCurrentTab = tab.id === activeTabId;
                            const tabIcon = viewIcons[tab.current.type] ?? '📄';
                            const tabTitle = tab.entries.length > 0
                              ? tab.entries[tab.entries.length - 1].title
                              : 'Busca';
                            return (
                              <div
                                key={tab.id}
                                className={`flex items-center gap-3 px-4 py-2.5 text-left transition-all border-l-2 cursor-pointer ${
                                  isCurrentTab
                                    ? 'bg-blue-600/10 border-l-blue-500'
                                    : 'border-l-transparent hover:bg-slate-700/50 hover:border-l-slate-500'
                                }`}
                                onClick={() => {
                                  onSwitchTab?.(tab.id);
                                  setShowTabSwitcher(false);
                                }}
                              >
                                {/* Icon */}
                                <span className="flex-shrink-0 text-base leading-none">{tabIcon}</span>

                                {/* Title + page count */}
                                <div className="min-w-0 flex-1">
                                  <p className={`text-sm truncate ${
                                    isCurrentTab ? 'text-blue-400 font-medium' : 'text-slate-200'
                                  }`}>
                                    {tabTitle}
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    {tab.entries.length} página(s)
                                  </p>
                                </div>

                                {/* Close button */}
                                {tabs.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCloseTab?.(tab.id);
                                    }}
                                    className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-600/50 transition-all flex-shrink-0"
                                    title="Fechar aba"
                                    aria-label={`Fechar ${tabTitle}`}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={globalIndex}
                  onClick={() => {
                    onGoTo(globalIndex);
                    setShowHistory(false);
                  }}
                  className={`flex items-center gap-1.5 text-sm truncate max-w-[180px] px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                    isLast
                      ? 'text-blue-400 font-medium cursor-default'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 cursor-pointer'
                  }`}
                  title={isLast ? `Página atual: ${entry.title}` : `Ir para: ${entry.title}`}
                >
                  {/* Icon */}
                  <span className="flex-shrink-0 text-sm leading-none">{icon}</span>

                  {/* Title — animated on the current breadcrumb */}
                  {isLast ? (
                    <span key={entry.title} className="animate-title-enter truncate">
                      {entry.title}
                    </span>
                  ) : (
                    <span className="truncate">{entry.title}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dropdown toggle button */}
          {navEntries.length > 1 && (
            <button
              ref={buttonRef}
              onClick={() => setShowHistory(!showHistory)}
              className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                showHistory
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
              title="Histórico completo"
              aria-label="Histórico de navegação"
              aria-expanded={showHistory}
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>

          {/* ── Profile / Avatar ── */}
        <div className="flex items-center ml-auto pl-2 border-l border-slate-700/40">
          <UserProfileMenu onProfileClick={onProfileClick} />
        </div>

        {/* ── History Dropdown ── */}
        {showHistory && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-4 right-4 mt-1 max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <History size={14} />
                  Histórico de Navegação
                  <span className="text-slate-600 font-normal normal-case">({navEntries.length})</span>
                </p>
                {isAuthenticated && user && (
                  <button
                    onClick={() => {
                      try {
                        const savedKey = `pega-corrupcao-saved-nav-${user.email}`;
                        localStorage.setItem(savedKey, JSON.stringify(navEntries));
                        setHistorySaved(true);
                        setTimeout(() => setHistorySaved(false), 2000);
                      } catch {
                        // silently give up
                      }
                    }}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${ historySaved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-600/50'}`}
                    title="Salvar histórico de navegação atual"
                    aria-label="Salvar histórico">
                    <BookmarkPlus size={14} />
                    {historySaved ? 'Salvo!' : 'Salvar'}
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-1">
              {navEntries.map((entry, idx) => {
                const isCurrent = idx === navEntries.length - 1;
                return (
                  <button
                    key={`${entry.timestamp}-${idx}`}
                    onClick={() => {
                      onGoTo(idx);
                      setShowHistory(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2 ${
                      isCurrent
                        ? 'bg-blue-600/10 border-l-blue-500 cursor-default'
                        : 'border-l-transparent hover:bg-slate-700/50 hover:border-l-slate-500 cursor-pointer'
                    }`}
                    disabled={isCurrent}
                  >
                    {/* Position badge */}
                    <span className={`text-xs font-mono w-6 flex-shrink-0 ${
                      isCurrent ? 'text-blue-400' : 'text-slate-500'
                    }`}>
                      #{idx + 1}
                    </span>

                    {/* Icon */}
                    <span className="flex-shrink-0 text-base leading-none">
                      {viewIcons[entry.view.type] ?? '📄'}
                    </span>

                    {/* Title + time */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm truncate ${
                        isCurrent ? 'text-blue-400 font-medium' : 'text-slate-200'
                      }`}>
                        {entry.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {formatTimestamp(entry.timestamp)}
                      </p>
                    </div>

                    {/* View type badge */}
                    <span className="text-[10px] uppercase tracking-wider text-slate-600 bg-slate-800 px-2 py-0.5 rounded flex-shrink-0">
                      {entry.view.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Há ${days}d`;
}
