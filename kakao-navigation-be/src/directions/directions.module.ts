import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import kakaoConfig from '../config/kakao.config';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';

@Module({
  imports: [
    HttpModule, // axios 래핑 모듈
    ConfigModule.forFeature(kakaoConfig) // kakao 설정만 이 모듈에 바인딩
  ],
  controllers: [DirectionsController],
  providers: [DirectionsService]
})
export class DirectionsModule { }
