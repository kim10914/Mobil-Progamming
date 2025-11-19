import { useEffect, useState, useCallback } from 'react';
import { KAKAO_APP_KEY, DEFAULT_CENTER, DEFAULT_LEVEL } from '../config/kakaoConfig';
import type { LatLng } from '../stores/mapStore';

let kakaoScriptLoading = false; // SDK 로딩 중인지 여부
let kakaoScriptLoaded = false; // SDK 로딩 완료 여부

interface UseKakaoMapLoaderResult {
    isLoaded: boolean; // Kakao SDK 로딩 완료 여부
    error: Error | null; // 로딩 에러
    initializeMap: (
        container: HTMLDivElement,
        options?: {
            center?: LatLng;
            level?: number;
            onMapReady?: (map: kakao.maps.Map) => void;
        }
    ) => void;
}

export const useKakaoMapLoader = (): UseKakaoMapLoaderResult => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false); // SDK 준비 상태
    const [error, setError] = useState<Error | null>(null); // 에러 상태

    useEffect(() => {
        // 이미 로드된 경우
        if (kakaoScriptLoaded && window.kakao && window.kakao.maps) {
            setIsLoaded(true);
            return;
        }

        // 이미 로딩 중이면 onload 대기
        if (kakaoScriptLoading) {
            const interval = setInterval(() => {
                if (kakaoScriptLoaded && window.kakao && window.kakao.maps) {
                    setIsLoaded(true);
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }

        kakaoScriptLoading = true;

        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
            kakaoScriptLoaded = true;
            kakaoScriptLoading = false;
            setIsLoaded(true);
        };
        script.onerror = () => {
            kakaoScriptLoading = false;
            setError(new Error('Kakao Maps SDK 로딩 실패')); // SDK 로딩 실패 시 에러 설정
        };

        document.head.appendChild(script);
    }, []);

    const initializeMap: UseKakaoMapLoaderResult['initializeMap'] = useCallback(
        (container, options) => {
            if (!window.kakao || !window.kakao.maps) {
                console.warn('Kakao Maps SDK 가 아직 로딩되지 않았습니다.');
                return;
            }

            const center = options?.center ?? DEFAULT_CENTER; // 중심 좌표
            const level = options?.level ?? DEFAULT_LEVEL; // 줌 레벨

            window.kakao.maps.load(() => {
                const mapCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
                const mapOptions: kakao.maps.MapOptions = {
                    center: mapCenter,
                    level
                };

                const map = new window.kakao.maps.Map(container, mapOptions); // 지도 생성

                if (options?.onMapReady) {
                    options.onMapReady(map); // 지도 준비 완료 콜백
                }
            });
        },
        []
    );

    return {
        isLoaded,
        error,
        initializeMap
    };
};
