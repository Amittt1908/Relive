import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SearchBox from '../components/SearchBox';
import ProductCard from '../components/ProductCard';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import Rating from '../components/Rating';
import { ProductArt } from '../components/ProductArt';
import { DonationCampaign } from './Landing';
import { products } from '../data/products';
import { categories, sellers, trendingSearches, seasonalEdits } from '../data/content';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

function Rail({ items }) {
  return (
    <ul className="scrollbar-none -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      {items.map((p) => <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[22%]"><ProductCard product={p} /></li>)}
    </ul>
  );
}

export default function Home() {
  const { isAuthed, profile } = useAuth();
  const { recent, getProduct, wishlist } = useStore();
  const first = isAuthed ? profile.name.split(' ')[0] : null;
  const byNew = [...products].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  const newArrivals = byNew.slice(0, 8);
  const preloved = products.filter((p) => ['Gently Used', 'Like New'].includes(p.condition)).slice(0, 8);
  const budget = products.filter((p) => p.price <= 699).sort((a, b) => a.price - b.price);
  const recentItems = recent.map(getProduct).filter(Boolean).slice(0, 8);
  const favs = isAuthed ? profile.favorites : [];
  const recommended = products
    .filter((p) => p.stock !== 'Sold out' && !wishlist.includes(p.id))
    .map((p) => ({ p, score: p.popularity + (p.tags.some((t) => favs.includes(t)) ? 40 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p);
  const recentlyAdded = byNew.slice(8, 12);
  const trendingSellers = [...sellers].sort((a, b) => b.sales - a.sales).slice(0, 4);

  return (
    <div className="pt-10">
      <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <h1 className="text-hero max-w-[14ch]">{first ? `Welcome back, ${first}.` : 'Welcome to RELIVE.'}</h1>
          <p className="mt-4 max-w-md text-lg text-graphite">{first ? 'Fresh pieces landed since your last visit. Here’s what’s new on the rail.' : 'Browse freely as a guest, or sign in to save orders, listings and donations.'}</p>
        </div>
        <div>
          <SearchBox size="lg" />
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="mr-1 self-center text-sm text-graphite">Trending:</span>
            {trendingSearches.slice(0, 5).map((t) => <Link key={t} to={`/shop?q=${encodeURIComponent(t)}`} className="chip !min-h-[34px] text-xs">{t}</Link>)}
          </div>
        </div>
      </section>

      <nav aria-label="Categories" className="container-x mb-20">
        <ul className="scrollbar-none -mx-5 flex gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0 lg:grid-cols-9">
          {categories.map((c) => (
            <li key={c.slug} className="w-24 shrink-0 sm:w-auto">
              <Link to={`/category/${c.slug}`} className="group block text-center">
                <span className="block aspect-square overflow-hidden rounded-full p-3 transition-transform duration-300 group-hover:-translate-y-1" style={{ background: c.tone }}>
                  <ProductArt type={c.art} color="#4F5E47" bg={false} className="h-full w-full" label="" />
                </span>
                <span className="mt-2 block text-sm font-medium">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="container-x mb-24"><SectionHead title="New arrivals" intro="Listed in the last few days." link="/shop" /><Rail items={newArrivals} /></section>

      {recentItems.length > 0 && (
        <section className="container-x mb-24"><SectionHead title="Recently viewed" /><Rail items={recentItems} /></section>
      )}

      <section className="container-x mb-24"><SectionHead title={first ? 'Picked for you' : 'Recommended'} intro={first ? `Based on your favourite categories: ${favs.join(', ') || 'none yet'}.` : 'Popular with other demo shoppers.'} />
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{recommended.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
      </section>

      <section className="mb-24 bg-cream/60 py-20">
        <div className="container-x">
          <SectionHead title="Seasonal edits" intro="Small collections around a moment." />
          <div className="grid gap-6 lg:grid-cols-3">
            {seasonalEdits.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.06}>
                <div className="group overflow-hidden rounded-[32px] p-6" style={{ background: e.tone }}>
                  <div className="relative h-56">
                    {e.ids.map((id, k) => {
                      const p = products.find((x) => x.id === id);
                      return (
                        <Link key={id} to={`/product/${id}`} className="absolute top-0 h-48 w-36 transition-transform duration-500 hover:z-10 hover:-translate-y-3" style={{ left: `${k * 26}%`, rotate: `${(k - 1) * 7}deg` }} aria-label={p.name}>
                          <ProductArt type={p.art} color={p.color.hex} bg={false} className="h-full w-full drop-shadow-lg" label={p.name} />
                        </Link>
                      );
                    })}
                  </div>
                  <h3 className="text-2xl tracking-tight">{e.title}</h3>
                  <p className="mt-1 text-sm text-graphite">{e.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x mb-24"><SectionHead title="Pre-loved collection" intro="Worn, cared for, ready again." link="/shop" /><Rail items={preloved} /></section>

      <section className="container-x mb-24 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-title">Budget-friendly finds</h2>
          <p className="mt-3 max-w-sm text-graphite">Under ₹700 and still full of life.</p>
          <Link to="/category/under-499" className="btn-ghost mt-6">Shop under ₹499 <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3">{budget.slice(0, 6).map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
      </section>

      <section className="container-x mb-24">
        <SectionHead title="Trending sellers" intro="Fictional demo sellers; ratings are sample data." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingSellers.map((s) => (
            <li key={s.id} className="flex items-center gap-4 rounded-full border border-linen p-2 pr-5">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-display text-2xl font-extrabold text-ivory" style={{ background: s.tone }}>{s.name[0]}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{s.name}</span>
                <span className="block text-sm text-graphite">{s.sales} demo sales</span>
                <Rating value={s.rating} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x mb-24"><SectionHead title="Recently added" link="/shop" /><ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{recentlyAdded.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul></section>

      <DonationCampaign />
    </div>
  );
}
