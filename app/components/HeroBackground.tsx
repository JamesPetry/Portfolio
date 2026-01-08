'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function ParametricMesh() {
  const meshRef = useRef<THREE.LineSegments>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta * 0.2;
      // Subtle rotation
      meshRef.current.rotation.z = Math.sin(timeRef.current) * 0.05;
    }
  });

  // Create a subtle parametric grid geometry
  const geometry = useRef(new THREE.BufferGeometry());
  const vertices: number[] = [];
  const size = 20;
  const divisions = 15;

  // Generate a subtle grid-like pattern
  for (let i = 0; i <= divisions; i++) {
    for (let j = 0; j <= divisions; j++) {
      const x = (i / divisions - 0.5) * size;
      const y = (j / divisions - 0.5) * size;
      const z = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 0.3;
      vertices.push(x, y, z);
    }
  }

  geometry.current.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  return (
    <lineSegments ref={meshRef} geometry={geometry.current} position={[0, 0, -5]}>
      <lineBasicMaterial color="#000000" opacity={0.03} transparent />
    </lineSegments>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} className="w-full h-full">
        <ParametricMesh />
      </Canvas>
    </div>
  );
}
