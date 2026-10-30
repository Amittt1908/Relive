import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { Field } from '../../components/Field';
import { Stepper } from '../Checkout';
import { PriceTag } from '../../components/ProductCard';
import { ProductArt } from '../../components/ProductArt';
import Modal from '../../components/Modal';
import DemoNote from '../../components/DemoNote';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { CONDITIONS } from '../../data/products';
import { money } from '../../lib/format';

const CATS = [['women', 'Women'], ['men', 'Men'], ['streetwear', 'Streetwear'], ['vintage', 'Vintage'], ['shoes', 'Shoes'], ['bags', 'Bags'], ['accessories', 'Accessories']];
const ART = { women: 'dress', men: 'shirt', streetwear: 'hoodie', vintage: 'jacket', shoes: 'sneaker', bags: 'tote', accessories: 'cap' };
const sizesFor = (cat) => (cat === 'shoes' ? ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] : ['bags', 'accessories'].includes(cat) ? ['One Size', 'S', 'M', 'L'] : ['XS', 'S', 'M', 'L', 'XL']);
const ZONES = ['Greenleaf Block (fictional)', 'Riverside Sector (fictional)', 'Old Mill Quarter (fictional)', 'Hilltop Colony (fictional)'];
const METHODS = ['Doorstep pickup', 'Drop at a partner point', 'I’ll ship it myself'];
const SLOTS = ['Weekday mornings', 'Weekday evenings', 'Weekends'];
const STEPS = ['Photos', 'Details', 'Pickup', 'Preview'];

// Downscale uploads so they fit comfortably in localStorage.
function compress(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('type'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const scale = Math.min(1, 560 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const BLANK = { title: '', category: '', brand: '', description: '', size: '', color: '', material: '', condition: '', originalPrice: '', price: '', photos: [], pickup: { method: '', area: '', slot: '' } };

export default function CreateListing() {
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const { listings, saveListing } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const existing = editId ? listings.find((l) => l.id === editId) : null;
  const [f, setF] = useState(() => (existing ? { ...BLANK, ...existing, pickup: { ...BLANK.pickup, ...existing.pickup } } : BLANK));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value, ...(k === 'category' ? { size: '' } : {}) }));
  const setP = (k) => (e) => setF((x) => ({ ...x, pickup: { ...x.pickup, [k]: e.target.value } }));

  const addPhotos = async (files) => {
    const room = 4 - f.photos.length;
    if (room <= 0) return toast('You can add up to four photos.', 'info');
    setBusy(true);
    const out = [];
    let bad = 0;
    for (const file of Array.from(files).slice(0, room)) {
      try { out.push(await compress(file)); } catch { bad++; }
    }
    setBusy(false);
    if (bad) toast(`${bad} file${bad > 1 ? 's' : ''} couldn’t be read. Use JPG, PNG or WebP images.`, 'error');
    setF((x) => ({ ...x, photos: [...x.photos, ...out] }));
    setErrors((e) => ({ ...e, photos: undefined }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 0 && f.photos.length === 0) e.photos = 'Add at least one photo.';
    if (s === 1) {
      if (f.title.trim().length < 4) e.title = 'Give it a descriptive title (at least 4 characters).';
      if (!f.category) e.category = 'Choose a category.';
      if (!f.brand.trim()) e.brand = 'Enter a brand, or “Unbranded”.';
      if (f.description.trim().length < 20) e.description = 'Describe fit, wear and any flaws (at least 20 characters).';
      if (!f.size) e.size = 'Choose a size.';
      if (!f.color.trim()) e.color = 'Enter a colour.';
      if (!f.material.trim()) e.material = 'Enter the main material.';
      if (!f.condition) e.condition = 'Choose a condition.';
      const op = Number(f.originalPrice), sp = Number(f.price);
      if (!op || op < 50) e.originalPrice = 'Enter the original price (₹50 or more).';
      if (!sp || sp < 50) e.price = 'Enter a selling price (₹50 or more).';
      else if (op && sp > op) e.price = 'Selling price can’t be higher than the original price.';
    }
    if (s === 2) {
      if (!f.pickup.method) e.method = 'Choose a handover method.';
      if (f.pickup.method !== METHODS[2] && !f.pickup.area) e.area = 'Choose a demo pickup zone.';
      if (!f.pickup.slot) e.slot = 'Choose a preferred time.';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (validate(step)) { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const publish = () => {
    const id = saveListing({ ...f, id: existing?.id, title: f.title.trim(), brand: f.brand.trim(), originalPrice: Number(f.originalPrice), price: Number(f.price) });
    setConfirm(false);
    toast(existing ? 'Listing updated.' : 'Listing published as a demo listing.');
    navigate('/seller/dashboard', { state: { highlight: id } });
  };

  const off = Number(f.originalPrice) > Number(f.price) && Number(f.price) ? Math.round((1 - Number(f.price) / Number(f.originalPrice)) * 100) : 0;

  return (
    <div className="container-x pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero">{existing ? 'Edit listing' : 'Create a listing'}</h1>
        <DemoNote>Demo listing, not a real marketplace offer</DemoNote>
      </div>
      <div className="mt-8"><Stepper steps={STEPS} current={step} /></div>

      <div className="mt-10 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
            {step === 0 && (
              <section aria-labelledby="ph">
                <h2 id="ph" className="text-2xl">Upload photos</h2>
                <p className="mt-1 text-graphite">Up to four. Photos stay in your browser; nothing is uploaded.</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {f.photos.map((src, i) => (
                    <div key={i} className="relative aspect-[5/6] overflow-hidden rounded-2xl">
                      <img src={src} alt={`Listing photo ${i + 1}`} className="h-full w-full object-cover" />
                      {i === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-ivory/90 px-2 py-0.5 text-xs">Cover</span>}
                      <button type="button" onClick={() => setF((x) => ({ ...x, photos: x.photos.filter((_, k) => k !== i) }))} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-ivory/90" aria-label={`Remove photo ${i + 1}`}><X size={16} /></button>
                    </div>
                  ))}
                  {f.photos.length < 4 && (
                    <button type="button" onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }} className="grid aspect-[5/6] place-items-center rounded-2xl border-2 border-dashed border-sage text-center text-sm text-graphite hover:bg-sage-light/30">
                      <span>{busy ? <Loader2 className="mx-auto animate-spin" aria-hidden="true" /> : <ImagePlus className="mx-auto" aria-hidden="true" />}<span className="mt-2 block">Add photo</span><span className="block text-xs">or drop here</span></span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }} aria-label="Choose photos" />
                {errors.photos && <p className="field-error" role="alert">{errors.photos}</p>}
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="dt" className="grid gap-5 sm:grid-cols-2">
                <h2 id="dt" className="text-2xl sm:col-span-2">Product details</h2>
                <Field className="sm:col-span-2" label="Product title" value={f.title} onChange={set('title')} error={errors.title} placeholder="e.g. Faded denim trucker jacket" maxLength={70} />
                <Field as="select" label="Category" value={f.category} onChange={set('category')} error={errors.category}><option value="">Choose</option>{CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Field>
                <Field label="Brand" value={f.brand} onChange={set('brand')} error={errors.brand} placeholder="Brand or Unbranded" />
                <Field className="sm:col-span-2" as="textarea" label="Description" value={f.description} onChange={set('description')} error={errors.description} placeholder="Fit, measurements, how often it was worn, any flaws." maxLength={600} />
                <Field as="select" label="Size" value={f.size} onChange={set('size')} error={errors.size} disabled={!f.category} hint={!f.category ? 'Choose a category first.' : undefined}><option value="">Choose</option>{sizesFor(f.category).map((s) => <option key={s}>{s}</option>)}</Field>
                <Field label="Colour" value={f.color} onChange={set('color')} error={errors.color} placeholder="e.g. Washed blue" />
                <Field label="Material" value={f.material} onChange={set('material')} error={errors.material} placeholder="e.g. 100% cotton" />
                <Field as="select" label="Condition" value={f.condition} onChange={set('condition')} error={errors.condition}><option value="">Choose</option>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</Field>
                <Field label="Original price (₹)" type="number" inputMode="numeric" min="0" value={f.originalPrice} onChange={set('originalPrice')} error={errors.originalPrice} />
                <Field label="Selling price (₹)" type="number" inputMode="numeric" min="0" value={f.price} onChange={set('price')} error={errors.price} hint={off ? `${off}% below original. Most pieces sell at 30–60% off.` : undefined} />
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="pk" className="grid gap-5 sm:grid-cols-2">
                <h2 id="pk" className="text-2xl sm:col-span-2">Pickup and location</h2>
                <p className="-mt-3 text-sm text-graphite sm:col-span-2">Zones below are fictional demo areas. Please don’t enter a real address.</p>
                <fieldset className="sm:col-span-2">
                  <legend className="field-label">Handover method</legend>
                  <div className="flex flex-wrap gap-2">{METHODS.map((m) => <button key={m} type="button" onClick={() => setF((x) => ({ ...x, pickup: { ...x.pickup, method: m } }))} aria-pressed={f.pickup.method === m} className={`chip ${f.pickup.method === m ? 'chip-active' : ''}`}>{m}</button>)}</div>
                  {errors.method && <p className="field-error" role="alert">{errors.method}</p>}
                </fieldset>
                {f.pickup.method !== METHODS[2] && <Field as="select" label="Demo pickup zone" value={f.pickup.area} onChange={setP('area')} error={errors.area}><option value="">Choose</option>{ZONES.map((z) => <option key={z}>{z}</option>)}</Field>}
                <Field as="select" label="Preferred time" value={f.pickup.slot} onChange={setP('slot')} error={errors.slot}><option value="">Choose</option>{SLOTS.map((z) => <option key={z}>{z}</option>)}</Field>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="pv" className="grid gap-8 md:grid-cols-[280px_1fr]">
                <h2 id="pv" className="text-2xl md:col-span-2">Preview</h2>
                <div>
                  <div className="relative aspect-[5/6] overflow-hidden rounded-[24px] bg-cream">
                    {f.photos[0] ? <img src={f.photos[0]} alt="Cover photo" className="h-full w-full object-cover" /> : <ProductArt type={ART[f.category] || 'tee'} color="#9AAA8A" className="h-full w-full" />}
                    <span className="absolute left-3 top-3 rounded-full bg-sage-deep px-2.5 py-1 text-xs text-ivory">Demo listing</span>
                    <PriceTag price={Number(f.price)} originalPrice={Number(f.originalPrice)} className="absolute bottom-3 left-0" />
                  </div>
                  <p className="mt-3 text-sm text-graphite">{f.brand}</p>
                  <p className="font-medium">{f.title}</p>
                </div>
                <dl className="grid grid-cols-2 content-start gap-4 text-sm">
                  {[['Category', CATS.find((c) => c[0] === f.category)?.[1]], ['Size', f.size], ['Colour', f.color], ['Material', f.material], ['Condition', f.condition], ['Price', `${money(f.price)} (was ${money(f.originalPrice)})`], ['Handover', f.pickup.method], ['When', f.pickup.slot], ...(f.pickup.area ? [['Zone', f.pickup.area]] : [])].map(([k, v]) => (
                    <div key={k}><dt className="text-graphite">{k}</dt><dd className="mt-0.5">{v}</dd></div>
                  ))}
                  <div className="col-span-2"><dt className="text-graphite">Description</dt><dd className="mt-0.5 leading-relaxed">{f.description}</dd></div>
                  <div className="col-span-2 flex flex-wrap gap-2">{[0, 1, 2].map((s) => <button key={s} type="button" onClick={() => setStep(s)} className="link-u text-sm font-medium">Edit {STEPS[s].toLowerCase()}</button>)}</div>
                </dl>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap justify-between gap-3">
          {step > 0 ? <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost">Back</button> : <Link to="/sell" className="btn-ghost">Cancel</Link>}
          {step < 3 ? <button type="button" onClick={next} className="btn-primary" disabled={busy}>Continue</button> : <button type="button" onClick={() => setConfirm(true)} className="btn-sage">{existing ? 'Save changes' : 'Publish'}</button>}
        </div>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title={existing ? 'Save changes?' : 'Publish this demo listing?'}>
        <p className="text-graphite">It will be saved in this browser and shown in your seller dashboard. It isn’t visible to anyone else and can’t be bought.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirm(false)} className="btn-ghost btn-sm">Keep editing</button>
          <button type="button" onClick={publish} className="btn-sage btn-sm">{existing ? 'Save changes' : 'Publish'}</button>
        </div>
      </Modal>
    </div>
  );
}
