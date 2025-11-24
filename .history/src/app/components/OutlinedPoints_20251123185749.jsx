import React, { useRef, useMemo, useState } from 'react'
import { Points, PointMaterial, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shader material
const OutlinedPointMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#ffffff'),
    uOutlineColor: new THREE.Color('#ff88aa'),
    uSize: 2000.0,
    uOutlineWidth: 0.45,
  },
  // vertex shader
  `
    uniform float uSize;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uSize * (25.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // fragment shader
  `
    precision mediump float;
    uniform vec3 uColor;
    uniform vec3 uOutlineColor;
    uniform float uOutlineWidth;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv) * 2.0;

      // Small white core in center
      float coreRadius = 0.25;
      float core = 1.0 - smoothstep(0.0, coreRadius, d);
      
      // Pink outline ring - visible from outlineInner to edge
      float outlineInner = 0.5 - uOutlineWidth;
      float outlineOuter = 0.5;
      // Make outline visible in the ring area
      float outline = smoothstep(outlineInner - 0.05, outlineInner, d) * (1.0 - smoothstep(outlineOuter - 0.02, outlineOuter, d));
      
      // Color: use outline color in ring area, core color in center
      vec3 col = outline > 0.01 ? uOutlineColor : uColor;
      // Alpha: show both core and outline
      float alpha = max(core * 0.3, outline);

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

  const hoverPositions = useMemo(() => {
    if (!hoverPos) return null
    return new Float32Array([hoverPos.x, hoverPos.y, hoverPos.z])
  }, [hoverPos])

  useFrame(() => {
    if (cloudRef.current) {
      // cloudRef.current.rotation.y += 0.002
    }
  })

  const handlePointerMove = (e) => {
    // Get the actual point position using the index
    // Since hover outline has the same position={[0, 28, 0]} as main Points,
    // we can use the same local coordinates from the positions array
    if (e.index !== undefined && e.index !== null && e.index < count) {
      const index = e.index
      const x = positions[index * 3]
      const y = positions[index * 3 + 1]
      const z = positions[index * 3 + 2]
      
      setHoverPos(new THREE.Vector3(x, y, z))
    } else {
      // Fallback: convert world point to local space of main Points
      if (cloudRef.current && e.point) {
        const localPoint = e.point.clone()
        cloudRef.current.worldToLocal(localPoint)
        setHoverPos(localPoint)
      } else {
        setHoverPos(e.point.clone())
      }
    }
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
      {hoverPositions && (
        <Points
          ref={hoverRef}
          positions={hoverPositions}
          stride={3}
          position={[0, 28, 0]}
          frustumCulled={false}
        >
          <outlinedPointMaterial
            uSize={10.0}
            uOutlineWidth={0.15}
            uColor="#1298ff"
            uOutlineColor="#ff88aa"
            depthTest={false}
            depthWrite={false}
            transparent={true}
          />
        </Points>
      )}
    </>
  )
}
