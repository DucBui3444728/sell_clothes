import React from 'react';
import { Minus, Plus, ArrowRight, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = cartTotal > 100 || cartTotal === 0 ? 0 : 5.99;
    const total = cartTotal + shipping;

    if (items.length === 0) {
        return (
            <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                    <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="w-full">
                        <Button variant="primary" className="w-full" size="lg">Start Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

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
                                    {items.map((item) => (
                                        <div key={item.id} className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6 flex items-center gap-4 w-full">
                                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
                                                <div className="flex-1 text-left">
                                                    <h3 className="text-base font-semibold text-slate-900 mb-1">{item.name}</h3>
                                                    <p className="text-sm text-slate-500 mb-2">Color: {item.color} | Size: {item.size}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-sm text-red-500 font-medium hover:text-red-700 flex items-center gap-1.5 sm:hidden transition-colors mt-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center sm:text-slate-900 text-slate-500 font-medium">
                                                <span className="sm:hidden">Price: </span>${item.price.toFixed(2)}
                                            </div>
                                            <div className="col-span-2 flex justify-center w-full sm:w-auto">
                                                <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:bg-white rounded-md shadow-sm transition-all"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:bg-white rounded-md shadow-sm transition-all"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-right font-bold text-slate-900 text-lg flex justify-between sm:justify-end items-center w-full sm:w-auto">
                                                <span className="sm:hidden text-slate-500 text-base font-medium">Total: </span>
                                                ${(item.price * item.quantity).toFixed(2)}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="hidden sm:flex ml-6 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
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

                            <Link to="/checkout" className="block w-full">
                                <Button variant="primary" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary-500/20 group" icon={<ArrowRight className="group-hover:translate-x-1 transition-transform" />}>
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
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
