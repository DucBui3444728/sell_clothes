import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { categoryService, resolveImageUrl } from '../../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
}

export const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const { showToast } = useToast();

    // Form states
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setSlug(category.slug);
            setDescription(category.description || '');
        } else {
            setEditingCategory(null);
            setName('');
            setSlug('');
            setDescription('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            
            showToast(editingCategory ? 'Category updated' : 'Category created', 'success');
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            showToast('Error saving category', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoryService.deleteCategory(id);
            
            showToast('Category deleted', 'success');
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
            showToast('Error deleting category', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 rounded-xl">
                    <Plus className="w-4 h-4" />
                    New Category
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-500">
                    <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-600 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                        {cat.image ? (
                                            <img src={resolveImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                                <td className="px-6 py-4">{cat.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleOpenModal(cat)}
                                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors mr-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No categories found. Click 'New Category' to create one.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                        <button 
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">
                            {editingCategory ? 'Edit Category' : 'Create Category'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (!editingCategory) {
                                            setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                                        }
                                    }}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                                <div className="border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                            
                            <Button type="submit" className="w-full rounded-xl mt-6">
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
