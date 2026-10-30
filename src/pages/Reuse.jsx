import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Scissors, Recycle, Clock, Wrench, Leaf, ArrowLeftRight } from 'lucide-react';
import { ProductArt } from '../components/ProductArt';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import DemoNote from '../components/DemoNote';
import { reuseGuides } from '../data/content';
import { products } from '../data/products';

function BeforeAfter({ before, after, title }) {
  const [v, setV] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-cream">
        <div className="absolute inset-0 grid place-items-center bg-linen p-8">
          <ProductArt type={before[0]} color={before[1]} bg={false} className="h-full w-auto" label={`Before: ${before[2]}`} />
        </div>
        <div className="absolute inset-0 grid place-items-center bg-sage-light p-8" style={{ clipPath: `inset(0 0 0 ${v}%)` }}>
          <ProductArt type={after[0]} color={after[1]} bg={false} className="h-full w-auto" label={`After: ${after[2]}`} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${v}%` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-ivory"><ArrowLeftRight size={16} /></span>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs">Before</span>
        <span className="absolute right-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs">After</span>
      </div>
      <label className="mt-3 block text-sm text-graphite">
        <span className="sr-only">Compare before and after for {title}</span>
        <input type="range" min="0" max="100" value={v} onChange={(e) => setV(Number(e.target.value))} className="w-full accent-[#22211F]" />
      </label>
      <figcaption className="font-display text-xl font-extrabold tracking-tight">{title}</figcaption>
    </figure>
  );
}

const WAYS = [
  [Droplets, 'Wash cooler and less', 'Air garments between wears; wash only when they need it.'],
  [Wrench, 'Repair early', 'A loose seam takes five minutes now and a full repair later.'],
  [Clock, 'Rotate your wardrobe', 'Wearing pieces in rotation spreads the wear evenly.'],
  [Scissors, 'Alter, don’t abandon', 'A tailor can take in, hem or reshape a piece you’ve stopped wearing.'],
  [Recycle, 'Pass it on', 'Sell, swap or donate before it ever reaches a bin.'],
  [Leaf, 'Recycle the rest', 'Unwearable textiles can become insulation or stuffing.'],
];

export default function Reuse() {
  const related = products.filter((p) => ['rl-025', 'rl-013', 'rl-030', 'rl-006'].includes(p.id));
  return (
    <div>
      <section className="container-x pb-16 pt-12">
        <h1 className="text-mega max-w-[10ch]">Reuse. Repair. Recycle.</h1>
        <p className="mt-6 max-w-lg text-lg text-graphite">A practical guide to making clothes last longer, giving them new forms, and sending them somewhere useful at the very end.</p>
      </section>

      <section className="container-x grid gap-10 pb-20 md:grid-cols-2" aria-labelledby="ba-h">
        <h2 id="ba-h" className="sr-only">Before and after</h2>
        <BeforeAfter title="Old shirt into a market tote" before={['shirt', '#9DB0C8', 'worn chambray shirt']} after={['tote', '#9DB0C8', 'shirt sewn into a tote bag']} />
        <BeforeAfter title="Retired jeans into patchwork" before={['jeans', '#3E4C6B', 'worn jeans']} after={['tote', '#6A7FA0', 'patchwork denim tote']} />
      </section>

      <section className="bg-cream/60 py-20" aria-labelledby="care-h">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_2fr]">
          <h2 id="care-h" className="text-title">Clothing care guides</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {reuseGuides.care.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.06}><h3 className="text-xl">{g.title}</h3><p className="mt-2 text-graphite">{g.body}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_2fr]" aria-labelledby="repair-h">
        <h2 id="repair-h" className="text-title">Repair and restoration</h2>
        <div className="divide-y divide-linen border-y border-linen">
          {reuseGuides.repair.map((g) => (
            <div key={g.title} className="grid gap-2 py-6 sm:grid-cols-[220px_1fr]"><h3 className="text-xl">{g.title}</h3><p className="text-graphite">{g.body}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory" aria-labelledby="diy-h">
        <div className="container-x">
          <h2 id="diy-h" className="text-title">DIY upcycling tutorials</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {reuseGuides.diy.map((d) => (
              <article key={d.title} className="border-t border-white/20 pt-6">
                <div className="flex items-baseline justify-between"><h3 className="text-2xl">{d.title}</h3><span className="text-sm text-ivory/60">{d.time}</span></div>
                <ol className="mt-4 space-y-2">
                  {d.steps.map((s, i) => <li key={s} className="flex gap-3 text-ivory/80"><span className="font-display font-extrabold text-terra-light">{i + 1}</span>{s}</li>)}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20" aria-labelledby="ways-h">
        <h2 id="ways-h" className="text-title max-w-[14ch]">Ways to extend a garment’s life</h2>
        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {WAYS.map(([Icon, t, b]) => (
            <li key={t} className="flex gap-4"><Icon size={26} className="mt-1 shrink-0 text-sage-deep" aria-hidden="true" /><div><h3 className="font-sans text-lg font-semibold">{t}</h3><p className="text-graphite">{b}</p></div></li>
          ))}
        </ul>
      </section>

      <section className="container-x grid gap-10 pb-20 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="rec-h">
        <div>
          <h2 id="rec-h" className="text-title">Textile recycling, briefly</h2>
          <ul className="mt-6 space-y-3">{reuseGuides.recycle.map((r) => <li key={r} className="flex gap-3 text-graphite"><Recycle size={18} className="mt-1 shrink-0 text-olive" aria-hidden="true" />{r}</li>)}</ul>
        </div>
        <div className="self-start rounded-[32px] bg-terra-light/40 p-8">
          <p className="font-display text-6xl font-extrabold">2×</p>
          <p className="mt-2 text-graphite">An illustrative example: wearing a garment twice as long means one fewer replacement over the same period.</p>
          <DemoNote className="mt-4">Illustrative metric, not a verified statistic</DemoNote>
        </div>
      </section>

      <section className="container-x" aria-labelledby="rp-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="rp-h" className="text-title">Upcycled and handmade on the rail</h2>
          <Link to="/donate" className="btn-sage">Donate what you won’t wear</Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{related.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
      </section>
    </div>
  );
}
