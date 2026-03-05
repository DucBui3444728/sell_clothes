import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ALL_PRODUCTS } from '../data/products';

export const Shop: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const location = useLocation();

    // Parse search from URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    const ITEMS_PER_PAGE = 6;

    const categories = ['All', 'Men', 'Women', 'Accessories', 'Shoes'];

    // Filter by both category AND search query
    const filteredProducts = ALL_PRODUCTS.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Shop Collection</h1>
                        <p className="mt-4 text-slate-500 max-w-2xl">
                            Browse our entire collection. Use the filters to find precisely what you're looking for.
                        </p>
                    </div>
                    {searchQuery && (
                        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl border border-primary-100 font-medium">
                            <Search className="w-4 h-4" />
                            <span>Showing results for: "{searchQuery}"</span>
                        </div>
                    )}
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
                                                    onChange={() => {
                                                        setActiveCategory(cat);
                                                        setCurrentPage(1); // Reset page on category change
                                                    }}
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

                        {paginatedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                                <p className="text-slate-500">We couldn't find any items matching your current filters or search query.</p>
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => {
                                        setActiveCategory('All');
                                        if (searchQuery) window.history.replaceState({}, '', '/shop');
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4"
                                >
                                    Previous
                                </Button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-medium transition-colors ${currentPage === i + 1
                                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
