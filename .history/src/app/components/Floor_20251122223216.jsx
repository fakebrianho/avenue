import React from 'react'

export function Floor(props) {
	return (
		<mesh rotateX={Math.PI / 2} {...props}>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial color='white' />
		</mesh>
	)
}
