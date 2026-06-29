import React, { useState, useRef } from 'react';
import { Fingerprint, ScanLine, Filter, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { buttons, inputs, texts, containers, cards } from '../globalStyle';

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

export function SearchScreen({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
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
              
              <button 
                type="submit"
                className={buttons.primary}
              >
                Pesquisar
              </button>
            </div>
          </div>
        </form>

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
      </div>
    </div>
  );
}
