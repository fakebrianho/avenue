'use client'
import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export function ModelLoader({ onLoad }) {
	// This component loads the model and reports when it's ready
	const gltf = useGLTF('/Prunus_Pendula.glb')
	
	useEffect(() => {
		if (gltf && onLoad) {
			onLoad()
		}
	}, [gltf, onLoad])

	return null // This component doesn't render anything
}

