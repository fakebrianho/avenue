'use client'
import { useState } from 'react'
import styles from './Loader.module.css'

export function Loader({ isVisible = true }) {
	if (!isVisible) return null

	return (
		<div className={styles.loader}>
			<span>
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

