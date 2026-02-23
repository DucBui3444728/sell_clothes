import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { ALL_PRODUCTS } from '../data/products';

const FEATURED_PRODUCTS = ALL_PRODUCTS.slice(0, 4);

export const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-100/50">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2600"
                        alt="Hero background"
                        className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent mix-blend-multiply" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6 animate-fade-in-up">
                            New Collection 2026
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">Everyday</span> Style
                        </h1>
                        <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-lg leading-relaxed">
                            Discover premium clothing designed for comfort and crafted to make you feel confident, wherever you go.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/shop">
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary-500/30">
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/shop?sort=new">
                                <Button variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
                                    Explore New Arrivals
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center justify-center gap-4 text-center md:text-left">
                            <div className="bg-primary-50 text-primary-600 p-4 rounded-full">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Free Shipping</h4>
                                <p className="text-sm text-slate-500">On all orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-center md:text-left">
                            <div className="bg-primary-50 text-primary-600 p-4 rounded-full">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Secure Payment</h4>
                                <p className="text-sm text-slate-500">100% secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-center md:text-left">
                            <div className="bg-primary-50 text-primary-600 p-4 rounded-full">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Fast Support</h4>
                                <p className="text-sm text-slate-500">Dedicated 24/7 assistance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Now</h2>
                            <p className="text-slate-500 mt-2">Our most popular pieces right now.</p>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors">
                            View All Products
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURED_PRODUCTS.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Button variant="outline" className="w-full">
                            View All Products
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
