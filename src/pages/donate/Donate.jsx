import { Link } from 'react-router-dom';
import { Check, X, Sparkles, Package, Truck, HandHeart } from 'lucide-react';
import Magnetic from '../../components/Magnetic';
import Scene3D from '../../components/Scene3D';
import Reveal from '../../components/Reveal';
import { ProductArt } from '../../components/ProductArt';
import { AccordionItem } from '../../components/Accordion';
import DemoNote from '../../components/DemoNote';
import { partners, DONATION_CATEGORIES } from '../../data/content';

const ART = ['tee', 'jeans', 'dress', 'coat', 'tee', 'sneaker', 'tote', 'kurta'];

export default function Donate() {
  return (
    <div>
      <section className="relative overflow-hidden bg-sage-deep text-ivory">
        <div className="container-x grid items-center gap-8 pb-16 pt-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="text-hero max-w-[13ch]">Your Unused Clothes Can Change Someone’s Day.</h1>
            <p className="mt-5 max-w-md text-lg text-ivory/80">Clean, wearable clothes you no longer reach for can keep someone warm, dressed for an interview, or ready for school.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic to="/donate/schedule" className="btn-light">Start a Donation</Magnetic>
              <Link to="/account/donations" className="btn border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink">My donations</Link>
            </div>
            <p className="mt-6 text-sm text-ivory/60">Demo experience. No real pickup is scheduled.</p>
          </div>
          <Scene3D name="donation" className="h-[360px] sm:h-[460px]" fallback={<div className="grid h-full place-items-center"><div className="animate-floaty h-64 w-52"><ProductArt type="duffel" color="#E9C3B2" bg={false} className="h-full w-full" label="" /></div></div>} />
        </div>
      </section>

      <section className="container-x py-20" aria-labelledby="cats-h">
        <h2 id="cats-h" className="text-title">What you can donate</h2>
        <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {DONATION_CATEGORIES.map((c, i) => (
            <li key={c} className="group">
              <div className="aspect-square overflow-hidden rounded-full bg-cream p-6 transition-colors group-hover:bg-sage-light"><ProductArt type={ART[i]} color={i % 2 ? '#B85C3C' : '#7E8F72'} bg={false} className="h-full w-full transition-transform duration-500 group-hover:-rotate-6" label="" /></div>
              <p className="mt-3 text-center font-medium">{c}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-cream/60 py-20" aria-labelledby="hw-h">
        <div className="container-x">
          <h2 id="hw-h" className="text-title">How donations work</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {[[Package, 'Sort and pack', 'Wash everything, fold it, and pack it in a bag or box.'], [Truck, 'Pickup or drop-off', 'Choose a doorstep pickup or drop it at a partner point.'], [HandHeart, 'Passed on', 'Partners sort, repair where needed, and distribute.']].map(([Icon, t, b], i) => (
              <Reveal as="li" key={t} delay={i * 0.06} className="relative pl-14">
                <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-ink font-semibold text-ivory">{i + 1}</span>
                <Icon size={24} className="text-terra" aria-hidden="true" />
                <h3 className="mt-2 text-2xl">{t}</h3>
                <p className="mt-1 text-graphite">{b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x grid gap-8 py-20 md:grid-cols-2">
        <div className="rounded-[32px] bg-sage-light/40 p-8">
          <h2 className="text-2xl">Accepted</h2>
          <ul className="mt-4 space-y-2">{['Clean, dry everyday clothing', 'Winterwear and blankets', 'Shoes in matching pairs', 'Bags and belts in working order', 'Children’s clothing'].map((x) => <li key={x} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-sage-deep" aria-hidden="true" />{x}</li>)}</ul>
        </div>
        <div className="rounded-[32px] bg-terra-light/40 p-8">
          <h2 className="text-2xl">Not accepted</h2>
          <ul className="mt-4 space-y-2">{['Undergarments and socks', 'Wet, mouldy or heavily stained items', 'Torn items beyond repair (use textile recycling)', 'Single shoes', 'Items with pests'].map((x) => <li key={x} className="flex gap-2"><X size={18} className="mt-0.5 shrink-0 text-terra" aria-hidden="true" />{x}</li>)}</ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl"><Sparkles size={20} className="text-olive" aria-hidden="true" />Hygiene and quality guidelines</h2>
          <p className="mt-3 max-w-2xl text-graphite">Wash and fully dry every item. Empty pockets, zip zips and button buttons. Pack shoes with their laces tied together. If you wouldn’t give it to a friend, it belongs in textile recycling instead; see the <Link to="/reuse" className="underline">reuse hub</Link>.</p>
        </div>
      </section>

      <section className="container-x pb-20" aria-labelledby="pt-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 id="pt-h" className="text-title">Donation partners</h2><DemoNote>Fictional demo organisations</DemoNote></div>
        <ul className="grid gap-5 md:grid-cols-3">
          {partners.map((p) => (
            <li key={p.name} className="rounded-[32px] p-7" style={{ background: p.tone }}>
              <p className="font-display text-2xl font-extrabold leading-tight tracking-tight">{p.name}</p>
              <p className="mt-2 text-graphite">{p.focus}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x grid gap-10 pb-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="text-title">Why it matters</h2>
          <p className="mt-4 max-w-sm text-graphite">Extending a garment’s life is one of the simplest ways to lower its footprint. Donating keeps wearable clothes in use rather than in storage.</p>
          <Link to="/donate/schedule" className="btn-primary mt-6">Start a Donation</Link>
        </div>
        <div>
          <AccordionItem q="Is a real pickup scheduled?">No. This is a demo. Submitting the form saves a record in your browser with a reference number.</AccordionItem>
          <AccordionItem q="How many items should I donate at once?">For a pickup, at least five items is a sensible minimum. Drop-offs can be any size.</AccordionItem>
          <AccordionItem q="Do I get a receipt?">Your donation history shows a demo reference number. Real tax receipts are not issued.</AccordionItem>
          <AccordionItem q="Can I donate torn clothes?">Not for redistribution. Torn textiles are better suited to recycling programmes.</AccordionItem>
        </div>
      </section>
    </div>
  );
}
