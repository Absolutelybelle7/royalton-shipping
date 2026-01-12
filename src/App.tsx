import { AuthProvider } from './contexts/AuthContext';
import { Router, Route } from './components/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TrackPage } from './pages/TrackPage';
import { ShipPage } from './pages/ShipPage';
import { QuotePage } from './pages/QuotePage';
import { ServicesPage } from './pages/ServicesPage';
import { LocationsPage } from './pages/LocationsPage';
import { SupportPage } from './pages/SupportPage';
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ADMIN_PATH } from './config/admin';
import { AdminLayout } from './components/AdminLayout';

import { useState, useEffect } from 'react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    const handler = () => setCurrentPath(window.location.pathname + window.location.search);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const isAdminRoute = currentPath.startsWith(ADMIN_PATH);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Header />}
        <main className="flex-grow">
          <Router>
            <Route path="/" component={<HomePage />} />
            <Route path="/track" component={<TrackPage />} />
            <Route path="/ship" component={<ShipPage />} />
            <Route path="/quote" component={<QuotePage />} />
            <Route path="/services" component={<ServicesPage />} />
            <Route path="/services/domestic" component={<ServicesPage />} />
            <Route path="/services/international" component={<ServicesPage />} />
            <Route path="/services/express" component={<ServicesPage />} />
            <Route path="/services/freight" component={<ServicesPage />} />
            <Route path="/locations" component={<LocationsPage />} />
            <Route path="/support" component={<SupportPage />} />
            <Route path="/signin" component={<SignInPage />} />
            <Route path="/dashboard" component={<DashboardPage />} />
            <Route path="/shipments" component={<ShipmentsPage />} />
            <Route path="/notifications" component={<NotificationsPage />} />
            <Route path="/about" component={<AboutPage />} />
            <Route path="/privacy" component={<PrivacyPage />} />
            <Route path="/terms" component={<TermsPage />} />
            <Route path={ADMIN_PATH} component={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          </Router>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
