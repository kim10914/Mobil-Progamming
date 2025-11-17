import { useEffect, useState } from 'react';
import { useMapStore } from '../stores/mapStore';

interface UseLiveNavigationResult {
    lastError: string | null; // 마지막 에러 메시지 (옵션)
}

// "안내 시작" 버튼 클릭 시 isGpsTracking = true 가 되면
// navigator.geolocation.watchPosition 으로 위치를 지속적으로 구독하고
// store.setUserLocation 을 통해 현재 위치를 계속 업데이트
export const useLiveNavigation = (): UseLiveNavigationResult => {
    const isGpsTracking = useMapStore((state) => state.isGpsTracking); // 안내 중인지 여부
    const setUserLocation = useMapStore((state) => state.setUserLocation); // 현재 위치 저장 액션

    const [watchId, setWatchId] = useState<number | null>(null); // watchPosition ID
    const [lastError, setLastError] = useState<string | null>(null); // 마지막 에러

    useEffect(() => {
        // 안내 중이 아니면 기존 watch 중지
        if (!isGpsTracking) {
            if (watchId !== null && 'geolocation' in navigator) {
                navigator.geolocation.clearWatch(watchId); // watch 해제
            }
            setWatchId(null);
            return;
        }

        if (!('geolocation' in navigator)) {
            setLastError('브라우저에서 Geolocation API 를 지원하지 않습니다.');
            return;
        }

        // 안내 시작 => 위치 지속 구독
        const id = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(coords); // 현재 위치/출발지 갱신
            },
            (err) => {
                console.error('watchPosition error:', err);
                setLastError(err.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000, // 최대 5초 캐시 허용
                timeout: 10000
            }
        );

        setWatchId(id);

        // cleanup: 컴포넌트 unmount 또는 isGpsTracking false 전환 시
        return () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.clearWatch(id);
            }
        };
    }, [isGpsTracking, setUserLocation]);

    return { lastError };
};
