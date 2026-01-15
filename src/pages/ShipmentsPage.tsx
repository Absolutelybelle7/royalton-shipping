import { useState, useEffect } from 'react';
import { Package, Filter, MapPin, Truck, Calendar, User } from 'lucide-react';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'in_transit':
      case 'out_for_delivery':
        return '⏱';
      case 'cancelled':
        return '✕';
      default:
        return '⊙';
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
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                onClick={() => navigate(`/track?number=${shipment.trackingNumber}`)}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 font-mono">
                        {shipment.trackingNumber}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span className="capitalize">{shipment.serviceType} Shipping</span>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Locations Section */}
                <div className="p-6 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold text-gray-900">Origin</h4>
                      </div>
                      <div className="ml-7 space-y-1">
                        <p className="text-gray-700 font-medium">
                          {(shipment as any).origin?.address || shipment.originAddress || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {((shipment as any).origin?.city || shipment.originCity) && ((shipment as any).origin?.country || shipment.originCountry)
                            ? `${(shipment as any).origin?.city || shipment.originCity}, ${(shipment as any).origin?.country || shipment.originCountry}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold text-gray-900">Destination</h4>
                      </div>
                      <div className="ml-7 space-y-1">
                        <p className="text-gray-700 font-medium">
                          {(shipment as any).destination?.address || shipment.destinationAddress || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {((shipment as any).destination?.city || shipment.destinationCity) && ((shipment as any).destination?.country || shipment.destinationCountry)
                            ? `${(shipment as any).destination?.city || shipment.destinationCity}, ${(shipment as any).destination?.country || shipment.destinationCountry}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 font-semibold mb-2">Created</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {shipment.estimatedDelivery && (
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 font-semibold mb-2">Est. Delivery</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {shipment.weight && (
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 font-semibold mb-2">Weight</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.weight} kg</p>
                    </div>
                  )}

                  {shipment.recipientName && (
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 font-semibold mb-2">Recipient</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">{shipment.recipientName}</p>
                      </div>
                    </div>
                  )}
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
