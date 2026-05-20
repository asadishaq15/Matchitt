import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, PresentationControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  NULL_ROOT_NAME,
  PIECE_NAMES,
  SEPARATED_ALIGN_Y,
  SEPARATED_ALIGN_Z,
  CAMERA_FOV_JOINED,
  CAMERA_FOV_SEPARATED,
  CAMERA_SEPARATED_PADDING,
  CAMERA_Z_JOINED,
  CAMERA_Z_SEPARATED,
  SEPARATED_GROUP_ROTATION,
  SEPARATED_ROTATION,
  SEPARATION_EXTRA,
  SEPARATION_GAP_FACTOR,
  CORNER_PIECE_OFFSET,
} from '../constants/puzzleJoin';

const MODEL_TARGET_SIZE = 4.6;
/** Slightly larger normalize target for scroll-driven join / hero puzzle. */
const MODEL_TARGET_SIZE_SCROLL = 5.15;
const MODEL_BASE_ROTATION = [-0.50, -2.95, -0.44];
const MATERIAL_COLOR_BOOST = 1.08;

const seededRandom = (seed) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

const findPuzzlePieces = (root) => {
  const nullRoot = root.getObjectByName(NULL_ROOT_NAME) ?? root;
  const left =
    nullRoot.getObjectByName(PIECE_NAMES.left) ??
    root.getObjectByName(PIECE_NAMES.left);
  const right =
    nullRoot.getObjectByName(PIECE_NAMES.right) ??
    root.getObjectByName(PIECE_NAMES.right);

  return { left, right, nullRoot };
};

const capturePiece = (object) => ({
  object,
  restPosition: object.position.clone(),
  restRotation: object.rotation.clone(),
});

const PuzzleObject = ({
  modelScale = 1,
  rotationOffset = [0, 0, 0],
  scrollMotionRef,
  modelTargetSize = MODEL_TARGET_SIZE,
}) => {
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

        if (material.color) {
          material.color.multiplyScalar(MATERIAL_COLOR_BOOST);
        }

        if ('envMapIntensity' in material) {
          material.envMapIntensity = 0.48;
        }

        if ('roughness' in material) {
          material.roughness = Math.min(material.roughness ?? 0.5, 0.58);
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
    const scale = modelTargetSize / maxAxis;

    const { left: leftObject, right: rightObject } = findPuzzlePieces(clonedScene);

    let separationX = SEPARATION_EXTRA;
    if (leftObject && rightObject) {
      const restGap = Math.abs(leftObject.position.x - rightObject.position.x);
      separationX = SEPARATION_EXTRA + restGap * SEPARATION_GAP_FACTOR;
    }

    return {
      scene: clonedScene,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale],
      pieces: {
        left: leftObject ? capturePiece(leftObject) : null,
        right: rightObject ? capturePiece(rightObject) : null,
        separationX,
      },
    };
  }, [scene, modelTargetSize]);

  useFrame(() => {
    const scrollMotion = scrollMotionRef?.current;
    const scrollScale = scrollMotion?.modelScale ?? 1;
    const scrollRotationX = scrollMotion?.rotationX ?? 0;
    const scrollRotationY = scrollMotion?.rotationY ?? 0;
    const scrollRotationZ = scrollMotion?.rotationZ ?? 0;

    const joinProgress = scrollMotion?.joinProgress ?? 1;
    const spreadT = 1 - joinProgress;
    const useCornerOffsets = Boolean(scrollMotion?.separatedCorners && spreadT > 0);

    if (groupRef.current) {
      const baseX = THREE.MathUtils.lerp(MODEL_BASE_ROTATION[0], SEPARATED_GROUP_ROTATION[0], spreadT);
      const baseY = THREE.MathUtils.lerp(MODEL_BASE_ROTATION[1], SEPARATED_GROUP_ROTATION[1], spreadT);
      const baseZ = THREE.MathUtils.lerp(MODEL_BASE_ROTATION[2], SEPARATED_GROUP_ROTATION[2], spreadT);
      groupRef.current.rotation.set(
        baseX + rotationOffset[0] + scrollRotationX,
        baseY + rotationOffset[1] + scrollRotationY,
        baseZ + rotationOffset[2] + scrollRotationZ,
      );
    }

    if (normalizedModelRef.current) {
      normalizedModelRef.current.scale.setScalar(model.scale * modelScale * scrollScale);
    }
    const spread = model.pieces.separationX * spreadT;

    const applyPieceTransform = (piece, side) => {
      if (!piece) return;
      const { object, restPosition, restRotation } = piece;
      const rot = SEPARATED_ROTATION[side];
      const sign = side === 'left' ? -1 : 1;

      object.position.x = restPosition.x + sign * spread;
      object.position.y = THREE.MathUtils.lerp(restPosition.y, SEPARATED_ALIGN_Y, spreadT);
      object.position.z = THREE.MathUtils.lerp(restPosition.z, SEPARATED_ALIGN_Z, spreadT);

      if (useCornerOffsets) {
        const corner = CORNER_PIECE_OFFSET[side];
        object.position.x += corner.x * spreadT;
        object.position.y += corner.y * spreadT;
        object.position.z += corner.z * spreadT;
      }

      object.rotation.x = restRotation.x + rot.x * spreadT;
      object.rotation.y = restRotation.y + rot.y * spreadT;
      object.rotation.z = restRotation.z + rot.z * spreadT;
    };

    applyPieceTransform(model.pieces.left, 'left');
    applyPieceTransform(model.pieces.right, 'right');
  });

  const modelGroup = (
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
  );

  if (scrollMotionRef) {
    return modelGroup;
  }

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.55}>
      {modelGroup}
    </Float>
  );
};

const FitSeparatedCamera = ({ scrollMotionRef }) => {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const scrollMotion = scrollMotionRef?.current;
    const joinProgress = scrollMotion?.joinProgress ?? 1;
    const spreadT = 1 - joinProgress;
    const modelScale = scrollMotion?.modelScale ?? 1;

    let z = THREE.MathUtils.lerp(CAMERA_Z_JOINED, CAMERA_Z_SEPARATED, spreadT);
    let fov = THREE.MathUtils.lerp(CAMERA_FOV_JOINED, CAMERA_FOV_SEPARATED, spreadT);

    if (spreadT > 0) {
      const padding = 1 + CAMERA_SEPARATED_PADDING * spreadT;
      z *= padding;
    }

    camera.position.set(0, 0, z);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  });

  return <PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z_JOINED]} fov={CAMERA_FOV_JOINED} />;
};

const PuzzleScene = ({
  className = 'w-full h-full min-h-[500px]',
  controlsEnabled = true,
  modelScale = 1,
  rotationOffset = [0, 0, 0],
  scrollMotionRef,
  showParticles = true,
  dimmed = false,
}) => {
  const toneMappingExposure = dimmed ? 0.55 : 1;
  const environmentIntensity = dimmed ? 0.22 : 0.42;
  const ambientIntensity = dimmed ? 0.16 : 0.24;
  const puzzleContent = (
    <Suspense fallback={null}>
      <PuzzleObject
        modelScale={modelScale}
        rotationOffset={rotationOffset}
        scrollMotionRef={scrollMotionRef}
        modelTargetSize={scrollMotionRef ? MODEL_TARGET_SIZE_SCROLL : MODEL_TARGET_SIZE}
      />
    </Suspense>
  );

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
        onCreated={({ gl, events }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = toneMappingExposure;
          gl.domElement.style.touchAction = 'none';
          if (events.connected?.style) {
            events.connected.style.touchAction = 'none';
          }
        }}
      >
        {scrollMotionRef ? (
          <FitSeparatedCamera scrollMotionRef={scrollMotionRef} />
        ) : (
          <PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z_JOINED]} fov={CAMERA_FOV_JOINED} />
        )}
        <ambientLight intensity={ambientIntensity} />
        <hemisphereLight args={['#fff0df', '#5e7188', dimmed ? 0.28 : 0.42]} />
        <directionalLight position={[4, 5, 5]} intensity={dimmed ? 1.1 : 1.78} color="#ffe6d0" />
        <directionalLight position={[-5, 2, 3]} intensity={dimmed ? 0.32 : 0.52} color="#a9d8ff" />
        <pointLight position={[0, -2.5, 4]} intensity={dimmed ? 0.28 : 0.45} color="#ffc3cf" />
        <Environment preset="warehouse" environmentIntensity={environmentIntensity} />
        
        {controlsEnabled ? (
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            {puzzleContent}
          </PresentationControls>
        ) : (
          puzzleContent
        )}
        
        {showParticles ? <Particles count={50} /> : null}
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
