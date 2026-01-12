import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Quote, SavedAddress, TrackingEvent } from '../types';

/**
 * Firestore collection names
 */
export const COLLECTIONS = {
  SHIPMENTS: 'shipments',
  NOTIFICATIONS: 'notifications',
  QUOTES: 'quotes',
  SAVED_ADDRESSES: 'saved_addresses',
  TRACKING_EVENTS: 'tracking_events',
  USERS: 'users',
  PAYMENTS: 'payments',
  LOCATIONS: 'locations',
} as const;

/**
 * Fetch user shipments from Firestore
 */
export async function fetchUserShipments(userId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.SHIPMENTS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user shipments:', error);
    throw error;
  }
}

/**
 * Fetch user notifications from Firestore
 */
export async function fetchUserNotifications(userId: string, limit?: number) {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    ];

    const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), ...constraints);
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return limit ? docs.slice(0, limit) : docs;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
}

/**
 * Fetch user quotes from Firestore
 */
export async function fetchUserQuotes(userId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.QUOTES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    throw error;
  }
}

/**
 * Add a new quote to Firestore
 */
export async function addQuote(userId: string, quoteData: Omit<Quote, 'id' | 'userId' | 'createdAt' | 'status'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.QUOTES), {
      ...quoteData,
      userId,
      createdAt: new Date().toISOString(),
      status: 'quoted',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding quote:', error);
    throw error;
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notifRef, {
      isRead: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all user notifications as read
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);

    for (const docSnapshot of snapshot.docs) {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, docSnapshot.id), {
        isRead: true,
      });
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Fetch public shipment by tracking number
 */
export async function fetchShipmentByTrackingNumber(trackingNumber: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.SHIPMENTS),
      where('trackingNumber', '==', trackingNumber)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error('Error fetching shipment by tracking number:', error);
    throw error;
  }
}

/**
 * Fetch tracking events for a shipment
 */
export async function fetchTrackingEvents(shipmentId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.TRACKING_EVENTS),
      where('shipmentId', '==', shipmentId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching tracking events:', error);
    throw error;
  }
}

/**
 * Add a tracking event to a shipment
 */
export async function addTrackingEvent(shipmentId: string, eventData: Omit<TrackingEvent, 'id' | 'shipmentId' | 'timestamp'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TRACKING_EVENTS), {
      ...eventData,
      shipmentId,
      timestamp: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding tracking event:', error);
    throw error;
  }
}

/**
 * Fetch all locations (public)
 */
export async function fetchLocations() {
  try {
    const q = query(
      collection(db, COLLECTIONS.LOCATIONS),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

/**
 * Fetch user saved addresses
 */
export async function fetchUserSavedAddresses(userId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.SAVED_ADDRESSES),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching saved addresses:', error);
    throw error;
  }
}

/**
 * Add a saved address
 */
export async function addSavedAddress(userId: string, addressData: Omit<SavedAddress, 'id' | 'userId' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SAVED_ADDRESSES), {
      ...addressData,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding saved address:', error);
    throw error;
  }
}

/**
 * Update a saved address
 */
export async function updateSavedAddress(addressId: string, addressData: Partial<Omit<SavedAddress, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const addressRef = doc(db, COLLECTIONS.SAVED_ADDRESSES, addressId);
    await updateDoc(addressRef, addressData);
  } catch (error) {
    console.error('Error updating saved address:', error);
    throw error;
  }
}

/**
 * Delete a saved address
 */
export async function deleteSavedAddress(addressId: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SAVED_ADDRESSES, addressId));
  } catch (error) {
    console.error('Error deleting saved address:', error);
    throw error;
  }
}
