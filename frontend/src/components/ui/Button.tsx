import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary-800 text-white hover:bg-black shadow-sm tracking-wide text-sm uppercase",
        secondary: "bg-white text-slate-800 border border-slate-300 hover:border-slate-800 hover:bg-slate-50 shadow-sm tracking-wide text-sm uppercase",
        outline: "bg-transparent text-primary-800 border border-primary-800 hover:bg-primary-50 tracking-wide text-sm uppercase"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            {children}
        </button>
    );
};
