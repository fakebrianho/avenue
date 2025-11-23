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

		// Get audio duration
		const audioDuration = getAudioDuration ? getAudioDuration() : 0
		if (!audioDuration) {
			console.warn('Audio duration not available, using default timing')
		}

		const loaderFadeOutDuration = 5
		const bufferBeforeAudioEnd = 5 // Loader finishes 3 seconds before audio ends

		// Calculate when loader fade should end (bufferBeforeAudioEnd seconds before audio ends)
		const loaderFadeEndTime =
			audioDuration > 0 ? audioDuration - bufferBeforeAudioEnd : 20
		const loaderFadeStartTime = loaderFadeEndTime - loaderFadeOutDuration

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

		// Play through sequence texts - start after initial fade out
		let currentTime = 1.5
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
					duration: 10.2,
					ease: 'power2.out',
				},
				currentTime
			)
			currentTime += 10.2

			// Hold
			const holdDuration = index === 0 ? 5 : 3.0
			currentTime += holdDuration

			// Fade out (except last text)
			if (index < sequenceTexts.length - 1) {
				masterTl.to(
					textRef.current,
					{
						opacity: 0,
						y: -20,
						duration: 10,
						ease: 'power2.in',
					},
					currentTime
				)
				currentTime += 10
			}
		})

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

		// Set initial state - show "Headphones recommended" and button immediately
		textRef.current.textContent = initialText
		gsap.set(textRef.current, {
			opacity: 1,
			y: 0,
		})

		// Show button immediately
		if (buttonRef.current) {
			gsap.set(buttonRef.current, {
				opacity: 1,
				y: 0,
				immediateRender: true,
			})
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
