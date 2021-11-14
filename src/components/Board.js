import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import "../scss/index.scss";

export default function Board(props) {
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const mapRef = useRef();
	const firstUpdate = useRef(true);

	//map
	// const player = new Tone.Player(
	// 	process.env.PUBLIC_URL + "strolling.mp3",
	// ).toDestination();
	// player.autostart = true;
	// const synth = new Tone.Synth().toDestination();
	// synth.triggerAttackRelease("C4", "8n");

	// const pressPlay = async () => {
	// 	await Tone.start();
	// 	console.log("audio is ready");
	// };
	async function getMap() {
		const kakao = window.kakao;
		console.log(kakao);
		const locPosition = await new kakao.maps.LatLng(latitude, longitude);
		const options = {
			//지도를 생성할 때 필요한 기본 옵션
			center: locPosition, //지도의 중심좌표.
			level: 3, //지도의 레벨(확대, 축소 정도)
		};
		await updateLocation(options, locPosition, kakao);
	}

	useEffect(() => {
		//when we want to run useEffect in the first rendering..
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		getMap();
	}, [getMap, mapRef]);

	const updateLocation = (options, locPosition, kakao) => {
		const map_ = new kakao.maps.Map(mapRef.current, options);
		setInterval(() => {
			console.log("I am driving");
			loadLocation();

			if (latitude !== 0 && longitude !== 0) {
				const marker = new kakao.maps.Marker({
					position: locPosition,
				});
				marker.setMap(map_);
			}

			var iwContent = `<div style="padding:5px;">Let's driving! </div>`;

			// const infowindow = new kakao.maps.InfoWindow({
			// 	map: map_,
			// 	position: locPosition,
			// 	content: iwContent,
			// 	removable: true,
			// });
		}, 5000);

		// return () => clearInterval(getLocation);
	};

	const onClickEvent = (e) => {
		//confirm location
		if ("geolocation" in navigator) {
			console.log("Available");
		} else {
			console.log("Not Available");
		}
		loadLocation();

		e.preventDefault();
	};

	const loadLocation = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			// console.log("Latitude is :", position.coords.latitude);
			setLatitude(position.coords.latitude);
			// console.log("Longitude is :", position.coords.longitude);
			setLongitude(position.coords.longitude);
		});
	};

	return (
		<div>
			<div>
				{}
				<div className="map" ref={mapRef}></div>
				current position x: {latitude} y: {longitude}
				<button onClick={onClickEvent}>Find Map</button>
			</div>
			{/* <button onClick={pressPlay}> Play </button> */}
		</div>
	);
}
