import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../services/api';
import { LayoutDashboard, Users, Package, Tags, ShoppingCart, LifeBuoy, LogOut, Menu, X, ArrowLeft } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
        { to: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
        { to: '/admin/products', icon: <Package className="w-5 h-5" />, label: 'Products' },
        { to: '/admin/categories', icon: <Tags className="w-5 h-5" />, label: 'Categories' },
        { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
        { to: '/admin/support', icon: <LifeBuoy className="w-5 h-5" />, label: 'Support Tickets' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
                        <span className="font-serif text-xl tracking-widest text-slate-900 uppercase">
                            Admin Panel
                        </span>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-900">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <button 
                            onClick={() => navigate('/')} 
                            className="flex items-center gap-3 w-full px-4 py-3 mb-4 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Store
                        </button>
                        
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-4">Management</div>
                        
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`
                                }
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={resolveImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold text-primary-700">{user?.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 bg-white lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-900">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-serif text-lg tracking-widest text-slate-900 uppercase">Admin</span>
                    <div className="w-6" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
