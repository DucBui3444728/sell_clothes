import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Shield, RefreshCw, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ALL_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const product = ALL_PRODUCTS.find(p => p.id === id);

    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const sizes = product?.sizes || ['S', 'M', 'L', 'XL'];
    const colors = product?.colors || ['#0f172a', '#ffffff', '#38bdf8']; // Fallback colors

    useEffect(() => {
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
    }, [product]);

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

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color: selectedColor, // In a real app we'd map hex to name if needed
            size: selectedSize,
            quantity: quantity,
        });

        showToast('Item has been added to cart.', 'success');
    };

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
                        <span className="text-sm font-medium text-primary-800 uppercase tracking-widest mb-4 inline-block">{product.category}</span>
                        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-slate-900 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mt-6">
                            <span className="text-3xl font-light text-slate-900">${product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 border border-slate-200">
                                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-sm text-slate-500">(124 reviews)</span>
                            </div>
                        </div>

                        <p className="mt-8 text-lg text-slate-600 leading-relaxed font-light">
                            Our signature piece that offers an unparalleled level of comfort. Pre-shrunk and garment-dyed for a lived-in feel from day one. Perfect for any casual occasion.
                        </p>

                        <div className="mt-8 border-t border-slate-100 pt-8 space-y-8">
                            {/* Colors */}
                            <div>
                                <h3 className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-widest">Color</h3>
                                <div className="flex gap-4">
                                    {colors.map(colorHex => (
                                        <button
                                            key={colorHex}
                                            onClick={() => setSelectedColor(colorHex)}
                                            className={`w-12 h-12 flex items-center justify-center transition-all border ${selectedColor === colorHex ? 'border-black p-1' : 'border-transparent'}`}
                                            title={colorHex}
                                        >
                                            <div className="w-full h-full rounded-sm border border-slate-200" style={{ backgroundColor: colorHex }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">Size: <span className="text-slate-500 font-normal ml-2">{selectedSize}</span></h3>
                                    <button className="text-xs text-slate-500 uppercase tracking-widest hover:text-black hover:underline transition-colors">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 px-4 text-sm font-medium transition-all ${selectedSize === size ? 'bg-black text-white' : 'bg-transparent text-slate-700 border border-slate-300 hover:border-slate-800'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <h3 className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-widest">Quantity</h3>
                                <div className="flex items-center w-32 border border-slate-300 p-1">
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
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex-1 h-16"
                                    onClick={handleAddToCart}
                                >
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
