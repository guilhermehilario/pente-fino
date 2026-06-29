import { useState } from 'react';
import { SearchScreen } from './screens/SearchScreen';
import { CompanyDashboard } from './screens/CompanyDashboard';
import { PersonDashboard } from './screens/PersonDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'company' | 'person'>('search');

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    
    // Simple mock logic to determine view
    if (q.includes('roberto') || q.includes('alves') || q.includes('deputado')) {
      setCurrentView('person');
    } else {
      // Default to company dashboard for any other query
      setCurrentView('company');
    }
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
  };

  return (
    <>
      {currentView === 'search' && <SearchScreen onSearch={handleSearch} />}
      {currentView === 'company' && <CompanyDashboard onBack={handleBackToSearch} />}
      {currentView === 'person' && <PersonDashboard onBack={handleBackToSearch} />}
    </>
  );
}

export default App;
