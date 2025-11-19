import clsx from 'clsx';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

// 카드 형태 컨테이너
export const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={clsx(
                'rounded-2xl bg-slate-800/80 p-3 shadow-lg ring-1 ring-slate-700/60',
                className
            )}
        >
            {children}
        </div>
    );
};
