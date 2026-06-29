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
    ├── App.tsx                      # Roteador com stack de navegação
    ├── index.css                    # Tema Tailwind + animação scanner
    ├── hooks/
    │   └── useNavigationHistory.ts  # Hook de navegação em stack + localStorage
    ├── data/
    │   ├── mockData.ts              # Dados mockados + tipos expandidos
    │   └── graphData.ts             # Transformação de dados para grafo (NOVO)
    ├── globalStyle/
    │   ├── index.ts
    │   ├── buttonStyle.ts
    │   ├── inputStyle.ts
    │   ├── textStyle.ts
    │   ├── containerStyle.ts
    │   ├── cardStyle.ts
    │   └── tableStyle.ts
    ├── components/
    │   └── ui/
    │       ├── StatCard.tsx
    │       └── ContactInfoCard.tsx
    └── screens/
        ├── SearchScreen.tsx
        ├── CompanyDashboard.tsx
        ├── PersonDashboard.tsx
        ├── PoliticianDetailScreen.tsx
        ├── CompanyDetailScreen.tsx
        └── NetworkGraphScreen.tsx   # Mapa de Conexões (NOVO)
```

---

## 3. Arquitetura de Roteamento

O projeto **não usa React Router**. O roteamento é gerenciado pelo hook `useNavigationHistory` (`src/hooks/useNavigationHistory.ts`), que implementa uma **stack de navegação** persistida em `localStorage`.

### ViewState

Tipos de view são uma discriminated union simples — sem `parentView` ou qualquer contexto extra:

```typescript
export type ViewState =
  | { type: 'search' }
  | { type: 'company' }
  | { type: 'person' }
  | { type: 'company-detail'; companyId: number }
  | { type: 'politician-detail'; politicianId: number }
  | { type: 'graph'; centerType?: 'politician' | 'company'; centerId?: number };
```

### Hook `useNavigationHistory`

```typescript
const { current, canGoBack, navEntries, push, back, goTo, reset } = useNavigationHistory(initialView);

push(view)    // Navega para uma nova view (empilha)
back()        // Volta uma posição na stack
goTo(index)   // Pula para um índice específico do histórico
reset()       // Limpa tudo e volta para a view inicial
canGoBack     // true se há páginas anteriores na stack
navEntries    // Array completo do histórico (para exibir UI)
```

### Fluxo

| Origem | Ação | Destino | Stack após ação |
|---|---|---|---|
| SearchScreen | Pesquisa → | CompanyDashboard | `[search, company]` |
| CompanyDashboard | Clique político → | PoliticianDetailScreen | `[search, company, politician-detail(id)]` |
| PoliticianDetailScreen | Voltar → | CompanyDashboard | `[search, company]` |
| PoliticianDetailScreen | Clique empresa → | CompanyDetailScreen | `[search, company, politician-detail(id), company-detail(id)]` |

### Persistência

- Histórico salvo em `localStorage` na chave `` `pega-corrupcao-nav-history-v{STORAGE_VERSION}` ``
- **Versão atual do schema:** `STORAGE_VERSION = 2` 🔄 *(incrementar ao alterar ViewState)*
- Máximo de 50 entradas na stack
- Tratamento de erros: dados corrompidos são ignorados, armazenamento cheio faz trim automático
- Validação de schema: entradas carregadas passam por `isValidEntry()` — entradas com campos ausentes ou tipos desconhecidos são descartadas
- Ao recarregar a página, a última sessão é restaurada automaticamente

### Lógica de busca

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

## 4. Telas Implementadas

### 4.1 SearchScreen (`src/screens/SearchScreen.tsx`)

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

**Props:** `{ onSearch: (query: string) => void; searchHistory: string[]; onRemoveSearch: (query: string) => void; onClearHistory: () => void }`

### 4.2 CompanyDashboard (`src/screens/CompanyDashboard.tsx`)

**Funcionalidades:**
- Botão "Voltar para a Busca" no topo
- **Header:** Ícone gradiente azul-indigo, nome da empresa, status badge (Ativa), categoria
- **Ações:** Botões "Exportar Relatório" e "Ver Detalhes"
- **4 StatCards:** CNPJ, Valor de Mercado, Data de Criação, Políticos Ligados
- **Tabela com abas:**
  - Aba "Políticos": Nome (com avatar), Cargo/Função (badge), Partido — **clicável → PoliticianDetailScreen**
  - Aba "Sócios": Nome (com avatar), Qualificação (badge), Participação
- **Sidebar:** Card de Contato com e-mail, telefone e endereço

**Props:** `{ companyId: number; onBack: () => void; onPoliticianClick?: (id: number) => void; onGraphClick?: () => void; onDetailClick?: () => void }`

### 4.3 PersonDashboard (`src/screens/PersonDashboard.tsx`)

**Funcionalidades:**
- Botão "Voltar para a Busca" no topo
- **Header:** Ícone gradiente índigo-roxo, nome da pessoa, status badge (Ativo), "Agente Público"
- **Ações:** Botões "Exportar Dossiê" e "Ver Transações"
- **4 StatCards:** Cargo Atual, Salário Bruto, Patrimônio Declarado, Empresas Ligadas
- **Tabela com abas:**
  - Aba "Empresas": Nome (com ícone), CNPJ, Relação/Vínculo — **clicável → CompanyDetailScreen**
  - Aba "Pessoas": Nome (com avatar), Cargo (badge), Relação/Vínculo
- **Sidebar:** Card de Contato com labels personalizáveis

**Props:** `{ personId: number; onBack: () => void; onCompanyClick?: (id: number) => void; onGraphClick?: () => void }`

### 4.4 PoliticianDetailScreen (`src/screens/PoliticianDetailScreen.tsx`)

**Funcionalidades:**
- Botão "Voltar para Resultados" (restaura tela anterior com contexto)
- **Header:** Ícone gradiente índigo-roxo, nome, status, cargo e partido
- **Ações:** "Mapa de Conexões" (com `Share2`), "Exportar Dossiê" e "Ver Transações"
- **Painel de Alertas & Suspeitas:** Cards com indicador vermelho/laranja/amarelo
- **4 StatCards:** Cargo Atual, Salário, Patrimônio, Data de Nascimento
- **Biografia:** Texto completo do político
- **Carreira Política:** Timeline vertical com ano, cargo e descrição (expansível)
- **Processos & Investigações:** Lista com ano, tipo, status e descrição (expansível)
- **Sidebar de Contato:** E-mail, telefone, endereço
- **Sidebar de Empresas Ligadas:** Cards clicáveis → CompanyDetailScreen, com badge de relação (suspeita em vermelho/laranja)

**Props:** `{ politician: PoliticianDetail; onBack: () => void; onCompanyClick: (id: number) => void; onGraphClick?: () => void }`

### 4.5 CompanyDetailScreen (`src/screens/CompanyDetailScreen.tsx`)

**Funcionalidades:**
- Botão "Voltar para Resultados" (restaura tela anterior com contexto)
- **Header:** Ícone gradiente azul-indigo, nome, status, setor
- **Ações:** "Mapa de Conexões" (com `Share2`), "Exportar Relatório" e "Ver Contratos"
- **Painel de Alertas & Suspeitas:** Cards com indicador vermelho/laranja/amarelo
- **4 StatCards:** CNPJ, Faturamento Anual, Valor de Mercado, Funcionários
- **Contratos com Órgãos Públicos:** Tabela com ano, órgão, descrição e valor (expansível)
- **Tabela com abas:**
  - Aba "Sócios": Nome (com avatar), Qualificação (badge), Participação
  - Aba "Políticos": Nome (com avatar), Cargo/Partido (badge), Relação — **clicável → PoliticianDetailScreen**
- **Sidebar de Contato:** E-mail, telefone, endereço
- **Card de Data de Criação**

**Props:** `{ company: CompanyDetail; onBack: () => void; onPoliticianClick: (id: number) => void; onGraphClick?: () => void }`

### 4.6 NetworkGraphScreen (`src/screens/NetworkGraphScreen.tsx`) — NOVO

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

**Props:**
```typescript
interface NetworkGraphScreenProps {
  initialCenter?: { type: 'politician' | 'company'; id: number };
  onBack: () => void;
  onPoliticianClick: (id: number) => void;
  onCompanyClick: (id: number) => void;
}
```

---

## 5. Sistema de Estilo Global (`src/globalStyle/`)

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

## 6. Componentes Compartilhados

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

---

## 7. Dados Mockados (`src/data/mockData.ts`)

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

## 8. Funcionalidades Implementadas (Resumo)

### Telas
- [x] **SearchScreen** — Busca, filtros avançados, upload de arquivos
- [x] **CompanyDashboard** — Visão geral da empresa com tabelas de políticos e sócios
- [x] **PersonDashboard** — Visão geral da pessoa com tabelas de empresas e pessoas ligadas
- [x] **PoliticianDetailScreen** — Detalhamento completo com alertas, biografia, carreira, processos, empresas ligadas (acessível clicando em político nas tabelas)
- [x] **CompanyDetailScreen** — Detalhamento completo com alertas, contratos suspeitos, sócios e políticos ligados (acessível clicando em empresa nas tabelas)
- [x] **NetworkGraphScreen** — Mapa interativo de conexões entre políticos e empresas via react-force-graph-2d

### Navegação
- [x] Roteamento via stack persistida em localStorage (`useNavigationHistory`)
- [x] Histórico completo preservado entre sessões (recarregar a página restaura o estado)
- [x] Navegação para trás múltiplos níveis (back repetido percorre a stack)
- [x] Suporte a `push`, `back`, `goTo(index)` e `reset`
- [x] Botões "Voltar" em todas as telas de detalhe
- [x] Clique em políticos na CompanyDashboard → PoliticianDetailScreen
- [x] Clique em empresas na PersonDashboard → CompanyDetailScreen
- [x] Clique em políticos na CompanyDetailScreen → PoliticianDetailScreen
- [x] Clique em empresas na PoliticianDetailScreen → CompanyDetailScreen
- [x] Botão "Mapa de Conexões" nos dashboards (CompanyDashboard e PersonDashboard)
- [x] Botão "Mapa de Conexões" nas telas de detalhe (PoliticianDetailScreen e CompanyDetailScreen)
- [x] Clique em nós do grafo → navega para tela de detalhes

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
- [x] Indicador visual de clique (seta `ChevronRight`) nas linhas clicáveis das tabelas (opacidade `group-hover:opacity-100` + deslocamento)
- [x] Modal de confirmação (`ConfirmDialog`) antes de navegar/pesquisar com filtros ativos ou limpar todos os filtros
- [x] Busca textual com scoring inteligente (nome exato, CNPJ, contém, começa com, cargo)
- [x] Histórico de buscas recentes salvo em localStorage (`useSearchHistory`, máx. 8 itens)
- [x] Validação de schema do `ViewState` ao carregar histórico do localStorage (`isValidEntry`)
- [x] Design responsivo com hover states e transições
- [x] Diálogo `ConfirmDialog` reutilizável com 3 variantes (warning, danger, info), suporte a tecla Escape e acessibilidade (`role="dialog"`, `aria-modal`)

---

## 9. Próximos Passos Sugeridos

- 🔲 **Integração com API real** — Substituir dados mockados por chamadas a API de dados públicos
- 🔲 **React Router** — Substituir roteamento por estado para suportar URLs diretas e histórico
- [x] **Histórico de buscas** — Salvo no localStorage via `useSearchHistory` (máx. 8 itens, com remoção individual)
- 🔲 **Exportação de relatório/dossiê** — Implementar funcionalidade dos botões existentes
- 🔲 **Autenticação** — Login para salvar investigações
- 🔲 **Testes unitários** — Adicionar testes para componentes e navegação
- 🔲 **Página inicial** — Landing page institucional antes da busca

---

## 10. Convenções de Código

- **Nomenclatura:** PascalCase para componentes (`CompanyDetailScreen.tsx`), camelCase para utilitários
- **Imports:** Agrupados por tipo (React, bibliotecas, internos)
- **Tipagem:** Props sempre tipadas com `interface` ou `type`; estado de navegação com discriminated union
- **Estilo:** Apenas Tailwind via constantes em `globalStyle/` (sem CSS modules ou styled-components)
- **Exportações:** Nomeadas (sem `export default`)
- **Navegação:** Usar `useNavigationHistory` hook (stack + localStorage); `push()` para avançar, `back()` para voltar
- **Dados mockados:** Tipos reutilizáveis (`PoliticianDetail`, `CompanyDetail`) para facilitar migração para API

---

> **Mantenha este documento atualizado!** Sempre que uma nova funcionalidade, tela ou componente significativo for adicionado, atualize as seções relevantes acima.
