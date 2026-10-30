import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function AccordionItem({ q, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-linen">
      <h3 className="font-sans text-base font-medium">
        <button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span>{q}</span>
          <Plus size={18} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="max-w-2xl pb-5 leading-relaxed text-graphite">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
