'use client'

import { useAudio } from '../utils/useAudio'

export function IntroAudio() {
	const {
		play,
		pause,
		stop,
		toggle,
		isPlaying,
		isLoaded,
		isLoading,
		error,
		currentTime,
		duration,
		volume,
		setVolume,
	} = useAudio({
		src: ['sound.webm', 'sound.mp3', 'sound.wav'],
		autoplay: true,
		loop: true,
		volume: 0.5,
		onend: () => {
			console.log('Finished!')
		},
		onerror: (id, err) => {
			console.error('Audio error:', err)
		},
	})

	return (
		<div>
			<div>IntroAudio</div>
			{isLoading && <div>Loading audio...</div>}
			{error && <div>Error: {error}</div>}
			{isLoaded && (
				<div>
					<button onClick={toggle}>
						{isPlaying ? 'Pause' : 'Play'}
					</button>
					<button onClick={stop}>Stop</button>
					<div>
						Time: {Math.floor(currentTime)}s / {Math.floor(duration)}s
					</div>
					<div>
						Volume:{' '}
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={volume}
							onChange={(e) => setVolume(parseFloat(e.target.value))}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
