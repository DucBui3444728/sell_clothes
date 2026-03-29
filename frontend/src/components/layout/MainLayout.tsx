import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
            <Header />
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
