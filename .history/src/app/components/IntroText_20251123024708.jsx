'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'
import { EnterButton } from './EnterButton'

export function IntroText({
	isVisible = false,
	onEnter,
	playAudio,
	getAudioDuration,
	loaderRef,
	canvasWrapperRef,
}) {
	const textRef = useRef(null)
	const buttonRef = useRef(null)
	const initialText = 'Headphones recommended.'
	const sequenceTexts = [
		"In a moment you'll enter a place I call the Avenue of Broken Dreams.",
		'Click and drag to move the camera, click on different elements to interact with them.',
	]

	const handleEnterClick = () => {
		// Start audio
		if (playAudio) {
			playAudio()
		}

		// Kill any existing animations
		if (textRef.current) gsap.killTweensOf(textRef.current)
		if (buttonRef.current) gsap.killTweensOf(buttonRef.current)
		if (loaderRef?.current) gsap.killTweensOf(loaderRef.current)
		if (canvasWrapperRef?.current)
			gsap.killTweensOf(canvasWrapperRef.current)

		const tl = gsap.timeline()

		// Fade out initial text and button
		if (textRef.current) {
			tl.to(
				textRef.current,
				{
					opacity: 0,
					y: -20,
					duration: 1.2,
					ease: 'power2.in',
				},
				0
			)
		}

		if (buttonRef.current) {
			tl.to(
				buttonRef.current,
				{
					opacity: 0,
					y: -20,
					duration: 1.2,
					ease: 'power2.in',
				},
				0
			)
		}

		// Play through sequence texts
		sequenceTexts.forEach((text, index) => {
			// Update text
			tl.call(() => {
				if (textRef.current) {
					textRef.current.textContent = text
					gsap.set(textRef.current, { opacity: 0, y: 20 })
				}
			})

			// Fade in (1.2s)
			tl.to(textRef.current, {
				opacity: 1,
				y: 0,
				duration: 1.2,
				ease: 'power2.out',
			})

			// Hold for remaining time to total 3 seconds (3 - 1.2 = 1.8s)
			tl.to({}, { duration: 2.5 })

			// Fade out (1.2s) - except for last text
			if (index < sequenceTexts.length - 1) {
				tl.to(textRef.current, {
					opacity: 0,
					y: -20,
					duration: 1.5,
					ease: 'power2.in',
				})
			}
		})

		// After last text, fade out loader and fade in canvas
		if (loaderRef?.current && canvasWrapperRef?.current) {
			gsap.set(loaderRef.current, { opacity: 1 })
			tl.to(loaderRef.current, {
				opacity: 0,
				duration: 5,
				ease: 'sine.out',
				onComplete: () => {
					if (onEnter) {
						onEnter()
					}
				},
			})
			tl.to(
				canvasWrapperRef.current,
				{
					opacity: 1,
					duration: 5,
					ease: 'sine.out',
				},
				'<'
			) // Start at same time as loader fade
		}
	}

	useEffect(() => {
		if (!isVisible || !textRef.current) return

		// Set initial state - start hidden
		textRef.current.textContent = initialText
		gsap.set(textRef.current, {
			opacity: 0,
			y: 20,
		})

		// Set button initial state - start hidden
		if (buttonRef.current) {
			gsap.set(buttonRef.current, {
				opacity: 0,
				y: 20,
				immediateRender: true,
			})
		}

		// Fade in text and button
		const tl = gsap.timeline()
		tl.to(textRef.current, {
			opacity: 1,
			y: 0,
			duration: 1.2,
			ease: 'power2.out',
		})

		if (buttonRef.current) {
			tl.to(
				buttonRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 1.2,
					ease: 'power2.out',
				},
				'-=0.6'
			) // Start slightly before text finishes
		}
	}, [isVisible])

	if (!isVisible) return null

	return (
		<div className={styles.introText}>
			<div className={styles.content}>
				<span ref={textRef}>{initialText}</span>
				<EnterButton ref={buttonRef} onClick={handleEnterClick} />
			</div>
		</div>
	)
}
