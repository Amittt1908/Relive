import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LogoMark } from './Logo';

// Short branded intro, shown once per browser session.
export default function Loader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('relive:intro'); } catch { return false; }
  });
  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem('relive:intro', '1'); } catch { /* ignore */ }
    const t = setTimeout(() => setShow(false), reduce ? 300 : 1700);
    return () => clearTimeout(t);
  }, [show, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-ink text-ivory" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} role="status" aria-label="Loading RELIVE">
          <div className="flex flex-col items-center">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
              <LogoMark size={88} dark />
            </motion.div>
            <div className="mt-4 overflow-hidden">
              <motion.p initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="font-display text-5xl font-extrabold tracking-[-0.05em]">RELIVE</motion.p>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }} className="mt-2 text-sm">Give Fashion Another Life.</motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
