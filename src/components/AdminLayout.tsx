import React, { useEffect, useState } from 'react';
import { Link } from './Router';
import { ADMIN_PATH } from '../config/admin';
import { Home, Users, Package, CreditCard, BarChart2 } from 'lucide-react';
import { ToastProvider } from './Toast';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentTab(params.get('tab'));
    };

    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  const linkClass = (tab?: string) => {
    const base = 'flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors';
    const isActive = (tab && currentTab === tab) || (!tab && !currentTab);
    return isActive ? `${base} bg-gray-100 font-semibold` : base;
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-64 bg-white border-r border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Admin</h2>
            <p className="text-sm text-gray-500 mt-1">Dashboard</p>
          </div>

          <nav className="space-y-2">
            <Link to={ADMIN_PATH} className={linkClass()}>
              <Package className="h-4 w-4 text-gray-600" /> <span>Shipments</span>
            </Link>
            <Link to={`${ADMIN_PATH}?tab=payments`} className={linkClass('payments')}>
              <CreditCard className="h-4 w-4 text-gray-600" /> <span>Payments</span>
            </Link>
            <Link to={`${ADMIN_PATH}?tab=users`} className={linkClass('users')}>
              <Users className="h-4 w-4 text-gray-600" /> <span>Users</span>
            </Link>
            <Link to={`${ADMIN_PATH}?tab=reports`} className={linkClass('reports')}>
              <BarChart2 className="h-4 w-4 text-gray-600" /> <span>Reports</span>
            </Link>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <a href="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-600"> 
                <Home className="h-4 w-4" /> Back to site
              </a>
            </div>
          </nav>
        </aside>

        <div className="flex-1">
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage the application data and users</p>
            </div>
          </div>

          <main className="p-6 transition-all duration-200">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
