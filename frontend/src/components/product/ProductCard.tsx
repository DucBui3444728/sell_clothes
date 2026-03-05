import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    colors?: string[];
    sizes?: string[];
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product.id);

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color: product.colors?.[0] || 'Default',
            size: product.sizes?.[0] || 'One Size',
            quantity: 1,
        });

        showToast('Item has been added to cart.', 'success');
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isWishlisted) {
            removeFromWishlist(product.id);
            showToast('Removed from wishlist', 'info');
        } else {
            addToWishlist(product);
            showToast('Added to wishlist', 'success');
        }
    };

    return (
        <div className="group bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1">
            <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                    <img
                        src={product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors duration-200 z-10 
                            ${isWishlisted ? 'text-primary-600 opacity-100 hover:bg-primary-50' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50 opacity-0 group-hover:opacity-100'}`}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-primary-600' : ''}`} />
                    </button>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-medium text-slate-800 shadow-sm">
                        {product.category}
                    </div>
                </div>
            </Link>

            <div className="pt-5 pb-2">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-serif font-medium text-slate-900 mb-2 truncate hover:text-black transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-light text-slate-800">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        title="Add to Cart"
                        onClick={handleQuickAdd}
                        className="text-slate-400 hover:text-black transition-colors p-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
