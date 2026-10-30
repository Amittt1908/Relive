import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, AlertCircle, X } from 'lucide-react';

const ToastCtx = createContext(null);

const ICONS = { success: Check, info: Info, error: AlertCircle };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, tone = 'success') => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-2), { id, message, tone }]);
      setTimeout(() => dismiss(id), 3400);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[90] flex flex-col items-center gap-2 px-4 md:bottom-8 md:items-end md:pr-8"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = ICONS[t.tone] || Info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-ivory shadow-lift"
                role="status"
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${t.tone === 'error' ? 'bg-terra' : 'bg-sage'}`}>
                  <Icon size={15} aria-hidden="true" />
                </span>
                <span className="flex-1">{t.message}</span>
                <button onClick={() => dismiss(t.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Dismiss notification">
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
