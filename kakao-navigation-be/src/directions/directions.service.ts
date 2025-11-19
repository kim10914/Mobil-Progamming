import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import kakaoConfig, * as kakaoConfig_1 from '../config/kakao.config';
import { firstValueFrom } from 'rxjs';

export interface LatLng {
    lat: number; // 위도
    lng: number; // 경도
}

// 프론트에 돌려줄 경로 요약 타입 (프론트와 맞춰서 작성)
export interface DirectionsRoute {
    totalDistanceMeters: number; // 전체 거리
    totalDurationMinutes: number; // 전체 시간
    path: LatLng[]; // Polyline 좌표 리스트
    summary?: string;
}

@Injectable()
export class DirectionsService {
    constructor(
        private readonly httpService: HttpService, // axios HttpClient
        @Inject(kakaoConfig.KEY)
        private readonly kakao: kakaoConfig_1.KakaoConfig // Kakao 설정 주입
    ) { }

    // Kakao Directions API 호출 (실제 엔드포인트/파라미터는 공식 문서 기반으로 조정)
    async getRoute(origin: LatLng, destination: LatLng): Promise<DirectionsRoute> {
        const url = this.kakao.directionsBaseUrl; // .env에서 가져온 엔드포인트

        // Kakao Mobility Directions API는 Authorization 헤더에 REST API 키 사용 (예: KakaoAK {키})
        const headers = {
            Authorization: `KakaoAK ${this.kakao.restApiKey}` // REST API 키
        };

        // Kakao 문서에 맞게 파라미터 구성 (여기서는 예시 형태)
        const params = {
            origin: `${origin.lng},${origin.lat}`, // Kakao API 요구 포맷에 따라 조정
            destination: `${destination.lng},${destination.lat}`
            // 필요하면 추가 파라미터 (priority, car_type 등) 포함
        };

        try {
            const response$ = this.httpService.get(url, {
                headers,
                params
            });

            const { data } = await firstValueFrom(response$); // Observable -> Promise

            // Kakao 응답 구조(data)를 DirectionsRoute 형태로 변환
            const route = this.convertKakaoResponse(data);

            return route;
        } catch (err) {
            // 서버 내부 에러로 래핑
            throw new InternalServerErrorException('Kakao Directions API 호출 실패');
        }
    }

    // Kakao Mobility 응답 -> 프론트에서 사용하는 형식으로 변환
    private convertKakaoResponse(data: any): DirectionsRoute {
        // TODO: 실제 Kakao Mobility Directions 응답 스펙에 맞춰 변환 로직 구현
        // 아래는 구조 예시 (실 데이터 구조와 다를 수 있음)
        // data.routes[0].summary.distance, duration, vertexes 등

        // 예시: vertexes: [lng1, lat1, lng2, lat2, ...] 형태라고 가정
        const examplePath: LatLng[] = [];
        const vertexes: number[] = data.routes?.[0]?.summary?.vertexes ?? [];

        for (let i = 0; i < vertexes.length; i += 2) {
            const lng = vertexes[i];
            const lat = vertexes[i + 1];
            examplePath.push({ lat, lng }); // LatLng로 변환
        }

        const distance = data.routes?.[0]?.summary?.distance ?? 0; // m
        const durationSec = data.routes?.[0]?.summary?.duration ?? 0; // sec
        const durationMin = Math.round(durationSec / 60); // 분 단위로 변환

        return {
            totalDistanceMeters: distance,
            totalDurationMinutes: durationMin,
            path: examplePath,
            summary: data.routes?.[0]?.summary?.title ?? undefined
        };
    }
}
