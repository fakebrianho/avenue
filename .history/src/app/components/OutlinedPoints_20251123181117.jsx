import React, { useRef, useMemo, useState } from 'react'
import { Points, PointMaterial, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shader material
const OutlinedPointMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#ffffff'),
    uOutlineColor: new THREE.Color('#ff88aa'),
    uSize: 80.0,
    uOutlineWidth: 0.25,
  },
  // vertex shader
  `
    uniform float uSize;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
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
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv) * 2.0;

      float core = smoothstep(0.2, 0.0, d);
      float outline = smoothstep(0.5, 0.5 - uOutlineWidth, d);

      vec3 col = mix(uOutlineColor, uColor, core);
      float alpha = max(outline, core);

      if (alpha < 0.01) discard;
      gl_FragColor = vec4(col, alpha);
    }
  `
)

extend({ OutlinedPointMaterial })

export function OutlinedPoints() {
  const count = 2000
  const cloudRef = useRef()
  const hoverRef = useRef()
  const [hoverPos, setHoverPos] = useState(null)

  const positions = useMemo(() => {
    const innerRadius = 15
    const outerRadius = 37
    const height = 50

    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const y = (Math.random() - 0.5) * height
      const theta = Math.random() * Math.PI * 2
      const t = Math.random()
      const r = Math.sqrt(
        innerRadius * innerRadius +
          t * (outerRadius * outerRadius - innerRadius * innerRadius)
      )
      arr[i * 3] = r * Math.cos(theta)
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = r * Math.sin(theta)
    }
    return arr
  }, [])

  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.002
    }
    if (hoverRef.current && hoverPos) {
      hoverRef.current.position.copy(hoverPos)
    }
  })

  const handlePointerMove = (e) => {
    // important: DO NOT subtract the cloud's transform
    setHoverPos(e.point.clone())
  }

  const handlePointerOut = () => {
    setHoverPos(null)
  }

  return (
    <>
      {/* Main cloud */}
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
          color="#febdbd"
          size={0.08}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      {/* Hover outline point */}
      {hoverPos && (
        <Points ref={hoverRef} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([0, 0, 0])}
              count={1}
              itemSize={3}
            />
          </bufferGeometry>
          <outlinedPointMaterial
            uSize={140.0}          // finally visible
            uOutlineWidth={0.4}
            depthTest={false}
            depthWrite={false}
            transparent={true}
          />
        </Points>
      )}
    </>
  )
}
