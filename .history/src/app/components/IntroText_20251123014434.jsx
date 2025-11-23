'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'
import { EnterButton } from './EnterButton'

export function IntroText({ isVisible = false, onEnter, playAudio }) {
	const textRef = useRef(null)
	const buttonRef = useRef(null)
	const texts = [
		"In a moment you'll enter a place I call the Avenue of Broken Dreams.",
		'Click and drag to move the camera, click on different elements to interact with them.',
		'Headphones recommended.',
	]

	const handleEnterClick = () => {
		if (playAudio) {
			playAudio()
		}

		// Trigger the loader fade immediately (5 seconds total)
		if (onEnter) {
			onEnter()
		}

		// Fade out text and button quickly at the start (within the 5s timeline)
		if (textRef.current) {
			gsap.to(textRef.current, {
				opacity: 0,
				y: -20,
				duration: 1.2,
				ease: 'power2.in',
			})
		}

		if (buttonRef.current) {
			gsap.to(buttonRef.current, {
				opacity: 0,
				y: -20,
				duration: 1.2,
				ease: 'power2.in',
			})
		}
	}

	useEffect(() => {
		if (!isVisible || !textRef.current) return

		const tl = gsap.timeline()

		// Set initial state for first text
		textRef.current.textContent = texts[0]
		gsap.set(textRef.current, {
			opacity: 0,
			y: 20,
		})

		// Set initial state for button - ensure it's hidden initially
		// CSS already sets opacity: 0, but we'll use GSAP for consistency
		if (buttonRef.current) {
			gsap.set(buttonRef.current, {
				opacity: 0,
				y: 20,
				immediateRender: true,
			})
		}

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
					duration: 0.9,
					ease: 'power2.in',
				})

				// Reset position for next text
				tl.set(textRef.current, {
					y: 20,
				})
			} else {
				// After last text, animate in the button
				if (buttonRef.current) {
					tl.to(
						buttonRef.current,
						{
							opacity: 1,
							y: 0,
							duration: 0.7,
							ease: 'power2.out',
						},
						'-=0.2'
					) // Start slightly before text animation ends
				}
			}
		})

		return () => {
			tl.kill()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible])

	if (!isVisible) return null

	return (
		<div className={styles.introText}>
			<div className={styles.content}>
				<span ref={textRef}>{texts[0]}</span>
				<EnterButton ref={buttonRef} onClick={handleEnterClick} />
			</div>
		</div>
	)
}
