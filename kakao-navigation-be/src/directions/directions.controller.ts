import { Controller, Get, Query } from '@nestjs/common';
import { DirectionsService, LatLng, DirectionsRoute } from './directions.service';

@Controller('api/directions')
export class DirectionsController {
    constructor(private readonly directionsService: DirectionsService) { }

    // GET /api/directions?originLat=...&originLng=...&destLat=...&destLng=...
    @Get()
    async getDirections(
        @Query('originLat') originLat: string,
        @Query('originLng') originLng: string,
        @Query('destLat') destLat: string,
        @Query('destLng') destLng: string
    ): Promise<DirectionsRoute> {
        const origin: LatLng = {
            lat: parseFloat(originLat), // 문자열 → 숫자 변환
            lng: parseFloat(originLng)
        };
        const destination: LatLng = {
            lat: parseFloat(destLat),
            lng: parseFloat(destLng)
        };

        return this.directionsService.getRoute(origin, destination); // DirectionsService 호출
    }
}
