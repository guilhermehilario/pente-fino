import { useState } from 'react';
import {
  ArrowLeft, Landmark, ShieldCheck, Briefcase, Wallet, Calendar,
  Gavel, Building2, ChevronDown, ChevronUp,
  ExternalLink, Mail, Phone, MapPin, Award, UserCheck, FileWarning, Share2
} from 'lucide-react';
import type { PoliticianDetail } from '../data/mockData';
import { buttons, texts, containers, tables, cards } from '../globalStyle';

interface PoliticianDetailScreenProps {
  politician: PoliticianDetail;
  onBack: () => void;
  onCompanyClick: (companyId: number) => void;
  onGraphClick?: () => void;
}

const alertConfig = {
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
};

export function PoliticianDetailScreen({ politician, onBack, onCompanyClick, onGraphClick }: PoliticianDetailScreenProps) {
  const [showFullCareer, setShowFullCareer] = useState(false);
  const [showFullProcesses, setShowFullProcesses] = useState(false);

  const displayedCareer = showFullCareer ? politician.politicalCareer : politician.politicalCareer.slice(0, 2);
  const displayedProcesses = showFullProcesses ? politician.legalProcesses : politician.legalProcesses.slice(0, 2);

  return (
    <div className={containers.screenDashboard}>
      <div className={containers.dashboardWrapper}>

        <button onClick={onBack} className={buttons.back}>
          <ArrowLeft size={16} /> Voltar para Resultados
        </button>

        {/* Header */}
        <header className={containers.dashboardHeader}>
          <div className={containers.dashboardHeaderLeft}>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Landmark size={32} className="text-white" />
            </div>
            <div>
              <h1 className={texts.h1Dashboard}>{politician.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <span className={texts.badgeStatus}>
                  <ShieldCheck size={14} /> {politician.status}
                </span>
                <span className={texts.badgeCategory}>{politician.role}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {politician.party}
                </span>
              </div>
            </div>
          </div>
          <div className={containers.dashboardHeaderRight}>
            {onGraphClick && (
              <button onClick={onGraphClick} className={`${buttons.secondary} flex items-center gap-2`}>
                <Share2 size={16} /> Mapa de Conexões
              </button>
            )}
            <button className={buttons.secondary}>
              Exportar Dossiê
            </button>
            <button className={buttons.dashboardPrimaryIndigo}>
              Ver Transações <ExternalLink size={16} />
            </button>
          </div>
        </header>

        {/* Alertas */}
        {politician.alerts.length > 0 && (
          <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-5 shadow-lg">
            <h3 className="flex items-center gap-2 text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">
              <FileWarning size={18} />
              Alertas & Suspeitas
            </h3>
            <div className="space-y-3">
              {politician.alerts.map((alert, idx) => {
                const cfg = alertConfig[alert.type];
                return (
                  <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl ${cfg.bg} ${cfg.border} border`}>
                    <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${cfg.dot} shadow-[0_0_8px] ${cfg.dot.replace('bg-', 'shadow-')}/50 flex-shrink-0`} />
                    <span className={`text-sm ${cfg.text}`}>{alert.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grid de Info Cards */}
        <div className={containers.statGrid}>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-indigo-500/10 text-indigo-400`}>
                <Briefcase size={24} />
              </div>
            </div>
            <p className={texts.label}>Cargo Atual</p>
            <p className={texts.valueLarge}>{politician.role}</p>
          </div>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-emerald-500/10 text-emerald-400`}>
                <Wallet size={24} />
              </div>
            </div>
            <p className={texts.label}>Salário</p>
            <p className={texts.valueLarge}>{politician.salary}</p>
          </div>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-purple-500/10 text-purple-400`}>
                <Wallet size={24} />
              </div>
            </div>
            <p className={texts.label}>Patrimônio Declarado</p>
            <p className={texts.valueLarge}>{politician.wealth}</p>
          </div>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-amber-500/10 text-amber-400`}>
                <Calendar size={24} />
              </div>
            </div>
            <p className={texts.label}>Data de Nascimento</p>
            <p className={texts.valueLarge}>{politician.birthDate}</p>
          </div>
        </div>

        {/* Main Grid: Biografia + Timeline */}
        <div className={containers.mainGrid}>
          <div className="lg:col-span-2 space-y-8">

            {/* Biografia */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
              <h2 className={texts.h2Section}>
                <Award className="text-indigo-400" size={20} /> Biografia
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm">{politician.biography}</p>
            </div>

            {/* Carreira Política */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
              <h2 className={texts.h2Section}>
                <UserCheck className="text-indigo-400" size={20} /> Carreira Política
              </h2>
              <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                {displayedCareer.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <span className="text-xs font-mono text-indigo-400 whitespace-nowrap">{item.year}</span>
                      <div>
                        <p className="text-slate-200 font-medium">{item.position}</p>
                        <p className="text-slate-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {politician.politicalCareer.length > 2 && (
                <button
                  onClick={() => setShowFullCareer(!showFullCareer)}
                  className={`${buttons.secondary} mt-6 w-full flex items-center justify-center gap-2`}
                >
                  {showFullCareer ? <>Recolher <ChevronUp size={16} /></> : <>Ver carreira completa ({politician.politicalCareer.length} registros) <ChevronDown size={16} /></>}
                </button>
              )}
            </div>

            {/* Processos Judiciais */}
            {politician.legalProcesses.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
                <h2 className={texts.h2Section}>
                  <Gavel className="text-red-400" size={20} /> Processos & Investigações
                </h2>
                <div className="space-y-4">
                  {displayedProcesses.map((process, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/40">
                      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:min-w-[100px]">
                        <span className="text-xs font-mono text-slate-500">{process.year}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          process.status === 'Em andamento' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          process.status === 'Suspensa' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          {process.status}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-200 font-medium text-sm">{process.type}</p>
                        <p className="text-slate-400 text-sm mt-1">{process.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {politician.legalProcesses.length > 2 && (
                  <button
                    onClick={() => setShowFullProcesses(!showFullProcesses)}
                    className={`${buttons.secondary} mt-4 w-full flex items-center justify-center gap-2`}
                  >
                    {showFullProcesses ? <>Recolher <ChevronUp size={16} /></> : <>Ver todos ({politician.legalProcesses.length} registros) <ChevronDown size={16} /></>}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className={cards.contactInfoCard}>
              <h2 className={texts.h2Section}>
                <MapPin className="text-indigo-400" size={20} /> Contato
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className={cards.contactIconWrapper}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className={texts.contactLabel}>E-mail Gabinete</p>
                    <p className={texts.contactValue}>{politician.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={cards.contactIconWrapper}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className={texts.contactLabel}>Telefone</p>
                    <p className={texts.contactValue}>{politician.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={cards.contactIconWrapper}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className={texts.contactLabel}>Endereço</p>
                    <p className={texts.contactValueLong}>{politician.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Companies */}
            <div className={cards.contactInfoCard}>
              <h2 className={texts.h2Section}>
                <Building2 className="text-indigo-400" size={20} /> Empresas Ligadas
              </h2>
              <div className="space-y-3">
                {politician.linkedCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => onCompanyClick(company.id)}
                    className="w-full text-left p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/40 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-200 font-medium text-sm group-hover:text-indigo-300 transition-colors truncate">
                          {company.name}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">{company.cnpj}</p>
                        <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                          company.relation.toLowerCase().includes('suspeita') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          company.relation.toLowerCase().includes('oculto') ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                        }`}>
                          {company.relation}
                        </span>
                      </div>
                      <ExternalLink size={14} className="text-slate-500 group-hover:text-indigo-400 mt-1 flex-shrink-0 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
