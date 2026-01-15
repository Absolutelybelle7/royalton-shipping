import { Menu, X, User, Bell, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link, navigate } from './Router';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-brand-800 to-brand-900 text-brand-100 sticky top-0 z-50 shadow-lg header-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Royalton Gold Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">Royalton Gold Security and Shipping
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link to="/ship" className="hover:text-orange-600 transition-colors">
              Shipping
            </Link>
            <Link to="/track" className="hover:text-orange-600 transition-colors">
              Tracking
            </Link>
            <Link to="/services" className="hover:text-orange-600 transition-colors">
              Services
            </Link>
            <Link to="/locations" className="hover:text-orange-600 transition-colors">
              Locations
            </Link>
            <Link to="/support" className="hover:text-orange-600 transition-colors">
              Support
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/notifications" className="hover:text-orange-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-orange-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-orange-600 font-semibold">
                        <Shield className="inline h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/shipments" className="block px-4 py-2 hover:bg-gray-100">
                      My Shipments
                    </Link>
                    <Link to="/addresses" className="block px-4 py-2 hover:bg-gray-100">
                      Saved Addresses
                    </Link>
                    <Link to="/billing" className="block px-4 py-2 hover:bg-gray-100">
                      Billing
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-brand-900 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/ship"
              className="block px-3 py-2 rounded-md hover:bg-brand-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shipping
            </Link>
            <Link
              to="/track"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tracking
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/locations"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Locations
            </Link>
            <Link
              to="/support"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md hover:bg-gray-700 text-orange-400 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="inline h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="block px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-brand-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
