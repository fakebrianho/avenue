'use client'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import styles from './Loader.module.css'
import { IntroText } from './IntroText'

export function Loader({ isVisible = true, onClick, playAudio }) {
	const textRef = useRef(null)
	const loaderRef = useRef(null)
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
		if (loaderRef.current) {
			// Kill any existing animations on this element
			gsap.killTweensOf(loaderRef.current)

			// Ensure initial opacity is set
			gsap.set(loaderRef.current, { opacity: 1, clearProps: 'all' })

			// Animate to 0 over 5 seconds
			gsap.to(loaderRef.current, {
				opacity: 0,
				duration: 5,
				ease: 'power2.out',
				force3D: true,
				onComplete: () => {
					if (onClick) {
						onClick()
					}
					// Remove from DOM after fade completes
					setShouldRender(false)
				},
			})
		}
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
