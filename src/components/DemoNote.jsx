import { FlaskConical } from 'lucide-react';

export default function DemoNote({ children, className = '' }) {
  return (
    <p className={`demo-badge ${className}`}>
      <FlaskConical size={13} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
