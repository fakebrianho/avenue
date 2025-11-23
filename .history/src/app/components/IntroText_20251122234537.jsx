'use client'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'

export function IntroText({ isVisible = false }) {
	const textRef = useRef(null)
	const [currentTextIndex, setCurrentTextIndex] = useState(0)

	const texts = ['Welcome', 'Experience the journey', 'Begin your adventure']

	useEffect(() => {
		if (!isVisible || !textRef.current) return

		const tl = gsap.timeline()

		// Set initial state for first text
		gsap.set(textRef.current, {
			opacity: 0,
			y: 20,
		})
		setCurrentTextIndex(0)

		// Play through each text once
		texts.forEach((text, index) => {
			// Update text before animating in (except first one)
			if (index > 0) {
				tl.call(() => {
					setCurrentTextIndex(index)
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
			tl.to({}, { duration: 2 })

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
	}, [isVisible, texts])

	if (!isVisible) return null

	return (
		<div className={styles.introText}>
			<span ref={textRef}>{texts[currentTextIndex]}</span>
		</div>
	)
}
