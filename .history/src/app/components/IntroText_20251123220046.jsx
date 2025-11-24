'use client'
import { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react'
import { gsap } from 'gsap'
import styles from './IntroText.module.css'
import { EnterButton } from './EnterButton'

export const IntroText = memo(function IntroText({
	isVisible = false,
	onEnter,
	playAudio,
	getAudioDuration,
	loaderRef,
	canvasWrapperRef,
	onTriggerCameraAnimation,
}) {
	const textRef = useRef(null)
	const buttonRef = useRef(null)
	const [isClicked, setIsClicked] = useState(false)
	const [shouldShowButton, setShouldShowButton] = useState(true)
	const initialText = 'Headphones recommended.'
	
	// Memoize sequence texts to avoid recreating array
	const sequenceTexts = useMemo(() => [
		"In a moment you'll enter a place I call the Avenue of Broken Dreams.",
		'Click and drag to move the camera, click on different elements to interact with them.',
	], [])

	const handleEnterClick = useCallback(() => {
		// Prevent multiple clicks
		if (isClicked) return
		setIsClicked(true)
		// Trigger camera animation
		if (onTriggerCameraAnimation) {
			onTriggerCameraAnimation()
		}

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
		const fadeOutTargets = [textRef.current]
		if (buttonRef.current) {
			fadeOutTargets.push(buttonRef.current)
		}
		
		tl.to(
			fadeOutTargets,
			{
				opacity: 0,
				y: -20,
				duration: 1.2,
				ease: 'power2.in',
				onComplete: () => {
					// Unmount button after fade out
					setShouldShowButton(false)
				},
			},
			0
		)

		// Play through sequence texts
		sequenceTexts.forEach((text, index) => {
			const isLast = index === sequenceTexts.length - 1

			// Update text
			tl.call(() => {
				if (textRef.current) {
					textRef.current.textContent = text
					gsap.set(textRef.current, { opacity: 0, y: 20 })
				}
			})

			// Fade in
			tl.to(textRef.current, {
				opacity: 1,
				y: 0,
				duration: 2.5,
				ease: 'power2.out',
			})

			// Hold time
			tl.to({}, { duration: 2.5 })

			// Fade out (including last text)
			tl.to(textRef.current, {
				opacity: 0,
				y: -20,
				duration: 1.5,
				ease: 'power2.in',
			})

			// If last text, fade out loader and fade in canvas at the same time
			if (isLast && loaderRef?.current && canvasWrapperRef?.current) {
				gsap.set(loaderRef.current, { opacity: 1 })
				tl.to(
					loaderRef.current,
					{
						opacity: 0,
						duration: 1.5,
						ease: 'sine.out',
						onComplete: () => {
							if (onEnter) {
								onEnter()
							}
						},
					},
					'<' // Start at same time as text fade out
				)
				tl.to(
					canvasWrapperRef.current,
					{
						opacity: 1,
						duration: 1.5,
						ease: 'sine.out',
					},
					'<' // Start at same time
				)
			}
		})
	}, [isClicked, onTriggerCameraAnimation, playAudio, loaderRef, canvasWrapperRef, onEnter, sequenceTexts])

	useEffect(() => {
		if (!isVisible || !textRef.current) {
			// Reset states when hidden
			setIsClicked(false)
			setShouldShowButton(true)
			return
		}

		// Reset states when becoming visible
		setIsClicked(false)
		setShouldShowButton(true)

		// Set initial state - start hidden
		textRef.current.textContent = initialText
		gsap.set(textRef.current, {
			opacity: 0,
			y: 20,
		})

		// Set button initial state - start hidden
		// Use a small delay to ensure button is mounted
		const buttonSetupTimeout = setTimeout(() => {
			if (buttonRef.current) {
				gsap.set(buttonRef.current, {
					opacity: 0,
					y: 20,
					immediateRender: true,
				})
			}
		}, 0)

		// Fade in text and button
		const tl = gsap.timeline({ delay: 0.1 })
		tl.to(textRef.current, {
			opacity: 1,
			y: 0,
			duration: 1.6,
			ease: 'power2.out',
		})
		
		// Animate button if it exists
		if (buttonRef.current) {
			tl.to(
				buttonRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 1.6,
					ease: 'power2.out',
				},
				'<'
			)
		}

		return () => {
			clearTimeout(buttonSetupTimeout)
		}
	}, [isVisible])

	if (!isVisible) return null

	return (
		<div className={styles.introText}>
			<div className={styles.content}>
				<span ref={textRef}>{initialText}</span>
				{shouldShowButton && (
					<EnterButton 
						ref={buttonRef} 
						onClick={handleEnterClick} 
						disabled={isClicked}
					/>
				)}
			</div>
		</div>
	)
}
