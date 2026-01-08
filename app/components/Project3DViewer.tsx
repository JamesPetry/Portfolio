'use client';

'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  onReady?: (size: number) => void;
}

function Model({ url, autoRotate = false, rotationSpeed = 0.5, onReady }: ModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);

  // Configure the scene and center it
  useEffect(() => {
    if (scene && modelRef.current) {
      // Compute bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Center the model at origin
      scene.position.sub(center);

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.needsUpdate = true;
                }
              });
            } else if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.needsUpdate = true;
            }
          }
        }
      });

      // Notify parent about model size
      if (onReady) {
        onReady(maxDim);
      }
    }
  }, [scene, onReady]);

  useFrame(() => {
    if (rotationGroupRef.current && autoRotate) {
      rotationGroupRef.current.rotation.y += rotationSpeed * 0.003; // slower rotation
    }
  });

  if (!scene) return null;

  return (
    <group ref={rotationGroupRef}>
      <primitive ref={modelRef} object={scene} />
    </group>
  );
}

interface Project3DViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  className?: string;
}

export default function Project3DViewer({
  modelUrl,
  autoRotate = true,
  enableControls = true,
  className = '',
}: Project3DViewerProps) {
  // Determine model-specific settings based on URL
  const isCityModel = modelUrl.includes('urban_geo');
  const [modelSize, setModelSize] = useState<number | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  return (
    <div className={`relative w-full h-full bg-black/5 ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-black/5">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
          </div>
        }
      >
        <Canvas
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          className="w-full h-full"
        >
          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 10, 10]} fov={50} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} />
          <Environment preset="city" />
          <Model
            url={modelUrl}
            autoRotate={autoRotate}
            rotationSpeed={isCityModel ? 0.08 : 0.1}
            onReady={(size) => {
              setModelSize(size);
              // Position camera above the model looking down and slightly tilted
              const dist = Math.max(6, size * 1.6);
              if (cameraRef.current) {
                cameraRef.current.position.set(0, dist, dist * 0.4);
                cameraRef.current.lookAt(0, 0, 0);
              }
            }}
          />
          {enableControls && (
            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={modelSize ? Math.max(1, modelSize * 0.8) : 1}
              maxDistance={modelSize ? modelSize * 3 : 20}
              target={[0, 0, 0]}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              makeDefault
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
}
