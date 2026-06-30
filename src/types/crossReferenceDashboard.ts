// ─────────────────────────────────────────────────────────────────────────────
// CONSUMER-DRIVEN CONTRACT — Dashboard de Cruzamento de Dados
//
// Este arquivo define o contrato TypeScript exato que o Backend (api-pente-fino)
// precisará implementar para suprir a tela de Dashboard de Cruzamento.
//
// Versão: 1.0
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums & Constants ──────────────────────────────────────────────────────

export type AlertSeverity = 'red' | 'orange' | 'yellow' | 'none';
export type RelationSeverity = 'high' | 'medium' | 'low';

// ─── Summary ────────────────────────────────────────────────────────────────

export interface CrossReferenceSummary {
  /** Total de políticos (PEPs) mapeados */
  totalPoliticians: number;
  /** Total de empresas investigadas */
  totalCompanies: number;
  /** Total de relacionamentos cruzados político ↔ empresa */
  totalCrossReferences: number;
  /** Total de contratos suspeitos identificados */
  totalContracts: number;
  /** Valor total sob suspeita (somatório de todos os contratos) */
  totalSuspiciousValue: number;
  /** Quantidade de alertas de severidade alta (vermelho) */
  highSeverityCount: number;
  /** Quantidade de alertas de severidade média (laranja) */
  mediumSeverityCount: number;
  /** Quantidade de alertas de severidade baixa (amarelo) */
  lowSeverityCount: number;
}

// ─── Cross-Reference Link ───────────────────────────────────────────────────

export interface CrossReferenceLink {
  /** Identificador único do vínculo */
  id: string;
  /** ID do político */
  politicianId: number;
  /** Nome do político */
  politicianName: string;
  /** Cargo do político (ex: Deputado Estadual) */
  politicianRole: string;
  /** Partido do político (ex: PMB) */
  politicianParty: string;
  /** Nível máximo de alerta deste político */
  politicianMaxAlert: AlertSeverity;
  /** ID da empresa vinculada */
  companyId: number;
  /** Nome da empresa */
  companyName: string;
  /** CNPJ da empresa */
  companyCnpj: string;
  /** Setor de atuação da empresa */
  companySector: string;
  /** Descrição da relação (ex: Sócio Oculto, Doador de Campanha) */
  relation: string;
  /** Severidade da relação */
  relationSeverity: RelationSeverity;
  /** Quantidade de contratos entre este par */
  contractCount: number;
  /** Valor total dos contratos entre este par (numérico para sorting) */
  totalContractValue: number;
}

// ─── Top Contract Item ──────────────────────────────────────────────────────

export interface TopContractItem {
  /** Identificador único do contrato */
  id: number;
  /** Ano do contrato */
  year: string;
  /** Valor numérico do contrato (para ordenação e formatação) */
  value: number;
  /** Órgão público contratante */
  agency: string;
  /** Descrição do contrato */
  description: string;
  /** Nome da empresa contratada */
  companyName: string;
  /** Nome do político vinculado */
  politicianName: string;
  /** Severidade da suspeita */
  severity: RelationSeverity;
}

// ─── Politician Summary (para ranking) ──────────────────────────────────────

export interface PoliticianSummary {
  id: number;
  name: string;
  role: string;
  party: string;
  /** Quantidade de empresas ligadas */
  companyCount: number;
  /** Quantidade de contratos envolvendo suas empresas ligadas */
  contractCount: number;
  /** Valor total dos contratos envolvendo suas empresas ligadas */
  totalContractValue: number;
  /** Maior severidade de alerta deste político */
  maxSeverity: AlertSeverity;
}

// ─── Company Summary (para ranking) ─────────────────────────────────────────

export interface CompanySummary {
  id: number;
  name: string;
  cnpj: string;
  sector: string;
  /** Quantidade de políticos ligados */
  politicianCount: number;
  /** Quantidade de contratos suspeitos */
  contractCount: number;
  /** Valor total dos contratos suspeitos */
  totalContractValue: number;
  /** Maior severidade de alerta desta empresa */
  maxSeverity: AlertSeverity;
}

// ─── Main Dashboard Contract ────────────────────────────────────────────────

export interface CrossReferenceDashboardData {
  /** Métricas resumidas do topo */
  summary: CrossReferenceSummary;
  /** Matriz de cruzamento político ↔ empresa */
  crossReferences: CrossReferenceLink[];
  /** Top contratos suspeitos (ordenados por valor decrescente) */
  topContracts: TopContractItem[];
  /** Ranking de políticos por valor sob suspeita */
  politiciansByValue: PoliticianSummary[];
  /** Ranking de empresas por valor sob suspeita */
  companiesByValue: CompanySummary[];
}

// ─── API Response Envelope ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: {
    timestamp: string;
    version: string;
  };
}
