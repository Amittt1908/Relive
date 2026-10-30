import { Minus, Plus } from 'lucide-react';

export default function QtyStepper({ value, min = 1, max = 3, onChange, label = 'Quantity' }) {
  return (
    <div className="inline-flex items-center rounded-full border border-linen bg-white/70" role="group" aria-label={label}>
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity"><Minus size={15} /></button>
      <span className="w-7 text-center text-sm font-medium" aria-live="polite">{value}</span>
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Plus size={15} /></button>
    </div>
  );
}
