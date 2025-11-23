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

		// Play through each text once
		texts.forEach((text, index) => {
			// Set initial state for first text
			if (index === 0) {
				gsap.set(textRef.current, {
					opacity: 0,
					y: 20,
				})
				setCurrentTextIndex(0)
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
					onComplete: () => {
						setCurrentTextIndex(index + 1)
					},
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
