import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Heart, Shield, RefreshCw, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ALL_PRODUCTS } from '../data/products';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const product = ALL_PRODUCTS.find(p => p.id === id);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Navy');

    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = [
        { name: 'Navy', class: 'bg-slate-800' },
        { name: 'White', class: 'bg-white border border-slate-200' },
        { name: 'Sky Blue', class: 'bg-primary-300' }
    ];

    // Use product image + some fallback gallery images
    const images = product
        ? [
            product.image,
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800'
        ]
        : [];

    const [mainImage, setMainImage] = useState(images[0] || '');

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
                <h1 className="text-3xl font-bold text-slate-900">Product Not Found</h1>
                <p className="text-slate-500">The product you're looking for doesn't exist.</p>
                <Link to="/shop">
                    <Button variant="primary" icon={<ArrowLeft />}>
                        Back to Shop
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                    <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 w-full md:w-24 shrink-0">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-primary-600' : 'border-transparent hover:border-primary-300'}`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="relative aspect-[4/5] md:aspect-auto md:h-[700px] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                            <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-red-500 rounded-full transition-colors shadow-sm">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">{product.category}</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mt-4">
                            <span className="text-3xl font-bold text-primary-600">${product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-sm text-slate-500">(124 reviews)</span>
                            </div>
                        </div>

                        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                            Our signature piece that offers an unparalleled level of comfort. Pre-shrunk and garment-dyed for a lived-in feel from day one. Perfect for any casual occasion.
                        </p>

                        <div className="mt-8 border-t border-slate-100 pt-8 space-y-8">
                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Color: {selectedColor}</h3>
                                <div className="flex gap-3">
                                    {colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'ring-2 ring-primary-600 ring-offset-2' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full ${color.class}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Size: {selectedSize}</h3>
                                    <button className="text-sm text-primary-600 font-medium hover:underline">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 rounded-lg font-medium transition-all ${selectedSize === size ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:border-primary-400'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Quantity</h3>
                                <div className="flex items-center w-32 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-semibold text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button variant="primary" size="lg" className="flex-1 h-14 text-lg rounded-xl shadow-lg shadow-primary-500/20" icon={<ShoppingCart />}>
                                    Add to Cart
                                </Button>
                            </div>

                            {/* Perks */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-100">
                                <div className="flex flex-col gap-2">
                                    <Truck className="w-6 h-6 text-primary-600" />
                                    <span className="text-sm font-medium text-slate-900">Free shipping</span>
                                    <span className="text-xs text-slate-500">Over $100</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <RefreshCw className="w-6 h-6 text-primary-600" />
                                    <span className="text-sm font-medium text-slate-900">Free returns</span>
                                    <span className="text-xs text-slate-500">Within 30 days</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Shield className="w-6 h-6 text-primary-600" />
                                    <span className="text-sm font-medium text-slate-900">Secure payment</span>
                                    <span className="text-xs text-slate-500">100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
