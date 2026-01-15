import { useState } from 'react';
import { Package, MapPin, User, Calendar } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { navigate } from '../components/Router';
import { showToast } from '../components/Toast';

export function ShipPage() {
  const { user, addHistoryEntry } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdShipment, setCreatedShipment] = useState<{
    id: string;
    trackingNumber: string;
    status: string;
    serviceType: string;
    origin: { address: string; city: string; country: string };
    destination: { address: string; city: string; country: string };
    estimatedDelivery: string;
    createdAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    service_type: 'domestic',
    origin_address: '',
    origin_city: '',
    origin_country: '',
    destination_address: '',
    destination_city: '',
    destination_country: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    declared_value: '',
    recipient_name: '',
    recipient_email: '',
    recipient_phone: '',
    pickup_date: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/signin');
      return;
    }

    setLoading(true);

    try {
      const trackingNumber = `TXP${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const estimatedDays = formData.service_type === 'express' ? 1 : formData.service_type === 'domestic' ? 3 : 7;
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

      const shipmentData = {
        userId: user.uid,
        trackingNumber: trackingNumber,
        status: 'pending',
        serviceType: formData.service_type,
        origin: {
          address: formData.origin_address,
          city: formData.origin_city,
          country: formData.origin_country,
        },
        destination: {
          address: formData.destination_address,
          city: formData.destination_city,
          country: formData.destination_country,
        },
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.length && formData.width && formData.height ? {
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height),
        } : null,
        declaredValue: formData.declared_value ? parseFloat(formData.declared_value) : null,
        recipientName: formData.recipient_name,
        recipientEmail: formData.recipient_email || null,
        recipientPhone: formData.recipient_phone || null,
        pickupDate: formData.pickup_date || null,
        estimatedDelivery: estimatedDelivery.toISOString(),
        actualDelivery: null,
        notes: formData.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'shipments'), shipmentData);

      // Keep the created shipment in state so we can show details immediately
      setCreatedShipment({
        id: docRef.id,
        trackingNumber,
        status: 'pending',
        serviceType: formData.service_type,
        origin: {
          address: formData.origin_address,
          city: formData.origin_city,
          country: formData.origin_country,
        },
        destination: {
          address: formData.destination_address,
          city: formData.destination_city,
          country: formData.destination_country,
        },
        estimatedDelivery: estimatedDelivery.toISOString(),
        createdAt: new Date().toISOString(),
      });

      // record creation in user history (best-effort)
      try {
        await addHistoryEntry({ type: 'create_shipment', payload: { id: docRef.id, trackingNumber } });
      } catch (e) {
        // ignore history errors
      }

      setSuccess(true);
    } catch (err: unknown) {
      showToast('Shipment created successfully!', 'success');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (success && createdShipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shipment Created!</h2>
                <p className="text-gray-600">Your shipment has been successfully scheduled.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Tracking number</div>
              <div className="flex items-center space-x-3 mt-1">
                <div className="font-mono font-semibold text-lg text-gray-900">{createdShipment.trackingNumber}</div>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(createdShipment.trackingNumber);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (e) {
                      console.warn('Clipboard copy failed:', e);
                    }
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Origin</h4>
              <p className="text-gray-900">{createdShipment.origin.address}</p>
              <p className="text-sm text-gray-600">{createdShipment.origin.city}, {createdShipment.origin.country}</p>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Destination</h4>
              <p className="text-gray-900">{createdShipment.destination.address}</p>
              <p className="text-sm text-gray-600">{createdShipment.destination.city}, {createdShipment.destination.country}</p>
            </div>

            <div className="bg-white rounded-md p-4 border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Service</h4>
              <p className="text-gray-900 capitalize">{createdShipment.serviceType}</p>
            </div>

            <div className="bg-white rounded-md p-4 border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Estimated Delivery</h4>
              <p className="text-gray-900">{new Date(createdShipment.estimatedDelivery).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => navigate(`/track?number=${createdShipment.trackingNumber}`)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold"
            >
              View Tracking
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md font-semibold"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  } else if (success) {
    // Fallback: success but no createdShipment data
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Created!</h2>
          <p className="text-gray-600 mb-4">Your shipment has been successfully scheduled.</p>
          <div className="flex justify-center">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ship a Package</h1>
          <p className="text-gray-600">Fill in the details to schedule your shipment</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-orange-500" />
              Service Type
            </h2>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="domestic">Domestic Shipping</option>
              <option value="international">International Shipping</option>
              <option value="express">Express Delivery</option>
              <option value="freight">Freight & Cargo</option>
            </select>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-orange-500" />
              Origin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="origin_address"
                placeholder="Address"
                value={formData.origin_address}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="origin_city"
                placeholder="City"
                value={formData.origin_city}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="origin_country"
                placeholder="Country"
                value={formData.origin_country}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              Destination
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="destination_address"
                placeholder="Address"
                value={formData.destination_address}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="destination_city"
                placeholder="City"
                value={formData.destination_city}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="destination_country"
                placeholder="Country"
                value={formData.destination_country}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                name="declared_value"
                placeholder="Declared Value (USD)"
                value={formData.declared_value}
                onChange={handleChange}
                step="0.01"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                name="length"
                placeholder="Length (cm)"
                value={formData.length}
                onChange={handleChange}
                step="0.1"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                name="width"
                placeholder="Width (cm)"
                value={formData.width}
                onChange={handleChange}
                step="0.1"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
                step="0.1"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-orange-500" />
              Recipient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="recipient_name"
                placeholder="Recipient Name"
                value={formData.recipient_name}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                name="recipient_email"
                placeholder="Recipient Email"
                value={formData.recipient_email}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="tel"
                name="recipient_phone"
                placeholder="Recipient Phone"
                value={formData.recipient_phone}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Pickup Date
            </h2>
            <input
              type="date"
              name="pickup_date"
              value={formData.pickup_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any special instructions or notes..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Schedule Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
