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
├── README.md                        # README genérico do Vite (não reflete o projeto)
├── CONTEXT_PROJECT.md               ← Este documento
└── src/
    ├── main.tsx                     # Entry point
    ├── App.tsx                      # Roteador de estado simples
    ├── App.css                      # (Não usado — manter ou remover)
    ├── index.css                    # Tema Tailwind + animação scanner
    ├── data/
    │   └── mockData.ts              # Dados mockados de exemplo
    ├── globalStyle/
    │   ├── index.ts                 # Re-exporta todos os estilos
    │   ├── buttonStyle.ts           # Classes Tailwind para botões
    │   ├── inputStyle.ts            # Classes Tailwind para inputs
    │   ├── textStyle.ts             # Classes Tailwind para tipografia
    │   ├── containerStyle.ts        # Classes Tailwind para containers/layout
    │   ├── cardStyle.ts             # Classes Tailwind para cards
    │   └── tableStyle.ts            # Classes Tailwind para tabelas
    ├── components/
    │   └── ui/
    │       ├── StatCard.tsx         # Card de estatística reutilizável
    │       └── ContactInfoCard.tsx  # Card de contato reutilizável
    └── screens/
        ├── SearchScreen.tsx         # Tela inicial de busca
        ├── CompanyDashboard.tsx     # Dashboard de empresa
        └── PersonDashboard.tsx      # Dashboard de pessoa/político
```

---

## 3. Arquitetura de Roteamento

O projeto **não usa React Router**. O roteamento é feito via estado simples no `App.tsx`:

```tsx
const [currentView, setCurrentView] = useState<'search' | 'company' | 'person'>('search');
```

A lógica de navegação é:
- **SearchScreen** → usuário digita → `onSearch(query)` no App
- Se a query contém `"roberto"`, `"alves"` ou `"deputado"` → vai para **PersonDashboard**
- Caso contrário → vai para **CompanyDashboard**
- Ambos os dashboards têm botão "Voltar para a Busca" que chama `onBack()`

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
- Layout centralizado vertical e horizontalmente (`min-h-screen flex flex-col items-center justify-center`)

**Props:** `{ onSearch: (query: string) => void }`

### 4.2 CompanyDashboard (`src/screens/CompanyDashboard.tsx`)

**Funcionalidades:**
- Botão "Voltar para a Busca" no topo
- **Header:** Ícone gradiente azul-indigo, nome da empresa, status badge (Ativa), categoria
- **Ações:** Botões "Exportar Relatório" e "Ver Detalhes"
- **4 StatCards:**
  - CNPJ
  - Valor de Mercado Estimado (ícone verde)
  - Data de Criação (ícone roxo)
  - Políticos Ligados (ícone laranja)
- **Tabela com abas:**
  - Aba "Políticos": Nome (com avatar inicial), Cargo/Função (badge), Partido
  - Aba "Sócios": Nome do Sócio (com avatar inicial), Qualificação (badge), Participação
- **Sidebar:** Card de Contato com e-mail, telefone e endereço

**Dados mockados:** `mockCompanyData` — TechNova Soluções S.A., 3 políticos ligados, 3 sócios

### 4.3 PersonDashboard (`src/screens/PersonDashboard.tsx`)

**Funcionalidades:**
- Botão "Voltar para a Busca" no topo
- **Header:** Ícone gradiente índigo-roxo, nome da pessoa, status badge (Ativo), tag "Agente Público"
- **Ações:** Botões "Exportar Dossiê" e "Ver Transações"
- **4 StatCards:**
  - Cargo Atual (ícone azul)
  - Salário Bruto (ícone verde)
  - Patrimônio Declarado (ícone roxo)
  - Empresas Ligadas (ícone laranja)
- **Tabela com abas:**
  - Aba "Empresas": Nome da empresa (com ícone), CNPJ, Relação/Vínculo
  - Aba "Pessoas": Nome da pessoa (com avatar inicial), Cargo (badge), Relação/Vínculo
- **Sidebar:** Card de Contato com labels personalizáveis (E-mail Gabinete, Endereço Gabinete)

**Dados mockados:** `mockPersonData` — Roberto Alves, Deputado Estadual, 3 empresas ligadas, 2 pessoas ligadas

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

Dois objetos de exemplo:

### `mockCompanyData`
- `name`: "TechNova Soluções S.A."
- `cnpj`, `marketValue`, `creationDate`, `status`, `email`, `phone`, `address`
- `politicians[]`: 3 políticos (Roberto Alves, João Silveira, Maria Costa)
- `partners[]`: 3 sócios

### `mockPersonData`
- `name`: "Roberto Alves"
- `role`, `salary`, `wealth`, `status`, `email`, `phone`, `address`
- `linkedCompanies[]`: 3 empresas (TechNova, Construtora Horizonte, AgroPecuária Alves)
- `linkedPeople[]`: 2 pessoas (Maria Costa, Carlos Eduardo Mendes)

---

## 8. Funcionalidades Implementadas (Resumo)

- [x] Tela de busca com campo de texto e botão de pesquisa
- [x] Painel de filtros avançados com 4 categorias expansíveis
- [x] Badges de filtros ativos com remoção individual e "Limpar todos"
- [x] Upload de arquivos locais (.txt, .json, .md)
- [x] Logo com identidade visual "PenteFino" e animação de scanner
- [x] Dashboard de empresa com 4 stat cards + tabela de políticos/sócios
- [x] Dashboard de pessoa/político com 4 stat cards + tabela de empresas/pessoas ligadas
- [x] Cards de contato reutilizáveis
- [x] Tema escuro consistente (slate-900)
- [x] Design responsivo
- [x] Transições e micro-interações (hover states, animações)
- [x] Sistema de estilo centralizado em constantes Tailwind

---

## 9. Próximos Passos Sugeridos (Não Implementados)

Com base na estrutura atual, estas são as próximas evoluções lógicas:

- 🔲 **Integração com API real** — Substituir dados mockados por chamadas a uma API de dados públicos (CNPJ, TSE, etc.)
- 🔲 **Rotas via React Router** — Substituir roteamento por estado por React Router para suportar URLs diretas e navegação com histórico
- 🔲 **Detalhamento de pessoa/empresa** — Tela de detalhes clicável nas tabelas (links para páginas específicas)
- 🔲 **Histórico de buscas** — Salvar buscas recentes no localStorage
- 🔲 **Exportação de relatório** — Implementar a funcionalidade dos botões "Exportar Relatório" / "Exportar Dossiê"
- 🔲 **Gráficos e visualizações** — Adicionar gráficos de conexões (redes/grafos) entre entidades
- 🔲 **Autenticação** — Sistema de login para salvar investigações
- 🔲 **Testes** — Adicionar testes unitários e de integração
- 🔲 **Página inicial institucional** — Landing page antes da tela de busca

---

## 10. Convenções de Código

- **Nomenclatura:** Arquivos em PascalCase para componentes (`SearchScreen.tsx`), camelCase para utilitários (`mockData.ts`)
- **Imports:** Agrupados por tipo (React, bibliotecas, internos)
- **Tipagem:** Props sempre tipadas com `interface` ou `type`
- **Estilo:** Nunca usar CSS modules ou styled-components — sempre Tailwind via constantes em `globalStyle/`
- **Exportações:** Nomeadas (não `export default`)
- **Estado local:** `useState` para tabs, filtros e view atual

---

> **Mantenha este documento atualizado!** Sempre que uma nova funcionalidade, tela ou componente significativo for adicionado, atualize as seções relevantes acima.
