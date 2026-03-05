import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../components/product/ProductCard';

export interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: number;
}

interface UserActivityContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
    recentProducts: Product[];
    addRecentProduct: (product: Product) => void;
}

const UserActivityContext = createContext<UserActivityContextType | null>(null);

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('user_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [recentProducts, setRecentProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('recent_products');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('user_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('recent_products', JSON.stringify(recentProducts));
    }, [recentProducts]);

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
    };

    const addRecentProduct = (product: Product) => {
        setRecentProducts(prev => {
            const filtered = prev.filter(p => p.id !== product.id);
            return [product, ...filtered].slice(0, 10); // Keep last 10
        });
    };

    return (
        <UserActivityContext.Provider value={{ orders, addOrder, recentProducts, addRecentProduct }}>
            {children}
        </UserActivityContext.Provider>
    );
};

export const useUserActivity = () => {
    const context = useContext(UserActivityContext);
    if (!context) throw new Error('useUserActivity must be used within UserActivityProvider');
    return context;
};
