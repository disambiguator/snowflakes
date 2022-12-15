#ifdef GL_ES
precision highp float;
#endif

out vec2 vUv;
out vec2 p1, p2, p3, p4, p5, p6, p7, p8;
in vec2 ap1, ap2, ap3, ap4, ap5, ap6, ap7, ap8;

void main() {
  vUv = uv;
  p1 = ap1;
  p2 = ap2;
  p3 = ap3;
  p4 = ap4;
  p5 = ap5;
  p6 = ap6;
  p7 = ap7;
  p8 = ap8;

// p1 = vec2(0.);
// p2 = vec2(0.);
// p3 = vec2(0.);
// p4 = vec2(
//     -0.2490886872574297,
//     0.46773843604265275);
//     p5 = vec2(

//     -0.09554448933306882,
//     0.7239811385845376
//     );
//     p6 = vec2(

//     -0.17555978455364626,
//     0.7030935367397272
//     );
//     p7 = vec2(

//     -0.07704512284024878,
//     0.4282770766083457
//     );
//     p8 = vec2(

//     -0.270037821399792,
//     0.5631190428884035
//     );
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
