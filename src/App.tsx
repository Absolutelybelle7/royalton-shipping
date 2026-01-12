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

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
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
            <Route path="/admin" component={<AdminDashboardPage />} />
          </Router>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
