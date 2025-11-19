import { useEffect, useState } from 'react';
import { useMapStore } from '../stores/mapStore';

interface UseUserLocationResult {
    isLoading: boolean; // 위치 권한 요청/획득 중 여부
    error: string | null; // 에러 메시지 (권한 거부, 미지원 등)
}

// 초기 진입 시 한 번 현재 위치를 받아서
// - store.userLocation 설정
// - 출발지(origin)가 비어있다면 "현재 위치"로 세팅
export const useUserLocation = (): UseUserLocationResult => {
    const setUserLocation = useMapStore((state) => state.setUserLocation);
    const [isLoading, setIsLoading] = useState<boolean>(true); // 위치 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setError('브라우저에서 Geolocation API 를 지원하지 않습니다.'); // 브라우저 미지원
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude, // 현재 위도
                    lng: position.coords.longitude // 현재 경도
                };
                setUserLocation(coords); // store 에 현재 위치 저장 (출발지 기본값 반영 포함)
                setIsLoading(false);
            },
            (err) => {
                // 위치 권한 거부/타임아웃 등
                setError(err.message);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true, // 가능한 높은 정확도
                timeout: 10000, // 10초 타임아웃
                maximumAge: 0 // 캐시된 위치 사용 안 함
            }
        );
    }, [setUserLocation]);

    return { isLoading, error };
};
