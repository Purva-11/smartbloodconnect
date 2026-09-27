import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { AuthPage } from './pages/auth/AuthPage';
import { OverviewPage } from './pages/donor/OverviewPage';
import { CampDiscoveryPage } from './pages/camps/CampDiscoveryPage';
import { OrganizationDashboardPage } from './pages/organization/OrganizationDashboardPage';
import { EmergencySOSPage } from './pages/donor/EmergencySOSPage';
import { IntelligencePage } from './pages/donor/IntelligencePage';
import { AuditSecurityPage } from './pages/donor/AuditSecurityPage';
import { DonorSpacePage } from './pages/donor/DonorSpacePage';
import { SmartSearchPage } from './pages/donor/SmartSearchPage';

type Section = 'home' | 'camps' | 'emergency' | 'search' | 'intelligence' | 'donor' | 'org' | 'audit';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('home');

  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  // Basic routing using activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <OverviewPage onNavigate={(s) => setActiveSection(s as Section)} />;
      case 'camps':
        return <CampDiscoveryPage />;
      case 'org':
        return <OrganizationDashboardPage onNavigate={(s) => setActiveSection(s as Section)} />;
      case 'emergency':
        return <EmergencySOSPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'donor':
        return <DonorSpacePage />;
      case 'search':
        return <SmartSearchPage />;
      case 'audit':
        return <AuditSecurityPage />;
      default:
        return <OverviewPage onNavigate={(s) => setActiveSection(s as Section)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 relative">
      {/* Background Orbs for Glassmorphism Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          activeSection={activeSection} 
          onNavigate={(s) => setActiveSection(s as Section)} 
          onLogout={logout} 
        />
        
        <main className="flex-1 w-full max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
