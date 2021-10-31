import * as Tone from "tone";

export default function MusicRecommend() {
	//map

	const pressPlay = async () => {
		const player = await new Tone.Player(
			process.env.PUBLIC_URL + "strolling.mp3",
		);
		const waveform = new Tone.Waveform().toDestination();

		console.log("audio is ready");
		await Tone.start();
	};

	return (
		<div>
			<button onClick={pressPlay}>Play button</button>
		</div>
	);
}
