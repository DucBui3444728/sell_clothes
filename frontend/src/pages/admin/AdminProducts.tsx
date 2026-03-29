import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { productService, resolveImageUrl } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Category {
    id: string;
    name: string;
}

interface ProductMedia {
    id: string;
    url: string;
    type: 'image' | 'video';
}

interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    stock: number;
    image: string;
    colors: string[];
    sizes: string[];
    category_id: string;
    category?: Category;
    media?: ProductMedia[];
}

export const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.deleteProduct(id);
            
            showToast('Product deleted', 'success');
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            showToast('Error deleting product', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Manage Products</h1>
                <Button onClick={() => navigate('/admin/products/new')} className="flex items-center gap-2 rounded-xl">
                    <Plus className="w-4 h-4" />
                    New Product
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-500">
                    <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-600 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                        {prod.image ? (
                                            <img src={resolveImageUrl(prod.image)} alt={prod.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[200px]">{prod.name}</td>
                                <td className="px-6 py-4">{prod.category?.name || 'Uncategorized'}</td>
                                <td className="px-6 py-4">${parseFloat(prod.price).toFixed(2)}</td>
                                <td className="px-6 py-4">{prod.stock}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => navigate(`/admin/products/edit/${prod.id}`)}
                                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors mr-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prod.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No products found.</div>
                )}
            </div>


        </div>
    );
};
