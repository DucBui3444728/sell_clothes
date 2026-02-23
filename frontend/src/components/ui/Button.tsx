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
    const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm hover:shadow",
        outline: "bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50"
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
