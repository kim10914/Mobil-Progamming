import clsx from 'clsx';

interface ChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
}

// 출발/도착 선택 등에 사용하는 Chip 컴포넌트
export const Chip: React.FC<ChipProps> = ({ label, active, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium transition',
                active
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            )}
        >
            {label}
        </button>
    );
};
