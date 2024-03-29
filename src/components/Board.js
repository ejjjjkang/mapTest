import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	position: relative;
	width: 100%;
`;

const MenuWrapper = styled.div`
	position: absolute;
	z-index: 10;
`;

const MapWrapper = styled.div`
	width: 100%;
	height: 500px;
`;

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
	var geocoder;

	const setMap = () => {
		locPosition = new kakao.maps.LatLng(lat_, lng_);
		var options = {
			center: locPosition,
			level: 3,
		};
		map = new kakao.maps.Map(mapPlace.current, options);
		geocoder = new kakao.maps.services.Geocoder();
	};

	const setCurrentMarker = (position) => {
		const currentMarker = new kakao.maps.Marker({
			map: map,
			position: position,
		});
		const customOverlay = new kakao.maps.CustomOverlay({
			position: position,
			content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${
				position == locPosition ? "현재 위치" : null
			}</span><span class="right"></span></div>`,
		});
		currentMarker.setMap(map);
		customOverlay.setMap(map);
		currentLoc.current = currentMarker;
	};

	//loadkeep
	const onLoadKeep = (e) => {
		if (keep == false) {
			setKeepMarkers(map);
			setKeep(!keep);
		} else {
			setKeepMarkers(null);
			setKeep(!keep);
		}
	};

	const setKeepMarkers = () => {
		for (let i = 0; i < keepPlace.length; i++) {
			const { lat, lng } = keepPlace[i].coords;
			const mark_ = new kakao.maps.LatLng(lat, lng);
			const newMarker = new kakao.maps.Marker({
				map: map,
				position: mark_,
			});
			const customOverlayKeep = new kakao.maps.CustomOverlay({
				position: mark_,
				content: `<div className ="label" style="color:blue; background-color:white;"><span class="left"></span><span class="center">${keepPlace[i].name}</span><span class="right"></span></div>`,
			});

			const infoWindow = new kakao.maps.InfoWindow({
				content: `<div>${keepPlace[i].name}</div>`,
			});

			kakao.maps.event.addListener(
				newMarker,
				"mouseover",
				makeOverListener(map, newMarker, infoWindow),
			);
			newMarker.setMap(map);
			customOverlayKeep.setMap(map);
		}
	};

	function makeOverListener(map, marker, infowindow) {
		return function () {
			infowindow.open(map, marker);
		};
	}

	function makeOutListener(infowindow) {
		return function () {
			infowindow.close();
		};
	}

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
		const infoWindow = new kakao.maps.InfoWindow({
			content: `<div>${list}</div>`,
		});

		kakao.maps.event.addListener(
			newMarker,
			"mouseover",
			makeOverListener(map, newMarker, infoWindow),
		);

		kakao.maps.event.addListener(
			newMarker,
			"mouseout",
			makeOutListener(infoWindow),
		);

		newMarker.setMap(map);
		customOverlayKeep.setMap(map);
		map.setCenter(keepLocation);
	};

	const onClickGeocoder = () => {
		searchDetailAddrFromCoords(locPosition, function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				const detailAddr = !!result[0].address
					? "<div>도로명주소 : " + result[0].address.address_name + "</div>"
					: "";

				console.log(detailAddr);
			}
		});
	};

	function searchDetailAddrFromCoords(coords, callback) {
		// 좌표로 법정동 상세 주소 정보를 요청합니다
		geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
	}

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
		setCurrentMarker(locPosition);
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
			<Wrapper>
				<MenuWrapper>
					{/* <button onClick={onClickEvent}>Load Map</button> */}
					<button onClick={onClickGeocoder}>주변과 관련된 영상 찾아보기</button>
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
				<MapWrapper className="map" ref={mapPlace}></MapWrapper>
			</Wrapper>
		</div>
	);
}
