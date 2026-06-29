import React, { useState } from 'react';
import { Fingerprint, ScanLine } from 'lucide-react';

export function SearchScreen({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-6 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-2xl text-center space-y-8">
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

        <form onSubmit={handleSubmit} className="relative mt-8">
          <div className="relative flex items-center">
            <ScanLine className="absolute left-6 text-slate-400" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: TechNova, Roberto Alves, 12.345.678/0001-99..."
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 text-lg rounded-full py-5 pl-16 pr-36 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg backdrop-blur-sm"
            />
            <button 
              type="submit"
              className="absolute right-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all shadow-lg shadow-blue-500/20"
            >
              Pesquisar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
