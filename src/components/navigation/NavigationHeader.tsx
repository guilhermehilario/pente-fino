import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, History, Search } from 'lucide-react';
import type { ViewState, NavEntry } from '../../hooks/useNavigationHistory';
import { UserProfileMenu } from '../ui/UserProfileMenu';

// ─── Props ──────────────────────────────────────────────────────────────────

interface NavigationHeaderProps {
  current: ViewState;
  canGoBack: boolean;
  canGoForward: boolean;
  navEntries: NavEntry[];
  onBack: () => void;
  onForward: () => void;
  onGoTo: (index: number) => void;
  onSearchClick?: () => void;
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
  onBack,
  onForward,
  onGoTo,
  onSearchClick,
  onProfileClick,
}: NavigationHeaderProps) {
  const [showHistory, setShowHistory] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // Close on Escape
  useEffect(() => {
    if (!showHistory) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHistory(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHistory]);

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
        </button>

        {/* ── Search home ── */}
        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className={`p-2 rounded-lg transition-all ${
              current.type !== 'search'
                ? 'text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 active:bg-blue-600/30 cursor-pointer'
                : 'text-slate-700 cursor-not-allowed'
            }`}
            title={current.type !== 'search' ? 'Ir para a Busca' : 'Você já está na Busca'}
            aria-label="Ir para a Busca"
            disabled={current.type === 'search'}
          >
            <Search size={20} />
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History size={14} />
                Histórico de Navegação
                <span className="text-slate-600 font-normal normal-case">({navEntries.length})</span>
              </p>
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
