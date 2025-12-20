'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Users,
  Settings,
  BarChart3,
  Upload,
  Save,
  X
} from 'lucide-react';

// Vendor Profile Form Component
function VendorProfileForm({ vendorProfile, onUpdate }) {
  const { showSuccess, showError } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    businessName: '',
    contactPerson: '',
    phoneNumber: '',
    alternatePhone: '',
    email: '',
    shopDescription: '',
    shopBackgroundImage: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branchName: ''
    },
    taxDetails: {
      gstNumber: '',
      panNumber: ''
    },
    socialLinks: []
  });

  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);

  useEffect(() => {
    if (vendorProfile) {
      setFormData({
        shopName: vendorProfile.shopName || '',
        businessName: vendorProfile.businessName || '',
        contactPerson: vendorProfile.contactPerson || '',
        phoneNumber: vendorProfile.phoneNumber || '',
        alternatePhone: vendorProfile.alternatePhone || '',
        email: vendorProfile.email || '',
        shopDescription: vendorProfile.shopDescription || '',
        shopBackgroundImage: vendorProfile.shopBackgroundImage || '',
        businessAddress: vendorProfile.businessAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        pickupAddress: vendorProfile.pickupAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        bankDetails: vendorProfile.bankDetails || {
          accountHolderName: '',
          accountNumber: '',
          bankName: '',
          ifscCode: '',
          branchName: ''
        },
        taxDetails: vendorProfile.taxDetails || {
          gstNumber: '',
          panNumber: ''
        },
        socialLinks: vendorProfile.socialLinks || []
      });

      // Set background image preview if exists
      if (vendorProfile.shopBackgroundImage) {
        setBackgroundImagePreview(`http://localhost:3001${vendorProfile.shopBackgroundImage}`);
      }
    }
  }, [vendorProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add background image if selected
      if (backgroundImageFile) {
        submitData.append('shopBackgroundImage', backgroundImageFile);
      }

      await api.put(`/vendors/${vendorProfile._id}/profile`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsEditing(false);
      onUpdate();
      showSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBackgroundImageFile(null);
    // Reset form data to original values
    if (vendorProfile) {
      setFormData({
        shopName: vendorProfile.shopName || '',
        businessName: vendorProfile.businessName || '',
        contactPerson: vendorProfile.contactPerson || '',
        phoneNumber: vendorProfile.phoneNumber || '',
        alternatePhone: vendorProfile.alternatePhone || '',
        email: vendorProfile.email || '',
        shopDescription: vendorProfile.shopDescription || '',
        shopBackgroundImage: vendorProfile.shopBackgroundImage || '',
        businessAddress: vendorProfile.businessAddress || {},
        pickupAddress: vendorProfile.pickupAddress || {},
        bankDetails: vendorProfile.bankDetails || {},
        taxDetails: vendorProfile.taxDetails || {},
        socialLinks: vendorProfile.socialLinks || []
      });
      
      // Reset background image preview
      if (vendorProfile.shopBackgroundImage) {
        setBackgroundImagePreview(`http://localhost:3001${vendorProfile.shopBackgroundImage}`);
      } else {
        setBackgroundImagePreview(null);
      }
    }
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      setBackgroundImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Shop Information</h3>
          <p className="text-sm text-gray-600">
            {vendorProfile?.status === 'pending' ? 
              'Complete your profile to get approved faster' : 
              'Manage your shop details and information'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg hover:bg-[#d4a574] transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg hover:bg-[#d4a574] transition-colors flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
            <input
              type="tel"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Description</label>
          <textarea
            rows={4}
            name="shopDescription"
            value={formData.shopDescription}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            placeholder="Describe your shop and what you sell..."
          />
        </div>

        {/* Shop Background Image */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Background Image</label>
          <div className="mt-2">
            {backgroundImagePreview ? (
              <div className="relative">
                <img 
                  src={backgroundImagePreview} 
                  alt="Shop Background" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <label className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <span>Change Background</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleBackgroundImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className={`relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574] ${!isEditing ? 'pointer-events-none opacity-50' : ''}`}>
                      <span>Upload shop background</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleBackgroundImageChange}
                        disabled={!isEditing}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP up to 5MB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Business Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              name="businessAddress.street"
              value={formData.businessAddress.street}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="businessAddress.city"
              value={formData.businessAddress.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="businessAddress.state"
              value={formData.businessAddress.state}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              name="businessAddress.zipCode"
              value={formData.businessAddress.zipCode}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="businessAddress.country"
              value={formData.businessAddress.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Bank Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
            <input
              type="text"
              name="bankDetails.accountHolderName"
              value={formData.bankDetails.accountHolderName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              name="bankDetails.accountNumber"
              value={formData.bankDetails.accountNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            <input
              type="text"
              name="bankDetails.bankName"
              value={formData.bankDetails.bankName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
            <input
              type="text"
              name="bankDetails.ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Tax Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Tax Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
            <input
              type="text"
              name="taxDetails.gstNumber"
              value={formData.taxDetails.gstNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
            <input
              type="text"
              name="taxDetails.panNumber"
              value={formData.taxDetails.panNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Application Status</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Status:</p>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              vendorProfile?.status === 'approved' ? 'bg-green-100 text-green-800' :
              vendorProfile?.status === 'pending' ? 'bg-orange-100 text-orange-800' :
              vendorProfile?.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {vendorProfile?.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          {vendorProfile?.status === 'pending' && (
            <div className="text-right">
              <p className="text-sm text-orange-600 font-medium">⏳ Awaiting Admin Approval</p>
              <p className="text-xs text-gray-500">Complete your profile to speed up the process</p>
            </div>
          )}
          {vendorProfile?.status === 'approved' && (
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium">✅ Approved & Active</p>
              <p className="text-xs text-gray-500">You can now add products and receive orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VendorDashboardContent() {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState(null);

  // Fetch vendor data
  useEffect(() => {
    if (user?.role === 'vendor') {
      fetchVendorData();
    }
  }, [user]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendor profile using API client
      try {
        const profileRes = await api.get('/vendors/my-profile');
        setVendorProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
        showError('Failed to load vendor profile');
      }

      // Fetch vendor products using API client
      try {
        const productsRes = await api.get('/products/vendor/me');
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error('Error fetching vendor products:', error);
        setProducts([]);
      }

      // Fetch vendor orders using API client  
      try {
        const ordersRes = await api.get('/orders/vendor/me');
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error('Error fetching vendor orders:', error);
        setOrders([]);
      }

      // Calculate stats
      const totalRevenue = (orders || []).reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = (orders || []).filter(o => o.status === 'pending').length;
      const totalProducts = (products || []).length;
      const activeProducts = (products || []).filter(p => p.status === 'active').length;

      setStats({
        totalRevenue,
        totalOrders: (orders || []).length,
        pendingOrders,
        totalProducts,
        activeProducts
      });

    } catch (error) {
      console.error('Error fetching vendor data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchVendorData();
        showSuccess('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'My Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'profile', name: 'Shop Profile', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {vendorProfile?.businessName || user.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = '/vendor/profile'}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Manage Profile
              </button>
              <button
                onClick={fetchVendorData}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Refresh Data
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg hover:bg-[#d4a574] transition-colors"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#B88E2F] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue?.toFixed(2) || '0.00'}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                      </div>
                      <ShoppingBag className="w-12 h-12 text-[#B88E2F]" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Orders</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders || 0}</p>
                      </div>
                      <Package className="w-12 h-12 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Products</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeProducts || 0}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-[#B88E2F]" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order._id?.slice(-6) || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.user?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${order.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
                    <button
                      onClick={() => window.location.href = '/vendor/products/add'}
                      className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg hover:bg-[#d4a574] transition-colors flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add Product
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="aspect-w-1 aspect-h-1 mb-4">
                          <img
                            src={product.images?.[0] || '/images/placeholder.svg'}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description?.slice(0, 100)}...</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xl font-bold text-[#B88E2F]">${product.price}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' :
                            product.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.open(`/shop/vendor/${vendorProfile._id}`, '_blank')}
                            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button 
                            onClick={() => window.location.href = `/vendor/products/edit/${product._id}`}
                            className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 flex items-center justify-center gap-1"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleProductDelete(product._id)}
                            className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 flex items-center justify-center gap-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">All Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id?.slice(-6) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.user?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.items?.length || 0} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.total?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-[#B88E2F] hover:text-[#d4a574]">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shop Profile</h2>
                <VendorProfileForm vendorProfile={vendorProfile} onUpdate={fetchVendorData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <VendorDashboardContent />
    </ProtectedRoute>
  );
}