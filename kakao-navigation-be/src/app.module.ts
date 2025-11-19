import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { DirectionsModule } from './directions/directions.module';
import kakaoConfig from './config/kakao.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 사용 (ConfigService 어디서나 주입 가능)
      envFilePath: ['.env', `.env.${process.env.NODE_ENV ?? 'development'}`], // 여러 파일 사용 가능
      load: [configuration, kakaoConfig], // configuration 팩토리 함수 사용
      validationSchema // Joi 검증 스키마 적용
    }),
    DirectionsModule // Kakao Directions 프록시 모듈
  ]
})
export class AppModule { }
