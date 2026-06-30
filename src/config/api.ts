// ─────────────────────────────────────────────────────────────────────────────
// API CONFIG — Configuração de conexão com o backend (api-pente-fino)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * URL base da API Pente Fino.
 * - Em desenvolvimento: http://localhost:3000 (padrão da API Express)
 * - Em produção: deve ser alterado para a URL real de deploy
 */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';
