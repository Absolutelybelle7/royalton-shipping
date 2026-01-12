# Firebase and Stripe Setup Guide

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location for your database
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web icon (</>)
   - Copy the configuration values
6. Set up Firestore Security Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Only admins can access admin dashboard data
       match /shipments/{shipmentId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       match /payments/{paymentId} {
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```
7. Create an admin user:
   - Sign up a user through your app
   - In Firestore, go to the `users` collection
   - Find the user document and update the `role` field to `"admin"`

## Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable key:
   - Go to Developers > API keys
   - Copy your "Publishable key" (starts with `pk_test_` for test mode)
3. Set up webhook endpoint (for production):
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Create payment intent endpoint on your backend:
   - You'll need a backend server to create payment intents securely
   - Example endpoint: `POST /api/create-payment-intent`
   - This endpoint should use your Stripe secret key (server-side only)

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Important Notes

- **Admin Access**: To make a user an admin, update their `role` field in Firestore to `"admin"`
- **Payment Processing**: The StripePayment component requires a backend endpoint to create payment intents. This is a security requirement.
- **Data Migration**: Existing pages using Supabase need to be migrated to Firebase/Firestore

