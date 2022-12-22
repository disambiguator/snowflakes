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
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
