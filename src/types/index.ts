export interface Shipment {
  id: string;
  user_id: string | null;
  tracking_number: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  service_type: 'domestic' | 'international' | 'express' | 'freight';
  origin_address: string;
  origin_city: string;
  origin_country: string;
  destination_address: string;
  destination_city: string;
  destination_country: string;
  weight: number | null;
  dimensions: { length: number; width: number; height: number } | null;
  declared_value: number | null;
  pickup_date: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  recipient_name: string;
  recipient_email: string | null;
  recipient_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  user_id: string | null;
  service_type: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  weight: number;
  dimensions: { length: number; width: number; height: number } | null;
  declared_value: number | null;
  quoted_price: number | null;
  status: string;
  valid_until: string | null;
  created_at: string;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  coordinates: { lat: number; lng: number } | null;
  hours: Record<string, string> | null;
  services: string[];
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  shipment_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string | null;
  description: string;
  timestamp: string;
}
