import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Location } from '../types';

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [searchQuery, filterType, locations]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setLocations(data || []);
      setFilteredLocations(data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterLocations = () => {
    let filtered = locations;

    if (filterType !== 'all') {
      filtered = filtered.filter((loc) => loc.type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service_center':
        return 'bg-blue-100 text-blue-800';
      case 'drop_off':
        return 'bg-green-100 text-green-800';
      case 'pickup':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Find a Location</h1>
            <p className="text-xl">Drop-off points and service centers near you</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, city, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Types</option>
              <option value="service_center">Service Centers</option>
              <option value="drop_off">Drop-off Points</option>
              <option value="pickup">Pickup Points</option>
            </select>
          </div>
        </div>

        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(location.type)}`}>
                    {getTypeLabel(location.type)}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                    <div>
                      <p>{location.address}</p>
                      <p>
                        {location.city}
                        {location.state && `, ${location.state}`}
                      </p>
                      <p>{location.country}</p>
                      {location.postal_code && <p>{location.postal_code}</p>}
                    </div>
                  </div>

                  {location.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-orange-500" />
                      <a href={`tel:${location.phone}`} className="hover:text-orange-600">
                        {location.phone}
                      </a>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-orange-500" />
                      <a href={`mailto:${location.email}`} className="hover:text-orange-600">
                        {location.email}
                      </a>
                    </div>
                  )}

                  {location.hours && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                      <div>
                        {Object.entries(location.hours).map(([day, hours]) => (
                          <p key={day}>
                            <span className="font-medium capitalize">{day}:</span> {hours as string}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {location.services && location.services.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Available Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No locations found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
