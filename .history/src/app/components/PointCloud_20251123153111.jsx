import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'

function PointCloud() {
	const count = 2000
	const positions = new Float32Array(count * 3)
	const radius = 40 // Half of 75 to match the previous scale

	for (let i = 0; i < count; i++) {
		// Generate uniform distribution inside a sphere
		// Using spherical coordinates with uniform volume distribution
		const theta = Math.random() * Math.PI * 2 // Azimuth angle [0, 2π]
		const phi = Math.acos(2 * Math.random() - 1) // Elevation angle [0, π]
		// Cube root for uniform volume distribution (not just uniform radius)
		const r = radius * Math.cbrt(Math.random()) // [0, radius]

		// Convert spherical to Cartesian coordinates
		const x = r * Math.sin(phi) * Math.cos(theta)
		const y = r * Math.sin(phi) * Math.sin(theta)
		const z = r * Math.cos(phi)

		positions[i * 3] = x
		positions[i * 3 + 1] = y
		positions[i * 3 + 2] = z
	}
	return (
		<Points
			positions={positions}
			stride={3}
			frustumCulled={false}
			position={[0, 35, 0]}
		>
			<PointMaterial
				transparent
				color='#ffdcdc'
				size={0.08}
				sizeAttenuation={true}
				depthWrite={false}
			/>
		</Points>
	)
}

export default PointCloud
