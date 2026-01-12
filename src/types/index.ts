export interface Shipment {
  id: string;
  userId: string | null;
  trackingNumber: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  serviceType: 'domestic' | 'international' | 'express' | 'freight';
  originAddress: string;
  originCity: string;
  originCountry: string;
  destinationAddress: string;
  destinationCity: string;
  destinationCountry: string;
  weight: number | null;
  dimensions: { length: number; width: number; height: number } | null;
  declaredValue: number | null;
  pickupDate: string | null;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  recipientName: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  userId: string | null;
  serviceType: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  weight: number;
  dimensions: { length: number; width: number; height: number } | null;
  declaredValue: number | null;
  quotedPrice: number | null;
  status: string;
  validUntil: string | null;
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  coordinates: { lat: number; lng: number } | null;
  hours: Record<string, string> | null;
  services: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  shipmentId: string | null;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: string;
  location: string | null;
  description: string;
  timestamp: string;
}
