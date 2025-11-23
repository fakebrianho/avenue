'use client'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/**
 * Component to set camera lookAt target
 * Must be used inside a Canvas component
 *
 * @param {Object} props
 * @param {Array<number>} props.target - Target point to look at [x, y, z]
 */
export function CameraLookAt({ target = [0, 0, 0] }) {
	const { camera } = useThree()

	useEffect(() => {
		if (camera) {
			camera.lookAt(target[0], target[1], target[2])
		}
	}, [camera, target])

	return null
}

