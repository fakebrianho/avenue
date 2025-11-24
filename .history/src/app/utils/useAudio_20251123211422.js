'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Howl } from 'howler'

/**
 * Simple useAudio hook for playing audio with Howler.js
 *
 * @param {Object} options
 * @param {string|string[]} options.src - Audio source URL(s)
 * @param {boolean} options.autoplay - Autoplay on mount (default: false)
 * @param {boolean} options.loop - Loop audio (default: false)
 * @param {number} options.volume - Volume 0-1 (default: 1.0)
 *
 * @returns {Object} { play, pause, stop, isPlaying, volume, setVolume }
 */
export function useAudio({
	src,
	autoplay = false,
	loop = false,
	volume: initialVolume = 1.0,
	callbac
} = {}) {
	const howlRef = useRef(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const [volume, setVolumeState] = useState(initialVolume)

	// Initialize Howl
	useEffect(() => {
		if (!src) return

		const howl = new Howl({
			src: Array.isArray(src) ? src : [src],
			autoplay,
			loop,
			volume: initialVolume,
			onload: () => setIsLoaded(true),
			onplay: () => setIsPlaying(true),
			onpause: () => setIsPlaying(false),
			onstop: () => setIsPlaying(false),
			onend: () => setIsPlaying(false),
			onloaderror: (id, error) => {
				console.error('Audio load error:', error)
				setIsLoaded(true) // Set to true even on error to not block loading
			},
		})

		howlRef.current = howl

		// Check if already loaded
		if (howl.state() === 'loaded') {
			setIsLoaded(true)
		}

		return () => {
			howl.unload()
		}
	}, [src, autoplay, loop, initialVolume])

	// Control functions
	const play = useCallback(() => {
		howlRef.current?.play()
	}, [])

	const pause = useCallback(() => {
		howlRef.current?.pause()
	}, [])

	const stop = useCallback(() => {
		howlRef.current?.stop()
	}, [])

	const setVolume = useCallback((newVolume) => {
		const vol = Math.max(0, Math.min(1, newVolume))
		if (howlRef.current) {
			howlRef.current.volume(vol)
			setVolumeState(vol)
		}
	}, [])

	const getDuration = useCallback(() => {
		return howlRef.current?.duration() || 0
	}, [])

	const getHowl = useCallback(() => {
		return howlRef.current
	}, [])

	return {
		play,
		pause,
		stop,
		isPlaying,
		isLoaded,
		volume,
		setVolume,
		getDuration,
		getHowl,
	}
}
