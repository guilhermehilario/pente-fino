import { mockPoliticians, mockCompanies, type PoliticianDetail, type CompanyDetail } from './mockData';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  name: string;
  type: 'politician' | 'company';
  subtitle: string;
  val: number;          // node radius
  color: string;
  entityId: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  color: string;
  width: number;
  severity: 'high' | 'medium' | 'low';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// ─── Color palette ──────────────────────────────────────────────────────────

const COLORS = {
  politician: '#818cf8',    // indigo-400
  politicianBorder: '#6366f1', // indigo-500
  company: '#60a5fa',       // blue-400
  companyBorder: '#3b82f6',  // blue-500
  edgeHigh: '#f87171',      // red-400
  edgeMedium: '#fb923c',    // orange-400
  edgeLow: '#94a3b8',       // slate-400
};

// ─── Severity mapping for relation strings ─────────────────────────────────

function classifyRelation(relation: string): 'high' | 'medium' | 'low' {
  const r = relation.toLowerCase();
  if (r.includes('oculto') || r.includes('suspeita') || r.includes('oculto') || r.includes('investigação')) return 'high';
  if (r.includes('ex-') || r.includes('doador') || r.includes('contrato') || r.includes('campanha')) return 'medium';
  return 'low';
}

function edgeColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high': return COLORS.edgeHigh;
    case 'medium': return COLORS.edgeMedium;
    case 'low': return COLORS.edgeLow;
  }
}

// ─── Main builder ───────────────────────────────────────────────────────────

export function buildFullGraph(): GraphData {
  const nodeMap = new Map<string, GraphNode>();
  const linkMap = new Map<string, GraphLink>();  // dedup by "source->target"

  const addNode = (id: string, name: string, type: 'politician' | 'company', subtitle: string, entityId: number) => {
    if (!nodeMap.has(id)) {
      nodeMap.set(id, {
        id,
        name,
        type,
        subtitle,
        val: type === 'politician' ? 12 : 10,
        color: type === 'politician' ? COLORS.politician : COLORS.company,
        entityId,
      });
    }
  };

  const addLink = (source: string, target: string, label: string, severity: 'high' | 'medium' | 'low') => {
    // Force a canonical key to deduplicate
    const [a, b] = source < target ? [source, target] : [target, source];
    const key = `${a}||${b}`;
    if (!linkMap.has(key)) {
      linkMap.set(key, {
        source: a,
        target: b,
        label,
        color: edgeColor(severity),
        width: severity === 'high' ? 2.5 : severity === 'medium' ? 1.8 : 1,
        severity,
      });
    }
  };

  // ── Add all politicians ──
  Object.values(mockPoliticians).forEach((p: PoliticianDetail) => {
    const nodeId = `politician-${p.id}`;
    addNode(nodeId, p.name, 'politician', `${p.role} · ${p.party}`, p.id);

    // Links to companies from politician perspective
    p.linkedCompanies.forEach((c) => {
      const compId = `company-${c.id}`;
      addNode(compId, c.name, 'company', c.cnpj, c.id);
      const sev = classifyRelation(c.relation);
      addLink(nodeId, compId, c.relation, sev);
    });
  });

  // ── Add all companies (and their politicians not yet linked) ──
  Object.values(mockCompanies).forEach((c: CompanyDetail) => {
    const compId = `company-${c.id}`;
    addNode(compId, c.name, 'company', `${c.sector} · ${c.cnpj}`, c.id);

    c.politicians.forEach((p) => {
      const nodeId = `politician-${p.id}`;
      addNode(nodeId, p.name, 'politician', `${p.role} · ${p.party}`, p.id);
      const sev = classifyRelation(p.relation);
      // Check if link already added (from politician perspective)
      const [a, b] = nodeId < compId ? [nodeId, compId] : [compId, nodeId];
      const key = `${a}||${b}`;
      if (!linkMap.has(key)) {
        addLink(nodeId, compId, p.relation, sev);
      }
    });
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links: Array.from(linkMap.values()),
  };
}

// ── Build sub-graph focused on a single entity ──

export function buildFocusedGraph(
  entityType: 'politician' | 'company',
  entityId: number,
  maxDepth: number = 2
): GraphData {
  const full = buildFullGraph();

  if (entityType === 'politician') {
    const centerId = `politician-${entityId}`;
    return filterGraph(full, centerId, maxDepth);
  } else {
    const centerId = `company-${entityId}`;
    return filterGraph(full, centerId, maxDepth);
  }
}

function filterGraph(full: GraphData, centerId: string, maxDepth: number): GraphData {
  const visited = new Set<string>();
  const includedLinks: GraphLink[] = [];
  const queue: { id: string; depth: number }[] = [{ id: centerId, depth: 0 }];
  visited.add(centerId);

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (depth >= maxDepth) continue;

    full.links.forEach((link) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;

      if (sourceId === id && !visited.has(targetId)) {
        visited.add(targetId);
        queue.push({ id: targetId, depth: depth + 1 });
        includedLinks.push(link);
      } else if (targetId === id && !visited.has(sourceId)) {
        visited.add(sourceId);
        queue.push({ id: sourceId, depth: depth + 1 });
        includedLinks.push(link);
      } else if ((sourceId === id && visited.has(targetId)) || (targetId === id && visited.has(sourceId))) {
        // Link to already-visited node — still include the edge
        if (!includedLinks.includes(link)) {
          includedLinks.push(link);
        }
      }
    });
  }

  // Also include any links BETWEEN visited nodes
  full.links.forEach((link) => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    if (visited.has(sourceId) && visited.has(targetId) && !includedLinks.includes(link)) {
      includedLinks.push(link);
    }
  });

  return {
    nodes: full.nodes.filter((n) => visited.has(n.id)),
    links: includedLinks,
  };
}
