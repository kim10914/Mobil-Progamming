import type { LatLng } from '../stores/mapStore';

export interface DirectionsSegment {
    path: LatLng[]; // segment 단위 경로 좌표 리스트 (단순히 합쳐서 polyline)
    distanceMeters: number; // segment 거리
    durationMinutes: number; // segment 예상 시간
    description?: string; // "XX로 진입" 같은 안내 문구(있으면)
}

export interface DirectionsRoute {
    totalDistanceMeters: number; // 전체 거리
    totalDurationMinutes: number; // 전체 예상 시간
    path: LatLng[]; // 전체 polyline 좌표 (segment 합친 것)
    summary?: string; // 전체 경로 요약 텍스트
}
