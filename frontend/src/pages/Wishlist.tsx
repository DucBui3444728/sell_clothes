import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';

export const Wishlist: React.FC = () => {
    const { wishlist, wishlistCount } = useWishlist();

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                        <p className="text-slate-500 mt-1">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                            <Heart className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            Save items you love to your wishlist. Review them anytime and easily move them to your cart.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/shop">
                                <Button variant="primary" size="lg" icon={<ShoppingBag className="w-5 h-5" />}>
                                    Explore Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {wishlist.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
