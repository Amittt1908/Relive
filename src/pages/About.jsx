import { Link } from 'react-router-dom';
import { Repeat2, Scale, Fingerprint } from 'lucide-react';
import Reveal from '../components/Reveal';
import Magnetic from '../components/Magnetic';
import DemoNote from '../components/DemoNote';
import { ProductArt } from '../components/ProductArt';
import { team } from '../data/content';

export default function About() {
  return (
    <div>
      <section className="container-x pb-16 pt-12">
        <h1 className="text-mega max-w-[11ch]">Clothes outlive trends.</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <p className="text-xl leading-relaxed">RELIVE started with a wardrobe clear-out that had nowhere good to go. Half of it was too good to throw away, the rest too worn to sell anywhere we knew.</p>
          <p className="leading-relaxed text-graphite">So we imagined one place to buy pre-loved pieces, sell the ones you’ve outgrown, donate what still has warmth in it, and learn how to repair or recycle the rest. This site is a demo of that idea; the people and numbers on it are fictional.</p>
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div><h2 className="text-sm font-medium text-ivory/60">Mission</h2><p className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight">Keep every wearable garment in use for as long as it lasts.</p></div>
          <div><h2 className="text-sm font-medium text-ivory/60">Vision</h2><p className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight">A wardrobe where second-hand is the first choice.</p></div>
        </div>
      </section>

      <section className="container-x grid items-center gap-12 overflow-hidden py-20 lg:grid-cols-2" aria-labelledby="circ-h">
        <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden="true">
          <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-sage" />
          {[['tee', '#7E8F72', 'left-1/2 top-0 -translate-x-1/2'], ['tote', '#B85C3C', 'right-0 top-1/2 -translate-y-1/2'], ['jacket', '#7E97B3', 'bottom-0 left-1/2 -translate-x-1/2'], ['sneaker', '#6E6B3B', 'left-0 top-1/2 -translate-y-1/2']].map(([t, c, pos]) => (
            <div key={t} className={`absolute h-28 w-24 rounded-full bg-ivory p-2 ${pos}`}><ProductArt type={t} color={c} bg={false} className="h-full w-full" label="" /></div>
          ))}
          <p className="absolute inset-0 grid place-items-center font-display text-3xl font-extrabold">Buy, wear, resell, donate</p>
        </div>
        <div>
          <h2 id="circ-h" className="text-title">The circular wardrobe</h2>
          <p className="mt-4 max-w-md text-graphite">In a linear model, clothes are made, worn briefly and thrown out. In a circular one, each garment passes through more hands: bought second-hand, worn, resold or donated, repaired, and finally recycled into new fibre.</p>
        </div>
      </section>

      <section className="container-x pb-20" aria-labelledby="val-h">
        <h2 id="val-h" className="text-title">What we value</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {[[Repeat2, 'Reuse', 'The most sustainable garment is the one that already exists.'], [Scale, 'Responsibility', 'Honest condition notes, fair prices, clear labels on what’s demo and what’s real.'], [Fingerprint, 'Individuality', 'One-off pieces make wardrobes that look like nobody else’s.']].map(([Icon, t, b], i) => (
            <Reveal key={t} delay={i * 0.06}><Icon size={28} className="text-terra" aria-hidden="true" /><h3 className="mt-3 text-3xl">{t}</h3><p className="mt-2 text-graphite">{b}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream/60 py-20" aria-labelledby="team-h">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4"><h2 id="team-h" className="text-title">The team</h2><DemoNote>Fictional demo profiles</DemoNote></div>
          <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.name} className={i % 2 ? 'md:mt-12' : ''}>
                <div className="grid aspect-[4/5] place-items-center rounded-[28px] text-ivory" style={{ background: m.tone }}><span className="font-display text-6xl font-extrabold">{m.name.split(' ').map((w) => w[0]).join('')}</span></div>
                <p className="mt-3 font-semibold">{m.name}</p>
                <p className="text-sm text-graphite">{m.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-20" aria-labelledby="goals-h">
        <div className="flex flex-wrap items-end justify-between gap-4"><h2 id="goals-h" className="text-title">Impact goals</h2><DemoNote>Goals, not achieved results</DemoNote></div>
        <ul className="mt-10 divide-y divide-linen border-y border-linen">
          {[['Goal', 'Re-home 100,000 garments through resale'], ['Goal', 'Partner with 50 donation organisations'], ['Goal', 'Offer free repair guides for every common garment fix']].map(([k, v], i) => (
            <li key={v} className="flex items-baseline gap-6 py-6"><span className="font-display text-4xl font-extrabold text-sage">{i + 1}</span><span className="text-xl">{v}</span><span className="ml-auto hidden text-sm text-graphite sm:block">{k}</span></li>
          ))}
        </ul>
      </section>

      <section className="container-x">
        <div className="rounded-[40px] bg-sage-deep p-10 text-ivory sm:p-14">
          <h2 className="text-hero max-w-[12ch]">Join the movement.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic to="/shop" className="btn-light">Shop pre-loved</Magnetic>
            <Link to="/sell" className="btn border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink">Sell your clothes</Link>
            <Link to="/donate" className="btn border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink">Donate</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
