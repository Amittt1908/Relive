import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Garment, ShadowBlob } from './garments';

// Desktop keeps the cluster to the right and edges so the headline stays readable;
// narrow screens stack garments above and below the text.
const ITEMS = [
  { kind: 'jacket', color: '#7E97B3', accent: '#c08a4a', pos: [-5.4, 1.9, -1.6], m: [-1.5, 3.0, -1.5], rot: [0.1, 0.5, 0.18], s: 0.95 },
  { kind: 'dress', color: '#B85C3C', accent: '#E9C3B2', pos: [3.3, 0.6, -0.2], m: [1.3, -2.7, -0.4], rot: [0.05, -0.5, -0.14], s: 0.95 },
  { kind: 'sneaker', color: '#E8E4D8', accent: '#B85C3C', pos: [1.5, -2.3, 0.8], m: [-1.1, -3.1, 0.4], rot: [0.3, 0.6, -0.1], s: 0.55 },
  { kind: 'tee', color: '#7E8F72', accent: '#4F5E47', pos: [1.6, 2.1, -1.4], m: [1.2, 2.9, -1.2], rot: [0.05, 0.2, -0.08], s: 0.75 },
  { kind: 'bag', color: '#9A5A34', accent: '#4B3326', pos: [5.0, -2.0, 0.3], m: [0.1, -3.6, -0.8], rot: [0.1, -0.5, 0.12], s: 0.6 },
  { kind: 'cap', color: '#6E6B3B', accent: '#22211F', pos: [-5.0, -2.6, 0.5], m: [-0.2, 3.5, -2.0], rot: [0.2, 0.9, 0], s: 0.5 },
  { kind: 'pants', color: '#3E4C6B', accent: '#22211F', pos: [5.9, 2.4, -2.2], m: null, rot: [0, -0.3, 0.2], s: 0.7 },
  { kind: 'coat', color: '#3A3936', accent: '#B8BABD', pos: [-7.2, -0.4, -3.2], m: null, rot: [0, 0.4, -0.12], s: 0.75 },
];

function Floating({ item, i, narrow }) {
  const ref = useRef();
  const pos = narrow ? item.m : item.pos;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + i * 1.3;
    if (!ref.current) return;
    ref.current.position.y = pos[1] + Math.sin(t * 0.7) * 0.16;
    ref.current.rotation.y = item.rot[1] + Math.sin(t * 0.4) * 0.22;
    ref.current.rotation.z = item.rot[2] + Math.cos(t * 0.5) * 0.05;
  });
  return (
    <group ref={ref} position={pos} rotation={item.rot} scale={item.s * (narrow ? 0.62 : 1)}>
      <Garment kind={item.kind} color={item.color} accent={item.accent} />
    </group>
  );
}

function Items() {
  const { viewport } = useThree();
  const narrow = viewport.width < 7;
  return (
    <>
      {ITEMS.filter((it) => !narrow || it.m).map((it, i) => <Floating key={it.kind} item={it} i={i} narrow={narrow} />)}
      {!narrow && <ShadowBlob position={[1.5, -3.1, 0.8]} scale={1.6} opacity={0.2} />}
      {!narrow && <ShadowBlob position={[5.0, -3.0, 0.3]} scale={1.6} opacity={0.2} />}
    </>
  );
}

function Rig({ children }) {
  const ref = useRef();
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.18, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.1, 0.05);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pointer.x * 0.25, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 9], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-hidden="true">
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} color="#fff4e2" />
      <directionalLight position={[-5, -2, 3]} intensity={0.45} color="#C9D2BE" />
      <pointLight position={[0, 0, 4]} intensity={0.4} color="#E9C3B2" />
      <Rig>
        <Items />
      </Rig>
    </Canvas>
  );
}
