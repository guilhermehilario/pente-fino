import React, { useState } from 'react';
import { 
  Building2, Calendar, DollarSign, FileText, Users, ArrowUpRight, 
  ShieldCheck, Mail, Phone, MapPin, Landmark, ArrowLeft 
} from 'lucide-react';
import { mockCompanyData } from '../data/mockData';

export function CompanyDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'politicians' | 'partners'>('politicians');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Voltar para a Busca
        </button>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{mockCompanyData.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck size={14} /> {mockCompanyData.status}
                </span>
                <span className="text-sm">Tecnologia da Informação</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600">
              Exportar Relatório
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
              Ver Detalhes <ArrowUpRight size={16} />
            </button>
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">CNPJ</p>
            <p className="text-xl font-semibold text-slate-100">{mockCompanyData.cnpj}</p>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Valor de Mercado Estimado</p>
            <p className="text-xl font-semibold text-slate-100">{mockCompanyData.marketValue}</p>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Data de Criação</p>
            <p className="text-xl font-semibold text-slate-100">{mockCompanyData.creationDate}</p>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 group-hover:scale-110 transition-transform">
                <Landmark size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Políticos Ligados</p>
            <p className="text-xl font-semibold text-slate-100">{mockCompanyData.politicians.length} identificados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg flex flex-col">
            <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-800/80 gap-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {activeTab === 'politicians' ? (
                  <><Landmark className="text-blue-400" size={20} /> Políticos com Ligação</>
                ) : (
                  <><Users className="text-blue-400" size={20} /> Quadro Societário</>
                )}
              </h2>
              <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setActiveTab('politicians')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'politicians'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Políticos
                </button>
                <button
                  onClick={() => setActiveTab('partners')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'partners'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Sócios
                </button>
              </div>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">{activeTab === 'politicians' ? 'Nome' : 'Nome do Sócio'}</th>
                    <th className="p-4 font-medium">{activeTab === 'politicians' ? 'Cargo/Função' : 'Qualificação'}</th>
                    <th className="p-4 font-medium text-right">{activeTab === 'politicians' ? 'Partido' : 'Participação'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {activeTab === 'politicians' ? (
                    mockCompanyData.politicians.map((politician) => (
                      <tr key={`pol-${politician.id}`} className="hover:bg-slate-700/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
                              {politician.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-200">{politician.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                            {politician.role}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-orange-400">
                          {politician.party}
                        </td>
                      </tr>
                    ))
                  ) : (
                    mockCompanyData.partners.map((partner) => (
                      <tr key={`partner-${partner.id}`} className="hover:bg-slate-700/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
                              {partner.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-200">{partner.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                            {partner.role}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-emerald-400">
                          {partner.equity}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg h-fit">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MapPin className="text-blue-400" size={20} /> Contato e Localização
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">E-mail</p>
                  <p className="text-slate-200 font-medium">{mockCompanyData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">Telefone</p>
                  <p className="text-slate-200 font-medium">{mockCompanyData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">Endereço Principal</p>
                  <p className="text-slate-200 font-medium leading-relaxed">{mockCompanyData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
