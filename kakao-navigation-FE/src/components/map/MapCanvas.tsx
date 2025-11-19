import React, { useEffect, useRef, useState } from 'react';
import { useKakaoMapLoader } from '../../hooks/useKakaoMapLoader';
import { useMapStore } from '../../stores/mapStore';
import { DEFAULT_CENTER } from '../../config/kakaoConfig';
import { RouteOverlay } from './RouteOverlay';

// 지도 렌더링 및 출발/도착 마커 표시 담당 컴포넌트
export const MapCanvas: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // 지도 DOM 컨테이너 ref
    const [map, setMap] = useState<kakao.maps.Map | null>(null); // Kakao Map 인스턴스 상태

    const origin = useMapStore((state) => state.origin);
    const destination = useMapStore((state) => state.destination);
    const selectedPlace = useMapStore((state) => state.selectedPlace);
    const activeRole = useMapStore((state) => state.activeRole);
    const setOrigin = useMapStore((state) => state.setOrigin);
    const setDestination = useMapStore((state) => state.setDestination);

    const userLocation = useMapStore((state) => state.userLocation); // 사용자 현재 위치
    const isGpsTracking = useMapStore((state) => state.isGpsTracking); // 안내 중 여부

    const { isLoaded, error, initializeMap } = useKakaoMapLoader();

    const originMarkerRef = useRef<kakao.maps.Marker | null>(null); // 출발지 마커
    const destinationMarkerRef = useRef<kakao.maps.Marker | null>(null); // 도착지 마커
    const userMarkerRef = useRef<kakao.maps.Marker | null>(null); // 사용자 현재 위치 마커

    // Kakao 지도 초기화
    useEffect(() => {
        if (!isLoaded || !mapContainerRef.current || map) return;

        initializeMap(mapContainerRef.current, {
            center: DEFAULT_CENTER,
            onMapReady: (createdMap) => {
                setMap(createdMap); // 지도 인스턴스 저장
            }
        });
    }, [initializeMap, isLoaded, map]);

    // 출발지/도착지 마커 업데이트 (userLocation 관련 조기 리턴 제거)
    useEffect(() => {
        if (!map || !window.kakao || !(window.kakao as any).maps) return;

        const maps = (window.kakao as any).maps;

        // 출발지 마커
        if (origin) {
            const position = new maps.LatLng(origin.coords.lat, origin.coords.lng);
            if (!originMarkerRef.current) {
                originMarkerRef.current = new maps.Marker({
                    position,
                    map
                });
            } else {
                originMarkerRef.current.setMap(map);
                originMarkerRef.current.setPosition(position);
            }
        } else if (originMarkerRef.current) {
            originMarkerRef.current.setMap(null); // 출발지 제거
        }

        // 도착지 마커
        if (destination) {
            const position = new maps.LatLng(
                destination.coords.lat,
                destination.coords.lng
            );
            if (!destinationMarkerRef.current) {
                destinationMarkerRef.current = new maps.Marker({
                    position,
                    map
                });
            } else {
                destinationMarkerRef.current.setMap(map);
                destinationMarkerRef.current.setPosition(position);
            }
        } else if (destinationMarkerRef.current) {
            destinationMarkerRef.current.setMap(null); // 도착지 제거
        }
    }, [map, origin, destination]);

    // 사용자 현재 위치 마커 + 안내 중일 때 지도 중심 이동
    useEffect(() => {
        if (!map || !window.kakao || !(window.kakao as any).maps) return;
        if (!userLocation) {
            // 현재 위치 정보가 없는 경우 마커 제거
            if (userMarkerRef.current) {
                userMarkerRef.current.setMap(null);
                userMarkerRef.current = null;
            }
            return;
        }

        const maps = (window.kakao as any).maps;
        const position = new maps.LatLng(userLocation.lat, userLocation.lng); // 현재 위치 LatLng 생성

        if (!userMarkerRef.current) {
            // 현재 위치 마커가 없다면 새로 생성
            userMarkerRef.current = new maps.Marker({
                position,
                map
            });
        } else {
            // 이미 있다면 위치/지도만 갱신
            userMarkerRef.current.setMap(map);
            userMarkerRef.current.setPosition(position);
        }

        // 안내 모드(isGpsTracking)가 켜져 있을 때는 현재 위치를 따라 지도 중심을 이동
        if (isGpsTracking) {
            map.panTo(position);
        }
    }, [map, userLocation, isGpsTracking]);

    // 선택된 장소(selectedPlace) 변경 시 지도 중심 이동
    useEffect(() => {
        if (!map || !selectedPlace || !window.kakao || !(window.kakao as any).maps) return;

        const maps = (window.kakao as any).maps;
        const center = new maps.LatLng(
            selectedPlace.coords.lat,
            selectedPlace.coords.lng
        );
        map.panTo(center); // 해당 위치로 지도 중심 이동
    }, [map, selectedPlace]);

    // 지도 클릭 시 activeRole 에 따라 출발/도착 좌표 설정
    useEffect(() => {
        if (!map || !window.kakao || !(window.kakao as any).maps) return;

        const maps = (window.kakao as any).maps;

        const handleClick = (mouseEvent: any) => {
            const latlng = mouseEvent.latLng;

            const place = {
                id: `map-click-${Date.now()}`,
                name:
                    activeRole === 'origin'
                        ? '지도에서 선택한 출발지'
                        : '지도에서 선택한 도착지',
                address: '',
                coords: {
                    lat: latlng.getLat(),
                    lng: latlng.getLng()
                }
            };

            if (activeRole === 'origin') {
                setOrigin(place);
            } else {
                setDestination(place);
            }
        };

        // event API 접근 시 타입 에러 방지 위해 any 사용
        maps.event.addListener(map, 'click', handleClick);

        return () => {
            maps.event.removeListener(map, 'click', handleClick);
        };
    }, [map, activeRole, setOrigin, setDestination]);

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-red-400">
                지도 로딩 중 오류가 발생했습니다.
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-300">
                Kakao 지도 SDK 로딩 중...
            </div>
        );
    }

    return (
        <div className="relative flex-1">
            <div ref={mapContainerRef} className="h-full w-full" />
            {/* 경로 폴리라인 overlay */}
            {map && <RouteOverlay map={map} />}
        </div>
    );
};
