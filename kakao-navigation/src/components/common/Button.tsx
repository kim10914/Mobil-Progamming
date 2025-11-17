import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
}

// Tailwind 기반 공통 버튼 컴포넌트
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    className,
    children,
    ...rest
}) => {
    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                variant === 'primary' &&
                'bg-blue-500 text-white hover:bg-blue-400 disabled:bg-slate-600',
                variant === 'outline' &&
                'border border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800 disabled:opacity-50',
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};
