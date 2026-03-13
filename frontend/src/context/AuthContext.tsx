import React, { createContext, useContext, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    dob?: string;
    phone?: string;
    gender?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User, accessToken: string, refreshToken?: string) => void;
    updateUser: (userData: Partial<User>) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData: User, accessToken: string, refreshToken?: string) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
    };

    const updateUser = (updatedFields: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const newUser = { ...prev, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
