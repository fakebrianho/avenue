import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'

function PointCloud() {
	const count = 2000
	const positions = new Float32Array(count * 3)

	const innerRadius = 15 // thickness start
	const outerRadius = 35 // thickness end
	const height = 50 // total height along Y axis

	for (let i = 0; i < count; i++) {
		// height uniformly distributed
		const y = (Math.random() - 0.5) * height

		// random angle around Y axis
		const theta = Math.random() * Math.PI * 2

		// IMPORTANT:
		// uniform distribution in radius (area) requires sqrt(random)
		const t = Math.random()
		const r = Math.sqrt(
			innerRadius * innerRadius +
				t * (outerRadius * outerRadius - innerRadius * innerRadius)
		)

		// polar → cartesian
		const x = r * Math.cos(theta)
		const z = r * Math.sin(theta)

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
