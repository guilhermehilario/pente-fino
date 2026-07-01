import { useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { useNavigationHistory, type ViewState } from './hooks/useNavigationHistory';
import { useSearchHistory } from './hooks/useSearchHistory';
import { NavigationHeader } from './components/navigation/NavigationHeader';
import { ViewTransition } from './components/ui/ViewTransition';
import { SearchScreen } from './screens/SearchScreen';
import { CompanyDashboard } from './screens/CompanyDashboard';
import { PersonDashboard } from './screens/PersonDashboard';
import { PoliticianDetailScreen } from './screens/PoliticianDetailScreen';
import { CompanyDetailScreen } from './screens/CompanyDetailScreen';
import { NetworkGraphScreen } from './screens/NetworkGraphScreen';
import { DashboardCruzamento } from './screens/DashboardCruzamento';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { mockPoliticians, mockCompanies } from './data/mockData';

/** Busca o melhor resultado correspondente nos dados mockados. */
function searchEntity(query: string): { type: 'company'; companyId: number } | { type: 'person'; personId: number } {
  const q = query.toLowerCase().trim();
  if (!q) return { type: 'company', companyId: 1 };

  // Normaliza CNPJ: remove tudo que não é dígito
  const digitsOnly = q.replace(/\D/g, '');

  // Scoring: procura correspondência em nome e CNPJ
  interface Match {
    id: number;
    type: 'company' | 'person';
    score: number;
  }

  const matches: Match[] = [];

  // Busca em empresas
  for (const c of Object.values(mockCompanies)) {
    const nameLow = c.name.toLowerCase();
    const cnpjClean = c.cnpj.replace(/\D/g, '');

    let score = 0;
    if (nameLow === q) score = 100;                                // nome exato
    else if (q.length >= 2 && nameLow.includes(q)) score = 80;     // nome contém (mín. 2 chars)
    else if (cnpjClean === digitsOnly && digitsOnly.length >= 8) score = 90;  // CNPJ exato
    else if (q.length >= 3 && nameLow.split(' ').some((w) => w.startsWith(q))) score = 50; // palavra começa com
    if (score > 0) matches.push({ id: c.id, type: 'company', score });
  }

  // Busca em políticos
  for (const p of Object.values(mockPoliticians)) {
    const nameLow = p.name.toLowerCase();

    let score = 0;
    if (nameLow === q) score = 100;
    else if (q.length >= 2 && nameLow.includes(q)) score = 80;    // nome contém (mín. 2 chars)
    else if (q.length >= 3 && p.role.toLowerCase().includes(q)) score = 40;  // cargo (mín. 3 chars)
    else if (q.length >= 3 && nameLow.split(' ').some((w) => w.startsWith(q))) score = 50;
    if (score > 0) matches.push({ id: p.id, type: 'person', score });
  }

  // Ordena por score (melhor primeiro) e retorna o melhor
  matches.sort((a, b) => b.score - a.score);

  if (matches.length > 0) {
    const best = matches[0];
    if (best.type === 'company') {
      return { type: 'company', companyId: best.id };
    } else {
      return { type: 'person', personId: best.id };
    }
  }

  // Fallback: tenta detectar se parece nome de pessoa (2+ palavras)
  // ou se menciona cargo político
  const politicoTerms = ['deputado', 'senador', 'prefeito', 'vereador', 'político', 'pol'];
  if (politicoTerms.some((t) => q.includes(t))) {
    return { type: 'person', personId: 1 };
  }

  return { type: 'company', companyId: 1 };
}

/** Gera uma chave única para cada tipo de view (usada pelo ViewTransition). */
function computeViewKey(current: ViewState): string {
  switch (current.type) {
    case 'company':
    case 'company-detail':
      return `${current.type}-${current.companyId}`;
    case 'person':
    case 'politician-detail':
      return `${current.type}-${current.politicianId}`;
    case 'graph':
      return current.centerType && current.centerId
        ? `${current.type}-${current.centerType}-${current.centerId}`
        : current.type;
    default:
      return current.type;
  }
}

function App() {
  const {
    current,
    canGoBack,
    canGoForward,
    lastDirection,
    navEntries,
    push,
    replace,
    back,
    forward,
    goTo,
    reset,
  } = useNavigationHistory({ type: 'search' });
  const { searchHistory, addSearch, removeSearch, clearHistory } = useSearchHistory();

  const handleSearch = useCallback((query: string) => {
    addSearch(query);
    push(searchEntity(query));
  }, [addSearch, push]);

  const handleCrossReferenceSearch = useCallback((query: string) => {
    addSearch(query);
    push({ type: 'cross-reference', searchQuery: query });
  }, [addSearch, push]);

  const renderView = () => {
    switch (current.type) {
      case 'search':
        return (
          <SearchScreen
            onSearch={handleSearch}
            searchHistory={searchHistory}
            onRemoveSearch={removeSearch}
            onClearHistory={clearHistory}
            onCrossReferenceClick={() => push({ type: 'cross-reference' })}
            onCrossReferenceSearch={handleCrossReferenceSearch}
          />
        );

      case 'company':
        return (
          <CompanyDashboard
            companyId={current.companyId}
            onBack={() => back()}
            onPoliticianClick={(id) => push({ type: 'politician-detail', politicianId: id })}
            onGraphClick={() => push({ type: 'graph', centerType: 'company', centerId: current.companyId })}
            onDetailClick={() => replace({ type: 'company-detail', companyId: current.companyId })}
          />
        );

      case 'person':
        return (
          <PersonDashboard
            personId={current.personId}
            onBack={() => back()}
            onDetailClick={() => replace({ type: 'politician-detail', politicianId: current.personId })}
            onCompanyClick={(id) => push({ type: 'company-detail', companyId: id })}
            onGraphClick={() => push({ type: 'graph', centerType: 'politician', centerId: current.personId })}
          />
        );

      case 'politician-detail': {
        const politician = mockPoliticians[current.politicianId];
        if (!politician) {
          reset();
          return null;
        }
        return (
          <PoliticianDetailScreen
            politician={politician}
            onBack={() => back()}
            onCompanyClick={(companyId) => push({ type: 'company-detail', companyId })}
            onGraphClick={() => push({ type: 'graph', centerType: 'politician', centerId: current.politicianId })}
          />
        );
      }

      case 'company-detail': {
        const company = mockCompanies[current.companyId];
        if (!company) {
          reset();
          return null;
        }
        return (
          <CompanyDetailScreen
            company={company}
            onBack={() => back()}
            onPoliticianClick={(politicianId) => push({ type: 'politician-detail', politicianId })}
            onGraphClick={() => push({ type: 'graph', centerType: 'company', centerId: current.companyId })}
          />
        );
      }

      case 'graph':
        return (
          <NetworkGraphScreen
            initialCenter={
              current.centerType && current.centerId
                ? { type: current.centerType, id: current.centerId }
                : undefined
            }
            onBack={() => back()}
            onPoliticianClick={(id) => push({ type: 'politician-detail', politicianId: id })}
            onCompanyClick={(id) => push({ type: 'company-detail', companyId: id })}
          />
        );

      case 'cross-reference':
        return (
          <DashboardCruzamento
            searchQuery={current.searchQuery}
            onBack={() => back()}
            onPoliticianClick={(id) => push({ type: 'politician-detail', politicianId: id })}
            onCompanyClick={(id) => push({ type: 'company-detail', companyId: id })}
            onGraphClick={() => push({ type: 'graph' })}
          />
        );

      case 'profile':
        return (
          <UserProfileScreen
            onBack={() => back()}
            onLogout={() => push({ type: 'search' })}
          />
        );

      default:
        return <SearchScreen onSearch={handleSearch} />;
    }
  };

  return (
    <AuthProvider>
      <PreferencesProvider>
        <NavigationHeader
          current={current}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          navEntries={navEntries}
          onBack={back}
          onForward={forward}
          onGoTo={goTo}
          onSearchClick={() => push({ type: 'search' })}
          onProfileClick={() => push({ type: 'profile' })}
        />
        <ViewTransition
          viewKey={computeViewKey(current)}
          direction={lastDirection}
        >
          {renderView()}
        </ViewTransition>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
