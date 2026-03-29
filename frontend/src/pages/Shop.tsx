import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../services/api';

export const Shop: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [activeSize, setActiveSize] = useState<string>('All');
    const [activeColor, setActiveColor] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) setActiveCategory(cat);
    }, [location.search]);

    useEffect(() => {
        productService.getProducts()
            .then(data => { setProducts(data); setLoading(false); })
            .catch(console.error);
    }, []);

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    const ITEMS_PER_PAGE = 9;

    const categories = ['All', 'Men', 'Women', 'Accessories', 'Shoes'];
    const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = [
        { name: 'All', hex: 'all' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Gray', hex: '#9ca3af' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Navy', hex: '#1e3a8a' },
        { name: 'Pink', hex: '#ec4899' },
        { name: 'Green', hex: '#065f46' },
    ];

    const activeFiltersCount = [activeCategory !== 'All', activeSize !== 'All', activeColor !== 'All'].filter(Boolean).length;

    const clearAllFilters = () => {
        setActiveCategory('All');
        setActiveSize('All');
        setActiveColor('All');
        setCurrentPage(1);
        if (searchQuery) window.history.replaceState({}, '', '/shop');
    };

    const filteredProducts = products.filter(p => {
        let matchesCategory = activeCategory === 'All';
        if (!matchesCategory && p.category) {
            if (activeCategory === 'Men') matchesCategory = p.category.slug === 'mens-wear' || p.category.name === "Men's Wear";
            else if (activeCategory === 'Women') matchesCategory = p.category.slug === 'womens-wear' || p.category.name === "Women's Wear";
            else if (activeCategory === 'Shoes') matchesCategory = p.category.slug === 'leather-goods' || p.category.name === 'Shoes';
            else matchesCategory = p.category.name === activeCategory;
        }
        const matchesSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());

        let pSizes: string[] = [];
        let pColors: string[] = [];
        if (p.attributes) {
            try {
                const attrs = typeof p.attributes === 'string' ? JSON.parse(p.attributes) : p.attributes;
                if (Array.isArray(attrs)) {
                    const sizeAttr = attrs.find((a: any) => a.name.toLowerCase() === 'size');
                    const colorAttr = attrs.find((a: any) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour');
                    if (sizeAttr) pSizes = sizeAttr.values.map(String);
                    if (colorAttr) pColors = colorAttr.values.map(String);
                }
            } catch (e) { }
        }
        if (pSizes.length === 0 && p.sizes) pSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
        if (pColors.length === 0 && p.colors) pColors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;

        const matchesSize = activeSize === 'All' || pSizes.includes(activeSize);
        const matchesColor = activeColor === 'All' || pColors.some((c: string) => {
            const lowerC = c.toLowerCase();
            return lowerC === activeColor.toLowerCase() ||
                (activeColor === '#3b82f6' && (lowerC.includes('blue') || lowerC === '#60a5fa' || lowerC === '#93c5fd')) ||
                (activeColor === '#ffffff' && (lowerC === '#ffffff' || lowerC === 'white')) ||
                (activeColor === '#000000' && (lowerC === '#000000' || lowerC === 'black')) ||
                (activeColor === '#9ca3af' && ['#e5e7eb', '#9ca3af', '#374151', '#4b5563', '#1f2937', '#f3f4f6', 'gray'].includes(lowerC)) ||
                (activeColor === '#ec4899' && (lowerC.includes('pink') || lowerC === '#f472b6')) ||
                (activeColor === '#065f46' && (lowerC.includes('green') || lowerC === '#10b981'));
        });

        return matchesCategory && matchesSearch && matchesSize && matchesColor;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc': return parseFloat(a.price) - parseFloat(b.price);
            case 'price-desc': return parseFloat(b.price) - parseFloat(a.price);
            case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'name-asc': return a.name.localeCompare(b.name);
            default: return 0;
        }
    });

    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // ─── Filter Sidebar Content (reused for mobile drawer + desktop) ────
    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-[0.2em] mb-4">Category</h4>
                <div className="space-y-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeCategory === cat
                                ? 'bg-slate-900 text-white font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Colors */}
            <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-[0.2em] mb-4">Color</h4>
                <div className="grid grid-cols-4 gap-3">
                    {colors.map(color => (
                        <button
                            key={color.name}
                            onClick={() => { setActiveColor(color.hex); setCurrentPage(1); }}
                            className="flex flex-col items-center gap-1.5 group"
                            title={color.name}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${activeColor === color.hex ? 'border-slate-900 scale-110 ring-2 ring-slate-900/20' : 'border-slate-200 group-hover:border-slate-400 group-hover:scale-105'
                                } ${color.name === 'All' ? 'bg-gradient-to-br from-rose-400 via-sky-400 to-emerald-400' : ''}`}
                                style={color.name !== 'All' ? { backgroundColor: color.hex } : {}}
                            />
                            <span className={`text-[10px] font-medium ${activeColor === color.hex ? 'text-slate-900' : 'text-slate-400'}`}>
                                {color.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Sizes */}
            <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-[0.2em] mb-4">Size</h4>
                <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => { setActiveSize(size); setCurrentPage(1); }}
                            className={`min-w-[2.75rem] px-3 py-2 text-xs font-semibold uppercase tracking-wide border transition-all duration-200 ${activeSize === size
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear */}
            {activeFiltersCount > 0 && (
                <>
                    <div className="h-px bg-slate-100" />
                    <button
                        onClick={clearAllFilters}
                        className="w-full text-center text-sm text-primary-700 hover:text-primary-900 font-medium py-2 transition-colors"
                    >
                        Clear all filters ({activeFiltersCount})
                    </button>
                </>
            )}
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* ─── Hero Banner ─── */}
            <section className="relative h-[30vh] md:h-[35vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2400"
                        alt="Shop"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 30%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
                </div>
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-10 h-px bg-white/40" />
                        <span className="text-[10px] font-medium text-white/60 uppercase tracking-[0.4em]">
                            {activeCategory === 'All' ? 'Full Collection' : activeCategory}
                        </span>
                        <div className="w-10 h-px bg-white/40" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white">
                        {searchQuery ? `"${searchQuery}"` : 'The Shop'}
                    </h1>
                </div>
            </section>

            {/* ─── Toolbar ─── */}
            <div className="border-b border-slate-100 bg-white sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">{activeFiltersCount}</span>
                                )}
                            </button>

                            <span className="text-sm text-slate-400 font-light">
                                <span className="font-semibold text-slate-700">{sortedProducts.length}</span> {sortedProducts.length === 1 ? 'piece' : 'pieces'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                className="bg-transparent border-0 text-sm text-slate-600 font-medium outline-none cursor-pointer pr-6 appearance-none hover:text-slate-900"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23475569\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="newest">Sort: Newest</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="name-asc">Name: A → Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Active Filters Chips ─── */}
            {(activeFiltersCount > 0 || searchQuery) && (
                <div className="bg-slate-50/80 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 uppercase tracking-widest mr-2">Active:</span>
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                                <Search className="w-3 h-3" /> "{searchQuery}"
                            </span>
                        )}
                        {activeCategory !== 'All' && (
                            <button
                                onClick={() => { setActiveCategory('All'); setCurrentPage(1); }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 hover:border-red-300 hover:text-red-600 transition-colors"
                            >
                                {activeCategory} <X className="w-3 h-3" />
                            </button>
                        )}
                        {activeColor !== 'All' && (
                            <button
                                onClick={() => { setActiveColor('All'); setCurrentPage(1); }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 hover:border-red-300 hover:text-red-600 transition-colors"
                            >
                                <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: activeColor }} />
                                {colors.find(c => c.hex === activeColor)?.name || activeColor}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {activeSize !== 'All' && (
                            <button
                                onClick={() => { setActiveSize('All'); setCurrentPage(1); }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 hover:border-red-300 hover:text-red-600 transition-colors"
                            >
                                Size: {activeSize} <X className="w-3 h-3" />
                            </button>
                        )}
                        <button onClick={clearAllFilters} className="text-xs text-slate-400 hover:text-red-500 ml-2 transition-colors font-medium">
                            Clear all
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Main Content ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="text-center py-32">
                        <div className="w-12 h-12 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-light">Loading collection...</p>
                    </div>
                ) : (
                    <div className="flex gap-12">
                        {/* ─── Desktop Sidebar ─── */}
                        <aside className="hidden lg:block w-60 shrink-0">
                            <div className="sticky top-[7.5rem]">
                                <div className="flex items-center gap-2 mb-8">
                                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-[0.2em]">Refine</h3>
                                </div>
                                <FilterContent />
                            </div>
                        </aside>

                        {/* ─── Product Grid ─── */}
                        <div className="flex-1">
                            {paginatedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center">
                                    <div className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-serif font-medium text-slate-900 mb-2">No pieces found</h3>
                                    <p className="text-slate-400 font-light max-w-md mx-auto mb-8">
                                        We couldn't find any items matching your current selection. Try adjusting your filters.
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm font-medium text-slate-900 border border-slate-900 px-8 py-3 hover:bg-slate-900 hover:text-white transition-all duration-300"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}

                            {/* ─── Pagination ─── */}
                            {totalPages > 1 && (
                                <div className="mt-16 flex justify-center items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 text-sm font-medium transition-all duration-200 ${currentPage === i + 1
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Mobile Filters Drawer ─── */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col animate-slide-in">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.2em]">Filters</h2>
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <FilterContent />
                        </div>
                        <div className="border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="w-full bg-slate-900 text-white text-sm font-semibold py-3 hover:bg-slate-800 transition-colors"
                            >
                                Show {sortedProducts.length} results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
