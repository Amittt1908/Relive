import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

// Wordmark: the R sits inside a looping two-arrow ring, the recycling mark.
export function LogoMark({ size = 40, animate = true, dark = false }) {
  const reduce = useReducedMotion();
  const ink = dark ? '#F6F2EA' : '#22211F';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <motion.g
        style={{ originX: '24px', originY: '24px' }}
        animate={animate && !reduce ? { rotate: 360 } : undefined}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <path d="M24 4 A20 20 0 0 1 43 19" fill="none" stroke="#7E8F72" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M43 19 l-1 -6 M43 19 l-6 -1" stroke="#7E8F72" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M24 44 A20 20 0 0 1 5 29" fill="none" stroke="#B85C3C" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M5 29 l1 6 M5 29 l6 1" stroke="#B85C3C" strokeWidth="3.6" strokeLinecap="round" />
      </motion.g>
      <text x="24" y="25" textAnchor="middle" dominantBaseline="central" fontFamily="'Bricolage Grotesque', sans-serif" fontWeight="800" fontSize="26" fill={ink}>R</text>
    </svg>
  );
}

export default function Logo({ dark = false, className = '' }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-0.5 ${className}`} aria-label="RELIVE home">
      <LogoMark dark={dark} size={38} />
      <span className={`font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.04em] ${dark ? 'text-ivory' : 'text-ink'}`}>ELIVE</span>
    </Link>
  );
}
