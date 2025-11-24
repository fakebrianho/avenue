// OutlinedPoints.jsx
import React, { useRef, useMemo, useState } from 'react'
import { Points, PointMaterial, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import buffer
import * as THREE from 'three'

// 1. Define the custom shader material
const OutlinedPointMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#ffffff'),
    uOutlineColor: new THREE.Color('#ff88aa'),
    uSize: 24.0,
    uOutlineWidth: 0.3,
  },
  // vertex shader
  `
    uniform float uSize;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      // Scale point size by distance so it looks consistent
      gl_PointSize = uSize * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // fragment shader
  `
    uniform vec3 uColor;
    uniform vec3 uOutlineColor;
    uniform float uOutlineWidth;

    void main() {
      // gl_PointCoord is 0..1 in both directions
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv) * 2.0; // 0 at center, ~1 at edge

      float core   = smoothstep(0.2, 0.0, d);                    // inner disc
      float outline = smoothstep(0.5, 0.5 - uOutlineWidth, d);   // ring

      vec3 col = mix(uOutlineColor, uColor, core);
      float alpha = max(outline, core);

      if (alpha < 0.01) discard;
      gl_FragColor = vec4(col, alpha);
    }
  `
)

// 2. Tell R3F about this material so <outlinedPointMaterial /> works
extend({ OutlinedPointMaterial })

export function OutlinedPoints() {
  const count = 2000
  const innerRadius = 15
  const outerRadius = 37
  const height = 50

  const cloudRef = useRef()
  const hoverRef = useRef()

  const [hover, setHover] = useState({
    index: null,
    position: new THREE.Vector3(),
  })

  // Precompute positions once
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const y = (Math.random() - 0.5) * height
      const theta = Math.random() * Math.PI * 2

      const t = Math.random()
      const r = Math.sqrt(
        innerRadius * innerRadius +
          t * (outerRadius * outerRadius - innerRadius * innerRadius)
      )

      const x = r * Math.cos(theta)
      const z = r * Math.sin(theta)

      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }

    return arr
  }, [])

  // Rotate the whole cloud a bit
  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.01
    }
    if (hoverRef.current && hover.index !== null) {
      hoverRef.current.position.copy(hover.position)
    }
  })

  const handlePointerMove = (e) => {
    // e.index = which point, e.point = world position
    console.log('e', e)
    setHover({
      index: e.index,
      position: e.point.clone(),
    })
  }

  const handlePointerOut = () => {
    setHover({
      index: null,
      position: new THREE.Vector3(),
    })
  }

  return (
    <>
      {/* Main point cloud */}
      <Points
        ref={cloudRef}
        positions={positions}
        stride={3}
        position={[0, 28, 0]}
        frustumCulled={false}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <PointMaterial
          transparent
          color='#febdbd'
          size={0.08}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Single outlined point, following the hovered point */}
      {hover.index !== null && (
  <Points ref={hoverRef} frustumCulled={false}>
    <bufferGeometry
      attach="geometry"
      <bufferAttribute
      attach="attributes-position"
      array={new Float32Array([0, 0, 0])}
      count={1}
      itemSize={3}
    />
    />
    <outlinedPointMaterial
      uColor='#ffffff'
      uOutlineColor='#ff99cc'
      uSize={32.0}
      uOutlineWidth={0.35}
      transparent
      depthWrite={false}
      depthTest={false}
    />
  </Points>
)}
    </>
  )
}
