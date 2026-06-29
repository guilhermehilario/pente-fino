import React, { useState, useRef } from 'react';
import { Fingerprint, ScanLine, Filter, Upload, ChevronDown, ChevronUp, FileText } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-6 py-12 font-sans selection:bg-blue-500/30 overflow-y-auto">
      <div className="w-full max-w-4xl text-center space-y-8 mt-12">
        <div className="flex justify-center mb-10">
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 overflow-hidden">
            <Fingerprint size={56} className="text-white/40" />
            <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.8)] animate-scanner" />
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Pente<span className="text-blue-500">Fino</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Pesquise por CNPJ, Razão Social ou Nome do Político/Sócio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-8 max-w-3xl mx-auto">
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-full shadow-lg backdrop-blur-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 group">
            <ScanLine className="ml-6 mr-3 text-slate-400 flex-shrink-0 group-focus-within:text-blue-400 transition-colors" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: TechNova, Roberto Alves..."
              className="flex-1 bg-transparent text-slate-100 text-lg py-5 focus:outline-none placeholder-slate-500 min-w-0"
            />
            
            <div className="flex items-center gap-1 pr-2.5 flex-shrink-0">
              <div className="h-8 w-px bg-slate-700 mx-1"></div>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
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
                className="p-2.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all flex items-center gap-2"
                title="Adicionar Arquivos Locais"
              >
                <Upload size={20} />
              </button>
              
              <button 
                type="submit"
                className="ml-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all shadow-lg shadow-blue-500/20"
              >
                Pesquisar
              </button>
            </div>
          </div>
        </form>

        {showFilters && (
          <div className="w-full max-w-4xl mx-auto mt-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl text-left animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Filter size={18} className="text-blue-500" />
              Filtros Avançados
            </h3>
            
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              {FILTER_CATEGORIES.map((category) => (
                <div key={category.id} className="flex-1 min-w-[200px]">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-colors text-slate-200 font-medium"
                  >
                    <span className="text-sm truncate mr-2">{category.label}</span>
                    {expandedCategory === category.id ? (
                      <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className="mt-2 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-lg flex flex-col gap-2 max-h-60 overflow-y-auto animate-in fade-in duration-200">
                      {category.options.map((option) => {
                        const isSelected = selectedFilters[category.id]?.includes(option);
                        return (
                          <label 
                            key={option} 
                            className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors group"
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-slate-500 group-hover:border-slate-400 bg-slate-800'
                            }`}>
                              {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm text-slate-300 group-hover:text-slate-100 leading-tight">
                              {option}
                            </span>
                          </label>
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
