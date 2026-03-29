import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserActivity } from '../context/UserActivityContext';
import { Button } from '../components/ui/Button';
import { CreditCard, Truck, ShieldCheck, ChevronLeft, Lock } from 'lucide-react';

export const Checkout: React.FC = () => {
    const { items, cartTotal, clearCart } = useCart();
    const { addOrder } = useUserActivity();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    const shipping = cartTotal > 100 || cartTotal === 0 ? 0 : 5.99;
    const total = cartTotal + shipping;

    if (items.length === 0) {
        return (
            <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                        <Truck className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No items to checkout</h2>
                    <p className="text-slate-500 mb-8">Please add items to your cart first.</p>
                    <Link to="/shop" className="w-full">
                        <Button variant="primary" className="w-full" size="lg">Return to Shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { id, value } = e.target;

        if (id === 'expiry') {
            const onlyNums = value.replace(/\D/g, '');
            if (onlyNums.length === 2) {
                if (formData.expiry.length > value.length) {
                    value = onlyNums;
                } else {
                    value = onlyNums + '/';
                }
            } else if (onlyNums.length > 2) {
                value = `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`;
            } else {
                value = onlyNums;
            }
        } else if (id === 'cardNumber') {
            const onlyNums = value.replace(/\D/g, '');
            value = onlyNums.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        }

        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: Partial<typeof formData> = {};
        let isValid = true;

        if (!formData.fullName.trim()) { newErrors.fullName = 'Full name is required'; isValid = false; }
        if (!formData.email) { newErrors.email = 'Email is required'; isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Valid email is required'; isValid = false; }
        if (!formData.address.trim()) { newErrors.address = 'Address is required'; isValid = false; }
        if (!formData.city.trim()) { newErrors.city = 'City is required'; isValid = false; }
        if (!formData.zipCode.trim()) { newErrors.zipCode = 'ZIP code is required'; isValid = false; }

        if (!formData.cardNumber.trim()) { newErrors.cardNumber = 'Card number is required'; isValid = false; }
        else if (formData.cardNumber.replace(/\s/g, '').length < 15) { newErrors.cardNumber = 'Valid card number is required'; isValid = false; }
        if (!formData.expiry.trim()) { newErrors.expiry = 'Expiry date is required'; isValid = false; }
        if (!formData.cvv.trim()) { newErrors.cvv = 'CVV is required'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        // Simulate network request
        setTimeout(() => {
            setIsProcessing(false);

            // Simulate failure if card number ends in '0000'
            const isTestFailure = formData.cardNumber.endsWith('0000');

            if (isTestFailure) {
                navigate('/checkout/fail', {
                    state: {
                        reason: "Card declined by the issuing bank. (Test mode failure: card ends in 0000)"
                    }
                });
            } else {
                const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
                addOrder({
                    id: orderId,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    total: total, // use total which calculates shipping
                    status: 'Processing',
                    items: items.reduce((sum, item) => sum + item.quantity, 0)
                });
                clearCart();
                navigate('/checkout/success', {
                    state: {
                        orderId: orderId
                    }
                });
            }
        }, 1500);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/cart" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-colors shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Form */}
                    <div className="flex-1 space-y-8">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Information */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Shipping Details</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.fullName ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.email ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.address ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                            placeholder="123 Main St"
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.city ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                                placeholder="New York"
                                            />
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-1">ZIP / Postal Code</label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.zipCode ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                                placeholder="10001"
                                            />
                                            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                maxLength={19}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.cardNumber ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                                placeholder="0000 0000 0000 0000"
                                            />
                                            <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1.5">Tip: End card with <span className="font-mono font-bold">0000</span> to test failed payment screen</p>
                                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                id="expiry"
                                                value={formData.expiry}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.expiry ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                                placeholder="MM/YY"
                                            />
                                            {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${errors.cvv ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}
                                                placeholder="123"
                                            />
                                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity} | {item.attributes ? Object.entries(item.attributes).map(([k,v]) => `${k}: ${v}`).join(', ') : ''}</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 text-slate-600 border-t border-slate-100 pt-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between text-lg">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                variant="primary"
                                className={`w-full h-14 text-lg rounded-xl shadow-lg mb-4 ${isProcessing ? 'opacity-75 cursor-wait' : 'shadow-primary-500/20 hover:-translate-y-1'}`}
                                icon={isProcessing ? undefined : <Lock className="w-5 h-5" />}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : `Pay $${(total).toFixed(2)}`}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Secure encrypted checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
