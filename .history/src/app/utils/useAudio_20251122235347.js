'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Howl } from 'howler'

/**
 * Professional useAudio hook for managing audio playback with Howler.js
 * 
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.src - Audio source URL(s) - supports multiple formats for fallback
 * @param {boolean} options.autoplay - Whether to autoplay on mount (default: false)
 * @param {boolean} options.loop - Whether to loop the audio (default: false)
 * @param {number} options.volume - Initial volume (0.0 to 1.0, default: 1.0)
 * @param {number} options.rate - Playback rate (0.5 to 4.0, default: 1.0)
 * @param {boolean} options.html5 - Force HTML5 Audio (default: false)
 * @param {boolean} options.preload - Preload audio (default: true)
 * @param {Function} options.onload - Callback when audio is loaded
 * @param {Function} options.onplay - Callback when playback starts
 * @param {Function} options.onpause - Callback when playback pauses
 * @param {Function} options.onstop - Callback when playback stops
 * @param {Function} options.onend - Callback when playback ends
 * @param {Function} options.onerror - Callback when an error occurs
 * @param {Function} options.onloaderror - Callback when loading fails
 * @param {Function} options.onseek - Callback when seeking
 * @param {Function} options.onvolume - Callback when volume changes
 * @param {Function} options.onrate - Callback when rate changes
 * 
 * @returns {Object} Audio control object
 * @returns {Function} play - Play the audio
 * @returns {Function} pause - Pause the audio
 * @returns {Function} stop - Stop the audio
 * @returns {Function} toggle - Toggle play/pause
 * @returns {Function} seek - Seek to a specific time (seconds)
 * @returns {Function} setVolume - Set volume (0.0 to 1.0)
 * @returns {Function} setRate - Set playback rate (0.5 to 4.0)
 * @returns {number} currentTime - Current playback time in seconds
 * @returns {number} duration - Total duration in seconds
 * @returns {number} volume - Current volume (0.0 to 1.0)
 * @returns {number} rate - Current playback rate
 * @returns {boolean} isPlaying - Whether audio is currently playing
 * @returns {boolean} isLoaded - Whether audio is loaded
 * @returns {boolean} isLoading - Whether audio is loading
 * @returns {string|null} error - Error message if any
 * @returns {Howl|null} sound - The Howl instance (for advanced usage)
 */
export function useAudio(options = {}) {
	const {
		src,
		autoplay = false,
		loop = false,
		volume: initialVolume = 1.0,
		rate: initialRate = 1.0,
		html5 = false,
		preload = true,
		onload: onLoadCallback,
		onplay: onPlayCallback,
		onpause: onPauseCallback,
		onstop: onStopCallback,
		onend: onEndCallback,
		onerror: onErrorCallback,
		onloaderror: onLoadErrorCallback,
		onseek: onSeekCallback,
		onvolume: onVolumeCallback,
		onrate: onRateCallback,
	} = options

	// Refs to persist Howl instance across renders
	const howlRef = useRef(null)
	const soundIdRef = useRef(null)

	// State
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolumeState] = useState(initialVolume)
	const [rate, setRateState] = useState(initialRate)

	// Update current time during playback
	useEffect(() => {
		if (!isPlaying || !howlRef.current) return

		const interval = setInterval(() => {
			if (howlRef.current && soundIdRef.current !== null) {
				const time = howlRef.current.seek(soundIdRef.current) || 0
				setCurrentTime(time)
			}
		}, 100) // Update every 100ms

		return () => clearInterval(interval)
	}, [isPlaying])

	// Initialize Howl instance
	useEffect(() => {
		// Don't initialize if no source provided
		if (!src) {
			setIsLoading(false)
			return
		}

		// Cleanup previous instance
		if (howlRef.current) {
			howlRef.current.unload()
			howlRef.current = null
			soundIdRef.current = null
		}

		// Reset state
		setIsPlaying(false)
		setIsLoaded(false)
		setIsLoading(true)
		setError(null)
		setCurrentTime(0)
		setDuration(0)

		// Create new Howl instance
		const howl = new Howl({
			src: Array.isArray(src) ? src : [src],
			autoplay,
			loop,
			volume: initialVolume,
			rate: initialRate,
			html5,
			preload,
			onload: () => {
				setIsLoaded(true)
				setIsLoading(false)
				setDuration(howl.duration())
				onLoadCallback?.(howl)
			},
			onplay: (id) => {
				soundIdRef.current = id
				setIsPlaying(true)
				setError(null)
				onPlayCallback?.(id)
			},
			onpause: (id) => {
				setIsPlaying(false)
				onPauseCallback?.(id)
			},
			onstop: (id) => {
				setIsPlaying(false)
				setCurrentTime(0)
				soundIdRef.current = null
				onStopCallback?.(id)
			},
			onend: (id) => {
				setIsPlaying(false)
				setCurrentTime(0)
				soundIdRef.current = null
				onEndCallback?.(id)
			},
			onerror: (id, err) => {
				setIsLoading(false)
				setIsPlaying(false)
				const errorMsg = `Audio error: ${err}`
				setError(errorMsg)
				onErrorCallback?.(id, err)
			},
			onloaderror: (id, err) => {
				setIsLoading(false)
				const errorMsg = `Failed to load audio: ${err}`
				setError(errorMsg)
				onLoadErrorCallback?.(id, err)
			},
			onseek: (id) => {
				if (howlRef.current && id !== null) {
					const time = howlRef.current.seek(id) || 0
					setCurrentTime(time)
				}
				onSeekCallback?.(id)
			},
			onvolume: (id) => {
				if (howlRef.current) {
					const vol = howlRef.current.volume()
					setVolumeState(vol)
				}
				onVolumeCallback?.(id)
			},
			onrate: (id) => {
				if (howlRef.current && id !== null) {
					const rate = howlRef.current.rate(id) || 1.0
					setRateState(rate)
				}
				onRateCallback?.(id)
			},
		})

		howlRef.current = howl

		// Cleanup on unmount
		return () => {
			if (howlRef.current) {
				howlRef.current.unload()
				howlRef.current = null
				soundIdRef.current = null
			}
		}
	}, [src]) // Only recreate when src changes

	// Play function
	const play = useCallback(() => {
		if (!howlRef.current) return

		if (isLoaded) {
			if (soundIdRef.current === null) {
				soundIdRef.current = howlRef.current.play()
			} else {
				howlRef.current.play(soundIdRef.current)
			}
		} else if (!isLoading) {
			// Try to load and play if not loaded
			howlRef.current.load()
		}
	}, [isLoaded, isLoading])

	// Pause function
	const pause = useCallback(() => {
		if (!howlRef.current || soundIdRef.current === null) return
		howlRef.current.pause(soundIdRef.current)
	}, [])

	// Stop function
	const stop = useCallback(() => {
		if (!howlRef.current || soundIdRef.current === null) return
		howlRef.current.stop(soundIdRef.current)
	}, [])

	// Toggle play/pause
	const toggle = useCallback(() => {
		if (isPlaying) {
			pause()
		} else {
			play()
		}
	}, [isPlaying, play, pause])

	// Seek function
	const seek = useCallback((time) => {
		if (!howlRef.current || soundIdRef.current === null) return
		howlRef.current.seek(time, soundIdRef.current)
	}, [])

	// Set volume function
	const setVolume = useCallback((newVolume) => {
		if (!howlRef.current) return
		const clampedVolume = Math.max(0, Math.min(1, newVolume))
		howlRef.current.volume(clampedVolume)
		setVolumeState(clampedVolume)
	}, [])

	// Set rate function
	const setRate = useCallback((newRate) => {
		if (!howlRef.current || soundIdRef.current === null) return
		const clampedRate = Math.max(0.5, Math.min(4, newRate))
		howlRef.current.rate(clampedRate, soundIdRef.current)
		setRateState(clampedRate)
	}, [])

	return {
		// Control functions
		play,
		pause,
		stop,
		toggle,
		seek,
		setVolume,
		setRate,

		// State
		isPlaying,
		isLoaded,
		isLoading,
		error,
		currentTime,
		duration,
		volume,
		rate,

		// Advanced: direct access to Howl instance
		sound: howlRef.current,
	}
}

