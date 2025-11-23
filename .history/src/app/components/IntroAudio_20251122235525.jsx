'use client'

import { useAudio } from '../utils/useAudio'

export function IntroAudio() {
	const { play, pause, stop, isPlaying, volume, setVolume } = useAudio({
		src: ['sound.webm', 'sound.mp3', 'sound.wav'],
		autoplay: true,
		loop: true,
		volume: 0.5,
	})

	return (
		<div>
			<div>IntroAudio</div>
			<button onClick={isPlaying ? pause : play}>
				{isPlaying ? 'Pause' : 'Play'}
			</button>
			<button onClick={stop}>Stop</button>
			<div>
				Volume:{' '}
				<input
					type='range'
					min='0'
					max='1'
					step='0.1'
					value={volume}
					onChange={(e) => setVolume(parseFloat(e.target.value))}
				/>
			</div>
		</div>
	)
}
