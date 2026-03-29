import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    // We will replace these with real API calls later
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        // Mock fetch stats
        setStats({
            totalUsers: 142,
            totalProducts: 56,
            totalOrders: 89,
            totalRevenue: 12450.00
        });
    }, []);

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-8 h-8 text-emerald-500" />, bg: 'bg-emerald-50' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
        { label: 'Total Products', value: stats.totalProducts, icon: <Package className="w-8 h-8 text-purple-500" />, bg: 'bg-purple-50' },
        { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-8 h-8 text-orange-500" />, bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${card.bg}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{card.label}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="text-slate-500 text-sm text-center py-8">
                    Will be implemented soon. Connect to order and user APIs.
                </div>
            </div>
        </div>
    );
};
