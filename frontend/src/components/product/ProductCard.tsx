import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                    <img
                        src={product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                        <Heart className="w-5 h-5" />
                    </button>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-slate-700">
                        {product.category}
                    </div>
                </div>
            </Link>

            <div className="p-5">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate hover:text-primary-600 transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-primary-600">
                        ${product.price.toFixed(2)}
                    </span>
                    <Button
                        variant="primary"
                        className="rounded-full p-2 h-10 w-10 flex items-center justify-center !px-0"
                        title="Add to Cart"
                    >
                        <ShoppingCart className="w-5 h-5 absolute" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
