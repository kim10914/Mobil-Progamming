import React, { type FormEvent, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LocationSelector } from './LocationSelector';
import { useMapStore, type Place } from '../../stores/mapStore';

// Kakao Places 검색을 사용하는 검색 패널
export const SearchPanel: React.FC = () => {
    const searchKeyword = useMapStore((state) => state.searchKeyword);
    const searchResults = useMapStore((state) => state.searchResults);
    const activeRole = useMapStore((state) => state.activeRole);

    const setSearchKeyword = useMapStore((state) => state.setSearchKeyword);
    const setSearchResults = useMapStore((state) => state.setSearchResults);
    const clearSearchResults = useMapStore((state) => state.clearSearchResults);
    const setSelectedPlace = useMapStore((state) => state.setSelectedPlace);
    const setOrigin = useMapStore((state) => state.setOrigin);
    const setDestination = useMapStore((state) => state.setDestination);

    // Kakao Places 키워드 검색 수행
    const performSearch = useCallback(
        (keyword: string) => {
            if (!keyword.trim()) return;
            if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
                console.warn('Kakao Maps 서비스가 준비되지 않았습니다.');
                return;
            }

            const { maps } = window.kakao;
            const places = new maps.services.Places();

            places.keywordSearch(
                keyword,
                (data, status) => {
                    if (status !== 'OK') {
                        setSearchResults([]);
                        return;
                    }

                    const mapped: Place[] = data.map((item) => ({
                        id: item.id,
                        name: item.place_name,
                        address: item.road_address_name || item.address_name,
                        coords: {
                            lat: parseFloat(item.y), // y가 위도
                            lng: parseFloat(item.x) // x가 경도
                        }
                    }));

                    setSearchResults(mapped); // 검색 결과 상태 업데이트
                },
                {
                    size: 10
                }
            );
        },
        [setSearchResults]
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        performSearch(searchKeyword);
    };

    const handleSelectResult = (place: Place) => {
        // 역할에 따라 출발지/도착지 설정
        if (activeRole === 'origin') {
            setOrigin(place);
        } else {
            setDestination(place);
        }
        setSelectedPlace(place); // 지도 포커싱용 선택 장소
    };

    return (
        <Card className="space-y-3">
            <LocationSelector />
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    className="h-10 flex-1 rounded-xl border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500"
                    placeholder="목적지를 검색하세요 (예: 강남역, 스타벅스)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)} // 검색 키워드 상태 업데이트
                />
                <Button type="submit" className="h-10 whitespace-nowrap px-3">
                    검색
                </Button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>검색 결과: {searchResults.length}개</span>
                <button
                    type="button"
                    className="text-xs text-slate-400 underline"
                    onClick={clearSearchResults}
                >
                    초기화
                </button>
            </div>

            <div className="max-h-52 space-y-1 overflow-y-auto">
                {searchResults.map((place) => (
                    <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectResult(place)}
                        className="w-full rounded-xl bg-slate-900/80 px-3 py-2 text-left text-xs hover:bg-slate-800"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-100">
                                {place.name}
                            </span>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                                {activeRole === 'origin' ? '출발지로 설정' : '도착지로 설정'}
                            </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                            {place.address}
                        </div>
                    </button>
                ))}
                {searchResults.length === 0 && (
                    <div className="py-4 text-center text-xs text-slate-500">
                        검색 결과가 없습니다. 장소명을 입력해 검색해 주세요.
                    </div>
                )}
            </div>
        </Card>
    );
};
