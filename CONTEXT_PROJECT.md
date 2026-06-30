# 🕵️ Pega-Corrupção (PenteFino) — Contexto do Projeto

> **Propósito deste documento:** Servir como fonte única de verdade para agentes de IA sobre o que já foi implementado no projeto. Leia este documento antes de sugerir ou implementar novas funcionalidades para evitar retrabalho e garantir consistência.

---

## 1. Visão Geral

**Pega-Corrupção** é uma plataforma de investigação e inteligência para análise de conexões entre empresas, políticos e pessoas públicas. O nome de marca é **PenteFino**.

O objetivo é permitir que jornalistas, investigadores e cidadãos pesquisem por CNPJ, razão social, nome de político ou sócio, e visualizem um dashboard com informações consolidadas e suspeitas de corrupção/irregularidades.

**Stack tecnológica:**

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Framework UI |
| TypeScript | ~6.0 | Linguagem |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Estilização (via @tailwindcss/vite) |
| lucide-react | 1.21 | Ícones |
| ESLint | 10 | Linting |

---

## 2. Estrutura de Pastas

```
pega-corrupcao/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── README.md
├── CONTEXT_PROJECT.md               ← Este documento
└── src/
    ├── main.tsx
    ├── App.tsx                      # Roteador + ViewTransition + NavigationHeader
    ├── index.css                    # Tema Tailwind + animações (scanner, slide, title)
    ├── hooks/
    │   └── useNavigationHistory.ts  # Hook de navegação em stack + localStorage + Browser History API
    ├── data/
    │   ├── mockData.ts              # Dados mockados + tipos expandidos
    │   └── graphData.ts             # Transformação de dados para grafo
    ├── globalStyle/
    │   ├── index.ts
    │   ├── buttonStyle.ts
    │   ├── inputStyle.ts
    │   ├── textStyle.ts
    │   ├── containerStyle.ts
    │   ├── cardStyle.ts
    │   └── tableStyle.ts
    ├── components/
    │   ├── navigation/
    │   │   └── NavigationHeader.tsx  # Barra de navegação global (back/forward + breadcrumb + histórico visual)
    │   └── ui/
    │       ├── StatCard.tsx
    │       ├── ContactInfoCard.tsx
    │       ├── ConfirmDialog.tsx     # Modal de confirmação reutilizável
    │       └── ViewTransition.tsx    # Transição animada entre telas (slide-in)
    └── screens/
        ├── SearchScreen.tsx
        ├── CompanyDashboard.tsx
        ├── PersonDashboard.tsx
        ├── PoliticianDetailScreen.tsx
        ├── CompanyDetailScreen.tsx
        ├── NetworkGraphScreen.tsx   # Mapa de Conexões
        └── DashboardCruzamento.tsx  # Dashboard de Cruzamento de Dados
```

---

## 3. Arquitetura de Roteamento

O projeto **não usa React Router**. O roteamento é gerenciado pelo hook `useNavigationHistory` (`src/hooks/useNavigationHistory.ts`), que implementa uma **stack de navegação** persistida em `localStorage` e sincronizada com a **Browser History API**.

### ViewState

Tipos de view são uma discriminated union simples — sem `parentView` ou qualquer contexto extra:

```typescript
export type ViewState =
  | { type: 'search' }
  | { type: 'company'; companyId: number }
  | { type: 'person'; personId: number }
  | { type: 'company-detail'; companyId: number }
  | { type: 'politician-detail'; politicianId: number }
  | { type: 'graph'; centerType?: 'politician' | 'company'; centerId?: number }
  | { type: 'cross-reference' };
```

### Hook `useNavigationHistory`

```typescript
const {
  current, canGoBack, canGoForward, lastDirection, navEntries,
  push, back, forward, replace, goTo, reset
} = useNavigationHistory(initialView);

push(view)    // Navega para nova view (empilha) + pushState() no browser
replace(view) // Substitui a última entrada na stack + replaceState() — evita duplicidade para mesma entidade
back()        // Volta uma posição via window.history.back() → dispara popstate
forward()     // Avança uma posição via window.history.forward()
goTo(index)   // Pula para índice específico via window.history.go(delta)
reset()       // Limpa tudo e volta para a view inicial + replaceState

canGoBack     // true se há páginas anteriores na stack (length > 1)
canGoForward  // true se há páginas posteriores (forward stack não vazio)
lastDirection // 'forward' | 'backward' — usado pelo ViewTransition para animação
navEntries    // Array completo do histórico (para exibir UI)
```

### Integração com Browser History API

O hook sincroniza automaticamente a stack de navegação com o histórico do navegador:

1. **`push(view)`** — Adiciona entrada à stack + `history.pushState({ entries: JSON.stringify(stack) })`
2. **`replace(view)`** — Substitui última entrada (slice(0,-1) + new) + `history.replaceState()`
3. **`back()`** — Chama `window.history.back()` → dispara `popstate` → handler restaura a stack
4. **`forward()`** — Chama `window.history.forward()` → dispara `popstate`
5. **`goTo(index)`** — Chama `window.history.go(delta)` → `popstate` restaura a stack alvo
6. **`reset()`** — `replaceState` com apenas a view inicial (sem forward)

**Evento `popstate`:** O handler compara `restored.length` vs `historyRef.current.length` para determinar direção:
- `restored < current` → usuário voltou → entradas descartadas vão para `forwardStack` → `lastDirection = 'backward'`
- `restored > current` → usuário avançou → `forwardStack` é reduzido → `lastDirection = 'forward'`

**forwardStack:** Armazena entradas "futuras" quando o usuário volta, permitindo `canGoForward` e `forward()`.

### Persistência

- Histórico salvo em `localStorage` na chave `` `pega-corrupcao-nav-history-v{STORAGE_VERSION}` ``
- **Versão atual do schema:** `STORAGE_VERSION = 2` 🔄 *(incrementar ao alterar ViewState)*
- Máximo de 50 entradas na stack
- Tratamento de erros: dados corrompidos são ignorados, armazenamento cheio faz trim automático
- Validação de schema: entradas carregadas passam por `isValidEntry()` — entradas com campos ausentes ou tipos desconhecidos são descartadas
- Ao recarregar a página, a última sessão é restaurada automaticamente

### Fluxo de Navegação

| Origem | Ação | Destino | Método | Stack após ação |
|---|---|---|---|---|
| SearchScreen | Pesquisa → | CompanyDashboard | `push()` | `[search, company]` |
| SearchScreen | Pesquisa → | PersonDashboard | `push()` | `[search, person]` |
| CompanyDashboard | "Ver Detalhes" → | CompanyDetailScreen | `replace()` | `[search, company-detail]` (substitui company) |
| PersonDashboard | "Ver Detalhes" → | PoliticianDetailScreen | `replace()` | `[search, politician-detail]` (substitui person) |
| CompanyDashboard | Clique político → | PoliticianDetailScreen | `push()` | `[search, company, politician-detail]` |
| PersonDashboard | Clique empresa → | CompanyDetailScreen | `push()` | `[search, person, company-detail]` |
| CompanyDetailScreen | Clique político → | PoliticianDetailScreen | `push()` | `[search, company-detail, politician-detail]` |
| PoliticianDetailScreen | Clique empresa → | CompanyDetailScreen | `push()` | `[search, company-detail, politician-detail, company-detail]` |
| Qualquer tela | "Mapa de Conexões" → | NetworkGraph | `push()` | `[..., graph]` |
| Qualquer tela | Voltar → | Anterior | `back()` | Remove último |

**Nota:** `replace()` é usado exclusivamente para o botão "Ver Detalhes" (CompanyDashboard → CompanyDetailScreen, PersonDashboard → PoliticianDetailScreen) para evitar duplicidade no histórico — ambas as telas representam a mesma entidade em diferentes níveis de detalhe. Navegações entre entidades distintas (ex: clicar em político na tabela) sempre usam `push()`.

---

## 4. Componentes de Navegação

### 4.1 NavigationHeader (`src/components/navigation/NavigationHeader.tsx`)

Barra de navegação global exibida no topo de todas as telas (sticky, backdrop-blur z-50).

**Funcionalidades:**

- **← Botão Voltar:** desabilitado quando `canGoBack` é falso. Chama `window.history.back()`
- **→ Botão Avançar:** desabilitado quando `canGoForward` é falso. Chama `window.history.forward()`
- **Breadcrumb:** mostra as últimas 3 páginas visitadas como links clicáveis, com:
  - Ícone emoji por tipo de view (`viewIcons`): 🔍 busca, 🏢 empresa, 👤 pessoa/político, 🏭 detalhe empresa, 🔗 grafo, ⚖️ cruzamento
  - Título da página atual com animação `animate-title-enter` (fade + translateY) ao navegar
  - Itens não-atuais clicáveis que chamam `goTo(index)`
  - Se houver mais de 3 entradas, mostra `...` antes das últimas 3
- **▼ Dropdown de histórico:** botão toggle que abre/fecha painel completo:
  - Número da posição (#1, #2, ...)
  - Ícone por tipo de view
  - Título da página
  - Timestamp relativo ("Agora", "Há 5 min", "Há 2h", "Há 3d")
  - Badge com o tipo de view (`entry.view.type`)
  - Destaque na página atual (fundo azul, borda esquerda azul)
  - Scroll vertical se muitas entradas (max-h-[50vh])
- **Fechamento:** ao clicar fora, tecla Escape, e scroll do dropdown
- **Acessibilidade:** `aria-label`, `aria-expanded`, `role="dialog"`

**Props:**
```typescript
interface NavigationHeaderProps {
  current: ViewState;
  canGoBack: boolean;
  canGoForward: boolean;
  navEntries: NavEntry[];
  onBack: () => void;
  onForward: () => void;
  onGoTo: (index: number) => void;
}
```

### 4.2 ViewTransition (`src/components/ui/ViewTransition.tsx`)

Componente que envolve o conteúdo das telas com animação slide-in.

**Comportamento:**
- Usa `key={viewKey}` para forçar React a montar novo elemento a cada mudança de view → animação CSS dispara automaticamente
- Pula animação no **primeiro carregamento** (usa `useRef` para detectar first render)
- Direções:
  - `forward`: `animate-slide-in-right` (slide + fade de 40px da direita, 250ms, ease-out)
  - `backward`: `animate-slide-in-left` (slide + fade de 40px da esquerda)
  - `none`: sem animação
- Parent container com `overflow-hidden` e `relative` para clipping durante a transição
- `min-h-screen` para consistência de altura

**Props:**
```typescript
interface ViewTransitionProps {
  viewKey: string;
  direction: 'forward' | 'backward' | 'none';
  children: ReactNode;
}
```

**CSS (`src/index.css`):**
```css
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes title-enter {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 5. Telas Implementadas

### 5.1 SearchScreen (`src/screens/SearchScreen.tsx`)

**Funcionalidades:**
- Logo com ícone de impressão digital e animação de scanner (`animate-scanner`)
- Campo de busca com placeholder: *"Ex: TechNova, Roberto Alves..."*
- Botão de filtro (ícone `Filter`) que abre/fecha painel de filtros
- Botão de upload de arquivos locais (input file oculto)
- Botão de submit "Pesquisar"
- **Filtros avançados** com 4 categorias expansíveis:
  - **Criticidade:** Alerta Vermelho, Alerta Laranja, Alerta Amarelo, Alerta Verde
  - **Confiabilidade:** Conformado, Verificado, Suspeita
  - **Checagem de dados:** Dado confirmado por Sentença Judicial, Suspeita baseada em Inquérito Policial, Apenas vínculo contratual
  - **Ano de acontecimento:** 2026, 2025, 2024, 2023, 2022
- Filtros selecionados aparecem como badges removíveis acima do painel
- Botão "Limpar todos" para remover todos os filtros ativos
- Layout centralizado vertical e horizontalmente

**Props:** `{ onSearch: (query: string) => void; searchHistory: string[]; onRemoveSearch: (query: string) => void; onClearHistory: () => void; onCrossReferenceClick?: () => void }`

### 5.2 CompanyDashboard (`src/screens/CompanyDashboard.tsx`)

Tela de **resultado da busca por empresa** (visão básica).

**Funcionalidades:**
- **Header:** Ícone gradiente azul-indigo, nome da empresa, status badge (Ativa), categoria
- **Ações no header:**
  - "Mapa de Conexões" → `onGraphClick` (push para graph)
  - "Ver Detalhes" → `onDetailClick` (replace para company-detail — não duplica no histórico)
- **4 StatCards:** CNPJ, Valor de Mercado, Data de Criação, Políticos Ligados
- **Tabela com abas:**
  - Aba "Políticos": Nome (com avatar), Cargo/Função (badge), Partido — **clicável → PoliticianDetailScreen**
  - Aba "Sócios": Nome (com avatar), Qualificação (badge), Participação
- **Sidebar:** Card de Contato com e-mail, telefone e endereço

**Props:** `{ companyId: number; onBack: () => void; onPoliticianClick?: (id: number) => void; onGraphClick?: () => void; onDetailClick?: () => void }`

### 5.3 PersonDashboard (`src/screens/PersonDashboard.tsx`)

Tela de **resultado da busca por pessoa** (visão básica).

**Funcionalidades:**
- **Header:** Ícone gradiente índigo-roxo, nome da pessoa, status badge (Ativo), cargo e partido
- **Ações no header:**
  - "Mapa de Conexões" → `onGraphClick` (push para graph)
  - "Ver Detalhes" → `onDetailClick` (replace para politician-detail — não duplica no histórico)
- **4 StatCards:** Cargo Atual, Salário Bruto, Patrimônio Declarado, Empresas Ligadas
- **Tabela com abas:**
  - Aba "Empresas": Nome (com ícone), CNPJ, Relação/Vínculo — **clicável → CompanyDetailScreen**
  - Aba "Pessoas": Nome (com avatar), Cargo (badge), Relação/Vínculo
- **Sidebar:** Card de Contato com labels personalizáveis

**Props:** `{ personId: number; onBack: () => void; onDetailClick?: () => void; onCompanyClick?: (id: number) => void; onGraphClick?: () => void }`

### 5.4 PoliticianDetailScreen (`src/screens/PoliticianDetailScreen.tsx`)

Tela de **detalhamento completo do político** (visão detalhada, acessível via "Ver Detalhes" no PersonDashboard ou clicando em político nas tabelas).

**Funcionalidades:**
- **Header:** Ícone gradiente índigo-roxo, nome, status, cargo e partido
- **Ações no header:** "Mapa de Conexões", "Exportar Dossiê", "Ver Transações"
- **Painel de Alertas & Suspeitas:** Cards com indicador vermelho/laranja/amarelo
- **4 StatCards:** Cargo Atual, Salário, Patrimônio, Data de Nascimento
- **Biografia:** Texto completo do político
- **Carreira Política:** Timeline vertical com ano, cargo e descrição (expansível)
- **Processos & Investigações:** Lista com ano, tipo, status e descrição (expansível)
- **Sidebar de Contato:** E-mail, telefone, endereço
- **Sidebar de Empresas Ligadas:** Cards clicáveis → CompanyDetailScreen, com badge de relação (suspeita em vermelho/laranja)

**Props:** `{ politician: PoliticianDetail; onBack: () => void; onCompanyClick: (id: number) => void; onGraphClick?: () => void }`

### 5.5 CompanyDetailScreen (`src/screens/CompanyDetailScreen.tsx`)

Tela de **detalhamento completo da empresa** (visão detalhada, acessível via "Ver Detalhes" no CompanyDashboard ou clicando em empresa nas tabelas).

**Funcionalidades:**
- **Header:** Ícone gradiente azul-indigo, nome, status, setor
- **Ações no header:** "Mapa de Conexões", "Exportar Relatório", "Ver Contratos"
- **Painel de Alertas & Suspeitas:** Cards com indicador vermelho/laranja/amarelo
- **4 StatCards:** CNPJ, Faturamento Anual, Valor de Mercado, Funcionários
- **Contratos com Órgãos Públicos:** Tabela com ano, órgão, descrição e valor (expansível)
- **Tabela com abas:**
  - Aba "Sócios": Nome (com avatar), Qualificação (badge), Participação
  - Aba "Políticos": Nome (com avatar), Cargo/Partido (badge), Relação — **clicável → PoliticianDetailScreen**
- **Sidebar de Contato:** E-mail, telefone, endereço
- **Card de Data de Criação**

**Props:** `{ company: CompanyDetail; onBack: () => void; onPoliticianClick: (id: number) => void; onGraphClick?: () => void }`

### 5.6 NetworkGraphScreen (`src/screens/NetworkGraphScreen.tsx`)

**Funcionalidades:**
- Visualização interativa de grafo de conexões entre políticos e empresas (via `react-force-graph-2d`)
- Suporta visualização completa e modo **focado** (centrado em uma entidade específica com profundidade configurável)
- **Nós:** Políticos em indigo, Empresas em azul — tamanho proporcional à relevância
- **Arestas:** Cor codificada por severidade (vermelho=alta, laranja=média, cinza=baixa); setas direcionais; labels com nome da relação
- **Interações:** Arrastar nós, scroll para zoom, clique em nó → navega para detalhes da entidade, hover mostra tooltip
- **Busca textual** no grafo (filtra nós por nome/subtitulo)
- **Filtro por tipo:** Todos, Políticos ou Empresas
- **Barra de controles:** Zoom para ajuste, zoom out, resetar visão
- **Legenda lateral** explicando cores de nós e arestas
- **Contador** de nós e conexões (rodapé do canvas)
- **Modo focado:** Ao acessar de um dashboard, o grafo centraliza na entidade visualizada (ex: CompanyDashboard → grafo centrado na empresa)
- **Navegação:** Clique em qualquer nó → redireciona para a tela de detalhes da entidade (politician-detail ou company-detail)

**Dependência externa:** `react-force-graph-2d` (v1.29.1)

**Dados do grafo:** Geração automática via `src/data/graphData.ts`:
- `buildFullGraph()` — Constrói grafo completo com todas as entidades e conexões
- `buildFocusedGraph(type, id, maxDepth)` — Constrói subgrafo BFS centrado em uma entidade até `maxDepth` níveis de profundidade
- Deduplicação de arestas por chave canônica (source < target)

**Props:** `{ initialCenter?: { type: 'politician' | 'company'; id: number }; onBack: () => void; onPoliticianClick: (id: number) => void; onCompanyClick: (id: number) => void; }`

### 5.7 DashboardCruzamento (`src/screens/DashboardCruzamento.tsx`)

Dashboard macro-investigativo que cruza dados entre PEPs (Pessoas Expostas Politicamente) e Empresas. Consome dados via contrato CDC definido em `src/types/crossReferenceDashboard.ts`.

**Funcionalidades:**
- Indicador de alto risco com valor total sob suspeita
- 4 KPI cards: Políticos Mapeados, Empresas Investigadas, Contratos Suspeitos, Valor Sob Suspeita
- Barra de distribuição de alertas (alta/média/baixa severidade)
- Tabela de cruzamentos Político × Empresa com busca, ordenação por severidade/nome/valor
- Ranking de políticos e empresas por valor de contrato
- Top contratos suspeitos com barra de valor proporcional

**Props:** `{ onBack: () => void; onPoliticianClick?: (id: number) => void; onCompanyClick?: (id: number) => void; onGraphClick?: () => void }`

---

## 6. Lógica de Busca

A função `searchEntity(query)` em `App.tsx` implementa busca por **scoring**:

| Critério | Score | Mín. caracteres |
|---|---|---|
| Nome exato | 100 | — |
| CNPJ corresponde | 90 | 8 dígitos |
| Nome contém a query | 80 | 2 |
| Palavra começa com a query | 50 | 3 |
| Cargo contém a query | 40 | 3 |

- Ordena resultados por score (melhor primeiro)
- Fallback para político se query contém "deputado", "senador", "prefeito", etc.
- Fallback para empresa (id:1) se nada encontrado

---

## 7. Sistema de Estilo Global (`src/globalStyle/`)

O projeto usa um padrão de **constantes de classes Tailwind** exportadas como objetos JavaScript, centralizadas em arquivos por categoria:

| Arquivo | Objeto | Conteúdo |
|---|---|---|
| `containerStyle.ts` | `containers` | Layouts de tela, wrappers, grids |
| `buttonStyle.ts` | `buttons` | Variações de botão (primário, secundário, abas, etc.) |
| `inputStyle.ts` | `inputs` | Input de busca, checkboxes |
| `textStyle.ts` | `texts` | Headings, labels, badges, células de tabela |
| `cardStyle.ts` | `cards` | StatCard, ContactInfoCard, painel de filtros |
| `tableStyle.ts` | `tables` | Tabela, linhas, células, wrappers de avatar |

**Como usar:**
```tsx
import { containers, buttons, texts } from '../globalStyle';

<div className={containers.dashboardWrapper}>
  <button className={buttons.primary}>Pesquisar</button>
  <h1 className={texts.h1Dashboard}>Título</h1>
</div>
```

**Tema:** Escuro (slate-900 como cor de fundo), com acentos em azul (`blue-500/400`), índigo, verde esmeralda, roxo e laranja.

---

## 8. Componentes Compartilhados

### StatCard (`src/components/ui/StatCard.tsx`)

Card de estatística com ícone, título e valor.

**Props:**
| Prop | Tipo | Default |
|---|---|---|
| `title` | string | — |
| `value` | string \| number | — |
| `icon` | React.ReactNode | — |
| `iconBgColor?` | string | `'bg-blue-500/10'` |
| `iconTextColor?` | string | `'text-blue-400'` |

### ContactInfoCard (`src/components/ui/ContactInfoCard.tsx`)

Card lateral de informações de contato.

**Props:**
| Prop | Tipo | Default |
|---|---|---|
| `email` | string | — |
| `phone` | string | — |
| `address` | string | — |
| `emailLabel?` | string | `'E-mail'` |
| `phoneLabel?` | string | `'Telefone'` |
| `addressLabel?` | string | `'Endereço'` |
| `headerIcon?` | React.ReactNode | `<MapPin />` |
| `EmailIcon?` | LucideIcon | `Mail` |
| `PhoneIcon?` | LucideIcon | `Phone` |
| `AddressIcon?` | LucideIcon | `MapPin` |

### ConfirmDialog (`src/components/ui/ConfirmDialog.tsx`)

Modal de confirmação reutilizável com 3 variantes visuais.

**Props:**
| Prop | Tipo | Default |
|---|---|---|
| `open` | boolean | — |
| `title` | string | — |
| `description` | string | — |
| `confirmLabel` | string | — |
| `cancelLabel` | string | — |
| `variant?` | `'warning' \| 'danger' \| 'info'` | `'warning'` |
| `onConfirm` | () => void | — |
| `onCancel` | () => void | — |

---

## 9. Dados Mockados (`src/data/mockData.ts`)

### Tipos exportados
- `PoliticianDetail` — Interface completa com alerts, politicalCareer, legalProcesses, linkedCompanies
- `CompanyDetail` — Interface completa com alerts, partners, politicians, suspiciousContracts

### Objetos de exemplo
- `mockPoliticians` — `Record<number, PoliticianDetail>` com dados expandidos de:
  - **Roberto Alves** (id:1) — Deputado Estadual PMB, 3 alertas, 4 cargos, 3 processos, 3 empresas
  - **João Silveira** (id:2) — Senador PSD, 3 alertas, 4 cargos, 3 processos, 3 empresas
  - **Maria Costa** (id:3) — Prefeita MDB, 3 alertas, 4 cargos, 2 processos, 2 empresas
- `mockCompanies` — `Record<number, CompanyDetail>` com dados expandidos de:
  - **TechNova Soluções S.A.** (id:1) — TI, 3 alertas, 3 sócios, 3 políticos, 4 contratos
  - **Construtora Horizonte** (id:2) — Construção Civil, 2 alertas, 2 sócios, 1 político, 2 contratos
  - **AgroPecuária Alves** (id:3) — Agronegócio, 1 alerta, 2 sócios, 1 político, 1 contrato
  - **Construtora Silveira Ltda.** (id:4) — Construção Civil, 2 alertas, 2 sócios, 1 político, 3 contratos
  - **AgroNorte S.A.** (id:5) — Agronegócio, 2 alertas, 2 sócios, 1 político, 1 contrato
  - **SaúdePrimeira Serviços Ltda.** (id:6) — Saúde, 2 alertas, 2 sócios, 1 político, 1 contrato

---

## 10. Funcionalidades Implementadas (Resumo)

### Telas
- [x] **SearchScreen** — Busca, filtros avançados, upload de arquivos, atalho para Dashboard de Cruzamento
- [x] **CompanyDashboard** — Visão geral da empresa (resultado de busca), botões Mapa de Conexões + Ver Detalhes
- [x] **PersonDashboard** — Visão geral da pessoa (resultado de busca), botões Mapa de Conexões + Ver Detalhes
- [x] **PoliticianDetailScreen** — Detalhamento completo com alertas, biografia, carreira, processos, empresas ligadas
- [x] **CompanyDetailScreen** — Detalhamento completo com alertas, contratos suspeitos, sócios e políticos ligados
- [x] **NetworkGraphScreen** — Mapa interativo de conexões entre políticos e empresas via react-force-graph-2d
- [x] **DashboardCruzamento** — Dashboard macro-investigativo com cruzamento de dados PEP × Empresa

### Navegação
- [x] Roteamento via stack persistida em localStorage (`useNavigationHistory`)
- [x] Histórico completo preservado entre sessões (recarregar a página restaura o estado)
- [x] Navegação para trás múltiplos níveis (back repetido percorre a stack)
- [x] Suporte a `push`, `replace`, `back`, `forward`, `goTo(index)` e `reset`
- [x] **Browser History API:** pushState + popstate listener com restauração da stack e forwardStack tracking
- [x] **Botões Voltar/Avançar do navegador** funcionam nativamente
- [x] **`replace()`** — Substitui entrada na stack ao invés de empilhar (evita duplicidade CompanyDashboard → CompanyDetailScreen)
- [x] **NavigationHeader** — Barra global sticky com back/forward + breadcrumb com ícones + dropdown de histórico
- [x] **Breadcrumb animado** — Últimas 3 páginas como links clicáveis + ícone por view + `animate-title-enter` no título atual
- [x] **Dropdown de histórico** — Lista completa com timestamps, ícones, position badge, navegação direta, fechamento ao clicar fora / Escape
- [x] **ViewTransition** — Animação slide-in (forward: da direita, backward: da esquerda, 250ms, ease-out)
- [x] **Direção trackeada** — `lastDirection` no hook setado em push/back/forward/popstate
- [x] **Primeiro load sem animação** — ViewTransition usa ref para pular animação no mount inicial
- Clique em entidades nas tabelas:
  - [x] CompanyDashboard → PoliticianDetailScreen (push)
  - [x] PersonDashboard → CompanyDetailScreen (push)
  - [x] CompanyDetailScreen → PoliticianDetailScreen (push)
  - [x] PoliticianDetailScreen → CompanyDetailScreen (push)
  - [x] NetworkGraphScreen → detalhes da entidade (push)
- [x] Botão "Mapa de Conexões" em todas as telas de resultado e detalhe
- [x] Botão "Ver Detalhes" nos dashboards (replace — não duplica no histórico)

### Visualização de Grafo
- [x] Grafo interativo com nós (políticos/empresas) e arestas codificadas por severidade
- [x] Modo completo e modo focado (centrado em entidade específica)
- [x] Busca textual, filtro por tipo, zoom, arrastar nós
- [x] Legenda lateral de cores
- [x] Geração automática de dados do grafo via BFS (graphData.ts)

### UI/UX
- [x] Tema escuro consistente (slate-900)
- [x] Sistema de alertas com código de cores (vermelho/laranja/amarelo)
- [x] Timeline de carreira política
- [x] Painel de processos judiciais com status
- [x] Tabelas de contratos suspeitos com valores
- [x] Seções expansíveis (carreira, processos, contratos)
- [x] Sidebar de empresas ligadas com badges de relação
- [x] Indicador visual de clique (seta `ChevronRight`) nas linhas clicáveis das tabelas
- [x] Modal de confirmação (`ConfirmDialog`) com 3 variantes (warning, danger, info), Escape e acessibilidade
- [x] Busca textual com scoring inteligente (nome exato, CNPJ, contém, começa com, cargo)
- [x] Histórico de buscas recentes salvo em localStorage (`useSearchHistory`, máx. 8 itens)
- [x] Validação de schema do `ViewState` ao carregar histórico do localStorage (`isValidEntry`)
- [x] Design responsivo com hover states e transições
- [x] Animações CSS: scanner, slide-in-right, slide-in-left, title-enter

---

## 11. Próximos Passos Sugeridos

- 🔲 **Integração com API real** — Substituir dados mockados por chamadas a API de dados públicos
- [x] **Browser History API** — Sincronização com pushState/popstate + navegação via botões do navegador
- [x] **NavigationHeader** — Barra global com back/forward + breadcrumb + dropdown de histórico
- [x] **ViewTransition** — Animação slide-in entre telas com direção (forward/backward)
- [x] **replace()** — Substituição de entrada no histórico para evitar duplicidade empresa/pessoa
- 🔲 **React Router** — Substituir roteamento por estado para suportar URLs diretas
- [x] **Histórico de buscas** — Salvo no localStorage via `useSearchHistory` (máx. 8 itens)
- 🔲 **Exportação de relatório/dossiê** — Implementar funcionalidade dos botões existentes
- 🔲 **Autenticação** — Login para salvar investigações
- 🔲 **Testes unitários** — Adicionar testes para componentes, navegação e transições
- 🔲 **Página inicial** — Landing page institucional antes da busca

---

## 12. Convenções de Código

- **Nomenclatura:** PascalCase para componentes (`CompanyDetailScreen.tsx`), camelCase para utilitários
- **Imports:** Agrupados por tipo (React, bibliotecas, internos)
- **Tipagem:** Props sempre tipadas com `interface` ou `type`; estado de navegação com discriminated union
- **Estilo:** Apenas Tailwind via constantes em `globalStyle/` (sem CSS modules ou styled-components)
- **Exportações:** Nomeadas (sem `export default`)
- **Navegação:** Usar `useNavigationHistory` hook (stack + localStorage + Browser History API):
  - `push()` para navegações entre entidades distintas
  - `replace()` para mudança de nível de detalhe da mesma entidade
  - `back()` / `forward()` para navegação nativa (delega ao browser)
- **Transições:** `ViewTransition` envolvendo o conteúdo em `App.tsx` com `viewKey` e `direction`
- **Dados mockados:** Tipos reutilizáveis (`PoliticianDetail`, `CompanyDetail`) para facilitar migração para API

---

> **Mantenha este documento atualizado!** Sempre que uma nova funcionalidade, tela ou componente significativo for adicionado, atualize as seções relevantes acima.
