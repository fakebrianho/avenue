'use client'
import styles from './page.module.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { Model } from './components/Prunus_Pendula'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Floor } from './components/Floor'
import { Loader } from './components/Loader'
import { ModelLoader } from './components/ModelLoader'
import { useAudio } from './utils/useAudio'

export default function Home() {
	const [isLoading, setIsLoading] = useState(true)
	const [audioLoaded, setAudioLoaded] = useState(false)
	const [modelLoaded, setModelLoaded] = useState(false)

	// Preload and manage audio at page level so it persists
	const { isLoaded: audioIsLoaded, play: playAudio } = useAudio({
		src: 'audio.mp3',
		autoplay: false,
		loop: false,
		volume: 1,
	})

	// Preload 3D model
	useEffect(() => {
		// Start preloading the model
		useGLTF.preload('/Prunus_Pendula.glb')
	}, [])

	// Track audio loading
	useEffect(() => {
		if (audioIsLoaded) {
			setAudioLoaded(true)
		}
	}, [audioIsLoaded])

	// Auto-fade loader when both are loaded
	useEffect(() => {
		if (audioLoaded && modelLoaded && isLoading) {
			// Small delay to ensure everything is ready
			const timer = setTimeout(() => {
				setIsLoading(false)
			}, 100)
			return () => clearTimeout(timer)
		}
	}, [audioLoaded, modelLoaded, isLoading])

	function Box(props) {
		// This reference will give us direct access to the mesh
		const meshRef = useRef()
		// Set up state for the hovered and active state
		const [hovered, setHover] = useState(false)
		const [active, setActive] = useState(false)
		// Subscribe this component to the render-loop, rotate the mesh every frame
		useFrame((state, delta) => (meshRef.current.rotation.x += delta))
		// Return view, these are regular three.js elements expressed in JSX
		return (
			<mesh
				{...props}
				ref={meshRef}
				scale={active ? 1.5 : 1}
				onClick={(event) => setActive(!active)}
				onPointerOver={(event) => setHover(true)}
				onPointerOut={(event) => setHover(false)}
			>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
			</mesh>
		)
	}
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Loader
					isVisible={isLoading}
					onClick={() => setIsLoading(false)}
				/>
				<Canvas camera={{ position: [0, 0, 50] }}>
					<color attach='background' args={['black']} />

					<ModelLoader onLoad={() => setModelLoaded(true)} />
					<OrbitControls />
					<ambientLight intensity={Math.PI / 2} />
					<spotLight
						position={[10, 10, 10]}
						angle={0.15}
						penumbra={1}
						decay={0}
						intensity={Math.PI}
					/>
					<pointLight
						position={[-10, -10, -10]}
						decay={0}
						intensity={Math.PI}
					/>
					<Floor position={[0, -9, -5]} />
					<Box position={[-1.2, 0, 0]} />
					<Box position={[1.2, 0, 0]} />
					<Model position={[0, -9, -5]} scale={[0.3, 0.3, 0.3]} />
				</Canvas>
			</main>
		</div>
	)
}
