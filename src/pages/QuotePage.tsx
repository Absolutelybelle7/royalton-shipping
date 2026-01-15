import { useState } from 'react';
import { Calculator, Package, TrendingUp } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function QuotePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    serviceType: 'domestic',
    originCity: '',
    originCountry: '',
    destinationCity: '',
    destinationCountry: '',
    weight: '',
    declaredValue: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const name = target.name as keyof typeof formData;
    const value = target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateQuote = (weight: number, serviceType: string) => {
    const baseRates: { [key: string]: number } = {
      domestic: 5,
      international: 15,
      express: 25,
      freight: 10,
    };

    const baseRate = baseRates[serviceType] || 10;
    return baseRate * weight + 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const weight = parseFloat(formData.weight);
      const calculatedQuote = calculateQuote(weight, formData.serviceType);
      setQuote(calculatedQuote);

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7);

      const userId = (user as any)?.uid ?? (user as any)?.id ?? null;

      await addDoc(collection(db, 'quotes'), {
        userId,
        serviceType: formData.serviceType,
        originCity: formData.originCity,
        originCountry: formData.originCountry,
        destinationCity: formData.destinationCity,
        destinationCountry: formData.destinationCountry,
        weight: weight,
        declaredValue: formData.declaredValue ? parseFloat(formData.declaredValue) : null,
        quotedPrice: calculatedQuote,
        status: 'quoted',
        validUntil: validUntil.toISOString(),
        createdAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      showToast('Error calculating quote: ' + String((err as Error)?.message || err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get a Shipping Quote</h1>
          <p className="text-gray-600">Calculate instant pricing for your shipment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin City
                  </label>
                  <input
                    type="text"
                    name="originCity"
                    value={formData.originCity}
                    onChange={handleChange}
                    required
                    placeholder="e.g., New York"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin Country
                  </label>
                  <input
                    type="text"
                    name="originCountry"
                    value={formData.originCountry}
                    onChange={handleChange}
                    required
                    placeholder="e.g., USA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination City
                  </label>
                  <input
                    type="text"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    required
                    placeholder="e.g., London"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    required
                    placeholder="e.g., UK"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="0.1"
                    placeholder="e.g., 2.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Declared Value (USD)
                  </label>
                  <input
                    type="number"
                    name="declaredValue"
                    value={formData.declaredValue}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-brand-900 py-3 rounded-md font-semibold transition-colors disabled:bg-gray-400 flex items-center justify-center"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {loading ? 'Calculating...' : 'Calculate Quote'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {quote !== null ? (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-12 w-12" />
                </div>
                <h3 className="text-center text-lg font-semibold mb-2">Estimated Cost</h3>
                <div className="text-center text-5xl font-bold mb-4">${quote.toFixed(2)}</div>
                <p className="text-center text-sm opacity-90 mb-6">
                  Valid for 7 days from today
                </p>
                <button
                  onClick={() => (window.location.href = '/ship')}
                  className="w-full bg-white text-orange-500 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center mb-4">
                  <Package className="h-12 w-12 text-orange-500" />
                </div>
                <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">
                  Get Your Quote
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  Fill in the form to receive an instant shipping quote tailored to your needs.
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Door-to-door delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Real-time tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Insurance coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
