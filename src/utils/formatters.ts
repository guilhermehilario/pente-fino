// ─────────────────────────────────────────────────────────────────────────────
// FORMATTERS — Adaptadores/Mappers para exibição de dados
// Separa a lógica de formatação da lógica de renderização.
// ─────────────────────────────────────────────────────────────────────────────

import type { AlertSeverity, RelationSeverity } from '../types/crossReferenceDashboard';

// ─── Currency ───────────────────────────────────────────────────────────────

/**
 * Formata um valor numérico para moeda brasileira (BRL).
 * Ex: 1234567.89 → "R$ 1.234.567,89"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata valor monetário de forma abreviada para visão rápida.
 * Ex: 1_200_000 → "R$ 1,2M" | 850_000 → "R$ 850K"
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(1)}Bi`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}

// ─── Date ───────────────────────────────────────────────────────────────────

/**
 * Formata uma data ISO string para o formato extended brasileiro.
 * Ex: "2025-03-15T00:00:00.000Z" → "15 de março de 2025"
 */
export function formatDateFull(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Formata data no formato curto: "15/03/2025"
 */
export function formatDateShort(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return isoString;
  }
}

/**
 * Formata apenas mês e ano: "Mar/2025"
 */
export function formatMonthYear(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    }).replace('.', '');
  } catch {
    return isoString;
  }
}

// ─── Severity ───────────────────────────────────────────────────────────────

export interface SeverityVisualConfig {
  /** Classe de background Tailwind */
  bg: string;
  /** Classe de borda Tailwind */
  border: string;
  /** Classe de texto Tailwind */
  text: string;
  /** Cor do ponto indicador */
  dot: string;
  /** Rótulo em português */
  label: string;
  /** Ordem de severidade (1 = mais severo) */
  order: number;
}

/**
 * Mapa de configuração visual para severidade de alertas.
 */
export const severityConfig: Record<AlertSeverity, SeverityVisualConfig> = {
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    dot: 'bg-red-500',
    label: 'Alto',
    order: 1,
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    dot: 'bg-orange-500',
    label: 'Médio',
    order: 2,
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Baixo',
    order: 3,
  },
  none: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    label: 'Sem Alerta',
    order: 4,
  },
};

/**
 * Mapa de configuração visual para severidade de relações (arestas).
 */
export const relationSeverityConfig: Record<RelationSeverity, SeverityVisualConfig> = {
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    dot: 'bg-red-500',
    label: 'Alta Suspeita',
    order: 1,
  },
  medium: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    dot: 'bg-orange-500',
    label: 'Média Suspeita',
    order: 2,
  },
  low: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    label: 'Baixa Suspeita',
    order: 3,
  },
};

// ─── Number ─────────────────────────────────────────────────────────────────

/**
 * Formata números grandes com separadores.
 * Ex: 1234567 → "1.234.567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata percentual.
 * Ex: 0.756 → "75,6%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// ─── CNPJ ───────────────────────────────────────────────────────────────────

/**
 * Formata CNPJ: "12345678000199" → "12.345.678/0001-99"
 */
export function formatCNPJ(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 14) return raw;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}
