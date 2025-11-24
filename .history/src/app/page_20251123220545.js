'use client'
import styles from './page.module.css'
import { Canvas } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Model } from './components/Prunus_Pendula'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Floor } from './components/Floor'
import { ModelLoader } from './components/ModelLoader'
import { useAudio } from './utils/useAudio'
import { CameraAnimator } from './components/CameraAnimator'
import { useDataCount } from './utils/useDataCount'
import { Loader } from './components/Loader'


export default function Home() {
	const [isLoading, setIsLoading] = useState(true)
	const [modelLoaded, setModelLoaded] = useState(false)
	const canvasWrapperRef = useRef(null)
	
	// Fetch and store data count in localStorage
	const { count: dataCount, isLoading: isCountLoading } = useDataCount()

	// Preload and manage audio at page level so it persists
	const {
		isLoaded: audio1Loaded,
		play: playAudio1,
		isPlaying: isPlaying1,
		getDuration: getAudioDuration,
	} = useAudio({
		src: 'audio.mp3',
		autoplay: false,
		loop: false,
		volume: 1,
	})

	const {
		isLoaded: audio2Loaded,
		play: playAudio2,
	  } = useAudio({
		src: 'bg.mp3', // or a different file
		autoplay: false,
		loop: true,
		volume: 1,
	  })

	  useEffect(() => {
		if (!isPlaying1 && audio1Loaded) {
		  // First audio ended, start the looping one
		  playAudio2()
		}
	  }, [isPlaying1, audio1Loaded, playAudio2])

	// Preload 3D model
	useEffect(() => {
		// Start preloading the model
		useGLTF.preload('/Prunus_Pendula.glb')
	}, [])

	// Track audio loading - both audios need to be loaded
	const audioLoaded = audio1Loaded && audio2Loaded

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

	// Memoize camera animation callbacks
	const triggerCameraAnimation = useCallback(() => {
		setShouldAnimateCamera(true)
	}, [])

	const handleCameraAnimationComplete = useCallback(() => {
		setShouldAnimateCamera(false)
	}, [])

	// Memoize canvas onCreated callback
	const handleCanvasCreated = useCallback((state) => {
		state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Cap at 2 for performance
		state.raycaster.params.Points = { threshold: 0.1 } // adjust sensitivity
	}, [])

	// Memoize model load callback
	const handleModelLoad = useCallback(() => {
		setModelLoaded(true)
	}, [])

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Loader
					ref={loaderRef}
					isVisible={isLoading}
					onClick={() => setIsLoading(false)}
					playAudio={playAudio1}
					getAudioDuration={getAudioDuration}
					canvasWrapperRef={canvasWrapperRef}
					onTriggerCameraAnimation={triggerCameraAnimation}
				/>
				<div ref={canvasWrapperRef} className={styles.canvasWrapper}>
					<Canvas
						camera={{ position: [0, 5, 100] }}
						onCreated={handleCanvasCreated}
					>
						<color attach='background' args={['black']} />

						<ModelLoader onLoad={handleModelLoad} />
						<CameraAnimator
							targetPosition={[0, 5, 15]}
							duration={40}
							animate={shouldAnimateCamera}
							onComplete={handleCameraAnimationComplete}
						/>
						<OrbitControls
							makeDefault
							enabled={!shouldAnimateCamera}
							enablePan={true}
							enableZoom={true}
							enableDamping={true}
							enableRotate={true}
						/>
						<ambientLight intensity={4.75} color={0xffc0cb} />
						<Floor position={[0, -0.25, -2]} />
						<Model
							position={[0, -0.25, -2]}
							scale={[0.3, 0.3, 0.3]}
							isLoading={isLoading}
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
