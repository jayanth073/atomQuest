'use client';

import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-subtle border bg-white animate-slide-up ${
              t.type === 'success' ? 'border-emerald-200 text-emerald-800' :
              t.type === 'error' ? 'border-red-200 text-red-800' :
              'border-surface-200 text-surface-800'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
            {t.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
            {t.type === 'info' && <Info size={16} className="text-surface-500" />}
            <span className="text-sm font-medium">{t.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}