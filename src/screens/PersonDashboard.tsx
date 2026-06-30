import { useState } from 'react';
import {
  ArrowUpRight, ShieldCheck, MapPin, Landmark,
  ArrowLeft, Briefcase, Wallet, Building, Users, Share2, ChevronRight
} from 'lucide-react';
import { mockPoliticians } from '../data/mockData';
import { StatCard } from '../components/ui/StatCard';
import { ContactInfoCard } from '../components/ui/ContactInfoCard';
import { buttons, texts, containers, tables } from '../globalStyle';

interface PersonDashboardProps {
  personId: number;
  onBack: () => void;
  onCompanyClick?: (id: number) => void;
  onGraphClick?: () => void;
}

export function PersonDashboard({ personId, onBack, onCompanyClick, onGraphClick }: PersonDashboardProps) {
  const [activeTab, setActiveTab] = useState<'companies' | 'people'>('companies');
  const person = mockPoliticians[personId];

  if (!person) {
    return (
      <div className={containers.screenDashboard}>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Pessoa não encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containers.screenDashboard}>
      <div className={containers.dashboardWrapper}>

        

        {/* Header Section */}
        <header className={containers.dashboardHeader}>
          <div className={containers.dashboardHeaderLeft}>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Landmark size={32} className="text-white" />
            </div>
            <div>
              <h1 className={texts.h1Dashboard}>{person.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <span className={texts.badgeStatus}>
                  <ShieldCheck size={14} /> {person.status}
                </span>
                <span className={texts.badgeCategory}>{person.role}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {person.party}
                </span>
              </div>
            </div>
          </div>
          <div className={containers.dashboardHeaderRight}>
            <button
              onClick={onGraphClick}
              className={`${buttons.secondary} flex items-center gap-2`}
            >
              <Share2 size={16} /> Mapa de Conexões
            </button>
            <button className={buttons.dashboardPrimaryIndigo}>
              Ver Transações <ArrowUpRight size={16} />
            </button>
          </div>
        </header>

        {/* Info Grid */}
        <div className={containers.statGrid}>
          <StatCard 
            title="Cargo Atual" 
            value={person.role} 
            icon={<Briefcase size={24} />} 
          />
          <StatCard 
            title="Salário Bruto" 
            value={person.salary} 
            icon={<Wallet size={24} />} 
            iconBgColor="bg-emerald-500/10" 
            iconTextColor="text-emerald-400" 
          />
          <StatCard 
            title="Patrimônio Declarado" 
            value={person.wealth} 
            icon={<Wallet size={24} />} 
            iconBgColor="bg-purple-500/10" 
            iconTextColor="text-purple-400" 
          />
          <StatCard 
            title="Empresas Ligadas" 
            value={`${person.linkedCompanies.length} identificadas`} 
            icon={<Building size={24} />} 
            iconBgColor="bg-orange-500/10" 
            iconTextColor="text-orange-400" 
          />
        </div>

        <div className={containers.mainGrid}>
          <div className={containers.tableSection}>
            <div className={containers.tableHeaderWrapper}>
              <h2 className={texts.h2Table}>
                {activeTab === 'companies' ? (
                  <><Building className="text-indigo-400" size={20} /> Empresas Vinculadas</>
                ) : (
                  <><Users className="text-indigo-400" size={20} /> Pessoas Públicas Ligadas</>
                )}
              </h2>
              <div className={containers.tableTabsWrapper}>
                <button
                  onClick={() => setActiveTab('companies')}
                  className={activeTab === 'companies' ? buttons.tabActiveIndigo : buttons.tabInactive}
                >
                  Empresas
                </button>
                <button
                  onClick={() => setActiveTab('people')}
                  className={activeTab === 'people' ? buttons.tabActiveIndigo : buttons.tabInactive}
                >
                  Pessoas
                </button>
              </div>
            </div>
            <div className={tables.wrapper}>
              <table className={tables.table}>
                <thead>
                  <tr className={tables.theadTr}>
                    <th className={texts.tableHeader}>{activeTab === 'companies' ? 'Nome da Empresa' : 'Nome da Pessoa'}</th>
                    <th className={texts.tableHeader}>{activeTab === 'companies' ? 'CNPJ' : 'Cargo'}</th>
                    <th className={texts.tableHeaderRight}>Relação/Vínculo</th>
                    {activeTab === 'companies' && <th className="w-8"></th>}
                  </tr>
                </thead>
                <tbody className={tables.tbody}>
                  {activeTab === 'companies' ? (
                    person.linkedCompanies.map((company) => (
                      <tr
                        key={`comp-${company.id}`}
                        className={`${tables.tr} ${onCompanyClick ? 'cursor-pointer group' : ''}`}
                        onClick={() => onCompanyClick?.(company.id)}
                      >
                        <td className={tables.td}>
                          <div className="flex items-center gap-3">
                            <div className={tables.iconWrapper}>
                              <Building size={16} />
                            </div>
                            <span className={`${texts.tableCellName} group-hover:text-indigo-300 transition-colors`}>{company.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          {company.cnpj}
                        </td>
                        <td className={texts.tableCellRightOrange}>
                          {company.relation}
                        </td>
                        <td className="p-4">
                          <ChevronRight size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400 transition-all group-hover:translate-x-0.5" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    person.linkedPeople.map((person) => (
                      <tr key={`pers-${person.id}`} className={tables.tr}>
                        <td className={tables.td}>
                          <div className="flex items-center gap-3">
                            <div className={tables.avatarWrapper}>
                              {person.name.charAt(0)}
                            </div>
                            <span className={texts.tableCellName}>{person.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className={texts.tableCellBadge}>
                            {person.role}
                          </span>
                        </td>
                        <td className={texts.tableCellRightIndigo}>
                          {person.relation}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <ContactInfoCard 
            email={person.email}
            phone={person.phone}
            address={person.address}
            emailLabel="E-mail Gabinete"
            addressLabel="Endereço (Gabinete)"
            headerIcon={<MapPin className="text-indigo-400" size={20} />}
          />
        </div>

      </div>
    </div>
  );
}
