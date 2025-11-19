import type { LatLng } from '../stores/mapStore';
import type { DirectionsRoute } from '../types/directions';

// GET /api/directions?originLat=...&originLng=...&destLat=...&destLng=...
export async function fetchRouteDirections(
    origin: LatLng,
    destination: LatLng
): Promise<DirectionsRoute> {
    const params = new URLSearchParams({
        originLat: String(origin.lat),
        originLng: String(origin.lng),
        destLat: String(destination.lat),
        destLng: String(destination.lng)
    });

    const res = await fetch(`/api/directions?${params.toString()}`, {
        method: 'GET'
    });

    if (!res.ok) {
        throw new Error('경로 조회에 실패했습니다.'); // HTTP 에러
    }

    const data = (await res.json()) as DirectionsRoute; // 응답을 DirectionsRoute 로 캐스팅

    return data;
}
