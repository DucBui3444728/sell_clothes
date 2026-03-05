import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0c0a09] text-slate-400 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-slate-800 pb-14 mb-12 flex flex-col items-start">
                    {/* Ornate brand mark */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-px bg-slate-600" />
                        <span className="text-[10px] tracking-[0.4em] text-slate-500 uppercase">Est. 2024</span>
                        <div className="w-12 h-px bg-slate-600" />
                    </div>
                    <Link to="/" className="inline-block font-serif text-5xl tracking-[0.25em] text-white uppercase mb-2 hover:text-slate-200 transition-colors">
                        Douglas
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-px bg-slate-600" />
                        <span className="text-[10px] tracking-[0.4em] text-slate-500 uppercase">Maison de Mode</span>
                        <div className="w-12 h-px bg-slate-600" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                        A curated house of luxury fashion. Each piece is a statement of refined taste and timeless elegance.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & About */}
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Follow Us</p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Shop</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/shop?category=women" className="hover:text-primary-400 transition-colors">Women's Collection</Link></li>
                            <li><Link to="/shop?category=men" className="hover:text-primary-400 transition-colors">Men's Collection</Link></li>
                            <li><Link to="/shop?category=accessories" className="hover:text-primary-400 transition-colors">Accessories</Link></li>
                            <li><Link to="/shop?sort=new" className="hover:text-primary-400 transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop?sort=sale" className="hover:text-primary-400 transition-colors">Sale Offers</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
                                <span>123 Fashion Avenue, NY 10001, United States</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                                <span>+1 (800) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                                <span>support@douglas.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Newsletter</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <Button variant="primary" className="w-full justify-center">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Douglas. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
