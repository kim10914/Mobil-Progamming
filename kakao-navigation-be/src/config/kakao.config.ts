import { registerAs } from '@nestjs/config';

// kakao.* 네임스페이스 설정
export default registerAs('kakao', () => ({
    restApiKey: process.env.KAKAO_REST_API_KEY, // Kakao REST API 키
    directionsBaseUrl: process.env.KAKAO_DIRECTIONS_BASE_URL // Directions API 기본 URL
}));

export type KakaoConfig = {
    restApiKey: string; // REST API 키
    directionsBaseUrl: string; // Directions API 엔드포인트
};
