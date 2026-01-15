import { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Shipment, Notification } from '../types';
import { Link, navigate } from '../components/Router';
import { User } from 'firebase/auth';

export function DashboardPage() {
  const { user, userData } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const userId = (user as User).uid;
      if (!userId) return;

      // Fetch shipments
      const shipmentsQuery = query(
        collection(db, 'shipments'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const shipmentsSnapshot = await getDocs(shipmentsQuery);
      const shipmentsData = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Shipment[];

      // Fetch notifications
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsData = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setShipments(shipmentsData.slice(0, 5));
      setNotifications(notificationsData.slice(0, 5));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    pending: shipments.filter((s) => s.status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userData?.displayName ? userData.displayName.split(' ')[0] : user?.email?.split('@')[0]}</p>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {userData?.history && userData.history.length > 0 ? (
              <ul className="space-y-3 text-sm text-gray-700">
                {userData.history
                  .slice(-8)
                  .slice()
                  .reverse()
                  .map((entry, idx) => (
                    <li key={idx} className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          {entry.type === 'track' && (
                            <>
                              Tracked <span className="font-mono">{entry.payload?.trackingNumber}</span>
                            </>
                          )}
                          {entry.type === 'create_shipment' && (
                            <>
                              Created shipment <span className="font-mono">{entry.payload?.trackingNumber}</span>
                            </>
                          )}
                          {entry.type === 'login' && <>Signed in</>}
                          {entry.type !== 'track' && entry.type !== 'create_shipment' && entry.type !== 'login' && (
                            <>{entry.type}</>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</div>
                      </div>
                      <div>
                        {entry.payload?.trackingNumber && (
                          <a href={`/track?number=${entry.payload.trackingNumber}`} className="text-orange-500 hover:text-orange-600">View</a>
                        )}
                      </div>
                    </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent activity yet. Your recent searches and shipments will appear here.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Shipments</h3>
              <Package className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">In Transit</h3>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.inTransit}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Delivered</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Shipments</h2>
                <Link to="/shipments" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                  View All
                </Link>
              </div>

              {shipments.length > 0 ? (
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/track?number=${shipment.trackingNumber}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{shipment.trackingNumber}</p>
                          <p className="text-sm text-gray-600">
                            {((shipment as any).origin?.city || shipment.originCity)} → {((shipment as any).destination?.city || shipment.destinationCity)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(shipment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No shipments yet</p>
                  <Link
                    to="/ship"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
                  >
                    Create Shipment
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/ship"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-brand-900 px-4 py-3 rounded-md font-semibold text-center transition-colors"
                >
                  New Shipment
                </Link>
                <Link
                  to="/track"
                  className="block w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-3 rounded-md font-semibold text-center transition-colors"
                >
                  Track Package
                </Link>
                <Link
                  to="/quote"
                  className="block w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-3 rounded-md font-semibold text-center transition-colors"
                >
                  Get Quote
                </Link>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                  <Link to="/notifications" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-md ${
                        notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
