'use client'
import { forwardRef } from 'react'
import styles from './EnterButton.module.css'

export const EnterButton = forwardRef(function EnterButton({ onClick, disabled = false }, ref) {
	return (
		<button 
			ref={ref} 
			className={styles.enterButton} 
			onClick={onClick}
			disabled={disabled}
		>
			Enter
		</button>
	)
})
