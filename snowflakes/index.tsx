import {
  ThreeEvent,
  useFrame,
  useThree,
  Canvas,
  invalidate,
} from "@react-three/fiber";
import { minBy } from "lodash";
import React, { useRef, useState } from "react";
import { Vector2 } from "three";
import vertexShader from "./index.vert";
import fragmentShader from "./index.frag";
import styles from "./index.module.scss";
import upload from "./upload";
import Link from "next/link";
import { Perf } from "r3f-perf";

const Intro = ({ dismiss }: { dismiss: () => void }) => {
  return (
    <>
      <div className={styles.introBackground} />
      <div className={styles.introMessage}>
        <p className={styles.bold}>snowflake generator</p>
        <p>
          select “randomize” to generate a completely random snowflake. hover
          over the snowflake to select and use the purple vertices to alter the
          shape and cutouts of your snowflake.
        </p>
        <p>
          select “save snowflake” to create and save an image of your snowflake.
          this will get saved to the gallery.
        </p>
        <p>you can view all snowflakes generated in the gallery.</p>
        <p>hope you have fun!</p>
        <div className={styles.button} onClick={dismiss}>
          ❄️ let it snow
        </div>
      </div>
    </>
  );
};

// Similar to kaleidoscope glsl
const kaleid = (uv: Vector2) => {
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

  return uv;
};

const points = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"] as const;

const shader = {
  vertexShader,
  fragmentShader,
  uniforms: {
    ...(Object.fromEntries(
      points.map((p) => [p, { value: new Vector2() }])
    ) as Record<typeof points[number], { value: Vector2 }>),
    time: { value: 0 },
  },
};
const { uniforms } = shader;

const randomize = () => {
  const numPoints = 2 + Math.floor(Math.random() * 6);
  points.forEach((p, i) => {
    if (i < numPoints) {
      uniforms[p].value.set(0, 0);
    } else {
      kaleid(
        uniforms[p].value.set(Math.random() * 2 - 1, Math.random() * 2 - 1)
      );
    }
  });
  invalidate();
};
randomize();

const saveSnowflake = (name: string) => {
  const href = document.getElementsByTagName("canvas")[0].toDataURL();
  upload(href, name);
  // should this download it?
  // const link = document.createElement('a');
  // link.href = href;
  // link.download = 'disambiguous_export.png';
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};

const Shaders = React.memo(function Shader() {
  const size = useThree((t) => t.size);
  const hover = useRef(false);

  const mouseDown = useRef<typeof points[number] | null>(null);
  const animate = useRef<number | null>(null);

  // console.log([
  //   uniforms.p1.value.x,
  //   uniforms.p1.value.y,
  //   uniforms.p2.value.x,
  //   uniforms.p2.value.y,
  //   uniforms.p3.value.x,
  //   uniforms.p3.value.y,
  //   uniforms.p4.value.x,
  //   uniforms.p4.value.y,
  //   uniforms.p5.value.x,
  //   uniforms.p5.value.y,
  //   uniforms.p6.value.x,
  //   uniforms.p6.value.y,
  //   uniforms.p7.value.x,
  //   uniforms.p7.value.y,
  //   uniforms.p8.value.x,
  //   uniforms.p8.value.y,
  // ]);

  const onPointerDown = ({ uv }: ThreeEvent<PointerEvent>) => {
    if (!uv) return;

    uv.multiplyScalar(2).subScalar(1);
    kaleid(uv);

    const distances = points.map((p) => ({
      name: p,
      distance: uv.distanceTo(uniforms[p].value),
    }));
    const m = minBy(distances, (i) => i.distance)!;
    if (m.distance < 0.05) {
      mouseDown.current = m.name;
    }
  };

  const onPointerMove = ({ uv }: ThreeEvent<PointerEvent>) => {
    if (mouseDown.current !== null && uv) {
      uv.multiplyScalar(2).subScalar(1);
      kaleid(uv);
      uniforms[mouseDown.current].value = uv;
      invalidate();
    }
  };

  const onPointerUp = () => {
    mouseDown.current = null;
  };

  const onPointerEnter = () => {
    hover.current = true;
    animate.current = performance.now();
    invalidate();
  };

  const onPointerLeave = () => {
    hover.current = false;
    animate.current = performance.now();
    invalidate();
  };

  const totalAnimationTime = 250; // in milliseconds
  useFrame(() => {
    if (animate.current !== null) {
      const timeDiff =
        (performance.now() - animate.current) / totalAnimationTime;
      uniforms.time.value = hover.current ? timeDiff : 1 - timeDiff;
      if (uniforms.time.value > 1 || uniforms.time.value < 0) {
        animate.current = null;
      }

      invalidate();
    }
  });

  // const t = useRef(1);
  // // animate many snowflakes
  // useFrame(() => {
  //   t.current++;
  //   if (t.current % 20 === 0) {
  //     t.current = 1;
  //     kaleid(
  //       uniforms.p1.value.set(Math.random() * 2 - 1, Math.random() * 2 - 1),
  //     );
  //     kaleid(
  //       uniforms.p2.value.set(Math.random() * 2 - 1, Math.random() * 2 - 1),
  //     );
  //   }
  // });

  return (
    <mesh
      position={[0, 0, -610]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <planeGeometry args={[size.width, size.height]} />
      <shaderMaterial args={[shader]} />
    </mesh>
  );
});

const Save = () => {
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");
  return saveOpen ? (
    <div className={styles.saveComponent}>
      What is your name?
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
      />
      <div
        className={styles.button}
        onClick={() => {
          saveSnowflake(name);
          setSaveOpen(false);
        }}
      >
        ✔️ submit
      </div>
    </div>
  ) : (
    <div className={styles.button} onClick={() => setSaveOpen(true)}>
      💾 save snowflake
    </div>
  );
};

export default function ShaderPage() {
  const [inIntro, setInIntro] = useState(true);
  return (
    <React.StrictMode>
      <footer className={styles.marquee}>
        <div className={styles.marqueeText}>
          ❄️ Happy holidays ❄️ Love from Daniella and Paras ️️❄️ Happy holidays
          ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from
          Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras
          ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️
          Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella
          and Paras ❄️
        </div>
      </footer>
      <div className={styles.canvasWrapper}>
        <Canvas
          mode="concurrent"
          frameloop="demand"
          gl={{ preserveDrawingBuffer: true }}
        >
          <Shaders />
          <Perf />
        </Canvas>
      </div>
      <div className={styles.buttonFrame}>
        <div
          className={styles.button}
          onClick={() => {
            setInIntro(true);
          }}
        >
          👋 info
        </div>
        <div className={styles.topRightButtons}>
          <div className={styles.button} onClick={randomize}>
            🔀 randomize
          </div>
          <Save />
          <Link href={`/gallery`}>
            <a className={styles.viewGalleryLink}>view gallery ➡️</a>
          </Link>
        </div>
      </div>

      {inIntro ? (
        <Intro
          dismiss={() => {
            setInIntro(false);
          }}
        />
      ) : null}
    </React.StrictMode>
  );
}
