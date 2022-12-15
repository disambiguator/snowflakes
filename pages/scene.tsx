import { Instance, Instances, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import vertexShader from "scene.vert";
import fragmentShader from "scene.frag";

const height = 200;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const TOP = 1000;
const MAX = 5000;

const newPosition = () => ({
  velocity: new THREE.Vector3(0, rand(-60, 0), 0),
  position: new THREE.Vector3(rand(-5000, 5000), TOP, rand(-5000, 5000)),
  acceleration: new THREE.Vector3(0, rand(-1, -0.1), 0),
});

type Particle = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
};

const positionsFromParticles = (particles: Particle[]): Float32Array => {
  const d = new Float32Array(MAX * 3);
  particles.forEach((p, i) => {
    d[i * 3] = p.position.x;
    d[i * 3 + 1] = p.position.y;
    d[i * 3 + 2] = p.position.z;
  });

  return d;
};

const Rain = () => {
  const particles: Particle[] = [];
  for (let i = 0; i < MAX; i++) {
    const newParticle = newPosition();
    particles.push(newParticle);
  }
  const mat = new THREE.PointsMaterial({ color: 0x0033ff, size: 10 });
  const positionAttributeRef = useRef<THREE.BufferAttribute>();

  useFrame(() => {
    particles.forEach((p) => {
      p.velocity.add(p.acceleration);
      p.position.add(p.velocity);

      if (p.position.y < -TOP) {
        const n = newPosition();
        p.velocity = n.velocity;
        p.acceleration = n.acceleration;
        p.position.x = n.position.x;
        p.position.y = n.position.y;
        p.position.z = n.position.z;
      }
    });

    const positionAttribute = positionAttributeRef.current!;
    positionAttribute.array = positionsFromParticles(particles);
    positionAttribute.needsUpdate = true;
  });

  return (
    <>
      <points material={mat} position={[0, 0, -4]}>
        <bufferGeometry>
          <bufferAttribute
            ref={positionAttributeRef}
            attachObject={["attributes", "position"]}
            count={MAX}
            array={positionsFromParticles(particles)}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </>
  );
};

const uv = new THREE.Vector2();
const kaleid = (x: number, y: number) => {
  uv.x = x;
  uv.y = y;

  const KA = Math.PI / 6.0;
  // get the angle in radians of the current coords relative to origin (i.e. center of screen)
  let angle = Math.atan2(uv.y, uv.x) + 2 * Math.PI;
  // repeat image over evenly divided rotations around the center
  angle = angle % (2.0 * KA);
  // reflect the image within each subdivision to create a tilelable appearance
  angle = Math.abs(angle - KA);
  angle += Math.PI / 2.0;
  // get the distance of the coords from the uv origin (i.e. center of the screen)
  const d = uv.length();
  // map the calculated angle to the uv coordinate system at the given distance
  uv.x = Math.cos(angle);
  uv.y = Math.sin(angle);
  uv.multiplyScalar(d);

  return [uv.x, uv.y];
};

const shader = {
  vertexShader,
  fragmentShader,
  uniforms: {},
};

type InstancedMesh = Omit<
  THREE.InstancedMesh,
  "instanceMatrix" | "instanceColor"
> & {
  instanceMatrix: THREE.InstancedBufferAttribute;
  instanceColor: THREE.InstancedBufferAttribute;
};

const count = 300;
const points = [
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
];
points.forEach((a) => {
  for (let i = 0; i < a.length; i += 2) {
    const [x, y] = kaleid(Math.random() * 2 - 1, Math.random() * 2 - 1);
    a[i] = x;
    a[i + 1] = y;
  }
});
const Snow = () => {
  const geomRef = useRef<InstancedMesh>(null);

  const snowflakes = new Array(count).fill(undefined).map((_, i) => {
    return (
      <Instance
        key={i}
        scale={Math.random() * 10}
        position={[
          100 * Math.random() - 50,
          50 * Math.random(),
          100 * Math.random() - 50,
        ]}
        rotation={[
          Math.PI * 2 * Math.random(),
          Math.PI * 2 * Math.random(),
          Math.PI * 2 * Math.random(),
        ]}
      />
    );
  });

  useEffect(() => {
    const geom = geomRef.current!.geometry;
    for (let i = 0; i < points.length; i++) {
      geom.setAttribute(
        `ap${i + 1}`,
        new THREE.InstancedBufferAttribute(points[i], 2)
      );
    }
  }, []);

  return (
    <Instances ref={geomRef} limit={count}>
      <planeGeometry />
      <shaderMaterial args={[shader]} />
      {/* <meshStandardMaterial /> */}
      {snowflakes}
    </Instances>
  );
};

export default function HTTFPage() {
  return (
    <div style={{ width: 1000, height: 1000 }}>
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 3000], far: 10000 }}
      >
        <OrbitControls />
        {/* <Rain /> */}
        <Snow />
      </Canvas>
    </div>
  );
}
