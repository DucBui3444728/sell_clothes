import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { productService, categoryService, resolveImageUrl } from '../../services/api';
import { ArrowLeft, UploadCloud, X, Save, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Attribute {
    name: string;
    values: string[];
}

interface Variant {
    id?: string;
    attributes: Record<string, string>;
    price: number;
    stock: number;
    sku: string;
}

export const AdminProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const isEditMode = Boolean(id);
    
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    
    // Form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('0');
    
    // Dynamic Variants
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    
    // Media management
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [existingMedia, setExistingMedia] = useState<any[]>([]);
    const [deleteMainImage, setDeleteMainImage] = useState(false);
    const [newMainImageUrl, setNewMainImageUrl] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const catRes = await categoryService.getCategories();
                setCategories(catRes);
                if (!isEditMode && catRes.length > 0) {
                    setCategoryId(catRes[0].id);
                }

                if (isEditMode && id) {
                    const product = await productService.getProductById(id);
                    setName(product.name);
                    setPrice(product.price);
                    setCategoryId(product.category_id);
                    setDescription(product.description || '');
                    setStock(product.stock.toString());
                    
                    setAttributes(product.attributes || []);
                    setVariants(product.variants || []);
                    
                    // The main image might not be in product.media. But let's just show product.media.
                    // If the backend has main image in product.image, we can prepend it if it's not in media.
                    const mediaList = product.media || [];
                    if (product.image && !mediaList.find((m: any) => m.url === product.image)) {
                        mediaList.unshift({ id: 'main', url: product.image, type: 'image' });
                    }
                    setExistingMedia(mediaList);
                }
            } catch (error) {
                console.error(error);
                showToast('Failed to load data', 'error');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id, isEditMode]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Append newly selected files to existing selection
            setMediaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeNewFile = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    // --- Dynamic Variant Handlers ---
    const handleAddAttribute = () => {
        setAttributes([...attributes, { name: '', values: [] }]);
    };

    const handleUpdateAttributeName = (index: number, attrName: string) => {
        const newAttrs = [...attributes];
        newAttrs[index].name = attrName;
        setAttributes(newAttrs);
        generateVariants(newAttrs);
    };

    const handleUpdateAttributeValues = (index: number, valuesStr: string) => {
        const newAttrs = [...attributes];
        newAttrs[index].values = valuesStr.split(',').map(v => v.trim()).filter(v => v);
        setAttributes(newAttrs);
        generateVariants(newAttrs);
    };

    const handleRemoveAttribute = (index: number) => {
        const newAttrs = attributes.filter((_, i) => i !== index);
        setAttributes(newAttrs);
        generateVariants(newAttrs);
    };

    const generateVariants = (attrs: Attribute[]) => {
        const rawAttrs = attrs.filter(a => a.name.trim() && a.values.length > 0);
        
        // Merge attributes with the same name (e.g. two "Color" rows -> one "Color" with combined values)
        const mergedMap = new Map<string, string[]>();
        rawAttrs.forEach(a => {
            const key = a.name.trim();
            const existing = mergedMap.get(key) || [];
            a.values.forEach(v => { if (!existing.includes(v)) existing.push(v); });
            mergedMap.set(key, existing);
        });
        const validAttrs = Array.from(mergedMap.entries()).map(([name, values]) => ({ name, values }));
        
        if (validAttrs.length === 0) {
            setVariants([]);
            return;
        }
        
        const results: Record<string, string>[] = [];
        const helper = (attrIndex: number, currentCombo: Record<string, string>) => {
            if (attrIndex === validAttrs.length) {
                results.push({ ...currentCombo });
                return;
            }
            const attr = validAttrs[attrIndex];
            for (const val of attr.values) {
                currentCombo[attr.name] = val;
                helper(attrIndex + 1, currentCombo);
            }
        };
        helper(0, {});
        
        setVariants(prevVariants => {
            return results.map(combo => {
                const existing = prevVariants.find(v => {
                    const existingKeys = Object.keys(v.attributes);
                    const newKeys = Object.keys(combo);
                    if (existingKeys.length !== newKeys.length) return false;
                    return newKeys.every(k => v.attributes[k] === combo[k]);
                });
                if (existing) return existing;
                return { attributes: combo, price: Number(price) || 0, stock: 0, sku: '' };
            });
        });
    };

    const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };
    // ---------------------------------

    const deleteExistingMedia = async (mediaId: string) => {
        if (!window.confirm('Delete this media permanently?')) return;
        
        if (mediaId === 'main') {
            setDeleteMainImage(true);
            setExistingMedia(prev => prev.filter(m => m.id !== 'main'));
            showToast('Main image removed (Save to apply changes)', 'success');
            return;
        }

        try {
            await productService.deleteMedia(mediaId);
            setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
            if (newMainImageUrl === existingMedia.find(m => m.id === mediaId)?.url) {
                setNewMainImageUrl('');
            }
            showToast('Media deleted', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to delete media', 'error');
        }
    };

    const setAsMainImage = (url: string) => {
        setNewMainImageUrl(url);
        showToast('Image marked as main (Save to apply changes)', 'success');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category_id', categoryId);
        formData.append('description', description);
        formData.append('stock', stock);
        
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('variants', JSON.stringify(variants));
        
        if (deleteMainImage) {
            formData.append('deleteMainImage', 'true');
        }
        if (newMainImageUrl) {
            formData.append('setMainImageUrl', newMainImageUrl);
        }

        mediaFiles.forEach(file => {
            formData.append('media', file);
        });

        try {
            if (isEditMode && id) {
                await productService.updateProduct(id, formData);
                showToast('Product updated successfully', 'success');
            } else {
                await productService.createProduct(formData);
                showToast('Product created successfully', 'success');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            showToast('Error saving product', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading product data...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/admin/products')} 
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
                    <p className="text-slate-500 text-sm mt-1">{isEditMode ? 'Update product details and media gallery' : 'Add a new product to your store catalog'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Information */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 font-serif">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                            <input 
                                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors"
                                placeholder="e.g. Classic Cotton T-Shirt"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Price ($) <span className="text-red-500">*</span></label>
                            <input 
                                type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category <span className="text-red-500">*</span></label>
                            <select 
                                required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors"
                            >
                                <option value="" disabled>Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea 
                                rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                                placeholder="Describe the product details, materials, and care instructions..."
                            />
                        </div>
                    </div>
                </div>

                {/* Attributes & Variants */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 font-serif">Attributes & Variants</h2>
                        <Button type="button" variant="outline" onClick={handleAddAttribute} className="text-sm py-1.5 px-3">
                            <Plus className="w-4 h-4 mr-1" /> Add Attribute
                        </Button>
                    </div>

                    {/* Common Stock (if no variants) */}
                    {attributes.length === 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Base Stock Quantity <span className="text-red-500">*</span></label>
                            <input 
                                type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                                className="w-full md:w-1/2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>
                    )}

                    {/* Attributes Builder */}
                    <div className="space-y-4 mb-8">
                        {attributes.map((attr, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                <div className="w-1/3">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Attribute Name</label>
                                    <input 
                                        type="text" value={attr.name} onChange={(e) => handleUpdateAttributeName(idx, e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 bg-white"
                                        placeholder="e.g. Size, Color, Material"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Values (Comma separated)</label>
                                    <input 
                                        type="text" value={attr.values.join(', ')} onChange={(e) => handleUpdateAttributeValues(idx, e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 bg-white"
                                        placeholder="e.g. S, M, L or Red, Blue"
                                    />
                                </div>
                                <button type="button" onClick={() => handleRemoveAttribute(idx)} className="mt-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {attributes.length === 0 && (
                            <p className="text-sm text-slate-500 italic text-center py-4">No attributes defined. The product will only track base stock and price.</p>
                        )}
                    </div>

                    {/* Variants Table */}
                    {variants.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Generated Variants ({variants.length})</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Variant combination</th>
                                            <th className="px-4 py-3 font-semibold w-32">Price ($) <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 font-semibold w-24">Stock <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 font-semibold w-40">SKU</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {variants.map((variant, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {Object.entries(variant.attributes).map(([k,v]) => `${k}: ${v}`).join(' - ')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" step="0.01" required value={variant.price} onChange={e => handleVariantChange(idx, 'price', Number(e.target.value))}
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 bg-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" required value={variant.stock} onChange={e => handleVariantChange(idx, 'stock', Number(e.target.value))}
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 bg-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="text" value={variant.sku || ''} onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 bg-white"
                                                        placeholder="Optional"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Media Gallery */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 font-serif flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary-600" />
                        Media Gallery
                    </h2>
                    
                    {/* Existing Media */}
                    {existingMedia.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-slate-700 mb-4">Current Uploaded Media</h3>
                            <div className="flex flex-wrap gap-4">
                                {existingMedia.map(m => (
                                    <div key={m.id} className={`relative w-32 h-32 rounded-xl overflow-hidden border ${m.id === 'main' || newMainImageUrl === m.url ? 'border-primary-500 border-2' : 'border-slate-200'} group bg-slate-50`}>
                                        {m.type === 'video' ? (
                                            <video src={resolveImageUrl(m.url)} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={resolveImageUrl(m.url)} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingMedia(m.id)}
                                            className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete this media"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {(m.id === 'main' || newMainImageUrl === m.url) && (
                                            <span className="absolute bottom-0 inset-x-0 bg-primary-600/90 text-white text-[10px] uppercase text-center py-1 font-bold">Main Image</span>
                                        )}
                                        {m.id !== 'main' && newMainImageUrl !== m.url && m.type !== 'video' && (
                                            <button
                                                type="button"
                                                onClick={() => setAsMainImage(m.url)}
                                                className="absolute bottom-2 left-2 p-1.5 bg-white text-primary-600 rounded-lg shadow-sm hover:bg-primary-50 transition-colors opacity-0 group-hover:opacity-100 text-[10px] font-bold"
                                            >
                                                Set Main
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload New */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-4">Upload New Media</h3>
                        
                        <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center pointer-events-none">
                                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8 text-primary-600" />
                                </div>
                                <p className="text-base font-semibold text-slate-900 mb-1">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP, and MP4 (Max 10MB per file)</p>
                            </div>
                        </div>

                        {/* Preview Selected Files */}
                        {mediaFiles.length > 0 && (
                            <div className="mt-6 border border-slate-200 rounded-2xl p-4 bg-slate-50">
                                <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-4">Files to upload ({mediaFiles.length})</h4>
                                <ul className="space-y-2">
                                    {mediaFiles.map((file, idx) => (
                                        <li key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                    {file.type.startsWith('video/') ? (
                                                        <span className="text-xs font-bold text-slate-500">VIDEO</span>
                                                    ) : (
                                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg" />
                                                    )}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeNewFile(idx)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} className="w-32">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={saving} className="w-48 flex items-center justify-center gap-2">
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isEditMode ? 'Update Product' : 'Create Product'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
