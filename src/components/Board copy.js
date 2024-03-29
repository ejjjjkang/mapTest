import { useState, useEffect, useRef } from "react";
import "../scss/index.scss";
import dotenv from "dotenv";
import { weatherAPI } from "../api/weatherAPI";

export default function Board(props) {
	dotenv.config();

	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [weather, setWeather] = useState([]);
	const mapRef = useRef();
	const firstUpdate = useRef(true);

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

	useEffect(async () => {
		await weatherAPI(
			`https://api.openweathermap.org/data/2.5/weather?lat=${longitude}&lon=${latitude}&appid=2eddd0cd57462fdfe352f547de5b7f42`,
		).then((res) => {
			if (res.status == 200) {
				console.log(res);
			}
		});
	}, [longitude, latitude]);

	const updateLocation = (options, locPosition, kakao) => {
		const map_ = new kakao.maps.Map(mapRef.current, options);
		// setInterval(() => {
		console.log("I am driving");
		loadLocation();

		if (latitude !== 0 && longitude !== 0) {
			const marker = new kakao.maps.Marker({
				position: locPosition,
			});
			marker.setMap(map_);
		}

		// var iwContent = `<div style="padding:5px;">Let's driving! </div>`;

		// const infowindow = new kakao.maps.InfoWindow({
		// 	map: map_,
		// 	position: locPosition,
		// 	content: iwContent,
		// 	removable: true,
		// });
		// }, 5000);

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
