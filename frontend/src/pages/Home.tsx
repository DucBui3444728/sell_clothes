import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { ALL_PRODUCTS } from '../data/products';

const FEATURED_PRODUCTS = ALL_PRODUCTS.slice(0, 4);

const SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=2400',
        label: 'La Collection Femme',
        headline: 'L\'Art de la\nFéminité',
        sub: 'A celebration of grace, draped in the finest silks and cashmere.',
        cta: 'Shop Women',
        href: '/shop?category=Women',
        align: 'center',
    },
    {
        image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=2400',
        label: 'La Collection Homme',
        headline: 'The Gentleman\'s\nCode',
        sub: 'Precision tailoring for the modern aristocrat. Understated authority.',
        cta: 'Shop Men',
        href: '/shop?category=Men',
        align: 'left',
    },
    {
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2400',
        label: 'Nouvelle Saison',
        headline: 'Timeless\nElegance',
        sub: 'New Season 2026 — where heritage craft meets contemporary vision.',
        cta: 'Explore Now',
        href: '/shop',
        align: 'center',
    },
];

export const Home: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % SLIDES.length);
                setAnimating(false);
            }, 800);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const goTo = (idx: number) => {
        if (idx === current) return;
        setAnimating(true);
        setTimeout(() => {
            setCurrent(idx);
            setAnimating(false);
        }, 600);
    };

    const slide = SLIDES[current];

    return (
        <div className="flex flex-col min-h-screen">

            {/* ── HERO SLIDESHOW ─────────────────────────────────── */}
            <section className="relative h-screen min-h-[640px] overflow-hidden bg-[#0c0a09]">

                {/* Slides */}
                {SLIDES.map((s, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 transition-opacity duration-1000"
                        style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                    >
                        <img
                            src={s.image}
                            alt={s.label}
                            className={`w-full h-full object-cover object-top transition-transform duration-[7000ms] ease-out
                                ${i === current ? 'scale-110' : 'scale-100'}`}
                            style={{ filter: 'brightness(0.55)' }}
                        />
                    </div>
                ))}

                {/* Gradient vignette overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 to-transparent" />

                {/* Text overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div
                        className={`w-full max-w-5xl px-8 transition-all duration-700 ${animating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}
                            ${slide.align === 'left' ? 'text-left pl-[8vw] md:pl-[10vw]' : 'text-center flex flex-col items-center'}`}
                    >
                        {/* Category label with decorative lines */}
                        <div className={`flex items-center gap-4 mb-8 ${slide.align === 'center' ? 'justify-center' : ''}`}>
                            <div className="w-8 h-px bg-white/60" />
                            <span className="text-white/70 text-[10px] tracking-[0.5em] uppercase font-light">
                                {slide.label}
                            </span>
                            <div className="w-8 h-px bg-white/60" />
                        </div>

                        {/* Main headline */}
                        <h1 className="font-serif text-white text-5xl md:text-7xl xl:text-8xl font-light leading-[1.05] mb-8 whitespace-pre-line drop-shadow-lg">
                            {slide.headline}
                        </h1>

                        {/* Decorative separator */}
                        <div className={`flex items-center gap-4 mb-8 ${slide.align === 'center' ? 'justify-center' : ''}`}>
                            <div className="w-16 h-px bg-white/40" />
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                            <div className="w-16 h-px bg-white/40" />
                        </div>

                        {/* Subtext */}
                        <p className="text-white/75 text-base md:text-lg font-light leading-relaxed mb-12 max-w-md drop-shadow">
                            {slide.sub}
                        </p>

                        {/* CTA buttons */}
                        <div className={`flex flex-wrap gap-4 ${slide.align === 'center' ? 'justify-center' : ''}`}>
                            <Link to={slide.href}>
                                <button className="group relative h-14 px-12 bg-white text-[#0c0a09] text-xs uppercase tracking-[0.3em] font-medium hover:bg-[#0c0a09] hover:text-white border border-white transition-all duration-500 overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-3">
                                        {slide.cta}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </Link>
                            <Link to="/shop">
                                <button className="h-14 px-12 border border-white/50 text-white text-xs uppercase tracking-[0.3em] font-light hover:border-white hover:bg-white/10 transition-all duration-500">
                                    View All
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`transition-all duration-500 ${i === current
                                ? 'w-10 h-px bg-white'
                                : 'w-4 h-px bg-white/40 hover:bg-white/70'}`}
                        />
                    ))}
                </div>

                {/* Slide counter */}
                <div className="absolute bottom-10 right-8 z-30 text-white/50 text-xs font-light tracking-widest">
                    {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-8 z-30 flex flex-col items-center gap-2">
                    <div className="w-px h-12 bg-white/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/70 animate-[slideDown_2s_ease_infinite]" />
                    </div>
                    <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] rotate-90 origin-left translate-y-4">Scroll</span>
                </div>
            </section>

            {/* ── SPLIT EDITORIAL SECTION ─────────────────────────── */}
            <section className="bg-white grid grid-cols-1 md:grid-cols-2">
                {/* Women's editorial */}
                <div className="relative h-[70vh] overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200"
                        alt="Women's Collection"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white text-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-px bg-white/60" />
                            <span className="text-[9px] tracking-[0.5em] uppercase text-white/60">Collection</span>
                            <div className="w-6 h-px bg-white/60" />
                        </div>
                        <h2 className="font-serif text-4xl font-light mb-6">Pour Elle</h2>
                        <Link to="/shop?category=Women">
                            <span className="text-[10px] tracking-[0.4em] uppercase border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                                Explore Women
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Men's editorial */}
                <div className="relative h-[70vh] overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
                        alt="Men's Collection"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white text-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-px bg-white/60" />
                            <span className="text-[9px] tracking-[0.5em] uppercase text-white/60">Collection</span>
                            <div className="w-6 h-px bg-white/60" />
                        </div>
                        <h2 className="font-serif text-4xl font-light mb-6">Pour Lui</h2>
                        <Link to="/shop?category=Men">
                            <span className="text-[10px] tracking-[0.4em] uppercase border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                                Explore Men
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ────────────────────────────────────────── */}
            <section className="py-14 bg-[#fafaf9] border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        {[
                            { icon: <Truck className="h-6 w-6 stroke-[1.5]" />, title: 'Free Shipping', sub: 'On all orders over $100' },
                            { icon: <ShieldCheck className="h-6 w-6 stroke-[1.5]" />, title: 'Secure Payment', sub: '100% secure checkout' },
                            { icon: <Zap className="h-6 w-6 stroke-[1.5]" />, title: 'Dedicated Support', sub: '24 / 7 concierge assistance' },
                        ].map(f => (
                            <div key={f.title} className="flex flex-col items-center text-center py-10 px-8 gap-3">
                                <div className="text-slate-400 mb-2">{f.icon}</div>
                                <h4 className="font-serif text-base font-medium text-slate-900">{f.title}</h4>
                                <p className="text-xs text-slate-400 tracking-wide">{f.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURED COLLECTION ─────────────────────────────── */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-5">
                            <div className="w-12 h-px bg-slate-300" />
                            <span className="text-[9px] tracking-[0.5em] uppercase text-slate-400">Douglas Selection</span>
                            <div className="w-12 h-px bg-slate-300" />
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-light text-slate-900 mb-4">Trending Now</h2>
                        <p className="text-slate-400 font-light text-sm">The season's most coveted pieces, curated for you.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURED_PRODUCTS.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/shop" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-900 border-b border-slate-300 pb-1 hover:border-slate-900 transition-colors">
                            View Full Collection
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FULL-WIDTH BANNER ────────────────────────────────── */}
            <section className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2600"
                    alt="Douglas Atelier"
                    className="w-full h-full object-cover object-center"
                    style={{ filter: 'brightness(0.45)' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-px bg-white/50" />
                        <span className="text-[9px] tracking-[0.5em] uppercase text-white/60">The Atelier</span>
                        <div className="w-10 h-px bg-white/50" />
                    </div>
                    <h2 className="font-serif text-4xl md:text-6xl font-light mb-6 leading-tight">
                        Crafted with<br /><em>Intention</em>
                    </h2>
                    <p className="text-white/60 text-sm font-light tracking-wide max-w-md mb-10">
                        Every Douglas piece is born from a philosophy of quiet luxury — materials chosen for touch, silhouettes cut for the body.
                    </p>
                    <Link to="/shop">
                        <button className="h-12 px-10 border border-white/60 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500">
                            Discover the Collection
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    );
};
