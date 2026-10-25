import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { BrowsePage } from './pages/BrowsePage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { UserDashboard } from './pages/UserDashboard';
import { SecurityDashboard } from './pages/SecurityDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExperimentShowcasePage } from './pages/ExperimentShowcasePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render appropriate page view
  const renderPage = () => {
    if (currentPath === '/') return <LandingPage navigate={navigate} />;
    if (currentPath.startsWith('/browse')) return <BrowsePage />;
    if (currentPath.startsWith('/report-lost')) return <ReportLostPage navigate={navigate} />;
    if (currentPath.startsWith('/report-found')) return <ReportFoundPage navigate={navigate} />;
    if (currentPath.startsWith('/dashboard')) return <UserDashboard navigate={navigate} />;
    if (currentPath.startsWith('/security')) return <SecurityDashboard navigate={navigate} />;
    if (currentPath.startsWith('/admin')) return <AdminDashboard navigate={navigate} />;
    if (currentPath.startsWith('/experiments')) return <ExperimentShowcasePage navigate={navigate} />;
    if (currentPath.startsWith('/login')) return <LoginPage navigate={navigate} />;
    if (currentPath.startsWith('/register')) return <RegisterPage navigate={navigate} />;

    return <LandingPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <DemoBanner />
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer navigate={navigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
