import { useState } from 'react';
import { SearchScreen } from './screens/SearchScreen';
import { CompanyDashboard } from './screens/CompanyDashboard';
import { PersonDashboard } from './screens/PersonDashboard';
import { PoliticianDetailScreen } from './screens/PoliticianDetailScreen';
import { CompanyDetailScreen } from './screens/CompanyDetailScreen';
import { mockPoliticians, mockCompanies } from './data/mockData';

type ViewState =
  | { type: 'search' }
  | { type: 'company' }
  | { type: 'person' }
  | { type: 'politician-detail'; politicianId: number; returnTo: 'company' | 'person' | 'company-detail' }
  | { type: 'company-detail'; companyId: number; returnTo: 'person' | 'company-detail' };

function App() {
  const [view, setView] = useState<ViewState>({ type: 'search' });

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes('roberto') || q.includes('alves') || q.includes('deputado')) {
      setView({ type: 'person' });
    } else {
      setView({ type: 'company' });
    }
  };

  const handleBackToSearch = () => {
    setView({ type: 'search' });
  };

  const handlePoliticianClick = (politicianId: number, returnTo: ViewState['type']) => {
    setView({ type: 'politician-detail', politicianId, returnTo: returnTo as 'company' | 'person' | 'company-detail' });
  };

  const handleCompanyClick = (companyId: number, returnTo: ViewState['type']) => {
    setView({ type: 'company-detail', companyId, returnTo: returnTo as 'person' | 'company-detail' });
  };

  const handleBackFromDetail = () => {
    if (view.type === 'politician-detail') {
      if (view.returnTo === 'company') setView({ type: 'company' });
      else if (view.returnTo === 'person') setView({ type: 'person' });
      else if (view.returnTo === 'company-detail') setView({ type: 'company-detail', companyId: 1, returnTo: 'company-detail' });
      else setView({ type: 'search' });
    } else if (view.type === 'company-detail') {
      if (view.returnTo === 'person') setView({ type: 'person' });
      else setView({ type: 'search' });
    } else {
      setView({ type: 'search' });
    }
  };

  const renderView = () => {
    switch (view.type) {
      case 'search':
        return <SearchScreen onSearch={handleSearch} />;
      
      case 'company':
        return (
          <CompanyDashboard
            onBack={handleBackToSearch}
            onPoliticianClick={(id) => handlePoliticianClick(id, 'company')}
          />
        );
      
      case 'person':
        return (
          <PersonDashboard
            onBack={handleBackToSearch}
            onCompanyClick={(id) => handleCompanyClick(id, 'person')}
          />
        );
      
      case 'politician-detail': {
        const politician = mockPoliticians[view.politicianId];
        if (!politician) {
          setView({ type: 'search' });
          return null;
        }
        return (
          <PoliticianDetailScreen
            politician={politician}
            onBack={handleBackFromDetail}
            onCompanyClick={(id) => handleCompanyClick(id, 'company-detail')}
          />
        );
      }
      
      case 'company-detail': {
        const company = mockCompanies[view.companyId];
        if (!company) {
          setView({ type: 'search' });
          return null;
        }
        return (
          <CompanyDetailScreen
            company={company}
            onBack={handleBackFromDetail}
            onPoliticianClick={(id) => handlePoliticianClick(id, 'company-detail')}
          />
        );
      }
      
      default:
        return <SearchScreen onSearch={handleSearch} />;
    }
  };

  return <>{renderView()}</>;
}

export default App;
