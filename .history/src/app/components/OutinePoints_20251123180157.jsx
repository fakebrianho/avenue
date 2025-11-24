import { Points, PointMaterial } from "@react-three/drei"
import { useState, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function OutlinedPoints({ positions, stride = 3, position = [0, 0, 0] }) {
  const cloudRef = useRef()

  const [hover, setHover] = useState({
    index: null,
    position: new THREE.Vector3()
  })

  // This small mesh will be our outline
  const outlineRef = useRef()

  // Update outline position
  useFrame(() => {
    if (outlineRef.current && hover.index !== null) {
      outlineRef.current.position.copy(hover.position)
    }
  })

  const handlePointerMove = (e) => {
    // exact hit
    const idx = e.index
    const p = e.point.clone()

    setHover({ index: idx, position: p })
  }

  const handlePointerOut = () => {
    setHover({ index: null, position: new THREE.Vector3() })
  }

  return (
    <>
      {/* Main point cloud */}
      <Points
        ref={cloudRef}
        positions={positions}
        stride={stride}
        
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          size={0.08}
          color="#febdbd"
          depthWrite={false}
          sizeAttenuation
        />
      </Points>

      {/* Hover outline point (one point only) */}
      {hover.index !== null && (
        <mesh ref={outlineRef}>
          <sphereGeometry args={[0, 1, 1]} /> {/* dummy, never shown */}
          <outlinedPointMaterial
            uColor="#ffffff"
            uOutlineColor="#ff99cc"
            uSize={24.0}
            uOutlineWidth={0.4}
          />
        </mesh>
      )}
    </>
  )
}