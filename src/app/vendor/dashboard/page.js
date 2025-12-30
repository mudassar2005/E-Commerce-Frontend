'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api, { API_BASE_URL } from '@/lib/api';
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
  X,
  Store
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

  // Show loading state if vendor profile is not available
  if (!vendorProfile) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading vendor profile...</p>
      </div>
    );
  }

  // Show message if vendor profile is empty (404 error case)
  if (vendorProfile && Object.keys(vendorProfile).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-[#B88E2F]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Profile Not Found</h3>
        <p className="text-gray-600 mb-6">You need to complete your vendor application first before you can manage your profile.</p>
        <button
          onClick={() => window.location.href = '/vendor/register'}
          className="bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-6 py-3 rounded-lg hover:from-[#9F7A28] hover:to-[#B88E2F] transition-all duration-200 shadow-lg"
        >
          Complete Vendor Application
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (vendorProfile && vendorProfile._id) {
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
        setBackgroundImagePreview(`${API_BASE_URL}${vendorProfile.shopBackgroundImage}`);
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
      // Check if vendorProfile exists and has an ID
      if (!vendorProfile || !vendorProfile._id) {
        showError('Vendor profile not found. Please refresh the page and try again.');
        return;
      }

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
    if (vendorProfile && vendorProfile._id) {
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
        setBackgroundImagePreview(`${API_BASE_URL}${vendorProfile.shopBackgroundImage}`);
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

  const handleCreateVendorProfile = async () => {
    try {
      setLoading(true);
      const createRes = await api.post(`/vendors/fix-missing/${user.id}`);
      setVendorProfile(createRes.data);
      showSuccess('Vendor profile created successfully!');
    } catch (error) {
      console.error('Error creating vendor profile:', error);
      if (error.response?.status === 403) {
        showError('Access denied. Please contact support.');
      } else if (error.response?.status === 409) {
        showError('Vendor profile already exists. Try refreshing the page.');
      } else {
        showError('Failed to create vendor profile. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorData = async () => {
    try {
      setLoading(true);

      // First check if user has vendor role and is approved
      if (!user || user.role !== 'vendor') {
        showError('Access denied. You need vendor privileges to access this page.');
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }

      if (!user.isApproved) {
        showError('Your vendor account is not approved yet. Please wait for admin approval.');
        setTimeout(() => {
          router.push('/vendor/pending');
        }, 2000);
        return;
      }

      // Fetch vendor profile using API client with better error handling
      try {
        const profileRes = await api.get('/vendors/my-profile');
        setVendorProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
        if (error.response?.status === 404) {
          // Vendor profile doesn't exist yet - try to create it
          console.log('Vendor profile not found, attempting to create missing profile...');
          try {
            // Try to create missing vendor application
            const createRes = await api.post(`/vendors/fix-missing/${user.id}`);
            setVendorProfile(createRes.data);
            showSuccess('Vendor profile created successfully!');
          } catch (createError) {
            console.error('Error creating vendor profile:', createError);
            if (createError.response?.status === 403) {
              showError('Unable to create vendor profile. Please contact support.');
            } else {
              showError('Vendor profile not found. Please complete your vendor application or contact support.');
            }
            // Set empty profile to show the "complete application" message
            setVendorProfile({});
          }
        } else if (error.response?.status === 401) {
          showError('Authentication failed. Please login again.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        } else {
          showError('Failed to load vendor profile');
          setVendorProfile({});
        }
      }

      // Fetch vendor products using API client
      try {
        const productsRes = await api.get('/products/vendor/me');
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error('Error fetching vendor products:', error);
        if (error.response?.status === 404) {
          // No products found - this is normal for new vendors
          setProducts([]);
        } else if (error.response?.status === 403) {
          showError('Access denied. Your vendor account may not be properly set up.');
          setProducts([]);
        } else {
          showError('Failed to load your products');
          setProducts([]);
        }
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
    { id: 'shop', name: 'Shop Management', icon: Settings },
    { id: 'profile', name: 'Profile', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Enhanced Header with Golden Gradient */}
      <div className="bg-gradient-to-r from-[#B88E2F] via-[#d4a574] to-[#e6b887] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Vendor Dashboard</h1>
              <p className="text-amber-100">Welcome back, {vendorProfile?.businessName || user.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/vendor/profile'}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 border border-white/30"
              >
                <Settings size={16} />
                Manage Profile
              </button>
              <button
                onClick={fetchVendorData}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 border border-white/30"
              >
                <Settings size={16} />
                Refresh Data
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-white text-[#B88E2F] px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Enhanced Sidebar with Golden Theme */}
          <div className="w-64 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50">
            <nav className="space-y-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-amber-50 hover:shadow-md hover:text-[#B88E2F]'
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
                {/* Enhanced Stats Cards with Golden Gradients */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-[#B88E2F] to-[#9F7A28] p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold">${stats.totalRevenue?.toFixed(2) || '0.00'}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-amber-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#d4a574] to-[#B88E2F] p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm">Total Orders</p>
                        <p className="text-3xl font-bold">{stats.totalOrders || 0}</p>
                      </div>
                      <ShoppingBag className="w-12 h-12 text-amber-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#e6b887] to-[#d4a574] p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm">Pending Orders</p>
                        <p className="text-3xl font-bold">{stats.pendingOrders || 0}</p>
                      </div>
                      <Package className="w-12 h-12 text-amber-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#f4d4a7] to-[#e6b887] p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm">Active Products</p>
                        <p className="text-3xl font-bold">{stats.activeProducts || 0}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-amber-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-[#B88E2F] hover:text-[#9F7A28] text-sm font-medium"
                    >
                      View All Orders →
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order._id} className="hover:bg-amber-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order._id?.slice(-6) || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.user?.name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#B88E2F]">
                                ${order.total?.toFixed(2) || '0.00'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
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
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50">
                <div className="p-6 border-b border-amber-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
                    <button
                      onClick={() => window.location.href = '/vendor/products/add'}
                      className="bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-6 py-2 rounded-lg hover:from-[#9F7A28] hover:to-[#B88E2F] transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                      <Plus size={20} />
                      Add Product
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
                      <p className="text-gray-600 mb-6">Start building your catalog by adding your first product</p>
                      <button
                        onClick={() => window.location.href = '/vendor/products/add'}
                        className="bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-6 py-3 rounded-lg hover:from-[#9F7A28] hover:to-[#B88E2F] transition-all duration-200 shadow-lg"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <div key={product._id} className="border border-amber-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
                          <div className="aspect-w-1 aspect-h-1 mb-4">
                            <img
                              src={product.images?.[0] || '/images/placeholder.svg'}
                              alt={product.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{product.subtitle?.slice(0, 100)}...</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold text-[#B88E2F]">${product.price}</span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'active' ? 'bg-green-100 text-green-800' :
                              product.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => vendorProfile?._id && window.open(`/shop/vendor/${vendorProfile._id}`, '_blank')}
                              className="flex-1 bg-gradient-to-r from-amber-100 to-amber-200 text-[#B88E2F] px-3 py-2 rounded-lg text-sm hover:from-amber-200 hover:to-amber-300 flex items-center justify-center gap-1 transition-all duration-200"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            <button
                              onClick={() => window.location.href = `/vendor/products/edit/${product._id}`}
                              className="flex-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-[#B88E2F] px-3 py-2 rounded-lg text-sm hover:from-yellow-200 hover:to-yellow-300 flex items-center justify-center gap-1 transition-all duration-200"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleProductDelete(product._id)}
                              className="flex-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-3 py-2 rounded-lg text-sm hover:from-red-200 hover:to-red-300 flex items-center justify-center gap-1 transition-all duration-200"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50">
                <div className="p-6 border-b border-amber-200">
                  <h2 className="text-xl font-semibold text-gray-900">All Orders</h2>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600">Orders will appear here once customers start purchasing your products</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
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
                      <tbody className="divide-y divide-amber-200">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-amber-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order._id?.slice(-6) || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.user?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#B88E2F]">
                              ${order.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
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
                              <button className="text-[#B88E2F] hover:text-[#9F7A28] bg-amber-50 px-3 py-1 rounded-lg hover:bg-amber-100 transition-all duration-200">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shop' && (
              <div className="space-y-6">
                {/* Shop Management Header */}
                <div className="bg-gradient-to-r from-[#B88E2F] to-[#d4a574] rounded-xl p-6 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-2">Shop Management</h2>
                  <p className="text-amber-100">Manage your shop settings, appearance, and business operations</p>
                </div>

                {/* Shop Management Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Shop Settings */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#B88E2F] to-[#d4a574] rounded-lg">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Shop Settings</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Configure your shop name, description, and basic information</p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-4 py-2 rounded-lg hover:from-[#9F7A28] hover:to-[#B88E2F] transition-all duration-200 shadow-md"
                    >
                      Manage Settings
                    </button>
                  </div>

                  {/* Product Management */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#d4a574] to-[#e6b887] rounded-lg">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Listings</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add, edit, and manage your product catalog</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('products')}
                        className="w-full bg-gradient-to-r from-[#d4a574] to-[#e6b887] text-white px-4 py-2 rounded-lg hover:from-[#B88E2F] hover:to-[#d4a574] transition-all duration-200 shadow-md"
                      >
                        View Products
                      </button>
                      <button
                        onClick={() => window.location.href = '/vendor/products/add'}
                        className="w-full bg-white text-[#B88E2F] border border-[#B88E2F] px-4 py-2 rounded-lg hover:bg-amber-50 transition-all duration-200"
                      >
                        Add New Product
                      </button>
                    </div>
                  </div>

                  {/* Order Management */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#e6b887] to-[#f4d4a7] rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Process orders, update status, and manage fulfillment</p>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full bg-gradient-to-r from-[#e6b887] to-[#f4d4a7] text-white px-4 py-2 rounded-lg hover:from-[#d4a574] hover:to-[#e6b887] transition-all duration-200 shadow-md"
                    >
                      Manage Orders
                    </button>
                  </div>

                  {/* Shop Analytics */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#B88E2F] to-[#9F7A28] rounded-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                    </div>
                    <p className="text-gray-600 mb-4">View sales reports, customer insights, and performance metrics</p>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full bg-gradient-to-r from-[#B88E2F] to-[#9F7A28] text-white px-4 py-2 rounded-lg hover:from-[#9F7A28] hover:to-[#8B6914] transition-all duration-200 shadow-md"
                    >
                      View Analytics
                    </button>
                  </div>

                  {/* Shop Appearance */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#d4a574] to-[#B88E2F] rounded-lg">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Shop Appearance</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Customize your shop's look, banner, and branding</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => vendorProfile?._id && window.open(`/shop/vendor/${vendorProfile._id}`, '_blank')}
                        className="w-full bg-gradient-to-r from-[#d4a574] to-[#B88E2F] text-white px-4 py-2 rounded-lg hover:from-[#B88E2F] hover:to-[#9F7A28] transition-all duration-200 shadow-md"
                      >
                        Preview Shop
                      </button>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="w-full bg-white text-[#B88E2F] border border-[#B88E2F] px-4 py-2 rounded-lg hover:bg-amber-50 transition-all duration-200"
                      >
                        Edit Appearance
                      </button>
                    </div>
                  </div>

                  {/* Business Tools */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#e6b887] to-[#d4a574] rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Business Tools</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Access promotional tools, discounts, and marketing features</p>
                    <button
                      className="w-full bg-gradient-to-r from-[#e6b887] to-[#d4a574] text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed shadow-md"
                      disabled
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => window.location.href = '/vendor/products/add'}
                      className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg hover:from-amber-200 hover:to-amber-300 transition-all duration-200"
                    >
                      <Plus className="w-6 h-6 text-[#B88E2F]" />
                      <span className="text-sm font-medium text-[#B88E2F]">Add Product</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg hover:from-amber-200 hover:to-amber-300 transition-all duration-200"
                    >
                      <ShoppingBag className="w-6 h-6 text-[#B88E2F]" />
                      <span className="text-sm font-medium text-[#B88E2F]">View Orders</span>
                    </button>
                    <button
                      onClick={() => vendorProfile?._id && window.open(`/shop/vendor/${vendorProfile._id}`, '_blank')}
                      className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg hover:from-amber-200 hover:to-amber-300 transition-all duration-200"
                    >
                      <Eye className="w-6 h-6 text-[#B88E2F]" />
                      <span className="text-sm font-medium text-[#B88E2F]">Preview Shop</span>
                    </button>
                    <button
                      onClick={fetchVendorData}
                      className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg hover:from-amber-200 hover:to-amber-300 transition-all duration-200"
                    >
                      <Settings className="w-6 h-6 text-[#B88E2F]" />
                      <span className="text-sm font-medium text-[#B88E2F]">Refresh Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shop Profile</h2>
                
                {!vendorProfile || !vendorProfile._id ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendor Profile Found</h3>
                      <p className="text-gray-600 mb-6">
                        It looks like your vendor profile hasn't been created yet. 
                        Click the button below to create your shop profile.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateVendorProfile}
                      disabled={loading}
                      className="bg-[#B88E2F] text-white px-6 py-3 rounded-lg hover:bg-[#d4a574] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Profile...' : 'Create Vendor Profile'}
                    </button>
                  </div>
                ) : (
                  <VendorProfileForm vendorProfile={vendorProfile} onUpdate={fetchVendorData} />
                )}
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