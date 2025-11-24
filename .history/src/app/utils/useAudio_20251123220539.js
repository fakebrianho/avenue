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
	callback = () => {},
} = {}) {
	const howlRef = useRef(null)
	const callbackRef = useRef(callback)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const [volume, setVolumeState] = useState(initialVolume)

	// Keep callback ref up to date without causing re-initialization
	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	// Initialize Howl - only recreate when essential props change
	useEffect(() => {
		if (!src) return

		// Clean up existing instance before creating new one
		if (howlRef.current) {
			howlRef.current.unload()
			howlRef.current = null
		}

		const howl = new Howl({
			src: Array.isArray(src) ? src : [src],
			autoplay,
			loop,
			volume: initialVolume,
			html5: true, // Use HTML5 audio which can help with decoding issues
			onload: () => setIsLoaded(true),
			onplay: () => setIsPlaying(true),
			onpause: () => setIsPlaying(false),
			onstop: () => setIsPlaying(false),
			onend: () => {
				setIsPlaying(false)
				callbackRef.current()
			},
			onloaderror: (id, error) => {
				console.error('Audio load error for:', src, error)
				// Don't set isLoaded to true on error - this prevents playing broken audio
				// The error might be due to file format or CORS issues
			},
		})

		howlRef.current = howl

		// Check if already loaded
		if (howl.state() === 'loaded') {
			setIsLoaded(true)
		}

		return () => {
			if (howlRef.current) {
				howlRef.current.unload()
				howlRef.current = null
			}
		}
	}, [src, autoplay, loop, initialVolume]) // Removed callback from deps

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
