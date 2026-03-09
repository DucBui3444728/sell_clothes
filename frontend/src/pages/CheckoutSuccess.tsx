import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CheckoutSuccess: React.FC = () => {
    const location = useLocation();
    const orderId = location.state?.orderId || `ORD-${Math.floor(Math.random() * 1000000)}`;

    return (
        <div className="bg-slate-50 min-h-screen py-24 flex items-center justify-center px-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-8 sm:p-12 shadow-xl shadow-primary-500/5 border border-slate-100 text-center relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle className="w-12 h-12" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Successful!</h1>
                    <p className="text-slate-500 mb-8 text-lg">Thank you for your purchase. We're processing your order right away.</p>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-left">
                        <div className="flex items-center gap-3 mb-4 text-primary-600 font-semibold">
                            <Package className="w-5 h-5" />
                            Order Information
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Order ID</span>
                                <span className="font-mono font-medium text-slate-900">{orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/shop" className="block w-full">
                        <Button variant="primary" size="lg" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary-500/20 group">
                            Continue Shopping
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
