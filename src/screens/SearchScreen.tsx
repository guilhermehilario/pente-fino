import React, { useState, useRef, useCallback } from 'react';
import { Fingerprint, ScanLine, Filter, Upload, ChevronDown, ChevronUp, X, Clock, Gavel } from 'lucide-react';
import { buttons, inputs, texts, containers, cards } from '../globalStyle';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const FILTER_CATEGORIES = [
  {
    id: 'criticidade',
    label: 'Criticidade',
    options: ['Alerta Vermelho', 'Alerta Laranja', 'Alerta Amarelo', 'Alerta Verde']
  },
  {
    id: 'confiabilidade',
    label: 'Confiabilidade',
    options: ['Conformado', 'Verificado', 'Suspeita']
  },
  {
    id: 'checagem',
    label: 'Checagem de dados',
    options: ['Dado confirmado por Sentença Judicial', 'Suspeita baseada em Inquérito Policial', 'Apenas vínculo contratual']
  },
  {
    id: 'ano',
    label: 'Ano de acontecimento',
    options: ['2026', '2025', '2024', '2023', '2022']
  }
];

const FILTER_COUNT = (filters: Record<string, string[]>) =>
  Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

type DialogMode = 'search' | 'clear';

interface SearchScreenProps {
  onSearch: (query: string) => void;
  searchHistory: string[];
  onRemoveSearch: (query: string) => void;
  onClearHistory: () => void;
  onCrossReferenceClick?: () => void;
}

export function SearchScreen({ onSearch, searchHistory, onRemoveSearch, onClearHistory, onCrossReferenceClick }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('search');
  const [pendingQuery, setPendingQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);
  const totalFilters = FILTER_COUNT(selectedFilters);

  const executeSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (hasActiveFilters) {
      setPendingQuery(query.trim());
      setDialogMode('search');
      setShowConfirmDialog(true);
    } else {
      executeSearch(query.trim());
    }
  };

  const handleClearAllClick = () => {
    setDialogMode('clear');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmDialog(false);
    if (dialogMode === 'search') {
      executeSearch(pendingQuery);
    } else {
      setSelectedFilters({});
    }
    setPendingQuery('');
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setPendingQuery('');
  };

  const toggleFilter = (categoryId: string, option: string) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[categoryId] || [];
      if (categoryFilters.includes(option)) {
        return { ...prev, [categoryId]: categoryFilters.filter(item => item !== option) };
      } else {
        return { ...prev, [categoryId]: [...categoryFilters, option] };
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Logic to handle local files would go here
      console.log('Files selected:', files);
      alert(`${files.length} arquivo(s) selecionado(s) para busca local.`);
    }
  };

  return (
    <div className={containers.screenSearch}>
      <div className={containers.searchWrapper}>
        <div className="flex justify-center mb-10">
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 overflow-hidden">
            <Fingerprint size={56} className="text-white/40" />
            <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.8)] animate-scanner" />
          </div>
        </div>
        
        <div>
          <h1 className={texts.h1Search}>
            Pente<span className="text-blue-500">Fino</span>
          </h1>
          <p className={texts.subtitleSearch}>
            Pesquise por CNPJ, Razão Social ou Nome do Político/Sócio
          </p>
        </div>

        <form onSubmit={handleSubmit} className={containers.searchForm}>
          <div className={inputs.searchBarContainer}>
            <ScanLine className="ml-6 mr-3 text-slate-400 flex-shrink-0 group-focus-within:text-blue-400 transition-colors" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: TechNova, Roberto Alves..."
              className={inputs.searchInput}
            />
            
            <div className="flex items-center gap-1 pr-2.5 flex-shrink-0">
              <div className="h-8 w-px bg-slate-700 mx-1"></div>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? buttons.iconSearchActive : buttons.iconSearchInactive}
                title="Filtros"
              >
                <Filter size={20} />
              </button>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.json,.md"
                multiple
                className="hidden" 
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={buttons.iconSearchUpload}
                title="Adicionar Arquivos Locais"
              >
                <Upload size={20} />
              </button>
              
        <div className="flex items-center gap-1">
          {onCrossReferenceClick && (
            <button
              type="button"
              onClick={onCrossReferenceClick}
              className="p-2.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-all flex items-center gap-2"
              title="Dashboard de Cruzamento"
            >
              <Gavel size={20} />
            </button>
          )}
          <button 
            type="submit"
            className={buttons.primary}
          >
            <span className="hidden sm:inline">Pesquisar</span>
            <ScanLine className="sm:hidden" size={20} />
          </button>
        </div>
            </div>
          </div>
        </form>

        {/* Histórico de buscas */}
        {searchHistory.length > 0 && (
          <div className="mt-8 max-w-2xl mx-auto text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Clock size={14} /> Buscas Recentes
              </h3>
              <button
                onClick={onClearHistory}
                className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-wider font-medium"
              >
                Limpar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item) => (
                <div
                  key={item}
                  className="group flex items-center gap-1 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-full pl-3 pr-1 py-1.5 transition-all cursor-pointer"
                  onClick={() => {
                    setQuery(item);
                    if (hasActiveFilters) {
                      setPendingQuery(item);
                      setDialogMode('search');
                      setShowConfirmDialog(true);
                    } else {
                      onSearch(item);
                    }
                  }}
                >
                  <Clock size={12} className="text-slate-500 shrink-0" />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors truncate max-w-[180px]">{item}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSearch(item);
                    }}
                    className="p-1 rounded-full text-slate-600 hover:text-slate-300 hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    title="Remover"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.values(selectedFilters).some(arr => arr.length > 0) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-in fade-in slide-in-from-top-2">
            {Object.entries(selectedFilters).map(([categoryId, options]) => (
              options.map(option => (
                <span 
                  key={`${categoryId}-${option}`} 
                  className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30 flex items-center gap-2 group cursor-default"
                >
                  {option}
                  <button 
                    type="button"
                    onClick={() => toggleFilter(categoryId, option)}
                    className="hover:text-blue-200 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                    title="Remover filtro"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))
            ))}
            <button 
              onClick={handleClearAllClick}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors ml-2 font-medium"
            >
              Limpar todos
            </button>
          </div>
        )}

        {showFilters && (
          <div className={cards.filterPanel}>
            <h3 className={texts.h3Filter}>
              <Filter size={18} className="text-blue-500" />
              Filtros Avançados
            </h3>
            
            <div className={containers.filtersGrid}>
              {FILTER_CATEGORIES.map((category) => (
                <div key={category.id} className={containers.filterCategoryCol}>
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className={buttons.categoryToggle}
                  >
                    <span className="text-sm truncate mr-2">{category.label}</span>
                    {expandedCategory === category.id ? (
                      <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className={containers.filterOptionsWrapper}>
                      {category.options.map((option) => {
                        const isSelected = selectedFilters[category.id]?.includes(option);
                        return (
                          <div 
                            key={option} 
                            onClick={() => toggleFilter(category.id, option)}
                            className={inputs.checkboxWrapper}
                          >
                            <div className={isSelected ? inputs.checkboxBoxActive : inputs.checkboxBoxInactive}>
                              {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={texts.checkboxLabel}>
                              {option}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          open={showConfirmDialog}
          title={dialogMode === 'search' ? 'Filtros ativos' : 'Limpar todos os filtros'}
          description={
            dialogMode === 'search'
              ? `Você selecionou ${totalFilters} filtro(s). Deseja continuar com a pesquisa mantendo os filtros aplicados? Eles serão considerados na busca.`
              : `Você tem ${totalFilters} filtro(s) aplicados. Deseja realmente remover todos os filtros?`
          }
          confirmLabel={dialogMode === 'search' ? 'Pesquisar com Filtros' : 'Sim, Limpar Tudo'}
          cancelLabel="Cancelar"
          variant={dialogMode === 'search' ? 'warning' : 'danger'}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelDialog}
        />
      </div>
    </div>
  );
}
