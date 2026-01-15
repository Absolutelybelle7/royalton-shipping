import { useState, useEffect } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, Truck } from 'lucide-react';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Shipment, TrackingEvent } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addHistoryEntry } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const number = params.get('number');
    if (number) {
      setTrackingNumber(number);
      handleTrack(number);
    }
  }, []);

  const handleTrack = async (number?: string) => {
    const searchNumber = number || trackingNumber;
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError('');
    setShipment(null);
    setTrackingEvents([]);

    try {
      // Query Firestore for shipment by tracking number
      const q = query(
        collection(db, 'shipments'),
        where('trackingNumber', '==', searchNumber)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setError('Tracking number not found. Please check and try again.');
        setLoading(false);
        return;
      }

      const doc = snap.docs[0];
      const data = doc.data() as any;

      // Construct shipment object
      const shipmentData: Shipment = {
        id: doc.id,
        userId: data.userId || null,
        trackingNumber: data.trackingNumber || '',
        status: data.status || 'pending',
        serviceType: data.serviceType || 'domestic',
        originAddress: data.origin?.address || data.originAddress || '',
        originCity: data.origin?.city || data.originCity || '',
        originCountry: data.origin?.country || data.originCountry || '',
        destinationAddress: data.destination?.address || data.destinationAddress || '',
        destinationCity: data.destination?.city || data.destinationCity || '',
        destinationCountry: data.destination?.country || data.destinationCountry || '',
        weight: typeof data.weight === 'number' ? data.weight : null,
        dimensions: data.dimensions || null,
        declaredValue: data.declaredValue || null,
        pickupDate: data.pickupDate || null,
        estimatedDelivery: data.estimatedDelivery || null,
        actualDelivery: data.actualDelivery || null,
        recipientName: data.recipientName || '',
        recipientEmail: data.recipientEmail || null,
        recipientPhone: data.recipientPhone || null,
        notes: data.notes || null,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      };

      setShipment(shipmentData);

      // Record that the user searched/tracked this number
      try {
        await addHistoryEntry({ type: 'track', payload: { trackingNumber: searchNumber, found: true } });
      } catch (e) {
        // Ignore history errors
      }

      // Fetch tracking events for this shipment
      const eventsQuery = query(
        collection(db, 'tracking_events'),
        where('shipmentId', '==', doc.id),
        orderBy('timestamp', 'desc')
      );
      const eventsSnap = await getDocs(eventsQuery);
      const eventsData = eventsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as TrackingEvent[];

      setTrackingEvents(eventsData);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('Missing or insufficient permissions')) {
        setError('Unable to load tracking information. Please ensure Firebase is not blocked by browser extensions.');
      } else if (errorMsg.includes('not found')) {
        setError('Tracking number not found. Please check and try again.');
      } else {
        setError('An error occurred while tracking your package. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck className="h-6 w-6 text-blue-500" />;
      default:
        return <Package className="h-6 w-6 text-orange-500" />;
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Package</h1>
          <p className="text-gray-600">Enter your tracking number to see real-time updates</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-brand-900 px-8 py-3 rounded-md font-semibold transition-colors disabled:bg-gray-400"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Tracking your package...</p>
          </div>
        )}

        {shipment && !loading && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tracking: {shipment.trackingNumber}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {getStatusIcon(shipment.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    Origin
                  </h3>
                  <p className="text-gray-600">{(shipment as any).origin?.address || shipment.originAddress}</p>
                  <p className="text-gray-600">
                    {((shipment as any).origin?.city || shipment.originCity)}, {((shipment as any).origin?.country || shipment.originCountry)}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-500" />
                    Destination
                  </h3>
                  <p className="text-gray-600">{(shipment as any).destination?.address || shipment.destinationAddress}</p>
                  <p className="text-gray-600">
                    {((shipment as any).destination?.city || shipment.destinationCity)}, {((shipment as any).destination?.country || shipment.destinationCountry)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Service Type</h3>
                  <p className="text-gray-600 capitalize">{shipment.serviceType}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                  <p className="text-gray-600">
                    {shipment.estimatedDelivery
                      ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                      : 'TBD'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Weight</h3>
                  <p className="text-gray-600">
                    {shipment.weight ? `${shipment.weight} kg` : 'N/A'}
                  </p>
                </div>
              </div>

              {shipment.recipientName && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-2">Recipient</h3>
                  <p className="text-gray-600">{shipment.recipientName}</p>
                  {shipment.recipientEmail && (
                    <p className="text-gray-600">{shipment.recipientEmail}</p>
                  )}
                  {shipment.recipientPhone && (
                    <p className="text-gray-600">{shipment.recipientPhone}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-orange-500" />
                Tracking History
              </h2>

              {trackingEvents.length > 0 ? (
                <div className="space-y-6">
                  {trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        >
                          {index === 0 ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        {index < trackingEvents.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {event.status.replace('_', ' ')}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {event.location && (
                          <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                        )}
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No tracking events available yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
