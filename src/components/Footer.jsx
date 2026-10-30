import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import Logo from './Logo';
import Newsletter from './Newsletter';

const COLS = [
  { title: 'Shop', links: [['Shop all', '/shop'], ['Women', '/category/women'], ['Men', '/category/men'], ['Vintage', '/category/vintage'], ['Under ₹499', '/category/under-499']] },
  { title: 'Give back', links: [['Sell clothes', '/sell'], ['Create a listing', '/sell/create'], ['Donate clothes', '/donate'], ['Reuse & recycle', '/reuse']] },
  { title: 'RELIVE', links: [['About', '/about'], ['Help center', '/help'], ['Contact', '/contact'], ['My orders', '/account/orders']] },
  { title: 'Policies', links: [['Privacy', '/policies/privacy'], ['Terms', '/policies/terms'], ['Returns', '/policies/returns'], ['Shipping', '/policies/shipping']] },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink pb-28 pt-16 text-ivory lg:pb-10">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-sm text-ivory/70">Give Fashion Another Life. A demo marketplace for buying, selling, donating and reusing clothes.</p>
            <div className="mt-8"><Newsletter dark /></div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.title}>
                <h2 className="mb-4 font-sans text-sm font-medium text-ivory/50">{c.title}</h2>
                <ul className="space-y-2.5">
                  {c.links.map(([l, to]) => <li key={to}><Link to={to} className="link-u text-ivory/90">{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-16 select-none font-display text-mega font-extrabold text-ivory/[0.07]" aria-hidden="true">Wear it again.</p>
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>RELIVE is a frontend demo. Products, sellers, reviews and figures are fictional.</p>
          <div className="flex gap-1">
            {[[Instagram, 'Instagram'], [Twitter, 'X / Twitter'], [Facebook, 'Facebook'], [Youtube, 'YouTube']].map(([Icon, l]) => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label={`${l} (demo link)`}><Icon size={18} /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
