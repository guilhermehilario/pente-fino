// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Dashboard de Cruzamento de Dados
// Dados gerados a partir dos mocks existentes (mockPoliticians + mockCompanies)
// para desenvolvimento e testes do frontend antes da integração com a API.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CrossReferenceDashboardData,
  CrossReferenceLink,
  TopContractItem,
  PoliticianSummary,
  CompanySummary,
  CrossReferenceSummary,
  RelationSeverity,
  AlertSeverity,
} from '../types/crossReferenceDashboard';

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyRelationSeverity(relation: string): RelationSeverity {
  const r = relation.toLowerCase();
  if (r.includes('oculto') || r.includes('suspeita') || r.includes('investigação')) return 'high';
  if (r.includes('ex-') || r.includes('doador') || r.includes('contrato') || r.includes('campanha')) return 'medium';
  return 'low';
}

function parseCurrency(value: string): number {
  return Number(value.replace(/[R$\s.]/g, '').replace(',', '.'));
}

// ─── Politicians Summary ────────────────────────────────────────────────────

const politiciansData: PoliticianSummary[] = [
  {
    id: 1,
    name: 'Roberto Alves',
    role: 'Deputado Estadual',
    party: 'PMB',
    companyCount: 3,
    contractCount: 6,
    totalContractValue: 11_800_000,
    maxSeverity: 'red',
  },
  {
    id: 2,
    name: 'João Silveira',
    role: 'Senador',
    party: 'PSD',
    companyCount: 3,
    contractCount: 5,
    totalContractValue: 96_000_000,
    maxSeverity: 'red',
  },
  {
    id: 3,
    name: 'Maria Costa',
    role: 'Prefeita',
    party: 'MDB',
    companyCount: 2,
    contractCount: 2,
    totalContractValue: 4_250_000,
    maxSeverity: 'orange',
  },
];

// ─── Companies Summary ──────────────────────────────────────────────────────

const companiesData: CompanySummary[] = [
  {
    id: 1,
    name: 'TechNova Soluções S.A.',
    cnpj: '12.345.678/0001-99',
    sector: 'Tecnologia da Informação',
    politicianCount: 3,
    contractCount: 4,
    totalContractValue: 11_350_000,
    maxSeverity: 'red',
  },
  {
    id: 2,
    name: 'Construtora Horizonte',
    cnpj: '98.765.432/0001-10',
    sector: 'Construção Civil',
    politicianCount: 1,
    contractCount: 2,
    totalContractValue: 18_500_000,
    maxSeverity: 'orange',
  },
  {
    id: 3,
    name: 'AgroPecuária Alves',
    cnpj: '45.123.789/0001-55',
    sector: 'Agronegócio',
    politicianCount: 1,
    contractCount: 1,
    totalContractValue: 450_000,
    maxSeverity: 'yellow',
  },
  {
    id: 4,
    name: 'Construtora Silveira Ltda.',
    cnpj: '11.222.333/0001-44',
    sector: 'Construção Civil',
    politicianCount: 1,
    contractCount: 3,
    totalContractValue: 88_000_000,
    maxSeverity: 'red',
  },
  {
    id: 5,
    name: 'AgroNorte S.A.',
    cnpj: '55.666.777/0001-88',
    sector: 'Agronegócio',
    politicianCount: 1,
    contractCount: 1,
    totalContractValue: 8_000_000,
    maxSeverity: 'red',
  },
  {
    id: 6,
    name: 'SaúdePrimeira Serviços Ltda.',
    cnpj: '77.888.999/0001-11',
    sector: 'Saúde',
    politicianCount: 1,
    contractCount: 1,
    totalContractValue: 3_800_000,
    maxSeverity: 'orange',
  },
];

// ─── Cross-Reference Links ──────────────────────────────────────────────────

const crossReferencesData: CrossReferenceLink[] = [
  // Roberto Alves ↔ TechNova
  {
    id: 'ref-1-1',
    politicianId: 1,
    politicianName: 'Roberto Alves',
    politicianRole: 'Deputado Estadual',
    politicianParty: 'PMB',
    politicianMaxAlert: 'red',
    companyId: 1,
    companyName: 'TechNova Soluções S.A.',
    companyCnpj: '12.345.678/0001-99',
    companySector: 'Tecnologia da Informação',
    relation: 'Sócio Oculto / Suspeita',
    relationSeverity: 'high',
    contractCount: 4,
    totalContractValue: 11_350_000,
  },
  // Roberto Alves ↔ Construtora Horizonte
  {
    id: 'ref-2-1',
    politicianId: 1,
    politicianName: 'Roberto Alves',
    politicianRole: 'Deputado Estadual',
    politicianParty: 'PMB',
    politicianMaxAlert: 'red',
    companyId: 2,
    companyName: 'Construtora Horizonte',
    companyCnpj: '98.765.432/0001-10',
    companySector: 'Construção Civil',
    relation: 'Ex-Sócio (2015-2020)',
    relationSeverity: 'medium',
    contractCount: 2,
    totalContractValue: 18_500_000,
  },
  // Roberto Alves ↔ AgroPecuária Alves
  {
    id: 'ref-3-1',
    politicianId: 1,
    politicianName: 'Roberto Alves',
    politicianRole: 'Deputado Estadual',
    politicianParty: 'PMB',
    politicianMaxAlert: 'red',
    companyId: 3,
    companyName: 'AgroPecuária Alves',
    companyCnpj: '45.123.789/0001-55',
    companySector: 'Agronegócio',
    relation: 'Sócio-Administrador',
    relationSeverity: 'low',
    contractCount: 1,
    totalContractValue: 450_000,
  },
  // João Silveira ↔ TechNova
  {
    id: 'ref-4-2',
    politicianId: 2,
    politicianName: 'João Silveira',
    politicianRole: 'Senador',
    politicianParty: 'PSD',
    politicianMaxAlert: 'red',
    companyId: 1,
    companyName: 'TechNova Soluções S.A.',
    companyCnpj: '12.345.678/0001-99',
    companySector: 'Tecnologia da Informação',
    relation: 'Doador de Campanha',
    relationSeverity: 'medium',
    contractCount: 0,
    totalContractValue: 0,
  },
  // João Silveira ↔ Construtora Silveira
  {
    id: 'ref-5-2',
    politicianId: 2,
    politicianName: 'João Silveira',
    politicianRole: 'Senador',
    politicianParty: 'PSD',
    politicianMaxAlert: 'red',
    companyId: 4,
    companyName: 'Construtora Silveira Ltda.',
    companyCnpj: '11.222.333/0001-44',
    companySector: 'Construção Civil',
    relation: 'Sócio majoritário',
    relationSeverity: 'high',
    contractCount: 3,
    totalContractValue: 88_000_000,
  },
  // João Silveira ↔ AgroNorte
  {
    id: 'ref-6-2',
    politicianId: 2,
    politicianName: 'João Silveira',
    politicianRole: 'Senador',
    politicianParty: 'PSD',
    politicianMaxAlert: 'red',
    companyId: 5,
    companyName: 'AgroNorte S.A.',
    companyCnpj: '55.666.777/0001-88',
    companySector: 'Agronegócio',
    relation: 'Sócio oculto',
    relationSeverity: 'high',
    contractCount: 1,
    totalContractValue: 8_000_000,
  },
  // Maria Costa ↔ TechNova
  {
    id: 'ref-7-3',
    politicianId: 3,
    politicianName: 'Maria Costa',
    politicianRole: 'Prefeita',
    politicianParty: 'MDB',
    politicianMaxAlert: 'orange',
    companyId: 1,
    companyName: 'TechNova Soluções S.A.',
    companyCnpj: '12.345.678/0001-99',
    companySector: 'Tecnologia da Informação',
    relation: 'Doador de Campanha',
    relationSeverity: 'medium',
    contractCount: 0,
    totalContractValue: 0,
  },
  // Maria Costa ↔ SaúdePrimeira
  {
    id: 'ref-8-3',
    politicianId: 3,
    politicianName: 'Maria Costa',
    politicianRole: 'Prefeita',
    politicianParty: 'MDB',
    politicianMaxAlert: 'orange',
    companyId: 6,
    companyName: 'SaúdePrimeira Serviços Ltda.',
    companyCnpj: '77.888.999/0001-11',
    companySector: 'Saúde',
    relation: 'Contrato emergencial suspeito',
    relationSeverity: 'medium',
    contractCount: 1,
    totalContractValue: 3_800_000,
  },
];

// ─── Top Contracts ──────────────────────────────────────────────────────────

const topContractsData: TopContractItem[] = [
  {
    id: 1,
    year: '2025',
    value: 45_000_000,
    agency: 'Governo Federal',
    description: 'Obra de infraestrutura em aeroporto',
    companyName: 'Construtora Silveira Ltda.',
    politicianName: 'João Silveira',
    severity: 'high',
  },
  {
    id: 2,
    year: '2025',
    value: 28_000_000,
    agency: 'DNIT',
    description: 'Construção de ponte em rodovia federal',
    companyName: 'Construtora Silveira Ltda.',
    politicianName: 'João Silveira',
    severity: 'high',
  },
  {
    id: 3,
    year: '2024',
    value: 15_000_000,
    agency: 'Governo do Distrito Federal',
    description: 'Construção de hospital público',
    companyName: 'Construtora Silveira Ltda.',
    politicianName: 'João Silveira',
    severity: 'high',
  },
  {
    id: 4,
    year: '2024',
    value: 12_000_000,
    agency: 'Prefeitura Municipal',
    description: 'Obra de pavimentação urbana',
    companyName: 'Construtora Horizonte',
    politicianName: 'Roberto Alves',
    severity: 'medium',
  },
  {
    id: 5,
    year: '2025',
    value: 8_000_000,
    agency: 'Incra',
    description: 'Contrato de reforma agrária',
    companyName: 'AgroNorte S.A.',
    politicianName: 'João Silveira',
    severity: 'high',
  },
  {
    id: 6,
    year: '2024',
    value: 5_800_000,
    agency: 'Governo do Estado',
    description: 'Plataforma de dados educacionais',
    companyName: 'TechNova Soluções S.A.',
    politicianName: 'Roberto Alves',
    severity: 'high',
  },
  {
    id: 7,
    year: '2023',
    value: 3_800_000,
    agency: 'Prefeitura Municipal',
    description: 'Contrato emergencial de serviços hospitalares - COVID-19',
    companyName: 'SaúdePrimeira Serviços Ltda.',
    politicianName: 'Maria Costa',
    severity: 'medium',
  },
  {
    id: 8,
    year: '2025',
    value: 3_200_000,
    agency: 'Prefeitura Municipal',
    description: 'Sistema de gestão pública - dispensa de licitação',
    companyName: 'TechNova Soluções S.A.',
    politicianName: 'Roberto Alves',
    severity: 'high',
  },
];

// ─── Summary ─────────────────────────────────────────────────────────────────

const summaryData: CrossReferenceSummary = {
  totalPoliticians: 3,
  totalCompanies: 6,
  totalCrossReferences: 8,
  totalContracts: 8,
  totalSuspiciousValue: 130_300_000,
  highSeverityCount: 8,
  mediumSeverityCount: 5,
  lowSeverityCount: 3,
};

// ─── Complete Dashboard Data ────────────────────────────────────────────────

export const mockCrossReferenceDashboard: CrossReferenceDashboardData = {
  summary: summaryData,
  crossReferences: crossReferencesData,
  topContracts: topContractsData.sort((a, b) => b.value - a.value),
  politiciansByValue: politiciansData.sort((a, b) => b.totalContractValue - a.totalContractValue),
  companiesByValue: companiesData.sort((a, b) => b.totalContractValue - a.totalContractValue),
};

// ─── Adapter: derivar dados do dashboard a partir dos mocks existentes ──────

export function buildCrossReferenceFromExistingMocks(): CrossReferenceDashboardData {
  // Este é o adapter que será substituído pela chamada à API real
  // No futuro, esta função fará um fetch para GET /api/dashboard/cross-reference
  return mockCrossReferenceDashboard;
}
