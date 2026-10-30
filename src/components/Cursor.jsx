import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// Desktop-only custom cursor: a dot plus a trailing ring that grows over interactive elements.
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches && !reduce);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) { document.body.classList.remove('has-cursor'); return; }
    document.body.classList.add('has-cursor');
    const move = (e) => {
      x.set(e.clientX); y.set(e.clientY); setVisible(true);
      const t = e.target;
      setHover(!!(t.closest && t.closest('a, button, [role="button"], select, label, [data-cursor="grow"]')));
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.body.classList.remove('has-cursor');
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ x, y }} />
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/60 mix-blend-multiply"
        style={{ x: rx, y: ry }}
        animate={{ width: hover ? 56 : 30, height: hover ? 56 : 30, backgroundColor: hover ? 'rgba(126,143,114,0.25)' : 'rgba(0,0,0,0)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </div>
  );
}
