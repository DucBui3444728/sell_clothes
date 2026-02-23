import React from 'react';
import { Minus, Plus, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
    const cartItems = [
        {
            id: '1',
            name: 'Essence Cotton T-Shirt',
            price: 35.00,
            color: 'Navy',
            size: 'M',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: '2',
            name: 'Aura Denim Jacket',
            price: 120.00,
            color: 'Blue',
            size: 'L',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1551028719-01c1eb560841?auto=format&fit=crop&q=80&w=400'
        }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6 flex items-center gap-4 w-full">
                                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-slate-900 mb-1">{item.name}</h3>
                                                    <p className="text-sm text-slate-500 mb-2">Color: {item.color} | Size: {item.size}</p>
                                                    <button className="text-sm text-red-500 font-medium hover:text-red-700 flex items-center gap-1 sm:hidden">
                                                        <X className="w-4 h-4" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center sm:text-slate-900 text-slate-500 font-medium">
                                                <span className="sm:hidden">Price: </span>${item.price.toFixed(2)}
                                            </div>
                                            <div className="col-span-2 flex justify-center w-full sm:w-auto">
                                                <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                                                    <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-slate-900 text-sm">{item.quantity}</span>
                                                    <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-right font-bold text-slate-900 text-lg flex justify-between sm:justify-end items-center w-full sm:w-auto">
                                                <span className="sm:hidden text-slate-500 text-base font-medium">Total: </span>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-emerald-600">Free</span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between text-lg">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button variant="primary" size="lg" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary-500/20 mb-4 flex justify-between items-center px-6">
                                <span>Checkout</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Secure Checkout Guaranteed</span>
                            </div>

                            <div className="border-t border-slate-100 pt-6 text-center">
                                <span className="text-slate-500">or </span>
                                <Link to="/shop" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                                    Continue Shopping &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
