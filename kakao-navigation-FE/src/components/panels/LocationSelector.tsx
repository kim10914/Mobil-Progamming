import React from 'react';
import { Chip } from '../common/Chip';
import { useMapStore } from '../../stores/mapStore';

// 출발지/도착지 역할 선택 및 간단 상태 표시
export const LocationSelector: React.FC = () => {
    const activeRole = useMapStore((state) => state.activeRole);
    const setActiveRole = useMapStore((state) => state.setActiveRole);
    const origin = useMapStore((state) => state.origin);
    const destination = useMapStore((state) => state.destination);

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
                <Chip
                    label="출발지"
                    active={activeRole === 'origin'}
                    onClick={() => setActiveRole('origin')}
                />
                <Chip
                    label="도착지"
                    active={activeRole === 'destination'}
                    onClick={() => setActiveRole('destination')}
                />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[11px] text-slate-400">
                    출발지:{' '}
                    <strong className="text-slate-200 block max-w-[180px] truncate text-right">
                        {origin ? origin.name : '미지정'}
                    </strong>
                </span>
                <span className="text-[11px] text-slate-400">
                    도착지:{' '}
                    <strong className="text-slate-200 block max-w-[180px] truncate text-right">
                        {destination ? destination.name : '미지정'}
                    </strong>
                </span>
            </div>
        </div>
    );
};
