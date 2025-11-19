import * as Joi from 'joi';

// 애플리케이션 실행 전에 .env 를 검증하는 스키마
export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(4000),

    KAKAO_REST_API_KEY: Joi.string()
        .required()
        .description('Kakao Mobility REST API Key'),
    KAKAO_DIRECTIONS_BASE_URL: Joi.string()
        .uri()
        .required()
        .description('Kakao Directions API base URL')
});
