import React, { useState } from 'react';
import {
  ArrowUpRight, ShieldCheck, Mail, Phone, MapPin, Landmark,
  ArrowLeft, Briefcase, Wallet, Building, Users
} from 'lucide-react';
import { mockPersonData } from '../data/mockData';

export function PersonDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'companies' | 'people'>('companies');

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
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Landmark size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{mockPersonData.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck size={14} /> {mockPersonData.status}
                </span>
                <span className="text-sm">Agente Público</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600">
              Exportar Dossiê
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              Ver Transações <ArrowUpRight size={16} />
            </button>
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Cargo Atual</p>
            <p className="text-xl font-semibold text-slate-100">{mockPersonData.role}</p>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <Wallet size={24} /> {/* Note: DollarSign was replaced with Wallet for more variety if wanted, but Wallet is imported here. */}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Salário Bruto</p>
            <p className="text-xl font-semibold text-slate-100">{mockPersonData.salary}</p>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                <Wallet size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Patrimônio Declarado</p>
            <p className="text-xl font-semibold text-slate-100">{mockPersonData.wealth}</p>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 group-hover:scale-110 transition-transform">
                <Building size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">Empresas Ligadas</p>
            <p className="text-xl font-semibold text-slate-100">{mockPersonData.linkedCompanies.length} identificadas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg flex flex-col">
            <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-800/80 gap-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {activeTab === 'companies' ? (
                  <><Building className="text-indigo-400" size={20} /> Empresas Vinculadas</>
                ) : (
                  <><Users className="text-indigo-400" size={20} /> Pessoas Públicas Ligadas</>
                )}
              </h2>
              <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setActiveTab('companies')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'companies'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                >
                  Empresas
                </button>
                <button
                  onClick={() => setActiveTab('people')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'people'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                >
                  Pessoas
                </button>
              </div>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">{activeTab === 'companies' ? 'Nome da Empresa' : 'Nome da Pessoa'}</th>
                    <th className="p-4 font-medium">{activeTab === 'companies' ? 'CNPJ' : 'Cargo'}</th>
                    <th className="p-4 font-medium text-right">Relação/Vínculo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {activeTab === 'companies' ? (
                    mockPersonData.linkedCompanies.map((company) => (
                      <tr key={`comp-${company.id}`} className="hover:bg-slate-700/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
                              <Building size={16} />
                            </div>
                            <span className="font-medium text-slate-200">{company.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          {company.cnpj}
                        </td>
                        <td className="p-4 text-right font-semibold text-orange-400">
                          {company.relation}
                        </td>
                      </tr>
                    ))
                  ) : (
                    mockPersonData.linkedPeople.map((person) => (
                      <tr key={`pers-${person.id}`} className="hover:bg-slate-700/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
                              {person.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-200">{person.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                            {person.role}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-indigo-400">
                          {person.relation}
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
              <MapPin className="text-indigo-400" size={20} /> Contato e Localização
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">E-mail Gabinete</p>
                  <p className="text-slate-200 font-medium">{mockPersonData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">Telefone</p>
                  <p className="text-slate-200 font-medium">{mockPersonData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">Endereço (Gabinete)</p>
                  <p className="text-slate-200 font-medium leading-relaxed">{mockPersonData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
