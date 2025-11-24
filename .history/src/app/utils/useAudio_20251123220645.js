'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Howl } from 'howler'

// Global cache to share Howl instances across components with the same src
// This prevents audio pool exhaustion in React Strict Mode
const audioInstanceCache = new Map()
const instanceRefCounts = new Map()

/**
 * Simple useAudio hook for playing audio with Howler.js
 * Uses instance caching to prevent audio pool exhaustion
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
	const isMountedRef = useRef(true)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const [volume, setVolumeState] = useState(initialVolume)

	// Keep callback ref up to date without causing re-initialization
	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	// Reset mount tracking on mount
	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
		}
	}, [])

	// Initialize Howl - only recreate when essential props change
	useEffect(() => {
		if (!src) return
		
		// Create a cache key from src (normalize array to string)
		const cacheKey = Array.isArray(src) ? src.join(',') : src
		
		// Check if we already have an instance for this src
		let howl = audioInstanceCache.get(cacheKey)
		
		if (howl) {
			// Reuse existing instance
			instanceRefCounts.set(cacheKey, (instanceRefCounts.get(cacheKey) || 0) + 1)
			howlRef.current = howl
			
			// Update state if already loaded
			if (howl.state() === 'loaded') {
				setIsLoaded(true)
			}
			
			// Update volume if it changed
			if (howl.volume() !== initialVolume) {
				howl.volume(initialVolume)
			}
		} else {
			// Create new instance
			howl = new Howl({
				src: Array.isArray(src) ? src : [src],
				autoplay,
				loop,
				volume: initialVolume,
				html5: true, // Use HTML5 audio which can help with decoding issues
				onload: () => {
					if (isMountedRef.current) {
						setIsLoaded(true)
					}
				},
				onplay: () => {
					if (isMountedRef.current) {
						setIsPlaying(true)
					}
				},
				onpause: () => {
					if (isMountedRef.current) {
						setIsPlaying(false)
					}
				},
				onstop: () => {
					if (isMountedRef.current) {
						setIsPlaying(false)
					}
				},
				onend: () => {
					if (isMountedRef.current) {
						setIsPlaying(false)
						callbackRef.current()
					}
				},
				onloaderror: (id, error) => {
					console.error('Audio load error for:', src, error)
					// Don't set isLoaded to true on error - this prevents playing broken audio
				},
			})

			// Cache the instance
			audioInstanceCache.set(cacheKey, howl)
			instanceRefCounts.set(cacheKey, 1)
			howlRef.current = howl

			// Check if already loaded
			if (howl.state() === 'loaded') {
				setIsLoaded(true)
			}
		}

		return () => {
			isMountedRef.current = false
			const count = instanceRefCounts.get(cacheKey) || 0
			
			if (count > 1) {
				// Multiple components using this instance, just decrement ref count
				instanceRefCounts.set(cacheKey, count - 1)
			} else {
				// Last component using this instance, clean it up
				if (howlRef.current) {
					howlRef.current.unload()
				}
				audioInstanceCache.delete(cacheKey)
				instanceRefCounts.delete(cacheKey)
			}
			
			howlRef.current = null
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
