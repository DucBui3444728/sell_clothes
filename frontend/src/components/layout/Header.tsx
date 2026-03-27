import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Home, Store, Grid3x3, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMobileSearchOpen(false);
        }
    };

    const navLinks = [
        { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
        { to: '/shop', label: 'Shop', icon: <Store className="w-5 h-5" /> },
        { to: '/categories', label: 'Categories', icon: <Grid3x3 className="w-5 h-5" /> },
        { to: '/about', label: 'About', icon: <Info className="w-5 h-5" /> },
    ];

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Link to="/" className="flex flex-col items-center group">
                                {/* Decorative flanking lines */}
                                <div className="flex items-center gap-3 w-full">
                                    <div className="flex-1 h-px bg-slate-300 group-hover:bg-black transition-colors duration-500" />
                                    <span className="font-serif text-2xl tracking-[0.3em] text-slate-900 group-hover:text-black transition-colors uppercase whitespace-nowrap">
                                        Douglas
                                    </span>
                                    <div className="flex-1 h-px bg-slate-300 group-hover:bg-black transition-colors duration-500" />
                                </div>
                                {/* Ornate tagline */}
                                <span className="text-[9px] tracking-[0.35em] text-slate-400 uppercase group-hover:text-slate-600 transition-colors mt-0.5">
                                    Maison de Mode
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`text-sm uppercase tracking-widest font-medium transition-colors ${location.pathname === link.to ? 'text-black' : 'text-slate-500 hover:text-black'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Desktop Search */}
                            <form onSubmit={handleSearch} className="hidden lg:flex relative w-64 items-center group">
                                <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-100/80 border border-transparent focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-100 rounded-full pl-9 pr-4 py-2 text-sm transition-all outline-none"
                                />
                            </form>

                            {/* Mobile/Tablet Search Toggle */}
                            <button
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                                className="lg:hidden text-slate-500 hover:text-primary-600 transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {isAuthenticated ? (
                                <>
                                    {/* User Info */}
                                    <Link to="/profile" className="hidden sm:flex items-center gap-2 hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-colors cursor-pointer">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                                            {user?.avatar ? (
                                                <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-primary-700">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                                            {user?.name}
                                        </span>
                                    </Link>


                                </>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white bg-primary-800 hover:bg-black px-5 py-2 transition-colors">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign In</span>
                                </Link>
                            )}



                            {/* Cart (Available to all) */}
                            <Link to="/cart" className="relative text-slate-500 hover:text-primary-600 transition-colors">
                                <ShoppingBag className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Hamburger */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden text-slate-500 hover:text-primary-600 transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar Dropdown */}
                <div className={`lg:hidden w-full overflow-hidden transition-all duration-300 ease-in-out ${mobileSearchOpen ? 'max-h-20 border-t border-slate-100' : 'max-h-0'}`}>
                    <div className="px-4 py-3 bg-white">
                        <form onSubmit={handleSearch} className="relative flex items-center group">
                            <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-100/80 border border-transparent focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-100 rounded-full pl-9 pr-4 py-2.5 text-sm transition-all outline-none"
                            />
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeSidebar}
            />

            {/* Mobile Sidebar (Right) */}
            <aside
                className={`fixed top-0 right-0 z-[101] h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex flex-col items-center py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3 w-full justify-center">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="font-serif text-xl tracking-[0.3em] text-slate-900 uppercase">
                                Douglas
                            </span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>
                        <span className="text-[8px] tracking-[0.3em] text-slate-400 uppercase mt-1">Maison de Mode</span>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info (Mobile) */}
                {isAuthenticated && (
                    <Link to="/profile" onClick={closeSidebar} className="block px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {user?.avatar ? (
                                    <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-base font-bold text-primary-700">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Navigation Links */}
                <nav className="px-4 py-4 space-y-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === link.to
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth Actions & Cart & Wishlist (Mobile) */}
                <div className="px-4 py-4 space-y-1">


                    {/* Cart is always visible on mobile sidebar too */}
                    <Link
                        to="/cart"
                        onClick={closeSidebar}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/cart'
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Cart
                        {cartCount > 0 && (
                            <span className="ml-auto bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <>

                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={closeSidebar}
                            className="flex items-center justify-center gap-2 mx-2 py-3 bg-primary-800 hover:bg-black text-white text-sm uppercase tracking-widest font-medium transition-colors"
                        >
                            <User className="w-5 h-5" />
                            Sign In
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
};
