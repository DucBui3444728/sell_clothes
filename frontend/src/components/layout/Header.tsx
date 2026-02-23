import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();

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

                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary-700">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                                        {user?.name}
                                    </span>
                                </div>

                                {/* Cart (only visible when logged in) */}
                                <Link to="/cart" className="relative text-slate-500 hover:text-primary-600 transition-colors">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        3
                                    </span>
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={logout}
                                    className="text-slate-500 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        )}

                        <button className="md:hidden text-slate-500 hover:text-primary-600 transition-colors">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
