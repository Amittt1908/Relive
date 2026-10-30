import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Search, Shirt, Repeat2, HeartHandshake } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import Scene3D from '../components/Scene3D';
import Reveal from '../components/Reveal';
import ProductCard from '../components/ProductCard';
import { ProductArt } from '../components/ProductArt';
import Rating from '../components/Rating';
import Newsletter from '../components/Newsletter';
import DemoNote from '../components/DemoNote';
import { products } from '../data/products';
import { categories, sellers, testimonials, demoStats } from '../data/content';

export function HeroFallback() {
  const items = [
    ['jacket', '#7E97B3', 'left-[4%] top-[18%] w-[22%]', '-8deg'],
    ['dress', '#B85C3C', 'right-[5%] top-[14%] w-[20%]', '7deg'],
    ['sneaker', '#E8E4D8', 'left-[14%] bottom-[8%] w-[20%]', '-4deg'],
    ['tote', '#9A5A34', 'right-[12%] bottom-[6%] w-[16%]', '6deg'],
    ['tee', '#7E8F72', 'left-[42%] top-[4%] w-[14%]', '3deg'],
  ];
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {items.map(([t, c, pos, r], i) => (
        <div key={t} className={`animate-floaty absolute aspect-[5/6] ${pos}`} style={{ '--r': r, animationDelay: `${i * 0.8}s` }}>
          <ProductArt type={t} color={c} bg={false} className="h-full w-full drop-shadow-[0_24px_24px_rgba(34,33,31,0.18)]" label="" />
        </div>
      ))}
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const words = ['Fashion', 'Deserves', 'Another', 'Life.'];
  return (
    <section className="relative isolate -mt-[68px] flex min-h-[100svh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#E9E1D3_0%,#F6F2EA_55%)] pt-[68px]">
      <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Scene3D name="hero" className="h-full w-full" fallback={<HeroFallback />} />
      </motion.div>
      <div className="container-x relative pb-16 pt-8">
        <h1 className="text-mega pointer-events-none max-w-[11ch] font-extrabold">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-1">
              <motion.span className={`inline-block ${i === 2 ? 'pl-[0.6em]' : ''}`} initial={reduce ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.09, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }} className="mt-8 max-w-md rounded-[26px] bg-ivory/70 p-5 backdrop-blur-md sm:ml-[18%]">
          <p className="text-lg leading-relaxed text-graphite">Buy pre-loved pieces, sell what you no longer wear, and donate the rest. Every garment gets a second chapter.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic to="/shop">Explore Collection <ArrowUpRight size={18} aria-hidden="true" /></Magnetic>
            <Magnetic to="/sell" className="btn-ghost">Give Your Clothes a New Home</Magnetic>
          </div>
        </motion.div>
      </div>
      <p className="absolute bottom-6 right-5 hidden text-sm text-graphite md:block sm:right-8 lg:right-12">Move your cursor. The rail follows.</p>
    </section>
  );
}

function Marquee() {
  const text = 'Wear it again. Love it longer. ';
  return (
    <div className="overflow-hidden border-y border-ink bg-sage-deep py-4 text-ivory" aria-hidden="true">
      <div className="animate-marquee flex w-max whitespace-nowrap font-display text-3xl font-extrabold tracking-tight">
        {Array.from({ length: 8 }).map((_, i) => <span key={i} className="pr-8">{text}<span className="text-terra-light">✺</span></span>)}
      </div>
    </div>
  );
}

function Featured() {
  const pick = ['rl-001', 'rl-004', 'rl-003', 'rl-021', 'rl-013'].map((id) => products.find((p) => p.id === id));
  const [lead, ...rest] = pick;
  return (
    <section className="container-x py-24" aria-labelledby="featured-h">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <h2 id="featured-h" className="text-hero max-w-[10ch]">This week on the rail</h2>
          <p className="mt-4 max-w-sm text-graphite">Hand-picked from the demo catalogue: one-offs that won’t be restocked, because they were only ever made once for you.</p>
          <div className="mt-10 max-w-md"><ProductCard product={lead} /></div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:pt-24">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05} className={i % 2 ? 'mt-12' : ''}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
      <div className="mt-20 flex justify-center"><Link to="/shop" className="btn-ghost">See the full catalogue <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </section>
  );
}

function CategoryIndex() {
  const [hover, setHover] = useState(categories[0]);
  const list = categories.slice(0, 7);
  return (
    <section className="bg-cream/60 py-24" aria-labelledby="cat-h">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 id="cat-h" className="mb-8 text-sm font-medium text-graphite">Shop by category</h2>
          <ul>
            {list.map((c) => (
              <li key={c.slug} className="border-t border-ink/15 last:border-b">
                <Link to={`/category/${c.slug}`} onMouseEnter={() => setHover(c)} onFocus={() => setHover(c)} className="group flex items-baseline justify-between gap-4 py-3 sm:py-4">
                  <span className="font-display text-[clamp(1.8rem,4.8vw,3.8rem)] font-extrabold leading-none tracking-[-0.04em] transition-[color,transform] duration-300 group-hover:translate-x-3 group-hover:text-sage-deep">{c.name}</span>
                  <span className="hidden max-w-[22ch] text-right text-sm text-graphite sm:block">{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sticky top-28 hidden h-[460px] self-start overflow-hidden rounded-blob lg:block" style={{ background: hover.tone, transition: 'background .5s' }}>
          <motion.div key={hover.slug} initial={{ opacity: 0, scale: 0.9, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="h-full w-full p-10">
            <ProductArt type={hover.art} color="#4F5E47" bg={false} className="h-full w-full drop-shadow-xl" label={`${hover.name} category illustration`} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: 'Discover', body: 'Browse one-off pieces with honest condition notes, sizes and seller details.' },
    { icon: Shirt, title: 'Rewear', body: 'Order through a simulated checkout, wear it, love it. No new garment needed.' },
    { icon: Repeat2, title: 'Relove', body: 'When you’re done, list it again or donate it. The loop keeps going.' },
  ];
  return (
    <section className="container-x py-24" aria-labelledby="how-h">
      <Reveal><h2 id="how-h" className="text-hero max-w-[12ch]">How RELIVE works</h2></Reveal>
      <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.08} className={`relative ${i === 1 ? 'md:mt-16' : i === 2 ? 'md:mt-32' : ''}`}>
            <span className="font-display text-[5rem] font-extrabold leading-none text-sage/25" aria-hidden="true">{i + 1}</span>
            <div className="-mt-10 pl-4">
              <s.icon size={26} className="text-terra" aria-hidden="true" />
              <h3 className="mt-3 text-3xl tracking-tight">{s.title}</h3>
              <p className="mt-2 max-w-xs text-graphite">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-linen bg-ivory py-16" aria-labelledby="stats-h">
      <div className="container-x">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 id="stats-h" className="font-sans text-base font-medium text-graphite">If RELIVE were live, the loop might look like this</h2>
          <DemoNote>Illustrative demo estimates, not measured results</DemoNote>
        </div>
        <dl className="grid gap-8 sm:grid-cols-3">
          {demoStats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em]">{s.value}<sup className="ml-1 text-lg text-terra">*</sup></dd>
              <dt className="mt-2 text-graphite">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Sellers() {
  return (
    <section className="container-x py-24" aria-labelledby="sellers-h">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 id="sellers-h" className="text-title max-w-[14ch]">Wardrobes worth following</h2>
        <p className="max-w-xs text-sm text-graphite">Fictional demo sellers. Ratings are sample data, not verified.</p>
      </div>
      <ul className="scrollbar-none -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
        {sellers.map((s, i) => (
          <li key={s.id} className={`w-44 shrink-0 snap-start sm:w-auto ${i % 2 ? 'lg:mt-12' : ''}`}>
            <div className="grid aspect-square place-items-center rounded-full text-ivory" style={{ background: s.tone }}>
              <span className="font-display text-5xl font-extrabold">{s.name[0]}</span>
            </div>
            <h3 className="mt-4 font-sans text-base font-semibold">{s.name}</h3>
            <p className="text-sm text-graphite">{s.city}, {s.sales} demo sales</p>
            <Rating value={s.rating} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DonationCampaign() {
  return (
    <section className="relative overflow-hidden bg-sage-deep text-ivory" aria-labelledby="donate-h">
      <div className="container-x grid items-center gap-8 py-20 lg:grid-cols-2">
        <div>
          <HeartHandshake size={34} className="text-terra-light" aria-hidden="true" />
          <h2 id="donate-h" className="text-hero mt-4 max-w-[12ch]">The winter coat drive is open</h2>
          <p className="mt-5 max-w-md text-ivory/80">Clean, warm layers you don’t reach for can go to fictional demo partners that pass them on. Schedule a pickup or drop-off in two minutes.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic to="/donate" className="btn-light">Start a Donation</Magnetic>
            <Link to="/reuse" className="btn border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink">Reuse ideas</Link>
          </div>
          <p className="mt-6 text-sm text-ivory/60">Demo campaign. No real pickups are scheduled.</p>
        </div>
        <Scene3D name="donation" className="h-[360px] sm:h-[440px]" fallback={
          <div className="grid h-full place-items-center"><div className="animate-floaty h-64 w-52"><ProductArt type="coat" color="#E9C3B2" bg={false} className="h-full w-full" label="Coat illustration" /></div></div>
        } />
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-x py-24" aria-labelledby="t-h">
      <h2 id="t-h" className="mb-12 text-sm font-medium text-graphite">What people say (fictional demo personas)</h2>
      <div className="space-y-16">
        {testimonials.map((t, i) => (
          <Reveal key={t.name}>
            <figure className={`max-w-3xl ${i % 2 ? 'ml-auto text-right' : ''}`}>
              <blockquote className="font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.02em]">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-graphite">{t.name}, {t.role}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
      <Marquee />
      <Featured />
      <CategoryIndex />
      <HowItWorks />
      <Stats />
      <Sellers />
      <DonationCampaign />
      <Testimonials />
      <section className="container-x" aria-labelledby="nl-h">
        <div className="grid items-center gap-8 rounded-[40px] bg-terra-light/50 p-8 sm:p-12 lg:grid-cols-2">
          <h2 id="nl-h" className="text-title max-w-[14ch]">First pick of every drop, once a week</h2>
          <Newsletter />
        </div>
      </section>
    </>
  );
}
