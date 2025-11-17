import type { LatLng } from '../stores/mapStore';

const EARTH_RADIUS_M = 6371000; // 지구 반경(m) - 하버사인 계산용

// 두 좌표 사이 거리(m) 계산 (하버사인 공식)
export const calculateDistanceMeters = (a: LatLng, b: LatLng): number => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);

    const h =
        sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

    return EARTH_RADIUS_M * c; // 거리(m)
};

// 단순 차량 이동 기준 예상 소요시간(분) 계산
// 가정: 평균 속도 30km/h
export const estimateDurationMinutes = (distanceMeters: number): number => {
    const km = distanceMeters / 1000; // km로 변환
    const hours = km / 30; // 30km/h
    return Math.round(hours * 60); // 분 단위로 반올림
};
