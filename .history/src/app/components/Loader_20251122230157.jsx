'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import styles from './Loader.module.css'

export function Loader({ isVisible = true }) {
	const textRef = useRef(null)

	useEffect(() => {
		if (!isVisible && textRef.current) {
			gsap.to(textRef.current, {
				opacity: 0,
				y: -20,
				duration: 0.5,
				ease: 'power2.out'
			})
		} else if (isVisible && textRef.current) {
			gsap.set(textRef.current, {
				opacity: 1,
				y: 0
			})
		}
	}, [isVisible])

	return (
		<div className={styles.loader}>
			<span ref={textRef}>
				Loading
				<span className={styles.dots}>
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</span>
			</span>
		</div>
	)
}
