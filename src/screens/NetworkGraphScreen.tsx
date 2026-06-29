import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {
  ArrowLeft, Share2, Filter, Search, X, ZoomIn, ZoomOut,
  RotateCcw, Users, Building2
} from 'lucide-react';
import { buildFullGraph, buildFocusedGraph, type GraphNode, type GraphLink } from '../data/graphData';
import { buttons, texts, containers } from '../globalStyle';

// ─── Types ──────────────────────────────────────────────────────────────────

interface NetworkGraphScreenProps {
  initialCenter?: { type: 'politician' | 'company'; id: number };
  onBack: () => void;
  onPoliticianClick: (id: number) => void;
  onCompanyClick: (id: number) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function NetworkGraphScreen({
  initialCenter,
  onBack,
  onPoliticianClick,
  onCompanyClick,
}: NetworkGraphScreenProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'politician' | 'company'>('all');

  // ── Build graph data ──
  const graphData = useMemo(() => {
    if (initialCenter) {
      return buildFocusedGraph(initialCenter.type, initialCenter.id, 2);
    }
    return buildFullGraph();
  }, [initialCenter]);

  // ── Filtered data ──
  const filteredData = useMemo(() => {
    if (filterType === 'all' && !searchQuery) return graphData;

    const visibleIds = new Set<string>();

    // First pass: filter nodes by type and search
    graphData.nodes.forEach((n) => {
      const matchesType = filterType === 'all' || n.type === filterType;
      const matchesSearch = !searchQuery ||
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      if (matchesType && matchesSearch) {
        visibleIds.add(n.id);
      }
    });

    // Second pass: include links between visible nodes
    const filteredLinks = graphData.links.filter((l) => {
      const sourceId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
      const targetId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
      return visibleIds.has(sourceId) && visibleIds.has(targetId);
    });

    return {
      nodes: graphData.nodes.filter((n) => visibleIds.has(n.id)),
      links: filteredLinks,
    };
  }, [graphData, filterType, searchQuery]);

  // ── Dimensions tracking ──
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // ── Controls ──
  const handleZoomIn = () => graphRef.current?.zoomToFit(400, 50);
  const handleZoomOut = () => {
    const fg = graphRef.current;
    if (fg) {
      const { x, y } = fg.centerAt();
      fg.zoom(0.5, 400);
    }
  };
  const handleReset = () => {
    graphRef.current?.zoomToFit(400, 80);
  };
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.type === 'politician') {
        onPoliticianClick(node.entityId);
      } else {
        onCompanyClick(node.entityId);
      }
    },
    [onPoliticianClick, onCompanyClick]
  );

  return (
    <div className={`${containers.screenDashboard} !p-0 !items-stretch`}>
      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={buttons.back}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <div className="h-6 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Mapa de Conexões
            </h1>
          </div>
          {initialCenter && (
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Focado em: {graphData.nodes.find((n) =>
                n.id === `${initialCenter.type}-${initialCenter.id}`
              )?.name ?? initialCenter.type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no grafo..."
              className="w-48 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/50">
            {(['all', 'politician', 'company'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' && 'Todos'}
                {type === 'politician' && <><Users size={12} /> Políticos</>}
                {type === 'company' && <><Building2 size={12} /> Empresas</>}
              </button>
            ))}
          </div>

          {/* Graph controls */}
          <div className="flex bg-slate-800/80 rounded-lg border border-slate-700/50">
            <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-l-md transition-colors" title="Zoom para ajustar">
              <ZoomIn size={16} />
            </button>
            <div className="w-px bg-slate-700/50" />
            <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors" title="Zoom out">
              <ZoomOut size={16} />
            </button>
            <div className="w-px bg-slate-700/50" />
            <button onClick={handleReset} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-r-md transition-colors" title="Resetar visão">
              <RotateCcw size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`p-2 rounded-lg border transition-colors ${
              showLegend
                ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                : 'bg-slate-800/80 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title="Legenda"
          >
            <Filter size={16} />
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Graph canvas */}
        <div ref={containerRef} className="flex-1 relative bg-slate-900/50">
          {filteredData.nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Share2 size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Nenhum resultado encontrado</p>
                <p className="text-sm mt-1">Tente ajustar os filtros ou a busca</p>
              </div>
            </div>
          ) : (
            <ForceGraph2D
              ref={graphRef}
              graphData={filteredData as any}
              width={dimensions.width}
              height={dimensions.height}
              backgroundColor="#0f172a"
              nodeLabel={(node: any) => {
                const n = node as GraphNode;
                return `<div style="background:#1e293b;color:#e2e8f0;padding:8px 12px;border-radius:8px;border:1px solid #334155;font-size:13px;font-family:sans-serif;max-width:220px">
                  <strong style="color:${n.type === 'politician' ? '#818cf8' : '#60a5fa'}">${n.name}</strong>
                  <div style="color:#94a3b8;font-size:11px;margin-top:2px">${n.subtitle}</div>
                  <div style="color:#64748b;font-size:10px;margin-top:4px">Clique para ver detalhes</div>
                </div>`;
              }}
              nodeColor={(node: any) => (node as GraphNode).color}
              nodeVal={(node: any) => (node as GraphNode).val}
              linkColor={(link: any) => (link as GraphLink).color}
              linkWidth={(link: any) => (link as GraphLink).width}
              linkDirectionalArrowLength={5}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0.25}
              linkLabel={(link: any) => {
                const l = link as GraphLink;
                return `<div style="background:#1e293b;color:#e2e8f0;padding:6px 10px;border-radius:6px;border:1px solid #334155;font-size:12px;font-family:sans-serif">${l.label}</div>`;
              }}
              onNodeHover={(node: any) => setHoveredNode(node as GraphNode | null)}
              onNodeClick={(node: any) => handleNodeClick(node as GraphNode)}
              enableNodeDrag={true}
              enableZoomInteraction={true}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              cooldownTicks={100}
              linkCanvasObjectMode={() => 'after'}
              linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D) => {
                // Draw link labels
                const text = (link as GraphLink).label;
                if (!text) return;
                const start = link.source;
                const end = link.target;
                if (!start || !end || typeof start.x !== 'number' || typeof end.x !== 'number') return;

                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;

                ctx.save();
                ctx.font = '9px Inter, sans-serif';
                ctx.fillStyle = link.color + 'cc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                // Background for text
                const metrics = ctx.measureText(text);
                const pad = 3;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.roundRect
                  ? ctx.roundRect(midX - metrics.width / 2 - pad, midY - 8, metrics.width + pad * 2, 16, 4)
                  : ctx.rect(midX - metrics.width / 2 - pad, midY - 8, metrics.width + pad * 2, 16);
                ctx.fill();

                ctx.fillStyle = link.color;
                ctx.fillText(text, midX, midY + 6);
                ctx.restore();
              }}
            />
          )}

          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 flex gap-3 text-xs">
            <span className="bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400">
              {graphData.nodes.length} nós · {graphData.links.length} conexões
            </span>
            <span className="bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400">
              {graphData.nodes.filter((n) => n.type === 'politician').length} políticos · {graphData.nodes.filter((n) => n.type === 'company').length} empresas
            </span>
          </div>

          {/* Hover tooltip */}
          {hoveredNode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-700/50 shadow-2xl pointer-events-none z-10 text-center max-w-md">
              <p className={`font-semibold text-sm ${hoveredNode.type === 'politician' ? 'text-indigo-400' : 'text-blue-400'}`}>
                {hoveredNode.name}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">{hoveredNode.subtitle}</p>
              <p className="text-slate-500 text-[10px] mt-1">Clique para abrir detalhes</p>
            </div>
          )}
        </div>

        {/* ── Legend sidebar ── */}
        {showLegend && (
          <div className="w-56 bg-slate-900/95 border-l border-slate-800 p-5 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Legenda</h3>
              <button onClick={() => setShowLegend(false)} className="text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Nós</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-indigo-400 border-2 border-indigo-500 flex-shrink-0" />
                    <span className="text-xs text-slate-300">Político / Pessoa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-blue-500 flex-shrink-0" />
                    <span className="text-xs text-slate-300">Empresa</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Arestas</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-0.5 bg-red-400 rounded flex-shrink-0" />
                    <span className="text-xs text-slate-300">Alerta / Suspeita</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-0.5 bg-orange-400 rounded flex-shrink-0" />
                    <span className="text-xs text-slate-300">Médio risco</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-0.5 bg-slate-400 rounded flex-shrink-0" />
                    <span className="text-xs text-slate-300">Baixo risco</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Interação</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>· Arraste nós para reposicionar</li>
                  <li>· Scroll para zoom</li>
                  <li>· Clique em um nó para detalhes</li>
                  <li>· Passe o mouse sobre arestas</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
