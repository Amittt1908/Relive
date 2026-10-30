import { Link } from 'react-router-dom';
import { Camera, PenLine, Truck, Wallet, Leaf, Users, Check, X, ArrowUpRight } from 'lucide-react';
import Magnetic from '../../components/Magnetic';
import Reveal from '../../components/Reveal';
import { ProductArt } from '../../components/ProductArt';
import { AccordionItem } from '../../components/Accordion';
import DemoNote from '../../components/DemoNote';

const STEPS = [
  { icon: Camera, title: 'Photograph it', body: 'Daylight, plain background, front, back and any flaws. Up to four photos.' },
  { icon: PenLine, title: 'Describe it honestly', body: 'Brand, size, material and condition. Honest notes mean happier buyers.' },
  { icon: Truck, title: 'Choose a handover', body: 'Pick doorstep pickup, a partner drop point, or ship it yourself.' },
  { icon: Wallet, title: 'Get paid', body: 'In a live version, earnings would land after delivery. Here, it’s a demo tally.' },
];

export default function Sell() {
  return (
    <div>
      <section className="container-x grid items-center gap-10 pb-20 pt-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="text-hero max-w-[13ch]">Your Wardrobe Has More Stories to Tell.</h1>
          <p className="mt-5 max-w-md text-lg text-graphite">List pieces you’ve outgrown in a few minutes. Someone is looking for exactly that jacket.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic to="/sell/create">Start Selling <ArrowUpRight size={18} aria-hidden="true" /></Magnetic>
            <Link to="/seller/dashboard" className="btn-ghost">Seller dashboard</Link>
          </div>
          <DemoNote className="mt-6">Listings are saved in your browser as demo listings</DemoNote>
        </div>
        <div className="relative h-[380px]">
          {[['jacket', '#7E97B3', 'left-0 top-0', '-8deg'], ['dress', '#B85C3C', 'right-0 top-8', '6deg'], ['sneaker', '#E8E4D8', 'left-[22%] bottom-0', '-3deg']].map(([t, c, pos, r], i) => (
            <div key={t} className={`animate-floaty absolute h-60 w-48 ${pos}`} style={{ '--r': r, animationDelay: `${i}s` }}><ProductArt type={t} color={c} bg={false} className="h-full w-full drop-shadow-xl" label="" /></div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory" aria-labelledby="how-sell">
        <div className="container-x">
          <h2 id="how-sell" className="text-title">How selling works</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06}>
                <span className="font-display text-6xl font-extrabold text-ivory/20">{i + 1}</span>
                <s.icon size={24} className="mt-3 text-terra-light" aria-hidden="true" />
                <h3 className="mt-3 text-2xl">{s.title}</h3>
                <p className="mt-2 text-ivory/70">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x grid gap-14 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-title">Why sell on RELIVE</h2>
          <ul className="mt-8 space-y-6">
            {[[Wallet, 'Keep more of the price', 'A simple, flat demo commission instead of tiered fees.'], [Leaf, 'Keep clothes in use', 'Every resale is one less garment headed for landfill.'], [Users, 'Buyers who care', 'People here are shopping second-hand on purpose.']].map(([Icon, t, b]) => (
              <li key={t} className="flex gap-4"><Icon size={24} className="mt-1 shrink-0 text-sage-deep" aria-hidden="true" /><div><h3 className="font-sans text-lg font-semibold">{t}</h3><p className="text-graphite">{b}</p></div></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-title">What you can list</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Tops & shirts', 'Dresses', 'Jeans & trousers', 'Jackets & coats', 'Knitwear', 'Ethnic wear', 'Shoes', 'Bags', 'Accessories', 'Vintage'].map((c) => <span key={c} className="chip">{c}</span>)}
          </div>
          <h3 className="mt-10 text-2xl">Pricing tips</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-graphite">
            <li>Start around 30–50% of the original retail price.</li>
            <li>New with tags can sit closer to 60%.</li>
            <li>Vintage is priced by rarity and condition, not age alone.</li>
            <li>Round prices (₹499, ₹999) tend to feel fairer to buyers.</li>
          </ul>
        </div>
      </section>

      <section className="container-x grid gap-10 pb-10 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-title">Guidelines and prohibited items</h2>
        <div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[28px] bg-sage-light/40 p-6">
              <h3 className="font-sans font-semibold">Please do</h3>
              <ul className="mt-3 space-y-2 text-sm">{['Wash or clean items first', 'Photograph flaws clearly', 'Measure garments flat', 'Reply to buyer questions'].map((x) => <li key={x} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-sage-deep" aria-hidden="true" />{x}</li>)}</ul>
            </div>
            <div className="rounded-[28px] bg-terra-light/40 p-6">
              <h3 className="font-sans font-semibold">Not accepted</h3>
              <ul className="mt-3 space-y-2 text-sm">{['Counterfeit or replica goods', 'Used undergarments or swimwear', 'Items with stains, mould or pests', 'Real fur or restricted materials'].map((x) => <li key={x} className="flex gap-2"><X size={16} className="mt-0.5 shrink-0 text-terra" aria-hidden="true" />{x}</li>)}</ul>
            </div>
          </div>
          <div className="mt-8">
            <AccordionItem q="Do I need an account to sell?">Yes. Sign in with the demo credentials to create and manage listings.</AccordionItem>
            <AccordionItem q="Can buyers really purchase my listing?">No. Listings are labelled as demo listings and are visible only to you in this browser.</AccordionItem>
          </div>
          <Link to="/sell/create" className="btn-primary mt-8">Start Selling</Link>
        </div>
      </section>
    </div>
  );
}
