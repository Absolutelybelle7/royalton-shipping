import { useState, useEffect } from 'react';
import { Package, Filter } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Shipment } from '../types';
import { navigate } from '../components/Router';

export function ShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchShipments();
  }, [user]);

  useEffect(() => {
    filterShipments();
  }, [filterStatus, shipments]);

  const fetchShipments = async () => {
    if (!user) return;

    try {
      const shipmentsQuery = query(
        collection(db, 'shipments'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(shipmentsQuery);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Shipment[];

      setShipments(data);
      setFilteredShipments(data);
    } catch (err) {
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterShipments = () => {
    if (filterStatus === 'all') {
      setFilteredShipments(shipments);
    } else {
      setFilteredShipments(shipments.filter((s) => s.status === filterStatus));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Shipments</h1>
          <p className="text-gray-600">View and manage all your shipments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Shipments</option>
              <option value="pending">Pending</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredShipments.length > 0 ? (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/track?number=${shipment.trackingNumber}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {shipment.trackingNumber}
                    </h3>
                    <p className="text-gray-600 capitalize">{shipment.serviceType} Shipping</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Origin</p>
                    <p className="text-gray-600">{shipment.originAddress}</p>
                    <p className="text-gray-600">
                      {shipment.originCity}, {shipment.originCountry}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Destination</p>
                    <p className="text-gray-600">{shipment.destinationAddress}</p>
                    <p className="text-gray-600">
                      {shipment.destinationCity}, {shipment.destinationCountry}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {shipment.estimatedDelivery && (
                    <div>
                      <p className="text-xs text-gray-500">Est. Delivery</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {shipment.weight && (
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.weight} kg</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Recipient</p>
                    <p className="text-sm font-medium text-gray-900">{shipment.recipientName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? "You haven't created any shipments yet"
                : `No ${filterStatus.replace('_', ' ')} shipments`}
            </p>
            <button
              onClick={() => navigate('/ship')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Create Shipment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
