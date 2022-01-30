import { useState, useEffect } from "react";
import * as Tone from "tone";

const song = [
	{
		music: "a",
		info: "song",
	},
	{
		music: "b",
		info: "effect",
	},
];

export default function MusicRecommend() {
	const [music, setMusic] = useState([]);
	const [start, setStart] = useState(true);

	useEffect(() => {
		if (music !== null && start == false) {
			const currentMusic = new Tone.Player(music[0], () => {
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

			const currentMusic2 = new Tone.Player(music[1], () => {
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
		} else {
			Tone.Transport.stop();
		}
	});

	const pressPlay = (e) => {
		if (Tone.context.state !== "running") {
			Tone.context.resume();
			Tone.Transport.start();
		}
		const player1 = process.env.PUBLIC_URL + "strolling.mp3";
		const player2 = process.env.PUBLIC_URL + "rain.wav";
		setStart(!start);

		setMusic([player1, player2]);
		console.log(start);
	};

	return (
		<div>
			{start ? (
				<button onClick={() => pressPlay()}>Play button</button>
			) : (
				<button onClick={() => pressPlay()}>Stop</button>
			)}
		</div>
	);
}
