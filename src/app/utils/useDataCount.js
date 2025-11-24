import { useState, useEffect } from 'react'

const STORAGE_KEY = 'data_count'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Custom hook to fetch and cache the data count from the database
 * Stores the value in localStorage for persistence across page reloads
 * @returns {Object} { count, isLoading, error, refetch }
 */
export function useDataCount() {
	const [count, setCount] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchCount = async () => {
		try {
			setIsLoading(true)
			setError(null)

			const response = await fetch('/api/get-data-count', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error('Failed to fetch data count')
			}

			const data = await response.json()
			const newCount = data.count

			// Store in localStorage with timestamp
			const cacheData = {
				count: newCount,
				timestamp: Date.now(),
			}
			localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData))
			setCount(newCount)
		} catch (err) {
			console.error('Error fetching data count:', err)
			setError(err.message)
			// Try to use cached value if available
			const cached = localStorage.getItem(STORAGE_KEY)
			if (cached) {
				try {
					const cachedData = JSON.parse(cached)
					setCount(cachedData.count)
				} catch (e) {
					// If cache is corrupted, ignore it
				}
			}
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		// Check localStorage first
		const cached = localStorage.getItem(STORAGE_KEY)
		if (cached) {
			try {
				const cachedData = JSON.parse(cached)
				const age = Date.now() - cachedData.timestamp

				// Use cached value if it's still fresh
				if (age < CACHE_DURATION) {
					setCount(cachedData.count)
					setIsLoading(false)
					// Optionally fetch in background to update cache
					fetchCount()
					return
				}
			} catch (e) {
				// If cache is corrupted, continue to fetch
			}
		}

		// Fetch if no cache or cache is stale
		fetchCount()
	}, [])

	return {
		count,
		isLoading,
		error,
		refetch: fetchCount,
	}
}

/**
 * Get the cached count from localStorage synchronously
 * Useful for accessing the value without waiting for the hook
 * @returns {number|null} The cached count or null if not available
 */
export function getCachedDataCount() {
	try {
		const cached = localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const cachedData = JSON.parse(cached)
			return cachedData.count
		}
	} catch (e) {
		// If cache is corrupted, return null
	}
	return null
}

