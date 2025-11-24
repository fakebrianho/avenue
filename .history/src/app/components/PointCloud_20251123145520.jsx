import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'

function PointCloud() {
	const count = 2000
	const positions = new Float32Array(count * 3)

	for (let i = 0; i < count * 3; i++) {
		positions[i] = (Math.random() - 0.5) * 10
	}
	return <div>PointCloud</div>
}

export default PointCloud
