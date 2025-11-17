import type { LatLng } from '../stores/mapStore';

// Web용 Kakao 길찾기 링크
// 공식 포맷: https://map.kakao.com/link/to/장소명,위도,경도 :contentReference[oaicite:0]{index=0}
export const buildKakaoMapLinkTo = (name: string, coords: LatLng): string => {
    const encodedName = encodeURIComponent(name);
    return `https://map.kakao.com/link/to/${encodedName},${coords.lat},${coords.lng}`;
};

// Android / iOS 앱용 URL Scheme 예시
// Android: kakaomap://route?sp=위도,경도&ep=위도,경도&by=CAR :contentReference[oaicite:1]{index=1}
export type RouteMode = 'CAR' | 'PUBLICTRANSIT' | 'WALK';

export const buildKakaoAppRouteScheme = (
    origin: LatLng,
    destination: LatLng,
    mode: RouteMode = 'CAR'
): string => {
    return `kakaomap://route?sp=${origin.lat},${origin.lng}&ep=${destination.lat},${destination.lng}&by=${mode}`;
};
