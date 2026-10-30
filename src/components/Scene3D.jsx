import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const scenes = {
  hero: lazy(() => import('./three/HeroScene')),
  product: lazy(() => import('./three/ProductScene')),
  donation: lazy(() => import('./three/DonationScene')),
};

let webglOk;
function hasWebGL() {
  if (webglOk !== undefined) return webglOk;
  try {
    const c = document.createElement('canvas');
    webglOk = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    webglOk = false;
  }
  return webglOk;
}

class Boundary extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { /* fall back silently to the 2D illustration */ }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

// Lazy-loads a 3D scene only when it scrolls near the viewport, with a 2D fallback
// for reduced motion, missing WebGL, or any runtime error.
export default function Scene3D({ name, fallback = null, className = '', force = false, ...props }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const can = (force || !reduce) && typeof window !== 'undefined' && hasWebGL();
  const Scene = scenes[name];

  return (
    <div ref={ref} className={className}>
      {can && near ? (
        <Boundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <Scene {...props} />
          </Suspense>
        </Boundary>
      ) : (
        fallback
      )}
    </div>
  );
}
