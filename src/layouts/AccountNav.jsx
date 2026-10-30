import { NavLink } from 'react-router-dom';

const LINKS = [
  ['/account/profile', 'Profile'],
  ['/account/orders', 'Orders'],
  ['/seller/dashboard', 'Listings'],
  ['/account/donations', 'Donations'],
  ['/wishlist', 'Wishlist'],
];

export default function AccountNav() {
  return (
    <nav aria-label="Account" className="scrollbar-none -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      {LINKS.map(([to, l]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `chip shrink-0 ${isActive ? 'chip-active' : ''}`}>{l}</NavLink>
      ))}
    </nav>
  );
}
