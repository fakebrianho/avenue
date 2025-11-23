'use client'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'

export function IntroText({ isVisible = false }) {
	const textRef = useRef(null)
	const [currentTextIndex, setCurrentTextIndex] = useState(0)

	const texts = [
		'Welcome',
		'Experience the journey',
		'Begin your adventure',
	]

	useEffect(() => {
		if (!isVisible || !textRef.current) return

		// Animate text in
		gsap.fromTo(
			textRef.current,
			{
				opacity: 0,
				y: 20,
			},
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power2.out',
			}
		)

		// Cycle through texts
		const interval = setInterval(() => {
			// Animate current text out
			gsap.to(textRef.current, {
				opacity: 0,
				y: -20,
				duration: 0.5,
				ease: 'power2.in',
				onComplete: () => {
					// Update text
					setCurrentTextIndex((prev) => (prev + 1) % texts.length)
					// Animate new text in
					gsap.fromTo(
						textRef.current,
						{
							opacity: 0,
							y: 20,
						},
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: 'power2.out',
						}
					)
				},
			})
		}, 2000) // Change text every 2 seconds

		return () => {
			clearInterval(interval)
		}
	}, [isVisible, texts.length])

	if (!isVisible) return null

	return (
		<div className={styles.introText}>
			<span ref={textRef}>{texts[currentTextIndex]}</span>
		</div>
	)
}

