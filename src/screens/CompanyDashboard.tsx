import { useState } from 'react';
import { 
  Building2, Calendar, DollarSign, FileText, Users, ArrowUpRight, 
  ShieldCheck, Landmark, ArrowLeft, Share2
} from 'lucide-react';
import { mockCompanyData } from '../data/mockData';
import { StatCard } from '../components/ui/StatCard';
import { ContactInfoCard } from '../components/ui/ContactInfoCard';
import { buttons, texts, containers, tables } from '../globalStyle';

export function CompanyDashboard({ onBack, onPoliticianClick, onGraphClick }: { onBack: () => void; onPoliticianClick?: (id: number) => void; onGraphClick?: () => void }) {
  const [activeTab, setActiveTab] = useState<'politicians' | 'partners'>('politicians');

  return (
    <div className={containers.screenDashboard}>
      <div className={containers.dashboardWrapper}>
        
        <button 
          onClick={onBack}
          className={buttons.back}
        >
          <ArrowLeft size={16} /> Voltar para a Busca
        </button>

        {/* Header Section */}
        <header className={containers.dashboardHeader}>
          <div className={containers.dashboardHeaderLeft}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className={texts.h1Dashboard}>{mockCompanyData.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <span className={texts.badgeStatus}>
                  <ShieldCheck size={14} /> {mockCompanyData.status}
                </span>
                <span className={texts.badgeCategory}>Tecnologia da Informação</span>
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
            <button className={buttons.dashboardPrimaryBlue}>
              Ver Detalhes <ArrowUpRight size={16} />
            </button>
          </div>
        </header>

        {/* Info Grid */}
        <div className={containers.statGrid}>
          <StatCard 
            title="CNPJ" 
            value={mockCompanyData.cnpj} 
            icon={<FileText size={24} />} 
          />
          <StatCard 
            title="Valor de Mercado Estimado" 
            value={mockCompanyData.marketValue} 
            icon={<DollarSign size={24} />} 
            iconBgColor="bg-emerald-500/10" 
            iconTextColor="text-emerald-400" 
          />
          <StatCard 
            title="Data de Criação" 
            value={mockCompanyData.creationDate} 
            icon={<Calendar size={24} />} 
            iconBgColor="bg-purple-500/10" 
            iconTextColor="text-purple-400" 
          />
          <StatCard 
            title="Políticos Ligados" 
            value={`${mockCompanyData.politicians.length} identificados`} 
            icon={<Landmark size={24} />} 
            iconBgColor="bg-orange-500/10" 
            iconTextColor="text-orange-400" 
          />
        </div>

        <div className={containers.mainGrid}>
          <div className={containers.tableSection}>
            <div className={containers.tableHeaderWrapper}>
              <h2 className={texts.h2Table}>
                {activeTab === 'politicians' ? (
                  <><Landmark className="text-blue-400" size={20} /> Políticos com Ligação</>
                ) : (
                  <><Users className="text-blue-400" size={20} /> Quadro Societário</>
                )}
              </h2>
              <div className={containers.tableTabsWrapper}>
                <button
                  onClick={() => setActiveTab('politicians')}
                  className={activeTab === 'politicians' ? buttons.tabActiveBlue : buttons.tabInactive}
                >
                  Políticos
                </button>
                <button
                  onClick={() => setActiveTab('partners')}
                  className={activeTab === 'partners' ? buttons.tabActiveBlue : buttons.tabInactive}
                >
                  Sócios
                </button>
              </div>
            </div>
            <div className={tables.wrapper}>
              <table className={tables.table}>
                <thead>
                  <tr className={tables.theadTr}>
                    <th className={texts.tableHeader}>{activeTab === 'politicians' ? 'Nome' : 'Nome do Sócio'}</th>
                    <th className={texts.tableHeader}>{activeTab === 'politicians' ? 'Cargo/Função' : 'Qualificação'}</th>
                    <th className={texts.tableHeaderRight}>{activeTab === 'politicians' ? 'Partido' : 'Participação'}</th>
                  </tr>
                </thead>
                <tbody className={tables.tbody}>
                  {activeTab === 'politicians' ? (
                    mockCompanyData.politicians.map((politician) => (
                      <tr
                        key={`pol-${politician.id}`}
                        className={`${tables.tr} ${onPoliticianClick ? 'cursor-pointer' : ''}`}
                        onClick={() => onPoliticianClick?.(politician.id)}
                      >
                        <td className={tables.td}>
                          <div className="flex items-center gap-3">
                            <div className={tables.avatarWrapper}>
                              {politician.name.charAt(0)}
                            </div>
                            <span className={texts.tableCellName}>{politician.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className={texts.tableCellBadge}>
                            {politician.role}
                          </span>
                        </td>
                        <td className={texts.tableCellRightOrange}>
                          {politician.party}
                        </td>
                      </tr>
                    ))
                  ) : (
                    mockCompanyData.partners.map((partner) => (
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
                          <span className={texts.tableCellBadge}>
                            {partner.role}
                          </span>
                        </td>
                        <td className={texts.tableCellRightEmerald}>
                          {partner.equity}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <ContactInfoCard 
            email={mockCompanyData.email}
            phone={mockCompanyData.phone}
            address={mockCompanyData.address}
            addressLabel="Endereço Principal"
          />
        </div>

      </div>
    </div>
  );
}
