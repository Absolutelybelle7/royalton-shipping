# Migration Notes: Supabase to Firebase

## What's Been Completed

✅ Firebase Authentication integrated
✅ Firestore database configured
✅ Admin role system implemented
✅ Admin Dashboard created with full CRUD operations
✅ Stripe payment integration component created
✅ Admin routes protected
✅ Header updated with admin link

## What Needs Migration

The following pages still use Supabase and need to be migrated to Firebase/Firestore:

1. **DashboardPage.tsx** - Uses Supabase queries for shipments and notifications
2. **ShipmentsPage.tsx** - Uses Supabase queries
3. **ShipPage.tsx** - Uses Supabase for creating shipments
4. **QuotePage.tsx** - Uses Supabase for quotes
5. **NotificationsPage.tsx** - Uses Supabase for notifications

### Migration Steps for Each Page

1. Replace Supabase imports with Firebase/Firestore imports
2. Replace `user.id` with `user.uid` (Firebase uses `uid` not `id`)
3. Convert Supabase queries to Firestore queries:
   - `.from('table')` → `collection(db, 'table')`
   - `.select('*')` → Firestore returns all fields by default
   - `.eq('field', value)` → `.where('field', '==', value)`
   - `.order()` → `.orderBy()`
   - `.limit()` → `.limit()`

### Example Migration

**Before (Supabase):**
```typescript
const { data } = await supabase
  .from('shipments')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

**After (Firestore):**
```typescript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const shipmentsRef = collection(db, 'shipments');
const q = query(
  shipmentsRef,
  where('userId', '==', user.uid),
  orderBy('createdAt', 'desc')
);
const querySnapshot = await getDocs(q);
const data = querySnapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

## Firestore Collection Structure

The following collections should exist in Firestore:

- `users` - User profiles with role field
- `shipments` - Shipment records
- `payments` - Payment records
- `quotes` - Quote records
- `notifications` - User notifications
- `tracking_events` - Shipment tracking events

## Admin Features

The admin dashboard allows:
- View all shipments
- Edit shipment status, estimated delivery, actual delivery
- Delete shipments
- View all payments
- Search and filter shipments
- Real-time updates

Access is controlled via the `role` field in the user document (`"admin"`).

