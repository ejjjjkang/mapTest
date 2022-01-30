import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 100%;
	height: 500px;
`;

const MenuWrapper = styled.div``;

function UseInterval(callback, delay) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}

		let id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
}

export default function Mapwindow(params) {
	const [lat_, setLat] = useState(0);
	const [lng_, setLog] = useState(0);
	const [dest, setDest] = useState(true);

	const [keep, setKeep] = useState(false);
	const [keeplist, setKeeplist] = useState([]);
	const [keepPlace, setKeepPlace] = useState([
		{
			id: 1,
			name: "place 1",
			coords: {
				lat: 36.368258636020634,
				lng: 127.36385086076758,
			},
		},
		{
			id: 2,
			name: "place 2",
			coords: {
				lat: 36.3737905724698,
				lng: 127.36720858751144,
			},
		},

		{
			id: 3,
			name: "place 3",
			coords: {
				lat: 37.52852967338524,
				lng: 126.96922791179354,
			},
		},
		{
			id: 4,
			name: "place 4",
			coords: {
				lat: 37.42812509478836,
				lng: 126.99524348235616,
			},
		},
		{
			id: 5,
			name: "place 5",
			coords: {
				lat: 37.42887299230859,
				lng: 126.99683648886092,
			},
		},
	]);
	const [share, setShare] = useState(false);
	const [sharePlace, setSharePlace] = useState([
		{
			id: 1,
			name: "place 1",
			coords: {
				lat: 36.368258636020634,
				lng: 127.36385086076758,
			},
		},
		{
			id: 2,
			name: "place 2",
			coords: {
				lat: 36.3737905724698,
				lng: 127.36720858751144,
			},
		},
	]);

	const mapPlace = useRef();
	const infoPlace = useRef();
	const currentLoc = useRef();

	var kakao = window.kakao;
	var map;
	var locPosition;

	const setMap = () => {
		locPosition = new kakao.maps.LatLng(lat_, lng_);
		var options = {
			center: locPosition,
			level: 3,
		};
		map = new kakao.maps.Map(mapPlace.current, options);
	};

	const getMarker = () => {
		const currentMarker = new kakao.maps.Marker({
			position: locPosition,
		});
		const customOverlay = new kakao.maps.CustomOverlay({
			position: locPosition,
			content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${"현재 위치"}</span><span class="right"></span></div>`,
		});
		currentMarker.setMap(map);
		customOverlay.setMap(map);
		currentLoc.current = currentMarker;
	};

	//loadkeep
	const onLoadKeep = (e) => {
		if (keep == false) {
			setMarker(map);
			setKeep(!keep);
		} else {
			setMarker(null);
			setKeep(!keep);
		}
	};

	const setMarker = () => {
		for (let i = 0; i < keepPlace.length; i++) {
			const { lat, lng } = keepPlace[i].coords;
			const mark_ = new kakao.maps.LatLng(lat, lng);
			const newMarker = new kakao.maps.Marker({
				position: mark_,
			});
			const customOverlayKeep = new kakao.maps.CustomOverlay({
				position: mark_,
				content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${keepPlace[i].name}</span><span class="right"></span></div>`,
			});
			newMarker.setMap(map);
			customOverlayKeep.setMap(map);
		}
	};

	const onClickKeep = (list) => {
		const keepPlaceResult = keepPlace.find((place) => place.name == list);
		const { lat, lng } = keepPlaceResult.coords;
		const keepLocation = new kakao.maps.LatLng(lat, lng);
		const newMarker = new kakao.maps.Marker({
			map: map,
			position: keepLocation,
		});
		const customOverlayKeep = new kakao.maps.CustomOverlay({
			position: keepLocation,
			content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${list}</span><span class="right"></span></div>`,
		});

		newMarker.setMap(map);
		customOverlayKeep.setMap(map);
		map.setCenter(keepLocation);
	};

	//load destination
	//TODO: Need to revise
	const onLoadDestination = () => {
		if (dest === true) {
			keepPlace.map((element) => {
				const { lat, lng } = element.coords;
				const mark_ = new kakao.maps.LatLng(lat, lng);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);

				setKeeplist((keeplist) => [...keeplist, element.name]);
			});

			setDest(!dest);
		}
	};

	//TODO: Need to revise
	const onLoadSharePicture = () => {
		if (share === false) {
			sharePlace.forEach((element) => {
				const { lat, lng } = element.coords;
				console.log(element);
				const mark_ = new kakao.maps.LatLng(lat, lng);
				const newMarker = new kakao.maps.Marker({
					map: map,
					position: mark_,
				});
				newMarker.setPosition(mark_);
				setSharePlace((sharelist) => [...sharelist, element.name]);
			});

			setShare(!share);
		}
	};

	const onLoadCurrent = () => {
		map.setCenter(locPosition);
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function (position) {
			setLat(position.coords.latitude);
			setLog(position.coords.longitude);
		});
		setMap();
		getMarker();
	}, [setMap]);

	//이동시
	UseInterval(() => {
		if (mapPlace !== null) {
			navigator.geolocation.getCurrentPosition(function (position) {
				currentLoc.current.setPosition(
					new kakao.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude,
					),
				);
				console.log(currentLoc.current);
			});
		}
	}, 5000);

	return (
		<div>
			<div>
				<Wrapper className="map" ref={mapPlace}></Wrapper>

				<MenuWrapper>
					{/* <button onClick={onClickEvent}>Load Map</button> */}
					<button onClick={onLoadKeep}>Keep {keepPlace.length} 개</button>
					<button onClick={onLoadSharePicture}>
						공유 풍경 {keepPlace.length}
					</button>
					<button onClick={onLoadDestination}>목적지</button>
					<div ref={infoPlace}>
						{keep
							? keepPlace.map((list, index) => (
									<button onClick={() => onClickKeep(list.name)} key={index}>
										{list.name}
									</button>
							  ))
							: null}
					</div>
					<button onClick={onLoadCurrent}>현재 위치</button>
				</MenuWrapper>
			</div>
		</div>
	);
}
