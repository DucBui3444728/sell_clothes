import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    
    // Check if user is logged in and has admin or manager role
    const isAdmin = isAuthenticated && user && (user.role === 'admin' || user.role === 'manager');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Logged in but not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
