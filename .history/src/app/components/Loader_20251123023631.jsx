'use client'
import { useRef, useEffect, useState, forwardRef } from 'react'
import { gsap } from 'gsap'
import styles from './Loader.module.css'
import { IntroText } from './IntroText'

export const Loader = forwardRef(function Loader({ isVisible = true, onClick, playAudio, getAudioDuration, canvasWrapperRef }, ref) {
	const textRef = useRef(null)
	const [showIntro, setShowIntro] = useState(false)
	const [shouldRender, setShouldRender] = useState(true)

	useEffect(() => {
		if (!isVisible && textRef.current) {
			gsap.to(textRef.current, {
				opacity: 0,
				y: -20,
				duration: 1.25,
				ease: 'expo.in',
				onComplete: () => {
					// Show intro text after loading text animates out
					setShowIntro(true)
				},
			})
		} else if (isVisible && textRef.current) {
			gsap.set(textRef.current, {
				opacity: 1,
				y: 0,
			})
			setShowIntro(false)
		}
	}, [isVisible])

	const handleEnter = () => {
		// Remove from DOM after fade completes
		if (onClick) {
			onClick()
		}
		setShouldRender(false)
	}

	if (!shouldRender) {
		return null
	}

	return (
		<div ref={loaderRef} className={styles.loader} onClick={onClick}>
			<span ref={textRef}>
				Loading
				<span className={styles.dots}>
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</span>
			</span>
			<IntroText
				isVisible={showIntro}
				onEnter={handleEnter}
				playAudio={playAudio}
			/>
		</div>
	)
}
