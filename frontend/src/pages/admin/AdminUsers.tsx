import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { adminUserService } from '../../services/api';
import { Trash2 } from 'lucide-react';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    createdAt: string;
}

export const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchUsers = async () => {
        try {
            const data = await adminUserService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await adminUserService.updateRole(userId, newRole);
            showToast(`User role updated to ${newRole}`, 'success');
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error(error);
            showToast('Failed to update user role', 'error');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await adminUserService.deleteUser(userId);
            showToast('User deleted successfully', 'success');
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error(error);
            showToast('Failed to delete user', 'error');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-600 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.full_name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                                                user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                user.role === 'manager' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}
                                        >
                                            <option value="user">User</option>
                                            <option value="manager">Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="p-8 text-center text-slate-500">No users found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
