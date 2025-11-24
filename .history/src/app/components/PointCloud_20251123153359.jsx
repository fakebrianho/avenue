import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'
function PointCloud() {
	const count = 2000
	const positions = new Float32Array(count * 3)

	const radius = 20 // cylinder radius
	const height = 80 // cylinder height

	for (let i = 0; i < count; i++) {
		// Random angle around Y axis
		const theta = Math.random() * Math.PI * 2

		// Height uniformly distributed along Y axis
		const y = (Math.random() - 0.5) * height

		// Convert cylindrical coords → Cartesian
		const x = radius * Math.cos(theta)
		const z = radius * Math.sin(theta)

		positions[i * 3] = x
		positions[i * 3 + 1] = y
		positions[i * 3 + 2] = z
	}

	return (
		<Points
			positions={positions}
			stride={3}
			position={[0, 35, 0]}
			frustumCulled={false}
		>
			<PointMaterial
				transparent
				color='#ffdcdc'
				size={0.08}
				sizeAttenuation
				depthWrite={false}
			/>
		</Points>
	)
}

export default PointCloud
