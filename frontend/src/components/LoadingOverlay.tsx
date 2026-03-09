import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingOverlay: React.FC = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setIsFading(false);

        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 400);

        const hideTimer = setTimeout(() => {
            setIsLoading(false);
        }, 700);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [location.pathname]);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};
