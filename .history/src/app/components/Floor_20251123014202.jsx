import React from 'react'

export function Floor(props) {
	const { position = [0, -20, 0], ...rest } = props
	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={position} {...rest}>
			<planeGeometry args={[12, 12]} />
			<meshStandardMaterial color='blue' doubleSide />
		</mesh>
	)
}
