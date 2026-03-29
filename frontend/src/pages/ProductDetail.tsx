import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Shield, RefreshCw, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { productService, resolveImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [mainImage, setMainImage] = useState('');

    const parseJsonField = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try { return JSON.parse(val); } catch { return []; }
    };

    useEffect(() => {
        if (id) {
            productService.getProductById(id).then(data => {
                setProduct(data);
                
                // Initialize default attribute selection
                if (data.attributes) {
                    const attrs = parseJsonField(data.attributes);
                    const initialSelection: Record<string, string> = {};
                    attrs.forEach((a: any) => {
                        if (a.values && a.values.length > 0) {
                            initialSelection[a.name] = a.values[0];
                        }
                    });
                    setSelectedAttributes(initialSelection);
                }
                
                const initialImages = data.media && data.media.length > 0
                    ? data.media.map((m: any) => resolveImageUrl(m.url))
                    : data.image ? [resolveImageUrl(data.image)] : [];
                
                if (initialImages.length > 0) setMainImage(initialImages[0]);
                
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [id]);

    const attributes = parseJsonField(product?.attributes);

    const images = product?.media && product.media.length > 0
        ? product.media.map((m: any) => resolveImageUrl(m.url))
        : product?.image ? [resolveImageUrl(product.image)] : [];

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500">Loading product...</p></div>;
    }

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

    const currentVariant = product?.variants?.find((v: any) => {
        const vAttrs = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;
        const keys = Object.keys(selectedAttributes);
        if (keys.length === 0) return true; // If no attributes, it matches the base
        return keys.every(k => vAttrs[k] === selectedAttributes[k]);
    });

    const displayPrice = currentVariant ? parseFloat(currentVariant.price) : parseFloat(product?.price || 0);
    const displayStock = currentVariant ? currentVariant.stock : (product?.stock || 0);
    const isOutOfStock = displayStock <= 0;

    const handleAddToCart = () => {
        if (!product || isOutOfStock) return;

        addToCart({
            productId: product.id,
            name: product.name,
            price: displayPrice,
            image: resolveImageUrl(product.image),
            variantId: currentVariant ? currentVariant.id : undefined,
            attributes: selectedAttributes,
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
                            {images.map((img: string, idx: number) => (
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
                        <span className="text-sm font-medium text-primary-800 uppercase tracking-widest mb-4 inline-block">{product.category?.name || 'Uncategorized'}</span>
                        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-slate-900 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mt-6">
                            <span className="text-3xl font-light text-slate-900">${displayPrice.toFixed(2)}</span>
                            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 border border-slate-200">
                                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-sm text-slate-500">(124 reviews)</span>
                            </div>
                        </div>

                        <p className="mt-8 text-lg text-slate-600 leading-relaxed font-light whitespace-pre-line">
                            {product.description || 'Our signature piece that offers an unparalleled level of comfort. Pre-shrunk and garment-dyed for a lived-in feel from day one. Perfect for any casual occasion.'}
                        </p>

                        <div className="mt-8 border-t border-slate-100 pt-8 space-y-8">
                            {/* Dynamic Attributes */}
                            {attributes.map((attr: any) => (
                                <div key={attr.name}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">{attr.name}: <span className="text-slate-500 font-normal ml-2">{selectedAttributes[attr.name]}</span></h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {attr.values.map((val: string) => {
                                            const isHexColor = val.startsWith('#') && (val.length === 4 || val.length === 7);
                                            const isSelected = selectedAttributes[attr.name] === val;
                                            
                                            if (isHexColor) {
                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => setSelectedAttributes({ ...selectedAttributes, [attr.name]: val })}
                                                        className={`w-12 h-12 flex items-center justify-center transition-all border ${isSelected ? 'border-black p-1' : 'border-transparent'}`}
                                                        title={val}
                                                    >
                                                        <div className="w-full h-full rounded-sm border border-slate-200" style={{ backgroundColor: val }} />
                                                    </button>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => setSelectedAttributes({ ...selectedAttributes, [attr.name]: val })}
                                                    className={`py-2 px-4 text-sm font-medium transition-all ${isSelected ? 'bg-black text-white' : 'bg-transparent text-slate-700 border border-slate-300 hover:border-slate-800'}`}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

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
                                    disabled={isOutOfStock}
                                    onClick={handleAddToCart}
                                >
                                    {isOutOfStock ? 'OUT OF STOCK' : 'Add to Cart'}
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
