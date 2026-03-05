import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CheckoutFailed: React.FC = () => {
    const location = useLocation();
    const reason = location.state?.reason || "Your card was declined. Please verify your payment details and try again.";

    return (
        <div className="bg-slate-50 min-h-screen py-24 flex items-center justify-center px-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-8 sm:p-12 shadow-xl shadow-red-500/5 border border-slate-100 text-center relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-50 to-transparent"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
                        <XCircle className="w-12 h-12" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Failed</h1>
                    <p className="text-slate-500 mb-8 text-lg">We couldn't process your payment at this time.</p>

                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 text-left">
                        <div className="flex items-center gap-3 mb-2 text-red-600 font-semibold">
                            <HelpCircle className="w-5 h-5" />
                            Reason for failure
                        </div>
                        <p className="text-red-700 text-sm">{reason}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/checkout" className="flex-1">
                            <Button variant="primary" size="lg" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 group gap-2">
                                <RefreshCw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                                Try Again
                            </Button>
                        </Link>
                        <Link to="/cart" className="flex-1">
                            <Button variant="outline" size="lg" className="w-full h-12 rounded-xl border-2">
                                Return to Cart
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
