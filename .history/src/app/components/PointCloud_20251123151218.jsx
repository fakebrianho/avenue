import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'

function PointCloud() {
	const count = 2000
	const positions = new Float32Array(count * 3)

	for (let i = 0; i < count * 3; i++) {
		positions[i] = (Math.random() - 0.5) * 75
	}
	return (
		<Points positions={positions} stride={3} frustumCulled={false}>
			<PointMaterial
				transparent
				color='white'
				size={0.03}
				sizeAttenuation={true}
				depthWrite={false}
			/>
		</Points>
	)
}

export default PointCloud
