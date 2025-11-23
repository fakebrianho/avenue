'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'
import { EnterButton } from './EnterButton'

export function IntroText({ isVisible = false, onEnter, playAudio, getAudioDuration, loaderRef, canvasWrapperRef }) {
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

		// Get audio duration
		const audioDuration = getAudioDuration ? getAudioDuration() : 0
		const loaderFadeOutDuration = 5
		const bufferBeforeAudioEnd = 3 // Loader finishes 3 seconds before audio ends
		const sequenceEndTime = audioDuration - bufferBeforeAudioEnd - loaderFadeOutDuration

		// Kill any existing animations
		if (textRef.current) {
			gsap.killTweensOf(textRef.current)
		}
		if (buttonRef.current) {
			gsap.killTweensOf(buttonRef.current)
		}
		if (loaderRef?.current) {
			gsap.killTweensOf(loaderRef.current)
		}
		if (canvasWrapperRef?.current) {
			gsap.killTweensOf(canvasWrapperRef.current)
		}

		// Create unified timeline synced to audio
		const masterTl = gsap.timeline()

		// Fade out initial text and button
		if (textRef.current) {
			masterTl.to(
				textRef.current,
				{
					opacity: 0,
					y: -20,
					duration: 1.2,
					ease: 'power2.in',
					force3D: true,
				},
				0
			)
		}

		if (buttonRef.current) {
			masterTl.to(
				buttonRef.current,
				{
					opacity: 0,
					y: -20,
					duration: 1.2,
					ease: 'power2.in',
					force3D: true,
				},
				0
			)
		}

		// Play through sequence texts
		let currentTime = 1.5 // Start after fade out
		sequenceTexts.forEach((text, index) => {
			// Update text
			masterTl.call(
				() => {
					if (textRef.current) {
						textRef.current.textContent = text
						gsap.set(textRef.current, { opacity: 0, y: 20 })
					}
				},
				null,
				currentTime
			)

			// Fade in
			masterTl.to(
				textRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 1.2,
					ease: 'power2.out',
				},
				currentTime
			)
			currentTime += 1.2

			// Hold
			const holdDuration = index === 0 ? 2.5 : 2.0
			currentTime += holdDuration

			// Fade out (except last text)
			if (index < sequenceTexts.length - 1) {
				masterTl.to(
					textRef.current,
					{
						opacity: 0,
						y: -20,
						duration: 0.8,
						ease: 'power2.in',
					},
					currentTime
				)
				currentTime += 0.8
			}
		})

		// Calculate when to start loader fade-out
		// It should finish bufferBeforeAudioEnd seconds before audio ends
		const loaderFadeStartTime = sequenceEndTime
		const loaderFadeEndTime = loaderFadeStartTime + loaderFadeOutDuration

		// Start canvas fade-in at the same time as loader fade-out
		if (canvasWrapperRef?.current) {
			masterTl.to(
				canvasWrapperRef.current,
				{
					opacity: 1,
					duration: loaderFadeOutDuration,
					ease: 'sine.out',
					force3D: true,
				},
				loaderFadeStartTime
			)
		}

		// Fade out loader
		if (loaderRef?.current) {
			gsap.set(loaderRef.current, { opacity: 1, clearProps: 'all' })
			masterTl.to(
				loaderRef.current,
				{
					opacity: 0,
					duration: loaderFadeOutDuration,
					ease: 'sine.out',
					force3D: true,
					onComplete: () => {
						if (onEnter) {
							onEnter()
						}
					},
				},
				loaderFadeStartTime
			)
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
			if (index < texts.length - 1) {
				tl.to({}, { duration: 2 })
			} else {
				// For last text, shorter hold so button appears sooner
				tl.to({}, { duration: 1 })
			}

			// Fade out (except for last text)
			if (index < texts.length - 1) {
				tl.to(textRef.current, {
					opacity: 0,
					y: -20,
					duration: 0.8,
					ease: 'power2.in',
				})

				// Reset position for next text
				tl.set(textRef.current, {
					y: 20,
				})
			} else {
				// After last text hold completes, animate in the button
				if (buttonRef.current) {
					tl.to(
						buttonRef.current,
						{
							opacity: 1,
							y: 0,
							duration: 1.2,
							ease: 'power2.out',
						},
						'-=0.5'
					)
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
