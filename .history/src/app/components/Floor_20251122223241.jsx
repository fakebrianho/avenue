import React from 'react'

export function Floor(props) {
	return (
		<mesh {...props}>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial color='blue' />
		</mesh>
	)
}
