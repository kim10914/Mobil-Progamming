import { create } from 'zustand';

// 지도 좌표 타입
export interface LatLng {
    lat: number; // 위도
    lng: number; // 경도
}

// 검색 결과/출발지/도착지에서 사용하는 장소 타입
export interface Place {
    id: string;
    name: string;
    address: string;
    coords: LatLng;
}

// 경로 정보 타입
export interface RouteInfo {
    path: LatLng[]; // 폴리라인 경로 (간단히 [출발, 도착])
    distanceMeters: number; // 거리(m)
    durationMinutes: number; // 예상 소요시간(분)
    summaryText?: string; // 요약 텍스트(예: "5km, 10분")
    provider?: 'approx' | 'kakao'; // approx : 직선, kakao : Directions 기반
}

// 출발/도착 역할
export type ActiveRole = 'origin' | 'destination';

interface MapState {
    origin: Place | null; // 출발지
    destination: Place | null; // 도착지
    activeRole: ActiveRole; // 현재 선택 역할(출발/도착)

    searchKeyword: string; // 검색 키워드
    searchResults: Place[]; // 검색 결과 리스트
    selectedPlace: Place | null; // 지도 포커싱용 선택 장소

    routeInfo: RouteInfo | null; // 거리/시간/경로 정보

    userLocation: LatLng | null; // 사용자 현재 위치
    isGpsTracking: boolean; // 안내 시작 여부(실시간 위치 추적 중인지)

    // 액션들
    setActiveRole: (role: ActiveRole) => void;
    setOrigin: (place: Place | null) => void;
    setDestination: (place: Place | null) => void;

    setSearchKeyword: (keyword: string) => void;
    setSearchResults: (results: Place[]) => void;
    clearSearchResults: () => void;

    setSelectedPlace: (place: Place | null) => void;

    setRouteInfo: (route: RouteInfo | null) => void;
    resetRoute: () => void;

    setUserLocation: (coords: LatLng | null) => void; // 현재 위치 저장
    setIsGpsTracking: (tracking: boolean) => void; // 안내 시작/종료 설정
}

export const useMapStore = create<MapState>((set) => ({
    origin: null,
    destination: null,
    activeRole: 'destination',

    searchKeyword: '',
    searchResults: [],
    selectedPlace: null,

    routeInfo: null,

    // 초기값
    userLocation: null,
    isGpsTracking: false,

    setActiveRole: (role) => set({ activeRole: role }),

    setOrigin: (place) =>
        set((state) => ({
            origin: place,
            // 출발지를 지우면 경로도 초기화
            routeInfo: place && state.destination ? state.routeInfo : null
        })),

    setDestination: (place) =>
        set((state) => ({
            destination: place,
            // 도착지를 지우면 경로도 초기화
            routeInfo: state.origin && place ? state.routeInfo : null
        })),

    setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
    setSearchResults: (results) => set({ searchResults: results }),
    clearSearchResults: () => set({ searchResults: [] }),

    setSelectedPlace: (place) => set({ selectedPlace: place }),

    setRouteInfo: (route) => set({ routeInfo: route }),
    resetRoute: () => set({ routeInfo: null }),

    setUserLocation: (coords) =>
        set((state) => {
            // 아직 출발지가 설정되어 있지 않고, coords 가 있을 때 ->"현재 위치"를 출발지 기본값으로 사용
            if (!state.origin && coords) {
                return {
                    userLocation: coords, // 현재 위치 저장
                    origin: {
                        id: 'user-location',
                        name: '현재 위치', // 지도/요약에서 표시할 이름
                        address: '',
                        coords
                    }
                };
            }
            // 이미 출발지가 있으면 userLocation 만 갱신
            return {
                userLocation: coords
            };
        }),

    // 안내 시작/중지 플래그
    setIsGpsTracking: (tracking) => set({ isGpsTracking: tracking })
}));
