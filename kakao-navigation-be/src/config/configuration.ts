// 환경변수를 JS 객체 형태로 정리하는 팩토리 함수
export default () => ({
    nodeEnv: process.env.NODE_ENV || 'development', // 현재 NODE_ENV
    port: parseInt(process.env.PORT ?? '4000', 10), // 서버 포트

    kakao: {
        restApiKey: process.env.KAKAO_REST_API_KEY, // Kakao REST API 키
        directionsBaseUrl: process.env.KAKAO_DIRECTIONS_BASE_URL // Directions API 기본 URL
    }
});
