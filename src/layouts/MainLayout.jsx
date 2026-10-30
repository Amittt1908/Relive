import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function MainLayout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  return (
    <>
      <Navbar />
      <motion.main
        id="main"
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[60vh]"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </>
  );
}

export function BareLayout() {
  const { pathname } = useLocation();
  return (
    <motion.main id="main" key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Outlet />
    </motion.main>
  );
}
