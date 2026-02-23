import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
                                <ShoppingBag className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">
                                Aura<span className="text-primary-600">Style</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
                        <Link to="/shop" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Shop</Link>
                        <Link to="/categories" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Categories</Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About</Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="text-slate-500 hover:text-primary-600 transition-colors hidden sm:block">
                            <Search className="h-5 w-5" />
                        </button>
                        <Link to="/login" className="text-slate-500 hover:text-primary-600 transition-colors">
                            <User className="h-5 w-5" />
                        </Link>
                        <Link to="/cart" className="relative text-slate-500 hover:text-primary-600 transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                3
                            </span>
                        </Link>
                        <button className="md:hidden text-slate-500 hover:text-primary-600 transition-colors">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
