// Kakao Maps 전용 타입 선언
declare global {
    interface Window {
        kakao: typeof kakao;
    }

    namespace kakao {
        namespace maps {
            class LatLng {
                constructor(lat: number, lng: number);
                getLat(): number;
                getLng(): number;
            }

            interface MapOptions {
                center: LatLng;
                level?: number;
            }

            class Map {
                constructor(container: HTMLElement, options: MapOptions);
                setCenter(latlng: LatLng): void;
                panTo(latlng: LatLng): void;
            }

            interface MarkerOptions {
                map?: Map | null;
                position: LatLng;
            }

            class Marker {
                constructor(options: MarkerOptions);
                setMap(map: Map | null): void;
                setPosition(position: LatLng): void;
            }

            interface PolylineOptions {
                path: LatLng[];
                strokeWeight?: number;
                strokeColor?: string;
                strokeOpacity?: number;
                strokeStyle?: 'solid' | 'shortdash' | 'shortdot' | 'shortdashdot' | 'shortdashdotdot';
            }

            class Polyline {
                constructor(options: PolylineOptions);
                setMap(map: Map | null): void;
                setPath(path: LatLng[]): void;
            }

            namespace services {
                class Places {
                    keywordSearch(
                        keyword: string,
                        callback: (data: PlacesSearchResult[], status: Status) => void,
                        options?: PlacesSearchOptions
                    ): void;
                }

                interface PlacesSearchOptions {
                    size?: number;
                    page?: number;
                    location?: LatLng;
                    radius?: number;
                }

                type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';

                interface PlacesSearchResult {
                    id: string;
                    place_name: string;
                    address_name: string;
                    road_address_name: string;
                    x: string; // 경도
                    y: string; // 위도
                }
            }

            function load(callback: () => void): void;
        }
    }
}

export { };
