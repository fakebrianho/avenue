'use client'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import styles from './Loader.module.css'
import { IntroText } from './IntroText'

export function Loader({ isVisible = true, onClick }) {
	const textRef = useRef(null)
	const [showIntro, setShowIntro] = useState(false)

	useEffect(() => {
		if (!isVisible && textRef.current) {
			gsap.to(textRef.current, {
				opacity: 0,
				y: -20,
				duration: 0.85,
				ease: 'power2.out',
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

	return (
		<div className={styles.loader} onClick={onClick}>
			<span ref={textRef}>
				Loading
				<span className={styles.dots}>
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</span>
			</span>
			<IntroText isVisible={showIntro} />
		</div>
	)
}
