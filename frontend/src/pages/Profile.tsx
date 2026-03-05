import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserActivity } from '../context/UserActivityContext';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { User, Package, Settings, LogOut, ChevronRight, Edit2, MapPin, CreditCard, Shield, Lock, Clock } from 'lucide-react';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { orders, recentProducts } = useUserActivity();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');

    if (!user) {
        return (
            <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Please log in to view your profile</h2>
                    <Button variant="primary" onClick={() => window.location.href = '/login'}>Go to Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary-500/30">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                        <p className="text-slate-500 mt-1">{user.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                                <Shield className="w-4 h-4" />
                                Verified Account
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">
                                Member since 2023
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full md:w-auto mt-4 md:mt-0 gap-3">
                        <Button variant="outline" className="flex-1 md:flex-none" icon={<Edit2 className="w-4 h-4" />}>
                            Edit Profile
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700" onClick={logout} icon={<LogOut className="w-4 h-4" />}>
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 sticky top-24">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5" />
                                        Personal Info
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'rotate-90 text-primary-500' : 'text-slate-400'}`} />
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5" />
                                        Order History
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'rotate-90 text-primary-500' : 'text-slate-400'}`} />
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5" />
                                        Account Settings
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'settings' ? 'rotate-90 text-primary-500' : 'text-slate-400'}`} />
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">

                        {/* Tab: Personal Info */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary-600" />
                                        Contact Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
                                            <p className="text-slate-900 font-medium">{user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                                            <p className="text-slate-900 font-medium">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                                            <p className="text-slate-900 font-medium">+1 (555) 123-4567 <span className="text-xs text-slate-400 ml-2">(Unverified)</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary-600" />
                                            Saved Addresses
                                        </h2>
                                        <Button variant="outline" size="sm">Add New</Button>
                                    </div>
                                    <div className="border border-slate-200 rounded-2xl p-4 relative bg-slate-50/50">
                                        <span className="absolute top-4 right-4 bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">Default</span>
                                        <h4 className="font-bold text-slate-900 mb-1">Home Address</h4>
                                        <p className="text-slate-600 text-sm">
                                            123 Main Street, Apt 4B<br />
                                            New York, NY 10001<br />
                                            United States
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-primary-600" />
                                            Payment Methods
                                        </h2>
                                        <Button variant="outline" size="sm">Add New</Button>
                                    </div>
                                    <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold font-mono">
                                                VISA
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">Visa ending in 4242</p>
                                                <p className="text-slate-500 text-xs">Expires 12/25</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-red-500 hover:text-red-700">Remove</button>
                                    </div>
                                </div>

                                {/* Recently Viewed Products Section */}
                                {recentProducts.length > 0 && (
                                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mt-6 md:mt-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-primary-600" />
                                                Recently Viewed
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {recentProducts.slice(0, 4).map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Order History */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                                <div className="p-6 md:p-8 border-b border-slate-100">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-primary-600" />
                                        Order History
                                    </h2>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {orders.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">
                                            You haven't placed any orders yet.
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order.id} className="p-6 md:p-8 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 xl:gap-4 mb-2">
                                                        <span className="font-bold font-mono text-slate-900">{order.id}</span>
                                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                            order.status === 'Refunded' ? 'bg-slate-100 text-slate-700' :
                                                                'bg-primary-100 text-primary-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500">
                                                        {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                    <span className="font-bold text-slate-900">${order.total.toFixed(2)}</span>
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab: Settings */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary-600" />
                                    Account Settings
                                </h2>

                                <div className="space-y-6 max-w-lg">
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-2">Email Notifications</h3>
                                        <label className="flex items-center gap-3 mb-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" defaultChecked />
                                            <span className="text-slate-700">Order updates and delivery tracking</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" />
                                            <span className="text-slate-700">Promotions and new arrivals</span>
                                        </label>
                                    </div>

                                    <hr className="border-slate-100" />

                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-2">Password</h3>
                                        <p className="text-sm text-slate-500 mb-3">Last changed: 3 months ago</p>
                                        <Button variant="outline" size="sm" icon={<Lock className="w-4 h-4" />}>Change Password</Button>
                                    </div>

                                    <hr className="border-slate-100" />

                                    <div>
                                        <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-slate-500 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-200">Delete Account</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

