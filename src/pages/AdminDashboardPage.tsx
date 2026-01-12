import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy, addDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { navigate } from '../components/Router';
import { Package, Search, Edit2, Trash2, CheckCircle, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastSafe } from '../components/Toast';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  serviceType: string;
  origin: {
    address: string;
    city: string;
    country: string;
  };
  destination: {
    address: string;
    city: string;
    country: string;
  };
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  weight?: number;
  declaredValue?: number;
  pickupDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface Payment {
  id: string;
  shipmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentId?: string;
  createdAt: string;
}

interface UserRecord {
  uid: string;
  email?: string | null;
  role: 'user' | 'admin';
  displayName?: string | null;
  history?: { type: string; payload?: Record<string, any> | null; timestamp: string }[];
  disabled?: boolean;
  createdAt?: string;
} 

export function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'shipments' | 'payments' | 'users'>('shipments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Shipment>>({});
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserHistory, setSelectedUserHistory] = useState<UserRecord['history'] | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // Supabase admin email input
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  // safe toast hook (no-op if not inside provider)
  const toast = useToastSafe();

  // Supabase RPC helpers
  const handlePromoteSupabaseUser = async () => {
    if (!adminEmailInput) return toast('Enter an email to promote');
    if (!confirm(`Promote ${adminEmailInput} as Supabase admin?`)) return;
    setAdminActionLoading(true);
    try {
      const { error } = await import('../lib/supabase').then(m => m.promoteUserByEmail(adminEmailInput));
      if (error) {
        console.error('Promote RPC error:', error);
        toast(`Error promoting: ${error.message || String(error)}`);
      } else {
        toast('User promoted in Supabase');
        // record admin log in Firestore as well
        await logAdminAction('promote_user_supabase', adminEmailInput, { email: adminEmailInput });
        // clear input and refresh users
        setAdminEmailInput('');
        await fetchData();
      }
    } catch (err) {
      console.error('Promote error:', err);
      toast('Error promoting Supabase user');
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleDemoteSupabaseUser = async () => {
    if (!adminEmailInput) return toast('Enter an email to demote');
    if (!confirm(`Demote ${adminEmailInput} from Supabase admin?`)) return;
    setAdminActionLoading(true);
    try {
      const { error } = await import('../lib/supabase').then(m => m.demoteUserByEmail(adminEmailInput));
      if (error) {
        console.error('Demote RPC error:', error);
        toast(`Error demoting: ${error.message || String(error)}`);
      } else {
        toast('User demoted in Supabase');
        await logAdminAction('demote_user_supabase', adminEmailInput, { email: adminEmailInput });
        setAdminEmailInput('');
        await fetchData();
      }
    } catch (err) {
      console.error('Demote error:', err);
      toast('Error demoting Supabase user');
    } finally {
      setAdminActionLoading(false);
    }
  };
  useEffect(() => {
    if (authLoading) return;
    
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    // initial fetch for shipments & payments
    fetchData();

    // If route includes a ?tab= query, switch to that tab
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab === 'payments' || urlTab === 'users' || urlTab === 'shipments') {
        if (urlTab !== selectedTab) {
          setSelectedTab(urlTab as 'shipments' | 'payments' | 'users');
          try {
            // small toast to indicate we opened a tab via deep link
            toast?.(`Opened ${urlTab} tab`);
          } catch (e) {
            // ignore if toast not available
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // listen to users collection in real-time
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      })) as UserRecord[];
      setUsers(usersData);
    }, (err) => {
      console.error('Error listening to users:', err);
    });

    return () => {
      unsubscribeUsers();
    };
  }, [user, isAdmin, authLoading]);

  // Keep URL in sync when tab changes so links are shareable
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', selectedTab);
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      // ignore
    }
  }, [selectedTab]);

  // Respond to back/forward navigation
  useEffect(() => {
    const handler = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'payments' || tab === 'users' || tab === 'shipments') {
          setSelectedTab(tab as 'shipments' | 'payments' | 'users');
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch shipments
      const shipmentsQuery = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
      const shipmentsSnapshot = await getDocs(shipmentsQuery);
      const shipmentsData = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Shipment[];
      setShipments(shipmentsData);

      // Fetch payments
      const paymentsQuery = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];
      setPayments(paymentsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;

    try {
      const shipmentRef = doc(db, 'shipments', selectedShipment.id);
      await updateDoc(shipmentRef, {
        ...editForm,
        updatedAt: new Date().toISOString(),
      });

      await fetchData();
      setIsEditing(false);
      setSelectedShipment(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating shipment:', error);
      alert('Failed to update shipment');
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      await deleteDoc(doc(db, 'shipments', shipmentId));
      await fetchData();
    } catch (error) {
      console.error('Error deleting shipment:', error);
      alert('Failed to delete shipment');
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setEditForm({
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      actualDelivery: shipment.actualDelivery,
    });
    setIsEditing(true);
  };

  // Admin user actions
  const logAdminAction = async (action: string, targetId: string, details?: Record<string, any>) => {
    try {
      await addDoc(collection(db, 'adminLogs'), {
        actor: user?.uid || null,
        action,
        target: targetId,
        details: details || null,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not write admin log:', err);
    }
  };

  const handlePromoteUser = async (u: UserRecord) => {
    if (!user) return;
    if (!confirm(`Promote ${u.email} to admin?`)) return;

    try {
      const userRef = doc(db, 'users', u.uid);
      await updateDoc(userRef, { role: 'admin' });
      await logAdminAction('promote_user', u.uid, { email: u.email });
      await updateDoc(userRef, { history: arrayUnion({ type: 'role_changed', payload: { by: user.uid, to: 'admin' }, timestamp: new Date().toISOString() }) });
      await fetchData();
    } catch (err) {
      console.error('Error promoting user:', err);
      alert('Failed to promote user');
    }
  };

  const handleDemoteUser = async (u: UserRecord) => {
    if (!user) return;
    if (!confirm(`Demote ${u.email} to regular user?`)) return;

    try {
      const userRef = doc(db, 'users', u.uid);
      await updateDoc(userRef, { role: 'user' });
      await logAdminAction('demote_user', u.uid, { email: u.email });
      await updateDoc(userRef, { history: arrayUnion({ type: 'role_changed', payload: { by: user.uid, to: 'user' }, timestamp: new Date().toISOString() }) });
      await fetchData();
    } catch (err) {
      console.error('Error demoting user:', err);
      alert('Failed to demote user');
    }
  };

  const handleToggleDisableUser = async (u: UserRecord) => {
    if (!user) return;
    const action = u.disabled ? 'enable_user' : 'disable_user';
    if (!confirm(`${u.disabled ? 'Enable' : 'Disable'} ${u.email}?`)) return;

    try {
      const userRef = doc(db, 'users', u.uid);
      await updateDoc(userRef, { disabled: !u.disabled });
      await logAdminAction(action, u.uid, { email: u.email });
      await updateDoc(userRef, { history: arrayUnion({ type: action, payload: { by: user.uid }, timestamp: new Date().toISOString() }) });
      await fetchData();
    } catch (err) {
      console.error('Error toggling user disabled state:', err);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this user and their Firestore document? This will NOT delete their Firebase Auth account.')) return;

    try {
      await deleteDoc(doc(db, 'users', uid));
      await logAdminAction('delete_user', uid, {});
      await fetchData();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleViewUserHistory = (u: UserRecord) => {
    setSelectedUserHistory(u.history || []);
    setIsHistoryOpen(true);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      'out-for-delivery': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all shipments and payments</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('shipments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'shipments'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="inline h-5 w-5 mr-2" />
              Shipments ({shipments.length})
            </button>
            <button
              onClick={() => setSelectedTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'payments'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="inline h-5 w-5 mr-2" />
              Payments ({payments.length})
            </button>

            <button
              onClick={() => setSelectedTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserIcon className="inline h-5 w-5 mr-2" />
              Users ({users.length})
            </button>
          </nav>
        </div>

        {/* Animated Tab Content */}
        <AnimatePresence mode="popLayout">
          {selectedTab === 'shipments' && (
            <motion.div
              key="shipments"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* Filters and Search */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by tracking number, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Shipments Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin → Destination</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredShipments.map((shipment) => (
                        <tr key={shipment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>{shipment.status}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.serviceType}</td>
                          <td className="px-6 py-4 text-sm text-gray-500"><div>{shipment.origin.city}, {shipment.origin.country}</div><div className="text-gray-400">→ {shipment.destination.city}, {shipment.destination.country}</div></td>
                          <td className="px-6 py-4 text-sm text-gray-500"><div>{shipment.recipientName}</div>{shipment.recipientEmail && (<div className="text-gray-400">{shipment.recipientEmail}</div>)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEdit(shipment)} className="text-orange-600 hover:text-orange-900 mr-4"><Edit2 className="h-5 w-5" /></button>
                            <button onClick={() => handleDeleteShipment(shipment.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.shipmentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(payment.status)}`}>{payment.status}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentMethod}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div>
            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by email, name, or UID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="w-full sm:w-96 flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Supabase user email (for promote/demote)"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button onClick={handlePromoteSupabaseUser} disabled={adminActionLoading} className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Promote
                </button>
                <button onClick={handleDemoteSupabaseUser} disabled={adminActionLoading} className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                  Demote
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.filter(u => {
                      const q = userSearch.toLowerCase();
                      return !q || (u.email || '').toLowerCase().includes(q) || (u.displayName || '').toLowerCase().includes(q) || u.uid.toLowerCase().includes(q);
                    }).map((u) => (
                      <tr key={u.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.displayName || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {u.role !== 'admin' ? (
                            <button onClick={() => handlePromoteUser(u)} className="text-orange-600 hover:text-orange-900 mr-3">Promote</button>
                          ) : (
                            <button onClick={() => handleDemoteUser(u)} className="text-gray-600 hover:text-gray-900 mr-3">Demote</button>
                          )}
                          <button onClick={() => handleToggleDisableUser(u)} className={`mr-3 ${u.disabled ? 'text-green-600' : 'text-red-600'}`}>
                            {u.disabled ? 'Enable' : 'Disable'}
                          </button>
                          <button onClick={() => handleViewUserHistory(u)} className="text-blue-600 hover:text-blue-900 mr-3">History</button>
                          <button onClick={() => handleDeleteUser(u.uid)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* History Modal */}
            {isHistoryOpen && selectedUserHistory && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="Text-lg font-medium text-gray-900 mb-4">User History</h3>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {selectedUserHistory.length === 0 && <div className="text-sm text-gray-500">No history</div>}
                      {selectedUserHistory.map((entry, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{entry.type}</div>
                          <div className="text-gray-500 text-xs">{entry.timestamp}</div>
                          {entry.payload && <pre className="text-xs bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">{JSON.stringify(entry.payload, null, 2)}</pre>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button onClick={() => { setIsHistoryOpen(false); setSelectedUserHistory(null); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */} 
        {isEditing && selectedShipment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Shipment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editForm.status || ''}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-transit">In Transit</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                    <input
                      type="date"
                      value={editForm.estimatedDelivery || ''}
                      onChange={(e) => setEditForm({ ...editForm, estimatedDelivery: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Actual Delivery</label>
                    <input
                      type="date"
                      value={editForm.actualDelivery || ''}
                      onChange={(e) => setEditForm({ ...editForm, actualDelivery: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedShipment(null);
                      setEditForm({});
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateShipment}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

