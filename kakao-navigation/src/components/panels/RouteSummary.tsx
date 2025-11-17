import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useMapStore } from '../../stores/mapStore';
import { buildKakaoMapLinkTo, buildKakaoAppRouteScheme } from '../../utils/kakaoUrl';

// 거리/소요시간 및 "카카오맵으로 길찾기" 버튼 패널
export const RouteSummary: React.FC = () => {
    const origin = useMapStore((state) => state.origin);
    const destination = useMapStore((state) => state.destination);
    const routeInfo = useMapStore((state) => state.routeInfo);

    const userLocation = useMapStore((state) => state.userLocation); // 현재 위치
    const isGpsTracking = useMapStore((state) => state.isGpsTracking); // 안내 중 여부
    const setIsGpsTracking = useMapStore((state) => state.setIsGpsTracking); // 안내 시작/중지
    const setOrigin = useMapStore((state) => state.setOrigin); // 출발지 변경

    const distanceText = useMemo(() => {
        if (!routeInfo) return '-';
        const km = routeInfo.distanceMeters / 1000;
        return km < 1 ? `${routeInfo.distanceMeters.toFixed(0)} m` : `${km.toFixed(2)} km`;
    }, [routeInfo]);

    const durationText = useMemo(() => {
        if (!routeInfo) return '-';
        return `${routeInfo.durationMinutes} 분 (차량 기준 추정)`;
    }, [routeInfo]);

    const handleOpenKakaoWeb = () => {
        if (!destination) return;
        const url = buildKakaoMapLinkTo(destination.name, destination.coords); // Web 길찾기 링크 생성
        window.open(url, '_blank');
    };

    const handleOpenKakaoApp = () => {
        if (!origin || !destination) return;
        const scheme = buildKakaoAppRouteScheme(
            origin.coords,
            destination.coords,
            'CAR'
        ); // Kakao 앱용 scheme
        // 앱 설치 여부에 따라 브라우저에서 처리됨
        window.location.href = scheme;
    };

    //  추가: 안내 시작/중지 버튼 동작 핸들러
    const handleToggleGuide = () => {
        if (!destination) return; // 도착지가 없으면 안내 시작 불가

        if (!isGpsTracking) {
            // 안내 시작 시, 현재 위치가 있다면 이를 출발지로 우선 설정
            if (userLocation) {
                setOrigin({
                    id: 'user-location',
                    name: '현재 위치',
                    address: '',
                    coords: userLocation
                });
            }
            setIsGpsTracking(true); // 안내 모드 ON
        } else {
            // 안내 중지
            setIsGpsTracking(false);
        }
    };

    return (
        <Card className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100">
                    경로 요약
                </h2>
                <span className="text-[11px] text-slate-400">
                    Kakao Map Web / App 연동
                </span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
                <div>
                    <span className="font-semibold text-slate-400">출발지: </span>
                    <span>{origin ? origin.name : '미지정'}</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-400">도착지: </span>
                    <span>{destination ? destination.name : '미지정'}</span>
                </div>
                <div className="pt-2">
                    <span className="font-semibold text-slate-400">거리: </span>
                    <span>{distanceText}</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-400">예상 소요시간: </span>
                    <span>{durationText}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
                <Button
                    onClick={handleToggleGuide}
                    disabled={!destination}
                >
                    {isGpsTracking
                        ? '안내 중지 (실시간 위치 추적 중)'
                        : '안내 시작 (현재 위치 기준)'}
                </Button>
                <Button
                    disabled={!destination}
                    onClick={handleOpenKakaoWeb}
                >
                    카카오맵(웹)으로 길찾기
                </Button>
                <Button
                    variant="outline"
                    disabled={!origin || !destination}
                    onClick={handleOpenKakaoApp}
                >
                    카카오맵 앱으로 길찾기 (URL Scheme)
                </Button>
                <p className="text-[10px] text-slate-500">
                    * 실제 네비게이션은 카카오맵 Web/App 에서 수행됩니다.
                </p>
            </div>
        </Card>
    );
};
