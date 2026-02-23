import React, { useState } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ALL_PRODUCTS } from '../data/products';

export const Shop: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const categories = ['All', 'Men', 'Women', 'Accessories', 'Shoes'];

    const filteredProducts = activeCategory === 'All'
        ? ALL_PRODUCTS
        : ALL_PRODUCTS.filter(p => p.category === activeCategory);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Breadcrumbs */}
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Shop Collection</h1>
                    <p className="mt-4 text-slate-500 max-w-2xl">
                        Browse our entire collection. Use the filters to find precisely what you're looking for.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                                    Filters
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Categories */}
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-4">Categories</h4>
                                    <div className="space-y-3">
                                        {categories.map(cat => (
                                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeCategory === cat ? 'bg-primary-600 border-primary-600' : 'border-slate-300 group-hover:border-primary-400'}`}>
                                                    {activeCategory === cat && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    className="hidden"
                                                    checked={activeCategory === cat}
                                                    onChange={() => setActiveCategory(cat)}
                                                />
                                                <span className={`text-sm ${activeCategory === cat ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full" />

                                {/* Price Range (Visual only for mockup) */}
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-4">Price Range</h4>
                                    <div className="space-y-4">
                                        <input type="range" className="w-full mx-auto accent-primary-600" />
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 w-full text-center">$0</div>
                                            <span className="text-slate-400">-</span>
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 w-full text-center">$300+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-slate-500 font-medium text-sm">
                                Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> results
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">Sort by:</span>
                                <Button variant="secondary" className="!px-3 !py-1.5 h-auto text-sm border-slate-200 shadow-none">
                                    Featured
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="mt-16 flex justify-center">
                            <Button variant="outline" className="rounded-full px-8">
                                Load More
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
