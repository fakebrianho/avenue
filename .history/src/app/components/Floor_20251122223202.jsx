import React from 'react'

export function Floor(props) {
	return (
		<mesh>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial color='white' />
		</mesh>
	)
}
