#define N (9)

uniform float time;
uniform vec2 p1, p2, p3, p4, p5, p6, p7, p8;
in vec2 vUv;

const float PI = 3.14159265359;
const vec2 center = vec2(0.0, 0.0);

// NO idea why i need to do this but vec arrays do not work in Android otherwise.
  // vec2[N] poly = vec2[N](center, p1, p2, p3, p4, p5, p6, p7, p8);
vec2 v(int i) {
  if(i == 0) {
    return center;
  } else if(i == 1) {
    return p1;
    } else if(i == 2) {
    return p2;
    } else if(i == 3) {
    return p3;
      } else if(i == 4) {
    return p4;
  }  else if(i == 5) {
    return p5;
  }   else if(i == 6) {
    return p6;
      }   else if(i == 7) {
    return p7;
      }   else if(i == 8) {
    return p8;
  } else {
    return vec2(0.);
  }
}

// signed distance to a 2D polygon
// adapted from triangle
// https://iquilezles.org/articles/distfunctions2d
float sdPoly(vec2 p) {
  float d = dot(p - v(0), p - v(0));
  float s = 1.0;
  for (int i = 0, j = N - 1; i < N; j = i, i++) {
    vec2 e = v(j) - v(i);
    vec2 w = p - v(i);
    vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= v(i).y, p.y < v(j).y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.0;
  }
  return s * sqrt(d);
}

const float dF = 0.006;

// Modified kaleidoscope function
vec2 kaleidoscope(vec2 uv, float numSides) {
  float KA = PI / numSides;
  // get the angle in radians of the current coords relative to origin (i.e. center of screen)
  float angle = atan(uv.y, uv.x);
  // repeat image over evenly divided rotations around the center
  angle = mod(angle, 2.0 * KA);
  // reflect the image within each subdivision to create a tilelable appearance
  angle = abs(angle - KA);
  // This is the only change from the other version to make corners line up
  angle += PI / 2.0;
  // get the distance of the coords from the uv origin (i.e. center of the screen)
  float d = length(uv);
  // map the calculated angle to the uv coordinate system at the given distance
  return d * vec2(cos(angle), sin(angle));
}

const float cutoffSize = 0.06;
const float outlineSize = 0.0002;
const vec4 outlineColor = vec4(
  126.0 / 255.0,
  184.0 / 255.0,
  218.0 / 255.0,
  1.0
);

vec4 sdfSnowflake(vec2 p) {
  float d = sdPoly(p);

  vec4 col = vec4(0.0);

  // cutoff outline
  col = mix(
    col,
    outlineColor,
    smoothstep(
      -cutoffSize - dF - outlineSize,
      -cutoffSize - dF + outlineSize,
      d
    )
  );

  // border of cutout
  col = mix(col, vec4(1.0), smoothstep(-cutoffSize - dF, -cutoffSize + dF, d));

  // border of snowflake
  col = mix(col, outlineColor, smoothstep(-dF, dF, d));

  // away from snowflake
  col = mix(col, vec4(0.0), smoothstep(dF, dF + outlineSize, d));

  return col;
}

void main() {
  // Move from 0 to 1 domain to -1 to 1 domain
  vec2 p = vUv * 2.0 - 1.0;
  p = kaleidoscope(p, 6.0);

  vec4 col = sdfSnowflake(p);

  // hover targets
  if (
    min(
      distance(p, p1),
      min(
        distance(p, p2),
        min(
          distance(p, p3),
          min(
            distance(p, p4),
            min(
              distance(p, p5),
              min(distance(p, p6), min(distance(p, p7), distance(p, p8)))
            )
          )
        )
      )
    ) <
    0.02
  ) {
    col = mix(
      col,
      vec4(129.0 / 255.0, 52.0 / 255.0, 205.0 / 255.0, 1.0),
        smoothstep(0.0, 1., time)
    );
  }

  gl_FragColor = col;
}
