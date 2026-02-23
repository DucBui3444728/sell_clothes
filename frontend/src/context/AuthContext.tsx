import React, { createContext, useContext, useState } from 'react';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Tài khoản fix cứng để test
const MOCK_USER = {
    email: 'admin@aurastyle.com',
    password: '123456',
    name: 'Admin User',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email: string, password: string): boolean => {
        if (email === MOCK_USER.email && password === MOCK_USER.password) {
            const loggedInUser = { email: MOCK_USER.email, name: MOCK_USER.name };
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
