import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Field({ label, error, hint, as = 'input', children, className = '', id: given, ...props }) {
  const auto = useId();
  const id = given || auto;
  const Comp = as;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      {as === 'select' ? (
        <select id={id} className="field" aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...props}>{children}</select>
      ) : (
        <Comp id={id} className={`field ${as === 'textarea' ? 'min-h-[120px] resize-y' : ''}`} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} {...props} />
      )}
      {hint && !error && <p id={`${id}-h`} className="mt-1.5 text-xs text-graphite/80">{hint}</p>}
      {error && <p id={`${id}-e`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function PasswordField({ label = 'Password', error, className = '', ...props }) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} className="field pr-12" aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...props} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-graphite hover:bg-cream" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p id={`${id}-e`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, error, id: given }) {
  const auto = useId();
  const id = given || auto;
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-graphite">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#4F5E47]" aria-invalid={!!error} />
        <span>{label}</span>
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
