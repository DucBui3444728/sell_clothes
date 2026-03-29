import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categoryService, resolveImageUrl } from '../services/api';

const CATEGORY_IMAGES: Record<string, string> = {
    "men's wear": 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1200',
    "women's wear": 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200',
    "accessories": 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=1200',
    "shoes": 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
    "outerwear": 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
    "essentials": 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1200',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200';

export const Categories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService.getCategories()
            .then(data => { setCategories(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const getCategoryImage = (cat: any) => {
        if (cat.image) return resolveImageUrl(cat.image);
        const key = cat.name.toLowerCase();
        return CATEGORY_IMAGES[key] || DEFAULT_IMAGE;
    };

    const getCategorySlug = (cat: any) => {
        const name = cat.name.toLowerCase();
        if (name.includes('men') && !name.includes('women')) return 'Men';
        if (name.includes('women')) return 'Women';
        if (name.includes('shoe') || name.includes('leather')) return 'Shoes';
        return cat.name;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-white"><p className="text-slate-500 font-light">Loading collections...</p></div>;
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Banner */}
            <section className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2400"
                        alt="Collections"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-12 h-px bg-white/40" />
                        <span className="text-xs font-medium text-white/70 uppercase tracking-[0.35em]">Explore</span>
                        <div className="w-12 h-px bg-white/40" />
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-white leading-tight">
                        Our Collections
                    </h1>
                    <p className="mt-6 text-lg text-white/70 font-light max-w-xl mx-auto">
                        Curated categories designed to help you find exactly what speaks to your style.
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                {/* First row: 2 large cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                    {categories.slice(0, 2).map((cat, idx) => (
                        <Link
                            key={cat.id}
                            to={`/shop?category=${getCategorySlug(cat)}`}
                            className="group relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden"
                        >
                            <img
                                src={getCategoryImage(cat)}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                                <span className="text-xs text-white/60 uppercase tracking-[0.3em] font-medium mb-3 block">
                                    {idx === 0 ? 'Collection' : 'Curated'}
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-serif font-medium text-white mb-4">{cat.name}</h2>
                                {cat.description && (
                                    <p className="text-white/70 font-light text-sm mb-6 max-w-sm line-clamp-2">{cat.description}</p>
                                )}
                                <div className="inline-flex items-center gap-2 text-white text-sm font-medium uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Remaining: 3-column grid */}
                {categories.length > 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {categories.slice(2).map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/shop?category=${getCategorySlug(cat)}`}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
                            >
                                <img
                                    src={getCategoryImage(cat)}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <h3 className="text-2xl font-serif font-medium text-white mb-2">{cat.name}</h3>
                                    <div className="inline-flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-widest group-hover:gap-3 group-hover:text-white transition-all duration-300">
                                        Shop Now <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {categories.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 font-light text-lg">No collections available yet.</p>
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className="border-t border-slate-100 py-16 text-center bg-slate-50">
                <p className="text-sm text-slate-500 uppercase tracking-widest mb-4">Can't decide?</p>
                <Link to="/shop" className="text-lg font-serif text-slate-900 hover:text-primary-700 transition-colors inline-flex items-center gap-3 group">
                    Browse the full collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>
        </div>
    );
};
