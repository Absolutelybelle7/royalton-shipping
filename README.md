# Royalton Gold Security and Shipping - Shipping Management Platform

A professional, full-stack shipping and logistics management platform built with modern web technologies.Royalton Gold Security and Shipping enables users to create, track, and manage shipments with real-time updates, professional dashboards, and comprehensive admin controls.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [User Roles & Permissions](#user-roles--permissions)
- [Firestore Collections](#firestore-collections)
- [Authentication](#authentication)
- [Core Components](#core-components)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🚀 Features

### User Features
- **Shipment Creation** - Create and manage shipments with flexible service options
- **Real-time Tracking** - Track packages by tracking number with live status updates
- **Dashboard** - Personal dashboard showing shipment statistics and recent activity
- **Quote Calculator** - Calculate shipping costs before creating shipments
- **Saved Addresses** - Save frequently used addresses for quick access
- **History Tracking** - View complete history of user activities
- **Responsive Design** - Mobile-first responsive UI that works on all devices

### Admin Features
- ✅ All user permissions
- **Admin Dashboard** - Comprehensive view of all shipments and payments
- **Shipment Management** - Create, update, and delete shipments
- **Status Updates** - Update shipment status and tracking events
- **Payment Management** - Track and manage all payment transactions
- **Analytics** - View platform statistics and metrics

### Security & Access Control
- **Role-Based Access Control (RBAC)** - Different permissions for users and admins
- **Firebase Authentication** - Secure email/password authentication
- **Protected Routes** - Automatic redirection to sign-in for unauthorized access
- **Firestore Security Rules** - Database-level access control
- **Public Tracking** - Public can track shipments by tracking number without login

### Notifications & User Experience
- **Toast Notifications** - Professional, non-intrusive notifications
- **Error Handling** - Comprehensive error messages and guidance
- **Loading States** - Smooth loading indicators for async operations
- **Animations** - Smooth transitions and professional animations

---

## 💻 Tech Stack

### Frontend
- **React 18.3** - UI framework with hooks
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation build tool
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library
- **React CountUp** - Number animation library

### Backend & Services
- **Firebase** - Backend-as-a-Service (BaaS)
  - **Firebase Authentication** - User authentication
  - **Cloud Firestore** - Real-time database
  - **Firebase Rules** - Database security and access control

### Build & Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **PostCSS** - CSS transformations
- **Autoprefixer** - CSS vendor prefixes

---

## 📁 Project Structure

```
royalton-company/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer component
│   │   ├── Router.tsx          # Custom routing solution
│   │   ├── ProtectedRoute.tsx  # Authentication wrapper
│   │   └── Toast.tsx           # Toast notification system
│   │
│   ├── contexts/               # React context providers
│   │   └── AuthContext.tsx     # Authentication state
│   │
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx
│   │   ├── SignInPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ShipPage.tsx
│   │   ├── TrackPage.tsx
│   │   ├── ShipmentsPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── QuotePage.tsx
│   │   ├── ServicesPage.tsx
│   │   └── [other pages]
│   │
│   ├── lib/                    # Utility functions
│   │   ├── firebase.ts
│   │   ├── firestore-utils.ts
│   │   └── stripe-utils.ts
│   │
│   ├── types/                  # Type definitions
│   │   └── index.ts
│   │
│   ├── assets/                 # Static assets
│   │   ├── images/
│   │   └── videos/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── styles
│
├── firestore.rules             # Firestore security rules
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (v7+) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Free Tier Available](https://firebase.google.com/)

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/royalton-company.git
cd royalton-company
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create `.env.local` in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**⚠️ Never commit `.env.local` to version control.**

---

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Firestore database (Test mode for development)
4. Deploy the security rules from `firestore.rules`
5. Copy your Firebase config to `.env.local`

---

## 🚀 Running the Application

```bash
# Development server
npm run dev              # Starts on http://localhost:5173

# Build for production
npm run build            # Creates optimized dist folder

# Type checking
npm run typecheck        # Check TypeScript errors

# Linting
npm run lint             # Check code quality

# Preview production build
npm run preview          # Serve dist folder locally
```

---

## 👥 User Roles & Permissions

### Regular User
- ✅ Create shipments
- ✅ View own shipments
- ✅ Track packages
- ✅ Personal dashboard
- ✅ Save addresses

### Admin User
- ✅ All user permissions
- ✅ View all shipments
- ✅ Manage shipments & payments
- ✅ Admin dashboard

### Public User
- ✅ Track by tracking number
- ✅ View services & locations

---

## 🗄️ Firestore Collections

| Collection | Purpose | Access |
|-----------|---------|--------|
| `users` | User profiles & roles | Owner + Admin |
| `shipments` | Shipment details & tracking | Owner + Admin + Public |
| `tracking_events` | Status updates | Admin (create), Public (read) |
| `notifications` | User notifications | Owner + Admin |
| `payments` | Payment transactions | Owner + Admin |
| `quotes` | Shipping quotes | Owner + Admin |
| `saved_addresses` | User addresses | Owner |
| `locations` | Pickup/delivery points | Public (read), Admin (write) |

---

## 🔐 Authentication

### Sign In / Sign Up
```typescript
const { signIn, signUp } = useAuth();

await signIn(email, password);
await signUp(email, password, displayName);
```

### Protected Routes
```typescript
<ProtectedRoute requireAuth={true}>
  <DashboardPage />
</ProtectedRoute>

<ProtectedRoute requireAdmin={true}>
  <AdminDashboardPage />
</ProtectedRoute>
```

---

## 🎨 Core Components

### `Toast` Notifications
```typescript
import { showToast } from '../components/Toast';

showToast('Success!', 'success');
showToast('Error!', 'error');
showToast('Warning!', 'warning');
showToast('Info', 'info');
```

### `AuthContext`
```typescript
const { user, userData, isAdmin, loading } = useAuth();
```

### `Router` & `Link`
```typescript
import { navigate, Link } from '../components/Router';

navigate('/dashboard');
<Link to="/track">Track</Link>
```

---

## 📦 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy automatically

### Netlify
1. Run `npm run build`
2. Deploy `dist` folder at [netlify.com](https://netlify.com)
3. Add environment variables in settings

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission errors | Check Firestore rules are deployed |
| Video not playing | Disable ad blockers or whitelist domain |
| Firebase blocked | Whitelist `firestore.googleapis.com` |
| Build errors | Run `npm run typecheck` |
| Env variables missing | Create `.env.local` file |

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

## 📞 Support

- 📧 Email: support@trackxpress.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/royalton-company/issues)
- 📖 Docs: Check `/support` page

---

**Built with ❤️ | MIT License | Last Updated: January 2026**
