import { useEffect } from 'react';
import { useMapStore } from '../stores/mapStore';
import { calculateDistanceMeters, estimateDurationMinutes } from '../utils/geo';

// 출발지/도착지가 둘 다 설정되었을 때
// 거리/소요시간을 계산하고 폴리라인 path 를 전역 상태에 반영하는 훅
export const useRouteCalculator = () => {
    const origin = useMapStore((state) => state.origin);
    const destination = useMapStore((state) => state.destination);
    const setRouteInfo = useMapStore((state) => state.setRouteInfo);
    const resetRoute = useMapStore((state) => state.resetRoute);

    useEffect(() => {
        // 출발지 또는 도착지가 설정되지 않은 경우 경로 초기화
        if (!origin || !destination) {
            resetRoute();
            return;
        }

        const distanceMeters = calculateDistanceMeters(origin.coords, destination.coords); // 거리 계산
        const durationMinutes = estimateDurationMinutes(distanceMeters); // 소요시간 계산

        const path = [origin.coords, destination.coords]; // 간단히 직선 경로

        setRouteInfo({
            path,
            distanceMeters,
            durationMinutes
        });
    }, [origin, destination, resetRoute, setRouteInfo]);
};
