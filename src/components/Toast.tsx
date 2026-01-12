import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastContextType {
  toast: (message: string, timeoutMs?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const toast = useCallback((msg: string, timeoutMs = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), timeoutMs);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-gray-900 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
            {message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx.toast;
}

// Safe hook that returns a no-op if outside provider (useful for tests)
export function useToastSafe() {
  try {
    return useToast();
  } catch (e) {
    return () => {};
  }
}
