import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Button/link that leans gently toward the pointer on desktop.
export default function Magnetic({ to, onClick, className = 'btn-primary', children, strength = 0.28, type = 'button', disabled, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };

  const inner = <span className="inline-flex items-center gap-2">{children}</span>;

  return (
    <motion.span ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x: sx, y: sy }} className="inline-flex" data-cursor="grow">
      {to ? (
        <Link to={to} className={className} {...rest}>{inner}</Link>
      ) : (
        <button type={type} onClick={onClick} className={className} disabled={disabled} {...rest}>{inner}</button>
      )}
    </motion.span>
  );
}
