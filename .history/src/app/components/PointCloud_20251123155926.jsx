import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function PointCloud() {
	const count = 2000
	const ref = useRef()
	const positions = new Float32Array(count * 3)

	const innerRadius = 15 // thickness start
	const outerRadius = 37 // thickness end
	const height = 50 // total height along Y axis

	for (let i = 0; i < count; i++) {
		// height uniformly distributed
		const y = (Math.random() - 0.5) * height

		// random angle around Y axis
		const theta = Math.random() * Math.PI * 2

		// IMPORTANT:
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

	useFrame((state, delta) => {
		if (!ref.current) return
		ref.current.rotation.y += delta * 0.01 // slow spin
	})
	const handleClick = (e) => {
		console.log('CLICKED POINT:', e.index)
		console.log('World position:', e.point)
		console.log('Local position:', e.localPoint)
	}

	return (
		<Points
			ref={ref} // 👈 attach the ref
			positions={positions}
			stride={3}
			position={[0, 28, 0]}
			frustumCulled={false}
			onPointerDown={handleClick} // precise hit
		>
			<PointMaterial
				transparent
				color='#febdbd'
				size={0.08}
				sizeAttenuation
				depthWrite={false}
			/>
		</Points>
	)
}

export default PointCloud
