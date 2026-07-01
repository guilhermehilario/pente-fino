import { useState } from 'react';
import {
  Building2, ShieldCheck, FileText, DollarSign, Calendar,
  AlertTriangle, Users, Landmark, ChevronDown, ChevronUp,
  ExternalLink, Mail, Phone, MapPin, TrendingUp, Briefcase, FileWarning,
  ChevronRight, Share2
} from 'lucide-react';
import type { CompanyDetail } from '../data/mockData';
import { buttons, texts, containers, tables, cards } from '../globalStyle';

interface CompanyDetailScreenProps {
  company: CompanyDetail;
  onPoliticianClick: (politicianId: number) => void;
  onGraphClick?: () => void;
}

const alertConfig = {
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
};

export function CompanyDetailScreen({ company, onPoliticianClick, onGraphClick }: CompanyDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'partners' | 'politicians'>('partners');
  const [showAllContracts, setShowAllContracts] = useState(false);

  const displayedContracts = showAllContracts ? company.suspiciousContracts : company.suspiciousContracts.slice(0, 2);

  return (
    <div className={containers.screenDashboard}>
      <div className={containers.dashboardWrapper}>

        {/* Header */}
        <header className={containers.dashboardHeader}>
          <div className={containers.dashboardHeaderLeft}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className={texts.h1Dashboard}>{company.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <span className={texts.badgeStatus}>
                  <ShieldCheck size={14} /> {company.status}
                </span>
                <span className={texts.badgeCategory}>{company.sector}</span>
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
              Exportar Relatório
            </button>
            <button className={buttons.dashboardPrimaryBlue}>
              Ver Contratos <ExternalLink size={16} />
            </button>
          </div>
        </header>

        {/* Alertas */}
        {company.alerts.length > 0 && (
          <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-5 shadow-lg">
            <h3 className="flex items-center gap-2 text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">
              <FileWarning size={18} />
              Alertas & Suspeitas
            </h3>
            <div className="space-y-3">
              {company.alerts.map((alert, idx) => {
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
              <div className={`${cards.statCardIconWrapper} bg-blue-500/10 text-blue-400`}>
                <FileText size={24} />
              </div>
            </div>
            <p className={texts.label}>CNPJ</p>
            <p className={texts.valueLarge}>{company.cnpj}</p>
          </div>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-emerald-500/10 text-emerald-400`}>
                <TrendingUp size={24} />
              </div>
            </div>
            <p className={texts.label}>Faturamento Anual</p>
            <p className={texts.valueLarge}>{company.revenue}</p>
          </div>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-purple-500/10 text-purple-400`}>
                <DollarSign size={24} />
              </div>
            </div>
            <p className={texts.label}>Valor de Mercado</p>
            <p className={texts.valueLarge}>{company.marketValue}</p>
          </div>
          <div className={cards.statCard}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${cards.statCardIconWrapper} bg-amber-500/10 text-amber-400`}>
                <Briefcase size={24} />
              </div>
            </div>
            <p className={texts.label}>Funcionários</p>
            <p className={texts.valueLarge}>{company.employees}</p>
          </div>
        </div>

        {/* Main Grid: Contracts + Table / Sidebar */}
        <div className={containers.mainGrid}>
          <div className="lg:col-span-2 space-y-8">

            {/* Contratos Suspeitos */}
            {company.suspiciousContracts.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg">
                <h2 className={texts.h2Section}>
                  <AlertTriangle className="text-orange-400" size={20} /> Contratos com Órgãos Públicos
                </h2>
                <div className="overflow-x-auto">
                  <table className={tables.table}>
                    <thead>
                      <tr className={tables.theadTr}>
                        <th className={texts.tableHeader}>Ano</th>
                        <th className={texts.tableHeader}>Órgão</th>
                        <th className={texts.tableHeader}>Descrição</th>
                        <th className={texts.tableHeaderRight}>Valor</th>
                      </tr>
                    </thead>
                    <tbody className={tables.tbody}>
                      {displayedContracts.map((contract, idx) => (
                        <tr key={idx} className={tables.tr}>
                          <td className="p-4 text-slate-400 font-mono text-sm">{contract.year}</td>
                          <td className="p-4 text-slate-200 font-medium text-sm">{contract.agency}</td>
                          <td className="p-4 text-slate-300 text-sm">{contract.description}</td>
                          <td className={texts.tableCellRightOrange}>{contract.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {company.suspiciousContracts.length > 2 && (
                  <button
                    onClick={() => setShowAllContracts(!showAllContracts)}
                    className={`${buttons.secondary} mt-4 w-full flex items-center justify-center gap-2`}
                  >
                    {showAllContracts ? <>Recolher <ChevronUp size={16} /></> : <>Ver todos ({company.suspiciousContracts.length} contratos) <ChevronDown size={16} /></>}
                  </button>
                )}
              </div>
            )}

            {/* Sócios / Políticos */}
            <div className={containers.tableSection}>
              <div className={containers.tableHeaderWrapper}>
                <h2 className={texts.h2Table}>
                  {activeTab === 'partners' ? (
                    <><Users className="text-blue-400" size={20} /> Quadro Societário</>
                  ) : (
                    <><Landmark className="text-blue-400" size={20} /> Políticos com Ligação</>
                  )}
                </h2>
                <div className={containers.tableTabsWrapper}>
                  <button
                    onClick={() => setActiveTab('partners')}
                    className={activeTab === 'partners' ? buttons.tabActiveBlue : buttons.tabInactive}
                  >
                    Sócios
                  </button>
                  <button
                    onClick={() => setActiveTab('politicians')}
                    className={activeTab === 'politicians' ? buttons.tabActiveBlue : buttons.tabInactive}
                  >
                    Políticos
                  </button>
                </div>
              </div>
              <div className={tables.wrapper}>
                <table className={tables.table}>
                  <thead>
                    <tr className={tables.theadTr}>
                      <th className={texts.tableHeader}>{activeTab === 'partners' ? 'Nome do Sócio' : 'Nome'}</th>
                      <th className={texts.tableHeader}>{activeTab === 'partners' ? 'Qualificação' : 'Cargo / Partido'}</th>
                      <th className={texts.tableHeaderRight}>{activeTab === 'partners' ? 'Participação' : 'Relação'}</th>
                      {activeTab === 'politicians' && <th className="w-8"></th>}
                    </tr>
                  </thead>
                  <tbody className={tables.tbody}>
                    {activeTab === 'partners' ? (
                      company.partners.map((partner) => (
                        <tr key={`partner-${partner.id}`} className={tables.tr}>
                          <td className={tables.td}>
                            <div className="flex items-center gap-3">
                              <div className={tables.avatarWrapper}>
                                {partner.name.charAt(0)}
                              </div>
                              <span className={texts.tableCellName}>{partner.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">
                            <span className={texts.tableCellBadge}>{partner.role}</span>
                          </td>
                          <td className={texts.tableCellRightEmerald}>{partner.equity}</td>
                        </tr>
                      ))
                    ) : (
                      company.politicians.map((politician) => (
                        <tr
                          key={`pol-${politician.id}`}
                          className={`${tables.tr} cursor-pointer group`}
                          onClick={() => onPoliticianClick(politician.id)}
                        >
                          <td className={tables.td}>
                            <div className="flex items-center gap-3">
                              <div className={tables.avatarWrapper}>
                                {politician.name.charAt(0)}
                              </div>
                              <span className={`${texts.tableCellName} group-hover:text-blue-300 transition-colors`}>
                                {politician.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">
                            <span className={texts.tableCellBadge}>
                              {politician.role} · {politician.party}
                            </span>
                          </td>
                          <td className={texts.tableCellRightOrange}>{politician.relation}</td>
                          <td className="p-4">
                            <ChevronRight size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className={cards.contactInfoCard}>
              <h2 className={texts.h2Section}>
                <MapPin className="text-blue-400" size={20} /> Contato
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className={cards.contactIconWrapper}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className={texts.contactLabel}>E-mail</p>
                    <p className={texts.contactValue}>{company.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={cards.contactIconWrapper}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className={texts.contactLabel}>Telefone</p>
                    <p className={texts.contactValue}>{company.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={cards.contactIconWrapper}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className={texts.contactLabel}>Endereço</p>
                    <p className={texts.contactValueLong}>{company.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cards.statCard}>
              <div className="flex justify-between items-start mb-4">
                <div className={`${cards.statCardIconWrapper} bg-blue-500/10 text-blue-400`}>
                  <Calendar size={24} />
                </div>
              </div>
              <p className={texts.label}>Data de Criação</p>
              <p className={texts.valueLarge}>{company.creationDate}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
