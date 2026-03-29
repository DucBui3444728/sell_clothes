import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, Scissors, Heart, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

const VALUES = [
    {
        icon: <Gem className="w-7 h-7" />,
        title: 'Uncompromising Quality',
        description: 'Every garment is crafted from the finest materials — Italian silks, Japanese denims, and hand-selected fabrics sourced from the world\'s most prestigious mills.',
    },
    {
        icon: <Scissors className="w-7 h-7" />,
        title: 'Precision Craftsmanship',
        description: 'Our ateliers work with obsessive attention to detail. From invisible seams to perfectly weighted buttons — nothing is accidental.',
    },
    {
        icon: <Heart className="w-7 h-7" />,
        title: 'Designed with Intention',
        description: 'We don\'t chase trends. We create timeless pieces that transcend seasons and become an extension of who you are.',
    },
    {
        icon: <Globe className="w-7 h-7" />,
        title: 'Sustainable Elegance',
        description: 'Luxury and responsibility are not opposites. We are committed to ethical sourcing, minimal waste, and carbon-conscious production.',
    },
];

export const About: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=2400"
                        alt="Luxury fashion"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-16 h-px bg-white/40" />
                        <span className="text-xs font-medium text-white/70 uppercase tracking-[0.35em]">Notre Histoire</span>
                        <div className="w-16 h-px bg-white/40" />
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-medium text-white leading-[0.95] mb-8">
                        About Us
                    </h1>

                    <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
                        We are more than a fashion brand — we are a statement of identity.
                    </p>

                    <div className="mt-12 w-px h-16 bg-white/30 mx-auto" />
                </div>
            </section>

            {/* Statement Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="w-12 h-px bg-slate-300" />
                        <span className="text-xs font-semibold text-primary-700 uppercase tracking-[0.3em]">Our Philosophy</span>
                        <div className="w-12 h-px bg-slate-300" />
                    </div>

                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-slate-800 leading-relaxed mb-8">
                        Born from a passion for timeless elegance, our collections are crafted for those who move with
                        <span className="italic text-primary-700"> quiet confidence</span> and
                        <span className="italic text-primary-700"> refined taste</span>.
                    </p>

                    <p className="text-lg text-slate-500 font-light leading-relaxed max-w-3xl mx-auto">
                        Every piece is designed to transcend trends, blending modern aesthetics with enduring sophistication.
                        We believe that true luxury is not loud. It is subtle, intentional, and deeply personal.
                    </p>
                </div>
            </section>

            {/* Parallax Image Break */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2400"
                    alt="Craftsmanship"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center px-6">
                        <p className="text-white text-xl sm:text-2xl md:text-3xl font-serif font-light italic leading-relaxed max-w-3xl">
                            "From the selection of premium fabrics to the precision of every detail,
                            our mission is to create garments that speak without words."
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-12 h-px bg-slate-300" />
                            <span className="text-xs font-semibold text-primary-700 uppercase tracking-[0.3em]">What Defines Us</span>
                            <div className="w-12 h-px bg-slate-300" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-slate-900">Our Commitment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {VALUES.map((value, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-8 lg:p-10 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-500 group"
                            >
                                <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-700 transition-colors duration-500">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-serif font-medium text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-500 font-light leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Manifesto */}
            <section className="relative py-32 md:py-40 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2400"
                        alt="Luxury store"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
                </div>

                <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
                    <div className="space-y-6">
                        <p className="text-white/60 text-sm uppercase tracking-[0.4em] font-medium">The Manifesto</p>
                        <div className="w-12 h-px bg-white/30 mx-auto" />

                        <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white font-light leading-relaxed">
                            This is not just clothing.
                        </p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-medium">
                            This is <span className="italic">presence</span>.
                        </p>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white/90 font-light leading-relaxed">
                            This is who you are — <span className="text-primary-400 font-medium italic">elevated</span>.
                        </p>
                    </div>

                    <div className="mt-16">
                        <Link to="/shop">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/40 text-white hover:bg-white hover:text-slate-900 px-10 h-14 text-sm uppercase tracking-widest transition-all duration-500"
                                icon={<ArrowRight className="w-4 h-4" />}
                            >
                                Explore the Collection
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-16 bg-white border-t border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '2024', label: 'Founded' },
                            { number: '50+', label: 'Countries' },
                            { number: '10K+', label: 'Happy Clients' },
                            { number: '100%', label: 'Authentic Materials' },
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <p className="text-3xl sm:text-4xl font-serif font-medium text-slate-900">{stat.number}</p>
                                <p className="text-sm text-slate-500 uppercase tracking-widest mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-slate-50 text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-serif font-medium text-slate-900 mb-6">
                        Begin Your Journey
                    </h2>
                    <p className="text-slate-500 font-light text-lg mb-10 leading-relaxed">
                        Discover pieces that were made for you. Curated with care, crafted with purpose.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/shop?category=Women">
                            <Button variant="primary" size="lg" className="px-10 h-14 text-sm uppercase tracking-widest" icon={<ArrowRight />}>
                                Shop Women
                            </Button>
                        </Link>
                        <Link to="/shop?category=Men">
                            <Button variant="outline" size="lg" className="px-10 h-14 text-sm uppercase tracking-widest" icon={<ArrowRight />}>
                                Shop Men
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
