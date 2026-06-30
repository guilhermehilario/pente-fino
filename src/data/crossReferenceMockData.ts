// ─────────────────────────────────────────────────────────────────────────────
// CROSS-REFERENCE DATA ADAPTER
// Busca os dados do Dashboard de Cruzamento da API.
// Mantém fallback local apenas para desenvolvimento sem o backend rodando.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CrossReferenceDashboardData,
  CrossReferenceLink,
  TopContractItem,
  PoliticianSummary,
  CompanySummary,
  CrossReferenceSummary,
} from '../types/crossReferenceDashboard';
import { API_BASE_URL } from '../config/api';

// ─── Minimal Fallback Data ──────────────────────────────────────────────────
// (apenas para emergência quando o backend não estiver disponível)

const fallbackSummary: CrossReferenceSummary = {
  totalPoliticians: 0,
  totalCompanies: 0,
  totalCrossReferences: 0,
  totalContracts: 0,
  totalSuspiciousValue: 0,
  highSeverityCount: 0,
  mediumSeverityCount: 0,
  lowSeverityCount: 0,
};

const emptyDashboard: CrossReferenceDashboardData = {
  summary: fallbackSummary,
  crossReferences: [],
  topContracts: [],
  politiciansByValue: [],
  companiesByValue: [],
};

// ─── API Fetch ──────────────────────────────────────────────────────────────

const API_ENDPOINT = `${API_BASE_URL}/api/dashboard/cross-reference`;

/**
 * Busca os dados completos do dashboard de cruzamento da API.
 * Faz fallback para dados vazios em caso de erro (API indisponível).
 */
export async function fetchCrossReferenceDashboard(): Promise<CrossReferenceDashboardData> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`[CrossReference] API returned ${response.status}, using fallback data.`);
      return emptyDashboard;
    }

    const body = await response.json();

    if (!body.success || !body.data) {
      console.warn('[CrossReference] API response missing data, using fallback.');
      return emptyDashboard;
    }

    return body.data as CrossReferenceDashboardData;
  } catch (error) {
    console.warn('[CrossReference] Failed to fetch dashboard data:', error);
    console.warn('[CrossReference] Using fallback empty data. Start the API server for full data.');
    return emptyDashboard;
  }
}

// ─── Legacy Adapter (keep for compatibility) ────────────────────────────────
// Função síncrona mantida para compatibilidade com código legado.
// Retorna dados vazios — o fluxo principal agora usa fetchCrossReferenceDashboard().

export function buildCrossReferenceFromExistingMocks(): CrossReferenceDashboardData {
  console.warn(
    '[CrossReference] buildCrossReferenceFromExistingMocks() is deprecated. ' +
    'Use fetchCrossReferenceDashboard() for async loading from API.'
  );
  return emptyDashboard;
}

export { emptyDashboard as mockCrossReferenceDashboard };
