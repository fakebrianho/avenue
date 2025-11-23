'use client'
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

/**
 * Component to animate camera position using GSAP
 * Must be used inside a Canvas component
 *
 * @param {Object} props
 * @param {Array<number>} props.targetPosition - Target position [x, y, z]
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.ease - GSAP easing function
 * @param {boolean} props.animate - Trigger animation when true
 * @param {Function} props.onComplete - Callback when animation completes
 */
export function CameraAnimator({
	targetPosition = [0, 0, 100],
	duration = 1,
	ease = 'power2.inOut',
	animate = false,
	onComplete,
}) {
	const { camera, controls } = useThree()
	const animationRef = useRef(null)

	useEffect(() => {
		if (!animate || !camera) return

		// Kill any existing animation
		if (animationRef.current) {
			animationRef.current.kill()
		}

		// Create GSAP animation
		animationRef.current = gsap.to(camera.position, {
			x: targetPosition[0],
			y: targetPosition[1],
			z: targetPosition[2],
			duration,
			ease,
			onComplete: () => {
				// Update OrbitControls target to prevent jump when re-enabled
				if (controls && controls.target) {
					// Calculate where camera is looking
					const direction = new THREE.Vector3()
					camera.getWorldDirection(direction)
					// Set target to a point in front of camera
					const distance = 20
					controls.target.copy(
						camera.position.clone().add(direction.multiplyScalar(distance))
					)
					controls.update()
				}

				// Clear the animation ref when complete
				animationRef.current = null
				if (onComplete) onComplete()
			},
		})

		// Cleanup on unmount or when animate changes
		return () => {
			if (animationRef.current) {
				animationRef.current.kill()
				animationRef.current = null
			}
		}
	}, [animate, targetPosition, duration, ease, camera, scene, onComplete])

	return null // This component doesn't render anything
}
