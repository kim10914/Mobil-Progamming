import React, { useEffect, useRef } from 'react';
import { useMapStore } from '../../stores/mapStore';

interface RouteOverlayProps {
    map: kakao.maps.Map; // Kakao Map 인스턴스
}

// 전역 상태의 routeInfo.path 를 기반으로 폴리라인을 렌더링하는 컴포넌트
export const RouteOverlay: React.FC<RouteOverlayProps> = ({ map }) => {
    const routeInfo = useMapStore((state) => state.routeInfo);

    const polylineRef = useRef<kakao.maps.Polyline | null>(null);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        const { maps } = window.kakao;

        if (!routeInfo || routeInfo.path.length < 2) {
            if (polylineRef.current) {
                polylineRef.current.setMap(null); // 경로 제거
                polylineRef.current = null;
            }
            return;
        }

        const path = routeInfo.path.map(
            (p) => new maps.LatLng(p.lat, p.lng) // LatLng 배열 생성
        );

        if (!polylineRef.current) {
            polylineRef.current = new maps.Polyline({
                path,
                strokeWeight: 5,
                strokeColor: '#3b82f6', // 파란색 폴리라인
                strokeOpacity: 0.9,
                strokeStyle: 'solid'
            });
        } else {
            polylineRef.current.setPath(path); // 경로 업데이트
        }

        polylineRef.current.setMap(map); // 지도에 표시
    }, [map, routeInfo]);

    return null;
};
