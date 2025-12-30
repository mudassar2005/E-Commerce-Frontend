'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Upload,
  Eye,
  EyeOff,
  Star,
  Package,
  DollarSign,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';

export default function ProductsManager() {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByVendor,
    uploadProductImage,
    bulkUpdateProducts,
    bulkDeleteProducts
  } = useProducts();

  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all', // all, active, inactive, pending
    category: 'all'
  });

  // Form state
  const [productForm, setProductForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    topCategory: '',
    subCategory: '',
    stock: '',
    colors: [],
    sizes: [],
    material: '',
    brand: '',
    gender: '',
    tags: [],
    isNew: false,
    isFeatured: false,
    image: '',
    images: []
  });

  useEffect(() => {
    if (user?.userId) {
      fetchVendorProducts();
    }
  }, [user]);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const products = await getProductsByVendor(user.userId);
      setVendorProducts(products);
    } catch (error) {
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        stock: parseInt(productForm.stock),
        colors: productForm.colors.filter(c => c.trim()),
        sizes: productForm.sizes.filter(s => s.trim()),
        tags: productForm.tags.filter(t => t.trim()),
        isApproved: false // New products need approval
      };

      await addProduct(productData);
      showSuccess('Product added successfully! It will be reviewed by admin.');
      setShowAddForm(false);
      resetForm();
      fetchVendorProducts();
    } catch (error) {
      showError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        stock: parseInt(productForm.stock),
        colors: productForm.colors.filter(c => c.trim()),
        sizes: productForm.sizes.filter(s => s.trim()),
        tags: productForm.tags.filter(t => t.trim())
      };

      await updateProduct(editingProduct.id, productData);
      showSuccess('Product updated successfully!');
      setEditingProduct(null);
      resetForm();
      fetchVendorProducts();
    } catch (error) {
      showError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        showSuccess('Product deleted successfully!');
        fetchVendorProducts();
      } catch (error) {
        showError('Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await bulkDeleteProducts(selectedProducts);
        showSuccess(`${selectedProducts.length} products deleted successfully!`);
        setSelectedProducts([]);
        fetchVendorProducts();
      } catch (error) {
        showError('Failed to delete products');
      }
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const imageUrl = await uploadProductImage(file);
      setProductForm(prev => ({
        ...prev,
        image: imageUrl,
        images: [...prev.images, imageUrl]
      }));
      showSuccess('Image uploaded successfully!');
    } catch (error) {
      showError('Failed to upload image');
    }
  };

  const resetForm = () => {
    setProductForm({
      title: '',
      subtitle: '',
      description: '',
      price: '',
      originalPrice: '',
      topCategory: '',
      subCategory: '',
      stock: '',
      colors: [],
      sizes: [],
      material: '',
      brand: '',
      gender: '',
      tags: [],
      isNew: false,
      isFeatured: false,
      image: '',
      images: []
    });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || '',
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      topCategory: product.topCategory || '',
      subCategory: product.subCategory || '',
      stock: product.stock?.toString() || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      material: product.material || '',
      brand: product.brand || '',
      gender: product.gender || '',
      tags: product.tags || [],
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      image: product.image || '',
      images: product.images || []
    });
    setShowAddForm(true);
  };

  const filteredProducts = vendorProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && product.isApproved && product.stock > 0) ||
                         (filters.status === 'inactive' && (!product.isApproved || product.stock === 0)) ||
                         (filters.status === 'pending' && !product.isApproved);
    
    const matchesCategory = filters.category === 'all' || product.topCategory === filters.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg hover:bg-[#d4a574] transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending Approval</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Footwear">Footwear</option>
          </select>

          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="relative">
              <img
                src={product.image || '/images/default-product.png'}
                alt={product.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/images/default-product.png';
                }}
              />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(prev => [...prev, product.id]);
                    } else {
                      setSelectedProducts(prev => prev.filter(id => id !== product.id));
                    }
                  }}
                  className="rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
                />
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  product.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {product.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">{product.subtitle}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#B88E2F]">Rs {product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">Rs {product.originalPrice}</span>
                  )}
                </div>
                <span className="text-sm text-gray-600">Stock: {product.stock}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {product.isNew && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Product"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.status !== 'all' || filters.category !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first product'
            }
          </p>
          {!searchTerm && filters.status === 'all' && filters.category === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#B88E2F] text-white px-6 py-2 rounded-lg hover:bg-[#d4a574] transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={productForm.topCategory}
                    onChange={(e) => setProductForm(prev => ({ ...prev, topCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                  <input
                    type="text"
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm(prev => ({ ...prev, subCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm(prev => ({ ...prev, material: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.colors.join(', ')}
                    onChange={(e) => setProductForm(prev => ({ 
                      ...prev, 
                      colors: e.target.value.split(',').map(c => c.trim()) 
                    }))}
                    placeholder="Red, Blue, Green"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.sizes.join(', ')}
                    onChange={(e) => setProductForm(prev => ({ 
                      ...prev, 
                      sizes: e.target.value.split(',').map(s => s.trim()) 
                    }))}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={productForm.tags.join(', ')}
                  onChange={(e) => setProductForm(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(t => t.trim()) 
                  }))}
                  placeholder="casual, summer, trendy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
                  />
                  <span className="text-sm text-gray-700">Mark as New</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
                  />
                  <span className="text-sm text-gray-700">Mark as Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B88E2F] text-white px-6 py-2 rounded-lg hover:bg-[#d4a574] transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}