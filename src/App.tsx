import { useNavigationHistory, type ViewState } from './hooks/useNavigationHistory';
import { SearchScreen } from './screens/SearchScreen';
import { CompanyDashboard } from './screens/CompanyDashboard';
import { PersonDashboard } from './screens/PersonDashboard';
import { PoliticianDetailScreen } from './screens/PoliticianDetailScreen';
import { CompanyDetailScreen } from './screens/CompanyDetailScreen';
import { NetworkGraphScreen } from './screens/NetworkGraphScreen';
import { mockPoliticians, mockCompanies } from './data/mockData';

function App() {
  const { current, push, back, reset } = useNavigationHistory({ type: 'search' });

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('roberto') || q.includes('alves') || q.includes('deputado')) {
      push({ type: 'person' });
    } else {
      push({ type: 'company' });
    }
  };

  const renderView = () => {
    switch (current.type) {
      case 'search':
        return <SearchScreen onSearch={handleSearch} />;

      case 'company':
        return (
          <CompanyDashboard
            onBack={() => back()}
            onPoliticianClick={(id) => push({ type: 'politician-detail', politicianId: id })}
            onGraphClick={() => push({ type: 'graph', centerType: 'company', centerId: 1 })}
          />
        );

      case 'person':
        return (
          <PersonDashboard
            onBack={() => back()}
            onCompanyClick={(id) => push({ type: 'company-detail', companyId: id })}
            onGraphClick={() => push({ type: 'graph', centerType: 'politician', centerId: 1 })}
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

      default:
        return <SearchScreen onSearch={handleSearch} />;
    }
  };

  return <>{renderView()}</>;
}

export default App;
