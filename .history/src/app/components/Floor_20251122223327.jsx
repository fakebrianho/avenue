import React from 'react'

export function Floor(props) {
	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]} {...props}>
			<planeGeometry args={[10, 10]} />
			<meshStandardMaterial color='blue' />
		</mesh>
	)
}
