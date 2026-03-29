import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserActivity } from '../context/UserActivityContext';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { User, Package, Settings, LogOut, ChevronRight, Edit2, MapPin, CreditCard, Shield, Lock, Clock, Camera, Save, X, Plus, Trash2 } from 'lucide-react';
import { userService, addressService, orderService, resolveImageUrl } from '../services/api';
import type { Address } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const { recentProducts } = useUserActivity();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
    const { showToast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        gender: '',
        dob: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Address State
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);

    useEffect(() => {
        if (user && !isEditing && activeTab === 'profile') {
            loadProfile();
            loadAddresses();
        } else if (user && activeTab === 'orders') {
            loadOrders();
        }
    }, [user, isEditing, activeTab]);

    const loadOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders', error);
        }
    };

    const loadAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Failed to load addresses', error);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            await addressService.deleteAddress(id);
            showToast('Address deleted successfully!', 'success');
            loadAddresses();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to delete address', 'error');
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress?.id) {
                await addressService.updateAddress(editingAddress.id, editingAddress);
                showToast('Address updated successfully!', 'success');
            } else {
                await addressService.createAddress(editingAddress || {});
                showToast('Address added successfully!', 'success');
            }
            setIsAddressModalOpen(false);
            setEditingAddress(null);
            loadAddresses();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to save address', 'error');
        }
    };

    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setFormData({
                full_name: data.full_name || '',
                phone: data.phone || '',
                gender: data.gender || '',
                dob: data.dob ? data.dob.split('T')[0] : ''
            });
            updateUser({
                name: data.full_name,
                avatar: data.avatar,
                phone: data.phone,
                gender: data.gender,
                dob: data.dob
            });
        } catch (error) {
            console.error('Failed to load profile', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        try {
            const uploadData = new FormData();
            uploadData.append('full_name', formData.full_name);
            uploadData.append('phone', formData.phone);
            uploadData.append('gender', formData.gender);
            uploadData.append('dob', formData.dob);
            if (avatarFile) {
                uploadData.append('avatar', avatarFile);
            }

            const response = await userService.updateProfile(uploadData);
            
            updateUser({
                name: response.user.full_name,
                avatar: response.user.avatar,
                phone: response.user.phone,
                gender: response.user.gender,
                dob: response.user.dob
            });
            
            showToast('Profile updated successfully!', 'success');
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

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
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary-500/30 overflow-hidden">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : user?.avatar ? (
                                <img src={resolveImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white mb-1" />
                                <span className="text-[10px] text-white font-medium">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
                        <p className="text-slate-500 mt-1">{user?.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                                <Shield className="w-4 h-4" />
                                Verified Account
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full md:w-auto mt-4 md:mt-0 gap-3">
                        {!isEditing ? (
                            <Button variant="outline" className="flex-1 md:flex-none" icon={<Edit2 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 md:flex-none text-slate-500 hover:bg-slate-50" icon={<X className="w-4 h-4" />} onClick={() => { setIsEditing(false); loadProfile(); }}>
                                    Cancel
                                </Button>
                                <Button variant="primary" className="flex-1 md:flex-none" icon={<Save className="w-4 h-4" />} onClick={handleSaveProfile}>
                                    Save
                                </Button>
                            </div>
                        )}
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
                                    {isEditing ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                                <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Cannot be changed)</label>
                                                <input type="email" disabled value={user?.email || ''} className="w-full border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-slate-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500" placeholder="+1 (555) 123-4567" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                                <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500">
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
                                                <p className="text-slate-900 font-medium">{user?.name || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                                                <p className="text-slate-900 font-medium">{user?.email || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                                                <p className="text-slate-900 font-medium">{formData.phone || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Date of Birth</p>
                                                <p className="text-slate-900 font-medium">{formData.dob || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Gender</p>
                                                <p className="text-slate-900 font-medium capitalize">{formData.gender || '-'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary-600" />
                                            Saved Addresses
                                        </h2>
                                        <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => {
                                            setEditingAddress({});
                                            setIsAddressModalOpen(true);
                                        }}>
                                            Add New
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className={`border rounded-2xl p-4 relative ${address.is_default ? 'bg-primary-50/50 border-primary-200' : 'bg-slate-50/50 border-slate-200'}`}>
                                                {address.is_default && (
                                                    <span className="absolute top-4 right-4 bg-primary-100 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-md">Default</span>
                                                )}
                                                <h4 className="font-bold text-slate-900 mb-1">{address.detailed_address || 'Address'}</h4>
                                                <p className="text-slate-600 text-sm mb-3">
                                                    {address.street && <>{address.street}<br /></>}
                                                    {address.city}{address.state ? `, ${address.state}` : ''}{address.country ? ` - ${address.country}` : ''}<br />
                                                    {address.phone && <span className="font-medium">📞 {address.phone}</span>}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => { setEditingAddress(address); setIsAddressModalOpen(true); }} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteAddress(address.id)} className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {addresses.length === 0 && (
                                            <p className="text-slate-500 text-sm py-4">No addresses saved yet. Add one to speed up checkout.</p>
                                        )}
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
                                        orders.map((order) => {
                                            const itemCount = order.items ? order.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;
                                            return (
                                                <div key={order.id} className="p-6 md:p-8 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 xl:gap-4 mb-2">
                                                            <span className="font-bold font-mono text-slate-900 truncate max-w-[150px]">{order.id}</span>
                                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                                order.status === 'cancelled' ? 'bg-slate-100 text-slate-700' :
                                                                    'bg-primary-100 text-primary-700'
                                                                }`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-500">
                                                            {new Date(order.createdAt).toLocaleDateString()} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                        <span className="font-bold text-slate-900">${parseFloat(String(order.total_amount)).toFixed(2)}</span>
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>View Details</Button>
                                                    </div>
                                                </div>
                                            );
                                        })
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

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingAddress?.id ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button onClick={() => { setIsAddressModalOpen(false); setEditingAddress(null); }} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Street / Building</label>
                                <input required type="text" value={editingAddress?.street || ''} onChange={(e) => setEditingAddress({...editingAddress, street: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" placeholder="123 Main St" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Address (Optional)</label>
                                <input type="text" value={editingAddress?.detailed_address || ''} onChange={(e) => setEditingAddress({...editingAddress, detailed_address: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" placeholder="Apartment, suite, unit, building, floor, etc." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input required type="text" value={editingAddress?.city || ''} onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" placeholder="New York" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">State / Province</label>
                                    <input required type="text" value={editingAddress?.state || ''} onChange={(e) => setEditingAddress({...editingAddress, state: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" placeholder="NY" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                    <input required type="text" value={editingAddress?.country || ''} onChange={(e) => setEditingAddress({...editingAddress, country: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" placeholder="United States" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                    <input type="text" value={editingAddress?.phone || ''} onChange={(e) => setEditingAddress({...editingAddress, phone: e.target.value})} className="w-full border-slate-200 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" placeholder="+1..." />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 pt-2 cursor-pointer">
                                <input type="checkbox" checked={editingAddress?.is_default || false} onChange={(e) => setEditingAddress({...editingAddress, is_default: e.target.checked})} className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" />
                                <span className="text-sm font-medium text-slate-700">Set as default address</span>
                            </label>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAddressModalOpen(false); setEditingAddress(null); }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1 text-center justify-center">
                                    {editingAddress?.id ? 'Save Changes' : 'Add Address'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 font-serif">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Order ID</p>
                                    <p className="font-mono font-medium text-slate-900">{selectedOrder.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500 mb-1">Order Date</p>
                                    <p className="font-medium text-slate-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-4">Items Summary</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl items-center">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-50">
                                                {item.product?.image ? (
                                                    <img src={resolveImageUrl(item.product.image)} alt={item.product?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-900 truncate">{item.product?.name || 'Unknown Product'}</h4>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    Qty {item.quantity} {item.attributes && Object.keys(item.attributes).length > 0 ? `• ${Object.entries(item.attributes).map(([k,v]) => `${k} ${v}`).join(', ')}` : ''}
                                                </p>
                                            </div>
                                            <div className="text-right font-medium text-slate-900">
                                                ${parseFloat(String(item.price)).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Shipping Information</h3>
                                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{selectedOrder.shipping_address || 'No address provided'}</p>
                                </div>
                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                                    <h3 className="font-bold text-slate-900 mb-4 text-center border-b border-slate-200 pb-2">Payment Summary</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-medium text-slate-900">${parseFloat(String(selectedOrder.total_amount)).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Shipping</span>
                                            <span className="font-medium text-slate-900">Free</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 pt-3">
                                        <span className="font-bold text-slate-900">Total</span>
                                        <span className="font-bold text-primary-600 text-lg">${parseFloat(String(selectedOrder.total_amount)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

