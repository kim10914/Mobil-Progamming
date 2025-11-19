import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useMapStore } from '../stores/mapStore';
import { fetchRouteDirections } from '../utils/directionsApi';
import { calculateDistanceMeters, estimateDurationMinutes } from '../utils/geo';

// Directions API + fallback(직선) 로직을 포함한 훅
export const useRouteDirections = () => {
    const origin = useMapStore((state) => state.origin);
    const destination = useMapStore((state) => state.destination);
    const setRouteInfo = useMapStore((state) => state.setRouteInfo);
    const resetRoute = useMapStore((state) => state.resetRoute);

    // 출발/도착이 없으면 쿼리 비활성화
    const hasBoth = !!origin && !!destination;

    const query = useQuery({
        queryKey: ['directions', origin?.coords, destination?.coords], // 출발/도착 좌표를 키로 사용
        queryFn: async () => {
            if (!origin || !destination) {
                throw new Error('출발지와 도착지가 필요합니다.');
            }
            // 실제 Directions API 호출 (프록시)
            const route = await fetchRouteDirections(origin.coords, destination.coords);
            return route;
        },
        enabled: hasBoth, // 출발/도착이 모두 있을 때만 동작
        retry: 1 // 1번 정도 재시도
    });

    // API 성공 시 routeInfo 갱신
    useEffect(() => {
        if (!hasBoth) {
            resetRoute();
            return;
        }

        // 로딩 중이면 아직 routeInfo 를 안 바꿈
        if (query.isLoading) return;

        if (query.isSuccess && query.data) {
            const route = query.data;

            setRouteInfo({
                path: route.path, // Directions API 가 제공하는 polyline 경로
                distanceMeters: route.totalDistanceMeters,
                durationMinutes: route.totalDurationMinutes,
                summaryText: route.summary,
                provider: 'kakao' // 실제 도로 기반
            });
        }

        // 실패 or 에러일 경우 fallback: 직선 경로 + 하버사인
        if (query.isError) {
            if (!origin || !destination) return;

            const distance = calculateDistanceMeters(
                origin.coords,
                destination.coords
            );
            const duration = estimateDurationMinutes(distance);

            setRouteInfo({
                path: [origin.coords, destination.coords], // 직선 fallback
                distanceMeters: distance,
                durationMinutes: duration,
                summaryText: '직선 거리 기준 추정 경로',
                provider: 'approx'
            });
        }
    }, [hasBoth, origin, destination, query.isLoading, query.isError, query.isSuccess, query.data, resetRoute, setRouteInfo]);
};
