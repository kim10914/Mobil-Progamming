import React from 'react';
import { MapCanvas } from '../map/MapCanvas';
import { SearchPanel } from '../panels/SearchPanel';
import { RouteSummary } from '../panels/RouteSummary';

// 전체 레이아웃 구성 (모바일 우선)
export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen flex-col bg-slate-900">
            {/* 상단 헤더 영역 */}
            <header className="flex items-center justify-between px-4 py-3">
                <h1 className="text-lg font-semibold text-slate-50">
                    Kakao Navigation
                </h1>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    PWA Demo
                </span>
            </header>

            {/* 본문 영역: 모바일에서는 상단 패널 + 하단 지도, 데스크탑에서는 좌/우 분할 */}
            <main className="flex flex-1 flex-col gap-2 px-2 pb-2 md:flex-row md:gap-4 md:px-4 md:pb-4">
                {/* 좌측 패널 (검색 + 경로 요약) */}
                <section className="flex w-full flex-col gap-2 md:w-80">
                    <SearchPanel />
                    <RouteSummary />
                </section>

                {/* 우측 지도 영역 */}
                <section className="flex min-h-[260px] flex-1 overflow-hidden rounded-2xl bg-slate-800">
                    <MapCanvas />
                </section>
            </main>
        </div>
    );
};
