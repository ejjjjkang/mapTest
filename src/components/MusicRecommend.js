import { useState, useEffect } from "react";
import * as Tone from "tone";

export default function MusicRecommend() {
	const [music, setMusic] = useState(null);
	const [start, setStart] = useState(false);

	useEffect(() => {
		if (music !== null) {
			const currentMusic = new Tone.Player(music, () => {
				currentMusic.sync();
				currentMusic.start(0);
				currentMusic.stop(10);
				console.log(currentMusic.state);
			});
			const currentChannel = new Tone.Channel({
				volume: 1,
				channel: 2,
				pan: 0.45,
			}).toDestination();

			currentMusic.connect(currentChannel);

			const currentMusic2 = new Tone.Player(music, () => {
				currentMusic2.sync();
				currentMusic2.start(5);
				currentMusic2.stop(30);
				console.log(currentMusic.state);
			});
			const currentChannel2 = new Tone.Channel({
				volume: 0.4,
				channel: 2,
				pan: -0.4,
			}).toDestination();

			currentMusic2.connect(currentChannel2);

			Tone.Transport.start();
		}
	});

	const pressPlay = (e) => {
		if (Tone.context.state !== "running") {
			Tone.context.resume();
			Tone.Transport.start();
		}
		const player = process.env.PUBLIC_URL + "strolling.mp3";

		setMusic(player);
	};

	return (
		<div>
			<button onClick={() => pressPlay()}>Play button</button>
		</div>
	);
}
