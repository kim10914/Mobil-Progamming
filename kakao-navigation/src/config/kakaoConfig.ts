import { type LatLng } from '../stores/mapStore';

export const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_API_KEY; // Kakao JS 키

// 기본 지도 중심 좌표 (강남역)
export const DEFAULT_CENTER: LatLng = {

    lat: 37.498095,
    lng: 127.02761
};

export const DEFAULT_LEVEL = 5; // 줌 레벨 (숫자 클수록 넓게)

// 현재 위치를 우선으로 반환, 실패하면 DEFAULT_CENTER 반환
export async function getDefaultCenter(timeoutMs = 5000): Promise<LatLng> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return DEFAULT_CENTER;
    }

    return new Promise<LatLng>((resolve) => {
        const timer = setTimeout(() => resolve(DEFAULT_CENTER), timeoutMs);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(timer);
                resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            () => {
                clearTimeout(timer);
                resolve(DEFAULT_CENTER);
            },
            { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
        );
    });
}
