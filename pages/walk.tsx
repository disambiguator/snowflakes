import {
  ContactShadows,
  GradientTexture,
  Instance,
  Instances,
  OrbitControls,
  Plane,
  Sphere,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import vertexShader from "scene.vert";
import fragmentShader from "scene.frag";
import styles from "./scene.module.scss";
import { airtableList, Model } from "airtableApi";
import Link from "next/link";

const TOP = 70;
const FLOOR = -30;

const shader = { vertexShader, fragmentShader, uniforms: {} };

type InstancedMesh = Omit<
  THREE.InstancedMesh,
  "instanceMatrix" | "instanceColor"
> & {
  instanceMatrix: THREE.InstancedBufferAttribute;
  instanceColor: THREE.InstancedBufferAttribute;
};

const count = 300;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

const Snowflake = ({
  onPointerEnter,
  onPointerLeave,
}: {
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) => {
  const ref = useRef<any>(null);

  const r = Math.sqrt(Math.random()) * 80;
  const theta = Math.random() * 2 * Math.PI;
  const position: [number, number, number] = [
    r * Math.cos(theta),
    rand(FLOOR, TOP),
    r * Math.sin(theta),
  ];
  const speed = Math.random() * 20 + 4;
  const xSin = Math.random() * 5;
  const zSin = Math.random() * 5;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    const instance = ref.current!;
    instance.position.y = TOP - ((position[1] + t) % (TOP - FLOOR));
    instance.position.x = position[0] + Math.sin(t / 10) * xSin;
    instance.position.z = position[2] + Math.sin(t / 10) * zSin;
  });
  return (
    <Instance
      ref={ref}
      scale={rand(1, 7)}
      position={position}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      rotation={[
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random(),
      ]}
    />
  );
};

const Snow = ({
  fields,
  setName,
}: {
  fields: Model[];
  setName: (name: string | null) => void;
}) => {
  const geomRef = useRef<InstancedMesh>(null);

  const onPointerEnter = useCallback(
    (i: number) => () => {
      setName(fields[i % fields.length].name);
    },
    [fields, setName]
  );

  const onPointerLeave = useCallback(() => {
    setName(null);
  }, [setName]);

  const snowflakes = useMemo(
    () =>
      new Array(count)
        .fill(undefined)
        .map((_, i) => (
          <Snowflake
            key={i}
            onPointerEnter={onPointerEnter(i)}
            onPointerLeave={onPointerLeave}
          />
        )),
    [onPointerEnter, onPointerLeave]
  );

  useEffect(() => {
    const geom = geomRef.current!.geometry;
    const p = fields.map((f) => JSON.parse(f.points) as [number, number][]);

    for (let i = 0; i < 8; i++) {
      const a = new Float32Array(count * 2);

      for (let j = 0; j < a.length; j += 2) {
        const [x, y] = p[(j / 2) % p.length][i];
        a[j] = x;
        a[j + 1] = y;
      }

      geom.setAttribute(`ap${i + 1}`, new THREE.InstancedBufferAttribute(a, 2));
    }
  }, [fields]);

  const instances = useMemo(() => {
    return (
      <Instances ref={geomRef} limit={count}>
        <planeGeometry />
        <shaderMaterial args={[shader]} side={THREE.DoubleSide} />
        {snowflakes}
      </Instances>
    );
  }, [snowflakes]);

  return instances;
};

const Scene = ({
  fields,
  setName,
}: {
  fields: Model[];
  setName: (name: string | null) => void;
}) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], far: 1000 }}>
      <OrbitControls enablePan={false} maxDistance={100} />
      {/* <Stars /> */}
      <Snow fields={fields} setName={setName} />
      <ContactShadows
        position={[0, FLOOR, 0]}
        scale={160}
        far={(TOP - FLOOR) / 2}
        blur={3}
        color="gray"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        args={[1000, 1000]}
        position={[0, FLOOR - 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color="white" />
      </Plane>
      <Sphere args={[160]}>
        <meshBasicMaterial side={THREE.BackSide}>
          <GradientTexture
            stops={[0.4, 1]} // As many stops as you want
            colors={["#bdd9e9", "hotpink"]} // Colors need to match the number of stops
          />
        </meshBasicMaterial>
      </Sphere>
    </Canvas>
  );
};

export const getServerSideProps = async () => ({
  props: { fields: (await airtableList()).map((r) => r.fields) },
});

export default function HTTFPage({ fields }: { fields: Model[] }) {
  const [name, setName] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const setNameVisibility = useCallback((v: string | null) => {
    if (v) {
      setName(v);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, []);
  return (
    <>
      <div className={styles.scene}>
        <Scene fields={fields} setName={setNameVisibility} />
      </div>
      <div className={styles.links}>
        <Link href="/gallery">back to gallery ⬅️</Link>
        <span className={visible ? styles.nameVisible : styles.nameHidden}>
          snowflake made by: {name}
        </span>
      </div>
    </>
  );
}
