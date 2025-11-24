import React from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import { useGetData } from '../utils/useData'
import { OutlinedPoints } from './OutlinedPoints'
import { getCachedDataCount } from '../utils/useDataCount'


function PointCloud() {
	const count = 2000
	const ref = useRef()
	const { mutate, data, error, isPending } = useGetData()
	

	useEffect(() => {
		if (data) {
			console.log('Data received:', data)
		}
		if (error) {
			console.error('Error fetching data:', error)
		}
	}, [data, error])

	const innerRadius = 15 // thickness start
	const outerRadius = 37 // thickness end
	const height = 50 // total height along Y axis
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
	}, []) // ⬅ empty deps = generate once

	useFrame((state, delta) => {
		if (!ref.current) return
		ref.current.rotation.y += delta * 0.01 // slow spin
	})


	return (
		<OutlinedPoints positions={positions} stride={3} position={[0, 28, 0]}/>

		// <Points
		// 	ref={ref} // 👈 attach the ref
		// 	positions={positions}
		// 	stride={3}
		// 	position={[0, 28, 0]}
		// 	frustumCulled={false}
		// 	onPointerDown={handleClick} // precise hit
		// >
		// 	<PointMaterial
		// 		transparent
		// 		color='#febdbd'
		// 		size={0.08}
		// 		sizeAttenuation
		// 		depthWrite={false}
		// 	/>
		// </Points>
	)
}

export default PointCloud
