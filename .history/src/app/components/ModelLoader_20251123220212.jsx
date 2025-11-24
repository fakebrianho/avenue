'use client'
import { useEffect, useCallback, memo } from 'react'
import { useGLTF } from '@react-three/drei'

export const ModelLoader = memo(function ModelLoader({ onLoad }) {
	// This component loads the model and reports when it's ready
	const gltf = useGLTF('/Prunus_Pendula.glb')

	// Memoize onLoad to prevent unnecessary re-runs
	const memoizedOnLoad = useCallback(() => {
		if (gltf && onLoad) {
			onLoad()
		}
	}, [gltf, onLoad])

	useEffect(() => {
		if (gltf) {
			memoizedOnLoad()
		}
	}, [gltf, memoizedOnLoad])

	return null // This component doesn't render anything
})
