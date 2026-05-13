import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, PresentationControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_TARGET_SIZE = 4.8;
const MODEL_BASE_ROTATION = [-0.45, -2.95, -0.44];

const seededRandom = (seed) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

const PuzzleObject = ({ modelScale = 1, rotationOffset = [0, 0, 0], scrollMotionRef }) => {
  const groupRef = useRef();
  const normalizedModelRef = useRef();
  const { scene } = useGLTF('/puzzleModel.glb');

  const model = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      child.frustumCulled = false;
      if (!child.material) return;

      const materials = (Array.isArray(child.material) ? child.material : [child.material])
        .filter(Boolean)
        .map((material) => material.clone());

      if (!materials.length) return;

      materials.forEach((material) => {
        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
          material.map.needsUpdate = true;
        }

        if ('envMapIntensity' in material) {
          material.envMapIntensity = 0.25;
        }

        material.needsUpdate = true;
      });

      child.material = Array.isArray(child.material) ? materials : materials[0];
    });

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = MODEL_TARGET_SIZE / maxAxis;

    return {
      scene: clonedScene,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale],
    };
  }, [scene]);

  useFrame(() => {
    const scrollMotion = scrollMotionRef?.current;
    const scrollScale = scrollMotion?.modelScale ?? 1;
    const scrollRotationX = scrollMotion?.rotationX ?? 0;
    const scrollRotationY = scrollMotion?.rotationY ?? 0;
    const scrollRotationZ = scrollMotion?.rotationZ ?? 0;

    if (groupRef.current) {
      groupRef.current.rotation.set(
        MODEL_BASE_ROTATION[0] + rotationOffset[0] + scrollRotationX,
        MODEL_BASE_ROTATION[1] + rotationOffset[1] + scrollRotationY,
        MODEL_BASE_ROTATION[2] + rotationOffset[2] + scrollRotationZ
      );
    }

    if (normalizedModelRef.current) {
      normalizedModelRef.current.scale.setScalar(model.scale * modelScale * scrollScale);
    }
  });

  return (
    <Float
      speed={1.1}
      rotationIntensity={0.18}
      floatIntensity={0.55}
    >
      <group
        ref={groupRef}
        rotation={[
          MODEL_BASE_ROTATION[0] + rotationOffset[0],
          MODEL_BASE_ROTATION[1] + rotationOffset[1],
          MODEL_BASE_ROTATION[2] + rotationOffset[2],
        ]}
      >
        <group ref={normalizedModelRef} scale={model.scale * modelScale} position={model.position}>
          <primitive object={model.scene} />
        </group>
      </group>
    </Float>
  );
};

const PuzzleScene = ({
  className = 'w-full h-full min-h-[500px]',
  controlsEnabled = true,
  modelScale = 1,
  rotationOffset = [0, 0, 0],
  scrollMotionRef,
}) => {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ touchAction: 'none' }}
        onCreated={({ gl, events }) => {
          gl.domElement.style.touchAction = 'none';
          if (events.connected?.style) {
            events.connected.style.touchAction = 'none';
          }
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6.2]} fov={43} />
        <ambientLight intensity={0.38} />
        <hemisphereLight args={['#fff3df', '#6f7f92', 0.55]} />
        <directionalLight position={[4, 5, 5]} intensity={1.25} color="#fff0dc" />
        <directionalLight position={[-4, 2, 3]} intensity={0.45} color="#b9dcff" />
        <pointLight position={[0, -2, 4]} intensity={0.35} color="#ffd1d9" />
        
        <PresentationControls
          enabled={controlsEnabled}
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Suspense fallback={null}>
            <PuzzleObject
              modelScale={modelScale}
              rotationOffset={rotationOffset}
              scrollMotionRef={scrollMotionRef}
            />
          </Suspense>
        </PresentationControls>
        
        {/* Particle system for depth */}
        <Particles count={50} />
      </Canvas>
    </div>
  );
};

const Particles = ({ count }) => {
  const mesh = useRef();
  const dummy = new THREE.Object3D();
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      const t = seededRandom(seed) * 100;
      const factor = 20 + seededRandom(seed + 100) * 100;
      const speed = 0.01 + seededRandom(seed + 200) / 200;
      const xFactor = -50 + seededRandom(seed + 300) * 100;
      const yFactor = -50 + seededRandom(seed + 400) * 100;
      const zFactor = -50 + seededRandom(seed + 500) * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      particle.t += speed / 2;
      const { t } = particle;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color="#800020" />
    </instancedMesh>
  );
};

useGLTF.preload('/puzzleModel.glb');

export default PuzzleScene;
