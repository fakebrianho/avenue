'use client'
import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

/**
 * Component to animate camera position using GSAP
 * Must be used inside a Canvas component
 *
 * @param {Object} props
 * @param {Array<number>} props.targetPosition - Target position [x, y, z]
 * @param {Array<number>} props.lookAt - Target point to look at [x, y, z]
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.ease - GSAP easing function
 * @param {boolean} props.animate - Trigger animation when true
 * @param {Function} props.onComplete - Callback when animation completes
 */
export function CameraAnimator({
	targetPosition = [0, 0, 100],
	lookAt = [0, 0, 0],
	duration = 1,
	ease = 'power2.inOut',
	animate = false,
	onComplete,
}) {
	const { camera } = useThree()
	const animationRef = useRef(null)

	// Set camera lookAt target
	useFrame(() => {
		if (camera) {
			camera.lookAt(lookAt[0], lookAt[1], lookAt[2])
		}
	})

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
				if (onComplete) onComplete()
			},
		})

		// Cleanup on unmount
		return () => {
			if (animationRef.current) {
				animationRef.current.kill()
			}
		}
	}, [animate, targetPosition, duration, ease, camera, onComplete])

	return null // This component doesn't render anything
}
