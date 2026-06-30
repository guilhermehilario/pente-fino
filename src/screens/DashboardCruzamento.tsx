// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD DE CRUZAMENTO DE DADOS
// Visão macro-investigativa que cruza dados entre PEPs e Empresas.
// Consumer-Driven Contract: as interfaces estão em types/crossReferenceDashboard.ts
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Users,
  Building2,
  FileText,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  TrendingUp,
  Gavel,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { buildCrossReferenceFromExistingMocks } from '../data/crossReferenceMockData';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  severityConfig,
  relationSeverityConfig,
} from '../utils/formatters';
import { buttons, texts, containers, tables, cards } from '../globalStyle';
import type {
  CrossReferenceDashboardData,
  CrossReferenceLink,
  TopContractItem,
  PoliticianSummary,
  CompanySummary,
  RelationSeverity,
} from '../types/crossReferenceDashboard';

// ─── Props ──────────────────────────────────────────────────────────────────

interface DashboardCruzamentoProps {
  onBack: () => void;
  onPoliticianClick?: (id: number) => void;
  onCompanyClick?: (id: number) => void;
  onGraphClick?: () => void;
}

// ─── Tab types ──────────────────────────────────────────────────────────────

type CrossTab = 'crossReferences' | 'topContracts';
type RankingTab = 'politicians' | 'companies';
type SortField = 'value' | 'name' | 'contractCount' | 'severity';
type SortDirection = 'asc' | 'desc';

// ─── Constants ──────────────────────────────────────────────────────────────

const alertDotColors: Record<string, string> = {
  red: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  orange: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]',
  yellow: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]',
};

// ─── Component ──────────────────────────────────────────────────────────────

export function DashboardCruzamento({
  onBack,
  onPoliticianClick,
  onCompanyClick,
  onGraphClick,
}: DashboardCruzamentoProps) {
  const [activeCrossTab, setActiveCrossTab] = useState<CrossTab>('crossReferences');
  const [activeRankingTab, setActiveRankingTab] = useState<RankingTab>('politicians');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCross, setShowAllCross] = useState(false);
  const [showAllContracts, setShowAllContracts] = useState(false);
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  // ── Data ──
  const data: CrossReferenceDashboardData = useMemo(() => buildCrossReferenceFromExistingMocks(), []);
  const { summary, crossReferences, topContracts, politiciansByValue, companiesByValue } = data;

  // ── Filtered & Sorted Data ──
  const filteredCross = useMemo(() => {
    if (!searchQuery) return crossReferences;
    const q = searchQuery.toLowerCase();
    return crossReferences.filter(
      (ref) =>
        ref.politicianName.toLowerCase().includes(q) ||
        ref.companyName.toLowerCase().includes(q) ||
        ref.relation.toLowerCase().includes(q) ||
        ref.companyCnpj.includes(q)
    );
  }, [crossReferences, searchQuery]);

  const sortBySeverity = (items: CrossReferenceLink[], dir: SortDirection): CrossReferenceLink[] => {
    const order = { high: 1, medium: 2, low: 3 };
    return [...items].sort((a, b) => {
      const diff = order[a.relationSeverity] - order[b.relationSeverity];
      return dir === 'desc' ? diff : -diff;
    });
  };

  const sortByValue = <T extends { totalContractValue: number }>(items: T[], dir: SortDirection): T[] => {
    return [...items].sort((a, b) =>
      dir === 'desc' ? b.totalContractValue - a.totalContractValue : a.totalContractValue - b.totalContractValue
    );
  };

  const processedCross = useMemo(() => {
    if (sortField === 'severity') return sortBySeverity(filteredCross, sortDir);
    if (sortField === 'value') return sortByValue(filteredCross, sortDir);
    if (sortField === 'name') {
      return [...filteredCross].sort((a, b) => {
        const cmp = a.politicianName.localeCompare(b.politicianName);
        return sortDir === 'desc' ? -cmp : cmp;
      });
    }
    return filteredCross;
  }, [filteredCross, sortField, sortDir]);

  const displayedCross = showAllCross ? processedCross : processedCross.slice(0, 8);
  const displayedContracts = showAllContracts ? topContracts : topContracts.slice(0, 5);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const topValue = topContracts.length > 0 ? topContracts[0].value : 0;

  // ── Render Severity Dot ──
  const SeverityDot = ({ severity }: { severity: RelationSeverity | 'red' | 'orange' | 'yellow' }) => (
    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
      severity === 'high' || severity === 'red' ? alertDotColors.red :
      severity === 'medium' || severity === 'orange' ? alertDotColors.orange :
      alertDotColors.yellow
    }`} />
  );

  // ── Render ──
  return (
    <div className={containers.screenDashboard}>
      <div className={containers.dashboardWrapper}>

        {/* ── Top Navigation ── */}
        <button onClick={onBack} className={buttons.back}>
          <ArrowLeft size={16} /> Voltar para Busca
        </button>

        {/* ── Header ── */}
        <header className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-6 md:p-8 rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <ShieldAlert size={32} className="text-white" />
              </div>
              <div>
                <h1 className={texts.h1Dashboard}>Dashboard de Cruzamento</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Cruzamento de dados entre PEPs e Empresas com indícios de ilicitudes
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              {onGraphClick && (
                <button onClick={onGraphClick} className={`${buttons.secondary} flex items-center gap-2 whitespace-nowrap`}>
                  <ExternalLink size={16} /> Mapa de Conexões
                </button>
              )}
              <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-700/50 min-w-0">
                <Gavel size={16} className="text-red-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                  Alerta Máximo
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0">|</span>
                <span className="text-sm font-bold text-red-400 truncate max-w-[180px]">
                  {formatCurrency(summary.totalSuspiciousValue)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Risk Score Bar ── */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status Geral:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                <SeverityDot severity="high" />
                <span className="text-sm font-semibold text-red-400">ALTA CRITICIDADE</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> {summary.highSeverityCount} alto
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> {summary.mediumSeverityCount} médio
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> {summary.lowSeverityCount} baixo
              </span>
            </div>
          </div>
        </header>

        {/* ── KPI Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-w-0">
          {/* Total Políticos */}
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Políticos Mapeados</p>
            <p className="text-2xl font-bold text-white mt-1">{formatNumber(summary.totalPoliticians)}</p>
            <p className="text-xs text-slate-500 mt-1">PEPs sob investigação</p>
          </div>

          {/* Total Empresas */}
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Building2 size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Empresas Investigadas</p>
            <p className="text-2xl font-bold text-white mt-1">{formatNumber(summary.totalCompanies)}</p>
            <p className="text-xs text-slate-500 mt-1">Com vínculos suspeitos</p>
          </div>

          {/* Contratos Suspeitos */}
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Contratos Suspeitos</p>
            <p className="text-2xl font-bold text-white mt-1">{formatNumber(summary.totalContracts)}</p>
            <p className="text-xs text-slate-500 mt-1">{formatNumber(summary.totalCrossReferences)} cruzamentos</p>
          </div>

          {/* Valor Sob Suspeita */}
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
                  <DollarSign size={24} />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">Valor Sob Suspeita</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{formatCurrencyCompact(summary.totalSuspiciousValue)}</p>
              <p className="text-xs text-slate-500 mt-1">{formatCurrency(summary.totalSuspiciousValue)}</p>
            </div>
          </div>
        </div>

        {/* ── Alert Distribution Bar ── */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <AlertTriangle size={18} className="text-amber-400" />
            Distribuição de Alertas
          </h3>
          <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
            {summary.highSeverityCount > 0 && (
              <div
                className="bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                style={{ width: `${(summary.highSeverityCount / (summary.highSeverityCount + summary.mediumSeverityCount + summary.lowSeverityCount)) * 100}%` }}
                title="Alta Severidade"
              >
                {summary.highSeverityCount}
              </div>
            )}
            {summary.mediumSeverityCount > 0 && (
              <div
                className="bg-orange-500/70 hover:bg-orange-500 transition-colors flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                style={{ width: `${(summary.mediumSeverityCount / (summary.highSeverityCount + summary.mediumSeverityCount + summary.lowSeverityCount)) * 100}%` }}
                title="Média Severidade"
              >
                {summary.mediumSeverityCount}
              </div>
            )}
            {summary.lowSeverityCount > 0 && (
              <div
                className="bg-yellow-500/60 hover:bg-yellow-500 transition-colors flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                style={{ width: `${(summary.lowSeverityCount / (summary.highSeverityCount + summary.mediumSeverityCount + summary.lowSeverityCount)) * 100}%` }}
                title="Baixa Severidade"
              >
                {summary.lowSeverityCount}
              </div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Alto: {summary.highSeverityCount}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Médio: {summary.mediumSeverityCount}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Baixo: {summary.lowSeverityCount}</span>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className={containers.mainGrid}>
          {/* ── LEFT COLUMN: Cross-Reference Table + Top Contracts ── */}
          <div className="lg:col-span-2 space-y-8 min-w-0">

            {/* ── TAB: Cross-References / Top Contracts ── */}
            <div className={containers.tableSection}>
              <div className={containers.tableHeaderWrapper}>
                <h2 className={texts.h2Table}>
                  {activeCrossTab === 'crossReferences' ? (
                    <><Users className="text-red-400" size={20} /> Cruzamento Político × Empresa</>
                  ) : (
                    <><TrendingUp className="text-orange-400" size={20} /> Top Contratos Suspeitos</>
                  )}
                </h2>
                <div className="flex items-center gap-3">
                  {/* Search */}
                  {activeCrossTab === 'crossReferences' && (
                    <div className="relative flex-shrink-0">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filtrar por nome, CNPJ..."
                        className="w-36 lg:w-44 bg-slate-900/60 border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}
                  <div className={containers.tableTabsWrapper}>
                    <button
                      onClick={() => setActiveCrossTab('crossReferences')}
                      className={activeCrossTab === 'crossReferences' ? 'px-4 py-2 text-sm font-medium rounded-md transition-all bg-red-600 text-white shadow-md' : buttons.tabInactive}
                    >
                      Cruzamentos
                    </button>
                    <button
                      onClick={() => setActiveCrossTab('topContracts')}
                      className={activeCrossTab === 'topContracts' ? 'px-4 py-2 text-sm font-medium rounded-md transition-all bg-orange-600 text-white shadow-md' : buttons.tabInactive}
                    >
                      Top Contratos
                    </button>
                  </div>
                </div>
              </div>

              {/* Cross-Reference Table */}
              {activeCrossTab === 'crossReferences' && (
                <div className={tables.wrapper}>
                  <table className={tables.table}>
                    <thead>
                      <tr className={tables.theadTr}>
                        <th className={tables.td}>
                          <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors">
                            <SeverityDot severity={sortField === 'severity' ? (sortDir === 'desc' ? 'high' : 'low') : 'medium'} />
                            {sortField === 'severity' && <ArrowUpDown size={12} />}
                          </button>
                        </th>
                        <th className={tables.td}>
                          <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors">
                            Político × Empresa
                            {sortField === 'name' && <ArrowUpDown size={12} />}
                          </button>
                        </th>
                        <th className={tables.td}>
                          <span className="text-xs uppercase tracking-wider text-slate-400">Relação</span>
                        </th>
                        <th className="p-4 text-right">
                          <button onClick={() => toggleSort('value')} className="flex items-center gap-1 text-xs uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors ml-auto">
                            Valor
                            {sortField === 'value' && <ArrowUpDown size={12} />}
                          </button>
                        </th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {displayedCross.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            <Search size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhum cruzamento encontrado</p>
                            <p className="text-xs mt-1">Tente ajustar o filtro de busca</p>
                          </td>
                        </tr>
                      ) : (
                        displayedCross.map((ref, idx) => (
                          <tr
                            key={ref.id}
                            className={`${tables.tr} cursor-pointer group`}
                            onClick={() => {
                              if (onPoliticianClick) onPoliticianClick(ref.politicianId);
                            }}
                          >
                            {/* Severity */}
                            <td className={tables.td}>
                              <SeverityDot severity={ref.relationSeverity} />
                            </td>
                            {/* Names */}
                            <td className={tables.td}>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-slate-200 group-hover:text-red-300 transition-colors">
                                  {ref.politicianName}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-indigo-400">{ref.politicianRole}</span>
                                  <span className="text-xs text-slate-600">·</span>
                                  <span className="text-xs text-indigo-400/70">{ref.politicianParty}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <div className="w-px h-3 bg-slate-600" />
                                  <span className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors">
                                    {ref.companyName}
                                  </span>
                                  <span className="text-[11px] text-slate-500">{ref.companyCnpj}</span>
                                </div>
                              </div>
                            </td>
                            {/* Relation */}
                            <td className={tables.td}>
                              <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                                ref.relationSeverity === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                ref.relationSeverity === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                              }`}>
                                {ref.relation.length > 28 ? ref.relation.slice(0, 28) + '…' : ref.relation}
                              </span>
                            </td>
                            {/* Value */}
                            <td className="p-4 text-right">
                              <span className={`text-sm font-semibold ${
                                ref.totalContractValue >= 10_000_000 ? 'text-red-400' :
                                ref.totalContractValue >= 1_000_000 ? 'text-orange-400' :
                                'text-slate-300'
                              }`}>
                                {ref.totalContractValue > 0 ? formatCurrencyCompact(ref.totalContractValue) : '—'}
                              </span>
                              {ref.contractCount > 0 && (
                                <p className="text-[11px] text-slate-500 mt-0.5">{ref.contractCount} contrato(s)</p>
                              )}
                            </td>
                            <td className="p-4">
                              <ChevronRight size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-red-400 transition-all group-hover:translate-x-0.5" />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {processedCross.length > 8 && (
                    <button
                      onClick={() => setShowAllCross(!showAllCross)}
                      className={`${buttons.secondary} m-4 w-[calc(100%-2rem)] flex items-center justify-center gap-2`}
                    >
                      {showAllCross ? <>Recolher <ChevronUp size={16} /></> : <>Ver todos ({processedCross.length} cruzamentos) <ChevronDown size={16} /></>}
                    </button>
                  )}
                </div>
              )}

              {/* Top Contracts Table */}
              {activeCrossTab === 'topContracts' && (
                <div className={tables.wrapper}>
                  <table className={tables.table}>
                    <thead>
                      <tr className={tables.theadTr}>
                        <th className={tables.td}>
                          <span className="text-xs uppercase tracking-wider text-slate-400">#</span>
                        </th>
                        <th className={tables.td}>
                          <span className="text-xs uppercase tracking-wider text-slate-400">Contrato</span>
                        </th>
                        <th className={tables.td}>
                          <span className="text-xs uppercase tracking-wider text-slate-400">Envolvidos</span>
                        </th>
                        <th className="p-4 text-right">
                          <span className="text-xs uppercase tracking-wider text-slate-400">Valor</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {displayedContracts.map((contract, idx) => {
                        const barWidth = (contract.value / topValue) * 100;
                        return (
                          <tr key={contract.id} className={`${tables.tr} group`}>
                            <td className={tables.td}>
                              <span className={`text-sm font-bold ${
                                idx === 0 ? 'text-red-400' :
                                idx === 1 ? 'text-orange-400' :
                                idx === 2 ? 'text-yellow-400' :
                                'text-slate-500'
                              }`}>
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            </td>
                            <td className={tables.td}>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-200">{contract.description}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">{contract.agency}</span>
                                  <span className="text-xs text-slate-600">·</span>
                                  <span className="text-xs font-mono text-slate-500">{contract.year}</span>
                                </div>
                                {/* Value bar */}
                                <div className="w-full h-1.5 bg-slate-700/50 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      idx === 0 ? 'bg-red-500' :
                                      idx === 1 ? 'bg-orange-500' :
                                      idx === 2 ? 'bg-yellow-500' :
                                      'bg-slate-500'
                                    }`}
                                    style={{ width: `${barWidth}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className={tables.td}>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs text-slate-300">{contract.companyName}</span>
                                <span className="text-xs text-slate-500">↳ {contract.politicianName}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <span className={`text-sm font-bold ${
                                idx === 0 ? 'text-red-400' :
                                idx === 1 ? 'text-orange-400' :
                                idx === 2 ? 'text-yellow-400' :
                                'text-slate-300'
                              }`}>
                                {formatCurrencyCompact(contract.value)}
                              </span>
                              <p className="text-[11px] text-slate-500 mt-0.5">{formatCurrency(contract.value)}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {topContracts.length > 5 && (
                    <button
                      onClick={() => setShowAllContracts(!showAllContracts)}
                      className={`${buttons.secondary} m-4 w-[calc(100%-2rem)] flex items-center justify-center gap-2`}
                    >
                      {showAllContracts ? <>Recolher <ChevronUp size={16} /></> : <>Ver todos ({topContracts.length} contratos) <ChevronDown size={16} /></>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Rankings ── */}
          <div className="space-y-6 min-w-0">

            {/* Ranking Tabs */}
            <div className={cards.contactInfoCard}>
              <div className={containers.tableHeaderWrapper}>
                <h2 className={texts.h2Table}>
                  <TrendingUp className="text-amber-400" size={20} /> Ranking
                </h2>
                <div className={containers.tableTabsWrapper}>
                  <button
                    onClick={() => setActiveRankingTab('politicians')}
                    className={activeRankingTab === 'politicians' ? 'px-4 py-2 text-sm font-medium rounded-md transition-all bg-amber-600 text-white shadow-md' : buttons.tabInactive}
                  >
                    <UserCheck size={14} className="inline mr-1" /> Políticos
                  </button>
                  <button
                    onClick={() => setActiveRankingTab('companies')}
                    className={activeRankingTab === 'companies' ? 'px-4 py-2 text-sm font-medium rounded-md transition-all bg-amber-600 text-white shadow-md' : buttons.tabInactive}
                  >
                    <Building2 size={14} className="inline mr-1" /> Empresas
                  </button>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2 min-w-0">
                {activeRankingTab === 'politicians'
                  ? politiciansByValue.map((p, idx) => <RankingRow key={p.id} rank={idx + 1} name={p.name} subtitle={`${p.role} · ${p.party}`} value={p.totalContractValue} severity={p.maxSeverity} contractCount={p.contractCount} onClick={() => onPoliticianClick?.(p.id)} />)
                  : companiesByValue.map((c, idx) => <RankingRow key={c.id} rank={idx + 1} name={c.name} subtitle={c.cnpj} value={c.totalContractValue} severity={c.maxSeverity} contractCount={c.contractCount} onClick={() => onCompanyClick?.(c.id)} />)
                }
              </div>
            </div>

            {/* Mini Stats */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 shadow-lg min-w-0">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                <Briefcase size={16} className="text-blue-400" />
                Estatísticas Rápidas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/40">
                  <span className="text-sm text-slate-400">Média por político</span>
                  <span className="text-sm font-semibold text-slate-200">{formatCurrency(summary.totalSuspiciousValue / summary.totalPoliticians)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/40">
                  <span className="text-sm text-slate-400">Média por empresa</span>
                  <span className="text-sm font-semibold text-slate-200">{formatCurrency(summary.totalSuspiciousValue / summary.totalCompanies)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/40">
                  <span className="text-sm text-slate-400">Cruzamentos ativos</span>
                  <span className="text-sm font-semibold text-slate-200">{summary.totalCrossReferences}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-400">Relações de alta severidade</span>
                  <span className="text-sm font-bold text-red-400">{crossReferences.filter(r => r.relationSeverity === 'high').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center text-xs text-slate-600 pt-4 pb-8 border-t border-slate-800">
          Dados mockados para desenvolvimento · Contrato: v1.0 · Consumer-Driven Contract
        </div>
      </div>
    </div>
  );
}

// ─── Ranking Row Sub-Component ──────────────────────────────────────────────

interface RankingRowProps {
  rank: number;
  name: string;
  subtitle: string;
  value: number;
  severity: 'red' | 'orange' | 'yellow' | 'none';
  contractCount: number;
  onClick?: () => void;
}

function RankingRow({ rank, name, subtitle, value, severity, contractCount, onClick }: RankingRowProps) {
  const medalColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
  const rankDisplay = rank <= 3
    ? <span className={`font-bold text-sm ${medalColors[rank - 1]}`}>#{rank}</span>
    : <span className="text-xs font-mono text-slate-500">#{rank}</span>;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/20 hover:bg-slate-700/40 border border-transparent hover:border-slate-600/50 transition-all group text-left"
    >
      <div className="w-8 flex justify-center flex-shrink-0">
        {rankDisplay}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200 group-hover:text-amber-300 transition-colors truncate">
            {name}
          </span>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            severity === 'red' ? alertDotColors.red :
            severity === 'orange' ? alertDotColors.orange :
            severity === 'yellow' ? alertDotColors.yellow :
            'bg-slate-500'
          }`} />
        </div>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        {contractCount > 0 && (
          <p className="text-[11px] text-slate-600 mt-0.5">{contractCount} contrato(s)</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold ${
          rank === 1 ? 'text-red-400' :
          rank === 2 ? 'text-orange-400' :
          rank === 3 ? 'text-yellow-400' :
          'text-slate-300'
        }`}>
          {formatCurrencyCompact(value)}
        </p>
      </div>
    </button>
  );
}
