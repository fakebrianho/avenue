'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'
import { useAudio } from '../utils/useAudio'

export function IntroText({ isVisible = false }) {
	const textRef = useRef(null)

	const texts = [
		"In a moment you'll enter a place I call the Avenue of Broken Dreams.",
		'Click and drag to move the camera, click on different elements to interact with them.',
	]

	useEffect(() => {
		if (!isVisible || !textRef.current) return

		const tl = gsap.timeline()

		// Set initial state for first text
		textRef.current.textContent = texts[0]
		gsap.set(textRef.current, {
			opacity: 0,
			y: 20,
		})

		// Play through each text once
		texts.forEach((text, index) => {
			// Update text before animating in (except first one)
			if (index > 0) {
				tl.call(() => {
					if (textRef.current) {
						textRef.current.textContent = text
					}
				})
			}

			// Fade in
			tl.to(textRef.current, {
				opacity: 1,
				y: 0,
				duration: 1.2,
				ease: 'power2.out',
			})

			// Hold text visible
			tl.to({}, { duration: 2.5 })

			// Fade out (except for last text)
			if (index < texts.length - 1) {
				tl.to(textRef.current, {
					opacity: 0,
					y: -20,
					duration: 1.2,
					ease: 'power2.in',
				})

				// Reset position for next text
				tl.set(textRef.current, {
					y: 20,
				})
			}
		})

		return () => {
			tl.kill()
		}
	}, [isVisible])

	if (!isVisible) return null

	return (
		<div className={styles.introText}>
			<span ref={textRef}>{texts[0]}</span>
		</div>
	)
}
