'use client'
import styles from './page.module.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import {
	EffectComposer,
	Bloom,
	Noise,
	Vignette,
} from '@react-three/postprocessing'
import { Model } from './components/Prunus_Pendula'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Floor } from './components/Floor'
import { ModelLoader } from './components/ModelLoader'
import { useAudio } from './utils/useAudio'
import { CameraAnimator } from './components/CameraAnimator'

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
	const [shouldAnimateCamera, setShouldAnimateCamera] = useState(false)

	// Function to trigger camera animation
	const triggerCameraAnimation = () => {
		setShouldAnimateCamera(true)
	}

	const handleCameraAnimationComplete = () => {
		setShouldAnimateCamera(false)
	}

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				{/* <Loader
					ref={loaderRef}
					isVisible={isLoading}
					onClick={() => setIsLoading(false)}
					playAudio={playAudio}
					getAudioDuration={getAudioDuration}
					canvasWrapperRef={canvasWrapperRef}
					onTriggerCameraAnimation={triggerCameraAnimation}
				/> */}
				<div ref={canvasWrapperRef} className={styles.canvasWrapper}>
					<Canvas
						camera={{ position: [0, 5, 100] }}
						onCreated={(state) => {
							state.gl.setPixelRatio(window.devicePixelRatio)
							state.raycaster.params.Points = { threshold: 0.1 } // adjust sensitivity
						}}
					>
						<color attach='background' args={['black']} />

						<ModelLoader onLoad={() => setModelLoaded(true)} />
						<CameraAnimator
							targetPosition={[0, 5, 15]}
							duration={40}
							animate={shouldAnimateCamera}
							onComplete={handleCameraAnimationComplete}
						/>
						<OrbitControls
							makeDefault
							enabled={!shouldAnimateCamera}
						/>
						<ambientLight intensity={4.75} color={0xffc0cb} />
						<Floor position={[0, -0.25, -2]} />
						<Model
							position={[0, -0.25, -2]}
							scale={[0.3, 0.3, 0.3]}
						/>
						<EffectComposer>
							<Bloom
								luminanceThreshold={0}
								luminanceSmoothing={0.85}
								intensity={0.6}
							/>
						</EffectComposer>
					</Canvas>
				</div>
			</main>
		</div>
	)
}
