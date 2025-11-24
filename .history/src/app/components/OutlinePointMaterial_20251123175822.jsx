import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

const OutlinedPointMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("#ffffff"),
    uOutlineColor: new THREE.Color("#ff88aa"),
    uSize: 12.0,
    uOutlineWidth: 0.3
  },
  /* vertex shader */
  `
    uniform float uSize;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* fragment shader */
  `
    uniform vec3 uColor;
    uniform vec3 uOutlineColor;
    uniform float uOutlineWidth;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv) * 2.0;

      float core = smoothstep(0.2, 0.0, d);
      float outline = smoothstep(0.5, 0.5 - uOutlineWidth, d);

      vec3 col = mix(uOutlineColor, uColor, core);
      float alpha = max(outline, core);

      gl_FragColor = vec4(col, alpha);
      if (alpha < 0.01) discard;
    }
  `
)

extend({ OutlinedPointMaterial })
