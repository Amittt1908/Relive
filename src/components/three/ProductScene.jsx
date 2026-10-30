import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Garment, ShadowBlob, ART_TO_3D } from './garments';

function Spinner({ art, color, drag }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    if (!drag.current.active) drag.current.vy += (0.45 - drag.current.vy) * 0.02;
    ref.current.rotation.y += drag.current.vy * dt;
    ref.current.rotation.x += (drag.current.tx - ref.current.rotation.x) * 0.1;
    ref.current.position.y = Math.sin(performance.now() / 900) * 0.06;
  });
  return (
    <group ref={ref}>
      <Garment kind={ART_TO_3D[art] || 'tee'} color={color} accent="#B85C3C" />
    </group>
  );
}

export default function ProductScene({ art, color }) {
  const drag = useRef({ active: false, x: 0, vy: 0.45, tx: 0 });
  const down = (e) => { drag.current.active = true; drag.current.x = e.clientX; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const move = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    drag.current.x = e.clientX;
    drag.current.vy = dx * 0.25;
    drag.current.tx = Math.max(-0.4, Math.min(0.4, drag.current.tx + e.movementY * 0.004));
  };
  const up = () => { drag.current.active = false; };
  return (
    <div className="h-full w-full touch-pan-y" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 42 }} gl={{ alpha: true, antialias: true }} aria-label="Interactive 3D preview">
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fff4e2" />
        <directionalLight position={[-4, -1, -3]} intensity={0.6} color="#C9D2BE" />
        <Spinner art={art} color={color} drag={drag} />
        <ShadowBlob position={[0, -2.1, 0]} scale={2.6} opacity={0.3} />
      </Canvas>
    </div>
  );
}
