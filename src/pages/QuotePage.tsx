import { useState } from 'react';
import { Calculator, Package, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function QuotePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    service_type: 'domestic',
    origin_city: '',
    origin_country: '',
    destination_city: '',
    destination_country: '',
    weight: '',
    declared_value: '',
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
      const calculatedQuote = calculateQuote(weight, formData.service_type);
      setQuote(calculatedQuote);

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7);

      const userId = (user as any)?.uid ?? (user as any)?.id ?? null;

      await supabase.from('quotes').insert([
        {
          user_id: userId,
          service_type: formData.service_type,
          origin_city: formData.origin_city,
          origin_country: formData.origin_country,
          destination_city: formData.destination_city,
          destination_country: formData.destination_country,
          weight: weight,
          declared_value: formData.declared_value ? parseFloat(formData.declared_value) : null,
          quoted_price: calculatedQuote,
          status: 'quoted',
          valid_until: validUntil.toISOString(),
        },
      ]);
    } catch (err: unknown) {
      alert('Error calculating quote: ' + String((err as Error)?.message || err));
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin City
                  </label>
                  <input
                    type="text"
                    name="origin_city"
                    value={formData.origin_city}
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
                    name="origin_country"
                    value={formData.origin_country}
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
                    name="destination_city"
                    value={formData.destination_city}
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
                    name="destination_country"
                    value={formData.destination_country}
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
                    name="declared_value"
                    value={formData.declared_value}
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
