'use client'
import styles from './page.module.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Model } from './components/Prunus_Pendula'
import { OrbitControls } from '@react-three/drei'
import { Floor } from './components/Floor'
import { Loader } from './components/Loader'

export default function Home() {
	const [isLoading, setIsLoading] = useState(true)

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
	//   <div class="screen screen--flex action">
	//   <span class="action__line">Headphones Recommended</span>
	//   <button id="play-btn" class="button button--box">Play</button>
	// </div>
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<div className={styles.screen}>
					<span className={styles.line}>Headphones Recommended</span>
					<button id='play-btn' className={styles.button}>
						Play
					</button>
				</div>
				<div className={styles.loader}>
					<span>
						Loading
						<span className={styles.dots}>
							<span>.</span>
							<span>.</span>
							<span>.</span>
						</span>
					</span>
				</div>
				<Canvas camera={{ position: [0, 0, 50] }}>
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
