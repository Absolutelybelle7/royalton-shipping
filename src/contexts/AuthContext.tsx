import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Detect common network errors produced when browser extensions (adblockers / privacy tools)
// block calls to Google APIs (e.g. net::ERR_BLOCKED_BY_CLIENT). Returns true if the error
// message or string suggests a client-side block.
function isBlockedByClientError(err: unknown): boolean {
  try {
    const msg = typeof err === 'string' ? err : (err && typeof err === 'object' && 'message' in err ? String((err as any).message) : String(err));
    const lower = (msg || '').toLowerCase();
    return (
      lower.includes('err_blocked_by_client') ||
      lower.includes('blocked by client') ||
      lower.includes('net::err_blocked_by_client') ||
      lower.includes('failed to fetch') ||
      lower.includes('networkerror')
    );
  } catch (e) {
    return false;
  }
}

function blockedClientErrorMessage() {
  return 'The request was blocked by a browser extension or client setting (e.g. adblocker). Please disable adblocking/privacy extensions for this site or whitelist it and try again.';
}

interface HistoryEntry {
  type: string;
  payload: Record<string, any> | null;
  timestamp: string;
}

interface UserData {
  uid: string;
  email: string | null;
  role: 'user' | 'admin';
  displayName?: string | null;
  history?: HistoryEntry[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  addHistoryEntry: (entry: { type: string; payload?: Record<string, any> }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as Partial<UserData>;
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: data.role || 'user',
              displayName: data.displayName,
            });
          } else {
            // Create user document if it doesn't exist
            const newUserData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'user',
              displayName: null,
              history: [],
            };
            try {
              await setDoc(userDocRef, newUserData);
              setUserData(newUserData);
            } catch (err: unknown) {
              // If a browser extension blocked the request, don't crash; set minimal user data
              if (isBlockedByClientError(err)) {
                console.warn('Firestore write blocked by client extension:', err);
                setUserData({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  role: 'user',
                  displayName: null,
                  history: [],
                });
              } else {
                console.error('Error creating user document:', err);
                // still set a minimal profile so the app remains usable
                setUserData({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  role: 'user',
                  displayName: null,
                  history: [],
                });
              }
            }
          }
        } catch (err: unknown) {
          console.error('Error fetching user data:', err);
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'user',
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // record sign-in in the user's history (best-effort)
      try {
        const userDocRef = doc(db, 'users', credential.user.uid);
        await updateDoc(userDocRef, {
          history: arrayUnion({ type: 'login', payload: null, timestamp: new Date().toISOString() })
        });
      } catch (err: unknown) {
        if (isBlockedByClientError(err)) {
          console.warn('Could not record login history (blocked by client):', err);
        } else {
          console.warn('Could not record login history:', err);
        }
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the Firebase user profile with displayName (if provided)
      if (displayName) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (e) {
          console.warn('Could not set auth profile displayName:', e);
        }
      }

      // Create user document in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      try {
        await setDoc(userDocRef, {
          email: email,
          role: 'user',
          displayName: displayName || null,
          history: [],
          createdAt: new Date().toISOString(),
        });
      } catch (err: unknown) {
        if (isBlockedByClientError(err)) {
          console.warn('Firestore write blocked by client extension during signUp:', err);
          return { error: new Error(blockedClientErrorMessage()) };
        }
        return { error: err instanceof Error ? err : new Error(String(err)) };
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
  };

  const addHistoryEntry = async (entry: { type: string; payload?: Record<string, any> }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const userDocRef = doc(db, 'users', user.uid);
    const newEntry = { type: entry.type, payload: entry.payload || null, timestamp: new Date().toISOString() };

    try {
      await updateDoc(userDocRef, { history: arrayUnion(newEntry) });

      // Update local state if present
      setUserData((prev) => (prev ? { ...prev, history: [...(prev.history || []), newEntry] } : prev));

      return { error: null };
    } catch (err: unknown) {
      if (isBlockedByClientError(err)) {
        console.warn('Could not add history entry (blocked by client):', err);
        return { error: new Error(blockedClientErrorMessage()) };
      }
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      isAdmin,
      addHistoryEntry,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
