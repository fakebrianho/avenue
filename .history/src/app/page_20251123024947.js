'use client'
import styles from './page.module.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
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
	const canvasWrapperRef = useRef(null)

	// Preload and manage audio at page level so it persists
	const {
		isLoaded: audioIsLoaded,
		play: playAudio,
		getDuration: getAudioDuration,
	} = useAudio({
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

	const loaderRef = useRef(null)
  const animateCamaer

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Loader
					ref={loaderRef}
					isVisible={isLoading}
					onClick={() => setIsLoading(false)}
					playAudio={playAudio}
					getAudioDuration={getAudioDuration}
					canvasWrapperRef={canvasWrapperRef}
				/>
				<div ref={canvasWrapperRef} className={styles.canvasWrapper}>
					<Canvas camera={{ position: [0, 0, 100] }}>
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
						<Model position={[0, -9, -5]} scale={[0.3, 0.3, 0.3]} />
					</Canvas>
				</div>
			</main>
		</div>
	)
}
