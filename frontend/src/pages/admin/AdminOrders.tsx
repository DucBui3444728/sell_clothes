import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/api';

interface OrderItem {
    id: string;
    product: { name: string; image: string };
    quantity: number;
    price_at_purchase: string;
    selected_size: string;
    selected_color: string;
}

interface Order {
    id: string;
    total_amount: string;
    status: string;
    shipping_address: string;
    payment_method: string;
    createdAt: string;
    user: { full_name: string; email: string };
    items: OrderItem[];
}

export const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            showToast(`Order status updated to ${newStatus}`, 'success');
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error(error);
            showToast('Failed to update order status', 'error');
        }
    };

    if (loading) return <div>Loading orders...</div>;

    // Helper for status colors
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-600 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{order.id.split('-')[0]}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{order.user?.full_name}</div>
                                        <div className="text-xs">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">${parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer ${getStatusStyle(order.status)}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {order.items.length} items
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div className="p-8 text-center text-slate-500">No orders found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
