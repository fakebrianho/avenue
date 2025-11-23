import React from 'react'

export function Floor(props) {
	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} {...props}>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial color='blue' />
		</mesh>
	)
}
