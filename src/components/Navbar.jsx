import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Home, Store, LogOut, Package, Tag, HandHeart, Settings } from 'lucide-react';
import Logo from './Logo';
import SearchBox from './SearchBox';
import { ProductArt } from './ProductArt';
import { categories } from '../data/content';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MAIN = [
  { to: '/home', label: 'Home' },
  { to: '/sell', label: 'Sell' },
  { to: '/donate', label: 'Donate' },
  { to: '/reuse', label: 'Reuse' },
  { to: '/about', label: 'About' },
];

const ACCOUNT = [
  { to: '/account/profile', label: 'My Profile', icon: Settings },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/seller/dashboard', label: 'My Listings', icon: Tag },
  { to: '/account/donations', label: 'My Donations', icon: HandHeart },
];

function Badge({ n }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span key={n} initial={{ scale: 0.3 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 18 }} className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-terra px-1 text-[10px] font-bold text-ivory">
          {n > 99 ? '99+' : n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

const navCls = ({ isActive }) => `link-u py-2 text-[0.95rem] ${isActive ? 'font-semibold' : 'text-ink/80 hover:text-ink'}`;

function useOutside(ref, onOut, active) {
  useEffect(() => {
    if (!active) return;
    const h = (e) => ref.current && !ref.current.contains(e.target) && onOut();
    const k = (e) => e.key === 'Escape' && onOut();
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [ref, onOut, active]);
}

export default function Navbar() {
  const { cartCount, wishlist } = useStore();
  const { isAuthed, profile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [shopOpen, setShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shopRef = useRef(null);
  const profRef = useRef(null);

  useOutside(shopRef, () => setShopOpen(false), shopOpen);
  useOutside(profRef, () => setProfileOpen(false), profileOpen);

  useEffect(() => {
    setShopOpen(false); setProfileOpen(false); setSearchOpen(false); setDrawer(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer, searchOpen]);

  const doLogout = () => {
    logout();
    toast('You’re signed out of the demo.', 'info');
    navigate('/login');
  };

  const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <header className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${scrolled ? 'bg-ivory/80 shadow-[0_1px_0_rgba(34,33,31,0.08)] backdrop-blur-xl' : 'bg-ivory/40 backdrop-blur-md'}`} style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
        <nav className="container-x flex h-[68px] items-center justify-between gap-4" aria-label="Main">
          <Logo />

          <div className="hidden items-center gap-7 lg:flex">
            <NavLink to="/home" className={navCls}>Home</NavLink>
            <div ref={shopRef} className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <button type="button" className="flex items-center gap-1 py-2 text-[0.95rem] text-ink/80 hover:text-ink" aria-expanded={shopOpen} aria-haspopup="true" onClick={() => setShopOpen((o) => !o)}>
                Shop <ChevronDown size={15} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {shopOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3">
                    <div className="grid grid-cols-[1fr_190px] gap-4 rounded-[28px] border border-linen bg-ivory p-4 shadow-lift">
                      <ul className="grid grid-cols-2 gap-1">
                        {categories.map((c) => (
                          <li key={c.slug}>
                            <Link to={`/category/${c.slug}`} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-cream">
                              <span className="h-10 w-9 overflow-hidden rounded-lg" style={{ background: c.tone }}><ProductArt type={c.art} color="#4F5E47" bg={false} className="h-full w-full" label="" /></span>
                              <span className="text-sm font-medium">{c.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link to="/shop" className="flex flex-col justify-between rounded-2xl bg-ink p-4 text-ivory">
                        <span className="font-display text-2xl font-extrabold leading-none tracking-tight">Shop everything</span>
                        <span className="text-sm text-ivory/70">30 pre-loved pieces in the demo catalogue</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {MAIN.slice(1).map((l) => <NavLink key={l.to} to={l.to} className={navCls}>{l.label}</NavLink>)}
          </div>

          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setSearchOpen(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream" aria-label="Search"><Search size={20} /></button>
            <Link to="/wishlist" className="relative hidden h-11 w-11 place-items-center rounded-full hover:bg-cream sm:grid" aria-label={`Wishlist, ${wishlist.length} items`}>
              <Heart size={20} /><Badge n={wishlist.length} />
            </Link>
            <Link to="/cart" className="relative hidden h-11 w-11 place-items-center rounded-full hover:bg-cream sm:grid" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingBag size={20} /><Badge n={cartCount} />
            </Link>
            <div ref={profRef} className="relative hidden lg:block">
              {isAuthed ? (
                <>
                  <button type="button" onClick={() => setProfileOpen((o) => !o)} className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-sage-deep text-sm font-bold text-ivory" aria-haspopup="menu" aria-expanded={profileOpen} aria-label="Account menu">
                    {initials}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div role="menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-[calc(100%+10px)] w-60 rounded-3xl border border-linen bg-ivory p-2 shadow-lift">
                        <p className="px-3 pb-2 pt-2 text-sm"><span className="block font-semibold">{profile.name}</span><span className="text-graphite">Demo session</span></p>
                        {ACCOUNT.map(({ to, label, icon: Icon }) => (
                          <Link key={to} to={to} role="menuitem" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm hover:bg-cream"><Icon size={16} aria-hidden="true" />{label}</Link>
                        ))}
                        <button type="button" role="menuitem" onClick={doLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-terra hover:bg-cream"><LogOut size={16} aria-hidden="true" />Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to="/login" className="btn-primary btn-sm ml-2">Sign in</Link>
              )}
            </div>
            <button type="button" onClick={() => setDrawer(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream lg:hidden" aria-label="Open menu" aria-expanded={drawer}><Menu size={22} /></button>
          </div>
        </nav>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div className="fixed inset-0 z-[70] bg-ivory/95 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Search" onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}>
            <div className="container-x pt-[calc(1.5rem+env(safe-area-inset-top,0px))]">
              <div className="flex justify-end"><button onClick={() => setSearchOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream" aria-label="Close search"><X size={22} /></button></div>
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="mx-auto mt-8 max-w-2xl">
                <h2 className="mb-6 text-hero">Find your next favourite.</h2>
                <SearchBox autoFocus size="lg" onDone={() => setSearchOpen(false)} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-ink/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside className="fixed bottom-0 right-0 top-0 z-[61] flex w-[86%] max-w-sm flex-col overflow-y-auto bg-ivory px-6 pb-8 lg:hidden" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} aria-label="Menu" role="dialog" aria-modal="true">
              <div className="flex items-center justify-between"><Logo /><button onClick={() => setDrawer(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream" aria-label="Close menu"><X size={22} /></button></div>
              <nav className="mt-8 flex flex-col" aria-label="Mobile">
                {[{ to: '/shop', label: 'Shop all' }, ...MAIN].map((l) => (
                  <NavLink key={l.to} to={l.to} className={({ isActive }) => `border-b border-linen py-3 font-display text-3xl font-extrabold tracking-tight ${isActive ? 'text-sage-deep' : ''}`}>{l.label}</NavLink>
                ))}
              </nav>
              <p className="mt-6 text-sm text-graphite">Categories</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}`} className="chip">{c.name}</Link>)}
              </div>
              <p className="mt-6 text-sm text-graphite">Account</p>
              <div className="mt-2 flex flex-col">
                {isAuthed ? (
                  <>
                    {ACCOUNT.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="flex min-h-[44px] items-center gap-3 text-base"><Icon size={18} aria-hidden="true" />{label}</Link>)}
                    <button onClick={doLogout} className="flex min-h-[44px] items-center gap-3 text-left text-base text-terra"><LogOut size={18} aria-hidden="true" />Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-primary mt-2">Sign in</Link>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-graphite">
                <Link to="/help">Help</Link><Link to="/contact">Contact</Link><Link to="/policies/privacy">Privacy</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-linen bg-ivory/90 backdrop-blur-xl lg:hidden" aria-label="Quick">
        <ul className="grid grid-cols-5">
          {[
            { to: '/home', label: 'Home', icon: Home },
            { to: '/shop', label: 'Shop', icon: Store },
            { to: '/wishlist', label: 'Wishlist', icon: Heart, n: wishlist.length },
            { to: '/cart', label: 'Cart', icon: ShoppingBag, n: cartCount },
            { to: isAuthed ? '/account/profile' : '/login', label: 'Profile', icon: User },
          ].map(({ to, label, icon: Icon, n }) => (
            <li key={label}>
              <NavLink to={to} className={({ isActive }) => `flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-[11px] ${isActive ? 'text-sage-deep font-semibold' : 'text-graphite'}`}>
                <span className="relative"><Icon size={21} aria-hidden="true" />{n != null && <Badge n={n} />}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
