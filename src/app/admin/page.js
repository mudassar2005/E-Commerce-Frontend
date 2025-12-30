'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api, { API_BASE_URL } from '@/lib/api';
import {
  Users,
  Store,
  ShoppingBag,
  AlertTriangle,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Ban,
  Trash2,
  X,
  Package,
  LogOut
} from 'lucide-react';

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const { showSuccess, showError, showWarning } = useAlert();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending-vendors');
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);

  // Newsletter state
  const [newsletterData, setNewsletterData] = useState(null);
  const [selectedTargets, setSelectedTargets] = useState(['subscribers']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      router.push('/login');
    } catch (error) {
      showError('Error logging out');
    }
  };

  // Fetch data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all vendors for stats
      const vendorsRes = await api.get('/vendors/all');
      const allVendorsData = vendorsRes.data.vendors || [];
      
      // Fetch pending vendors specifically for the pending tab
      let pendingVendorsData = [];
      try {
        const pendingVendorsRes = await api.get('/vendors/pending');
        pendingVendorsData = pendingVendorsRes.data.vendors || [];
      } catch (pendingError) {
        console.error('Error fetching pending vendors:', pendingError);
        // Fallback to filtering from all vendors if pending endpoint fails
        pendingVendorsData = allVendorsData.filter(v => v.status === 'pending');
      }
      
      // Combine all vendors with pending vendors to ensure we have complete data
      const combinedVendors = [...allVendorsData];
      
      // Add pending vendors if they're not already in the all vendors list
      pendingVendorsData.forEach(pendingVendor => {
        const exists = combinedVendors.find(v => v._id === pendingVendor._id);
        if (!exists) {
          combinedVendors.push(pendingVendor);
        }
      });
      
      // Debug logging
      console.log('Vendor data fetched:', {
        allVendors: allVendorsData.length,
        pendingVendors: pendingVendorsData.length,
        combinedVendors: combinedVendors.length,
        pendingInCombined: combinedVendors.filter(v => v.status === 'pending').length
      });
      
      setVendors(combinedVendors);

      // Fetch customers using the API client
      const customersRes = await api.get('/auth/users');
      const allUsers = customersRes.data;
      const customersData = allUsers.filter(user => user.role === 'user');
      setCustomers(customersData);

      // Fetch all products
      const productsRes = await api.get('/products');
      const productsData = productsRes.data.products || [];
      setProducts(productsData);

      // Fetch reports using the API client
      const reportsRes = await api.get('/reports');
      const reportsData = reportsRes.data.reports || []; // Handle pagination structure
      setReports(reportsData);

      // Fetch newsletter data
      try {
        const newsletterRes = await api.get('/newsletter/admin-data');
        setNewsletterData(newsletterRes.data);
      } catch (error) {
        console.error('Error fetching newsletter data:', error);
      }

      // Calculate stats using combined vendor data
      setStats({
        totalVendors: combinedVendors.length,
        pendingVendors: combinedVendors.filter(v => v.status === 'pending').length,
        approvedVendors: combinedVendors.filter(v => v.status === 'approved').length,
        totalCustomers: customersData.length,
        totalProducts: productsData.length,
        pendingProducts: productsData.filter(p => !p.isApproved).length,
        approvedProducts: productsData.filter(p => p.isApproved).length,
        activeReports: reportsData.filter(r => r.status === 'open').length,
        resolvedReports: reportsData.filter(r => r.status === 'resolved').length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!newsletterSubject || !newsletterContent || selectedTargets.length === 0) {
      showWarning('Please fill in all fields and select at least one target audience');
      return;
    }

    try {
      const payload = {
        subject: newsletterSubject,
        message: newsletterContent,
        targets: selectedTargets,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined
      };

      const response = await api.post('/newsletter/send-targeted', payload);
      showSuccess(`Newsletter sent successfully to ${response.data.successful} recipients!`);

      // Reset form
      setNewsletterSubject('');
      setNewsletterContent('');
      setSelectedTargets(['subscribers']);
      setSelectedCategories([]);

    } catch (error) {
      console.error('Error sending newsletter:', error);
      showError('Failed to send newsletter. Please try again.');
    }
  };

  const handleFixMissingVendors = async () => {
    try {
      // Get all products to find unique vendor user IDs
      const productsRes = await api.get('/products?limit=1000');
      const products = productsRes.data.products || [];
      
      // Get unique vendor user IDs
      const vendorUserIds = [...new Set(products.map(p => p.vendor).filter(Boolean))];
      
      // Get existing vendors
      const vendorsRes = await api.get('/vendors/all?limit=1000');
      const existingVendors = vendorsRes.data.vendors || [];
      const existingVendorUserIds = existingVendors.map(v => v.user?._id || v.user);
      
      // Find missing vendor profiles
      const missingVendorUserIds = vendorUserIds.filter(userId => 
        !existingVendorUserIds.includes(userId)
      );
      
      if (missingVendorUserIds.length === 0) {
        showSuccess('All vendors already have profiles!');
        return;
      }
      
      showWarning(`Found ${missingVendorUserIds.length} missing vendor profiles. Creating them...`);
      
      // Create missing vendor profiles
      let created = 0;
      for (const userId of missingVendorUserIds) {
        try {
          await api.post(`/vendors/fix-missing/${userId}`);
          created++;
        } catch (error) {
          console.error(`Failed to create vendor profile for user ${userId}:`, error);
        }
      }
      
      showSuccess(`Created ${created} missing vendor profiles!`);
      fetchDashboardData(); // Refresh data
      
    } catch (error) {
      console.error('Error fixing missing vendors:', error);
      showError('Failed to fix missing vendor profiles');
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/vendors/${vendorId}/approve`);
      } else if (action === 'reject') {
        const reason = prompt('Please provide a reason for rejection:') || 'Rejected by admin';
        await api.put(`/vendors/${vendorId}/reject`, { reason });
      } else if (action === 'suspend') {
        const reason = prompt('Please provide a reason for suspension:') || 'Suspended by admin';
        await api.put(`/vendors/${vendorId}/suspend`, { reason });
      } else if (action === 'unsuspend') {
        await api.put(`/vendors/${vendorId}/unsuspend`);
      } else if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
          return;
        }
        await api.delete(`/vendors/${vendorId}`);
      }
      fetchDashboardData(); // Refresh data
      showSuccess(`Vendor ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing vendor:`, error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        requestBody: error.config?.data
      });
      showError(`Failed to ${action} vendor: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCustomerBlock = async (customerId, block = true) => {
    try {
      if (block) {
        await api.post(`/auth/users/${customerId}/block`, { reason: 'Blocked by admin' });
      } else {
        await api.post(`/auth/users/${customerId}/unblock`);
      }
      fetchDashboardData(); // Refresh data
      showSuccess(`Customer ${block ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      console.error('Error updating customer status:', error);
      showError(`Failed to ${block ? 'block' : 'unblock'} customer`);
    }
  };

  const handleViewVendor = async (vendor) => {
    setSelectedVendor(vendor);
    try {
      // Fetch vendor's products - use vendor ID directly since products reference vendor by user ID
      // But first we need to get the user ID from the vendor
      if (!vendor.user || !vendor.user._id) {
        console.error('Vendor user information is missing');
        setVendorProducts([]);
        return;
      }

      const productsRes = await api.get(`/products?vendor=${vendor.user._id}`);
      setVendorProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      setVendorProducts([]);
    }
  };

  const handleProductAction = async (productId, action) => {
    try {
      if (action === 'approve') {
        await api.patch(`/products/${productId}/approve`);
      } else if (action === 'reject') {
        await api.patch(`/products/${productId}/reject`);
      } else if (action === 'delete') {
        await api.delete(`/products/${productId}`);
      }
      
      // Refresh products list
      fetchDashboardData();
      
      // If we're viewing vendor products, refresh those too
      if (selectedVendor && selectedVendor.user && selectedVendor.user._id) {
        const productsRes = await api.get(`/products?vendor=${selectedVendor.user._id}`);
        setVendorProducts(productsRes.data.products || []);
      }
      showSuccess(`Product ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      showError(`Failed to ${action} product`);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'pending-vendors', name: 'Pending Vendors', icon: Clock },
    { id: 'all-vendors', name: 'All Vendors', icon: Store },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'reports', name: 'Reports', icon: AlertTriangle },
    { id: 'newsletter', name: 'Newsletter', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Enhanced Header with Gradient */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
              <p className="text-black mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                Back to Store
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Bar with Colors */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-gray-600 to-gray-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.pendingVendors || 0}</div>
                  <div className=" text-sm">Pending Vendors</div>
                </div>
                <Clock className="w-8 h-8 0" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalVendors || 0}</div>
                  <div className="text-blue-100 text-sm">Total Vendors</div>
                </div>
                <Store className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.pendingProducts || 0}</div>
                  <div className="text-purple-100 text-sm">Pending Products</div>
                </div>
                <Package className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalCustomers || 0}</div>
                  <div className="text-green-100 text-sm">Customers</div>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.activeReports || 0}</div>
                  <div className="text-red-100 text-sm">Active Reports</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs with Colors */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              // Define colors for each tab
              const tabColors = {
                'pending-vendors': 'border-orange-500 text-orange-600 bg-orange-50',
                'all-vendors': 'border-blue-500 text-blue-600 bg-blue-50',
                'products': 'border-purple-500 text-purple-600 bg-purple-50',
                'customers': 'border-green-500 text-green-600 bg-green-50',
                'reports': 'border-red-500 text-red-600 bg-red-50',
                'newsletter': 'border-purple-500 text-purple-600 bg-purple-50'
              };
              
              const activeColors = tabColors[tab.id] || 'border-gray-900 text-gray-900 bg-gray-50';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-3 font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? `${activeColors} shadow-sm`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                  {tab.id === 'pending-vendors' && stats.pendingVendors > 0 && (
                    <span className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg">
                      {stats.pendingVendors}
                    </span>
                  )}
                  {tab.id === 'products' && stats.pendingProducts > 0 && (
                    <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg">
                      {stats.pendingProducts}
                    </span>
                  )}
                  {tab.id === 'reports' && stats.activeReports > 0 && (
                    <span className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg">
                      {stats.activeReports}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full">
            {activeTab === 'pending-vendors' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Pending Vendor Applications</h2>
                        <p className="text-sm text-gray-600">Review and approve vendor applications</p>
                      </div>
                    </div>
                    <button
                      onClick={fetchDashboardData}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {(vendors || []).filter(v => v.status === 'pending').length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
                      <p className="text-gray-600 mb-4">There are currently no vendor applications waiting for approval.</p>
                      <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 text-sm text-white bg-gray-800 hover:bg-gray-900 rounded transition-colors"
                      >
                        Refresh Data
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(vendors || []).filter(v => v.status === 'pending').map((vendor) => (
                        <div key={vendor._id} className="border border-gray-200 rounded p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                  <Store className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{vendor.businessName}</h3>
                                  <p className="text-gray-700">{vendor.contactPerson || vendor.user?.name || 'No contact person'}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span>{vendor.email}</span>
                                    <span>•</span>
                                    <span>{vendor.phoneNumber}</span>
                                  </div>
                                  <p className="text-gray-600 mt-2 text-sm">{vendor.shopDescription || 'No description available'}</p>
                                  <div className="flex gap-2 mt-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {vendor.businessType}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      Pending Review
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleViewVendor(vendor)}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                title="View Vendor Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleVendorAction(vendor._id, 'approve')}
                                className="px-3 py-1 text-sm text-white bg-gray-800 hover:bg-gray-900 rounded transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVendorAction(vendor._id, 'reject')}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'all-vendors' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">All Vendors</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search vendors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vendors
                        .filter(vendor =>
                          vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vendor.user?.name && vendor.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((vendor) => (
                          <tr key={vendor._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{vendor.businessName}</div>
                                <div className="text-sm text-gray-500">{vendor.businessType}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm text-gray-900">{vendor.contactPerson || vendor.user?.name || 'No contact person'}</div>
                                <div className="text-sm text-gray-500">{vendor.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                vendor.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                  vendor.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {vendor.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewVendor(vendor)}
                                  className="text-[#B88E2F] hover:text-[#d4a574]"
                                >
                                  <Eye size={16} />
                                </button>
                                {vendor.status === 'approved' && (
                                  <button
                                    onClick={() => handleVendorAction(vendor._id, 'suspend')}
                                    className="text-orange-600 hover:text-orange-900"
                                    title="Suspend Vendor"
                                  >
                                    <Ban size={16} />
                                  </button>
                                )}
                                {vendor.status === 'suspended' && (
                                  <button
                                    onClick={() => handleVendorAction(vendor._id, 'unsuspend')}
                                    className="text-green-600 hover:text-green-900"
                                    title="Unsuspend Vendor"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleVendorAction(vendor._id, 'delete')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Vendor"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vendor Details View */}
            {selectedVendor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#B88E2F] to-[#d4a574]">
                    <div className="flex justify-between items-center">
                      <div className="text-white">
                        <h2 className="text-2xl font-bold">
                          {selectedVendor.businessName}
                        </h2>
                        <p className="text-white/80">Vendor Application Details</p>
                      </div>
                      <button
                        onClick={() => setSelectedVendor(null)}
                        className="text-white/80 hover:text-white bg-white/20 rounded-full p-2"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Status and Actions */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-600">Current Status:</span>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${selectedVendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                            selectedVendor.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              selectedVendor.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {selectedVendor.status?.toUpperCase()}
                          </span>
                          {selectedVendor.approvedAt && (
                            <span className="text-sm text-gray-500">
                              Approved on {new Date(selectedVendor.approvedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {selectedVendor.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVendorAction(selectedVendor._id, 'approve')}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleVendorAction(selectedVendor._id, 'reject')}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          )}
                          {selectedVendor.status === 'approved' && (
                            <button
                              onClick={() => handleVendorAction(selectedVendor._id, 'suspend')}
                              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                          {selectedVendor.status === 'suspended' && (
                            <button
                              onClick={() => handleVendorAction(selectedVendor._id, 'unsuspend')}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Unsuspend
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Vendor Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      {/* Personal Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Personal Information</h3>
                        <div className="space-y-3">
                          {/* Personal Photo */}
                          {selectedVendor.documents?.personalPhoto && selectedVendor.documents.personalPhoto !== 'pending' && (
                            <div className="text-center mb-4">
                              <img
                                src={`${API_BASE_URL}/uploads/vendor-documents/${selectedVendor.documents.personalPhoto}`}
                                alt="Personal Photo"
                                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-200"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <p className="text-xs text-gray-500 mt-1">Personal Photo</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-600">Full Name:</span>
                            <p className="text-gray-900">{selectedVendor.contactPerson}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Email:</span>
                            <p className="text-gray-900">{selectedVendor.email}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Primary Phone:</span>
                            <p className="text-gray-900">{selectedVendor.phoneNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Alternate Phone:</span>
                            <p className="text-gray-900">{selectedVendor.alternatePhone}</p>
                          </div>
                          {selectedVendor.cnicNumber && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">CNIC Number:</span>
                              <p className="text-gray-900">{selectedVendor.cnicNumber}</p>
                            </div>
                          )}
                          {selectedVendor.dateOfBirth && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                              <p className="text-gray-900">{new Date(selectedVendor.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Business Information</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Shop Name:</span>
                            <p className="text-gray-900">{selectedVendor.shopName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Business Name:</span>
                            <p className="text-gray-900">{selectedVendor.businessName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Business Type:</span>
                            <p className="text-gray-900">{selectedVendor.businessType}</p>
                          </div>
                          {selectedVendor.businessCategory && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Category:</span>
                              <p className="text-gray-900">{selectedVendor.businessCategory}</p>
                            </div>
                          )}
                          {selectedVendor.establishedYear && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Established:</span>
                              <p className="text-gray-900">{selectedVendor.establishedYear}</p>
                            </div>
                          )}
                          {selectedVendor.businessDescription && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Description:</span>
                              <p className="text-gray-900 text-sm">{selectedVendor.businessDescription}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address & Financial Information */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Address & Financial</h3>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Business Address:</span>
                            <div className="text-gray-900 text-sm">
                              <p>{selectedVendor.businessAddress?.street}</p>
                              <p>{selectedVendor.businessAddress?.city}, {selectedVendor.businessAddress?.state}</p>
                              <p>{selectedVendor.businessAddress?.zipCode}, {selectedVendor.businessAddress?.country}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Bank Details:</span>
                            <div className="text-gray-900 text-sm space-y-1">
                              <p><strong>Account Holder:</strong> {selectedVendor.bankDetails?.accountHolderName}</p>
                              <p><strong>Bank:</strong> {selectedVendor.bankDetails?.bankName}</p>
                              <p><strong>Account:</strong> {selectedVendor.bankDetails?.accountNumber}</p>
                            </div>
                          </div>
                          {(selectedVendor.taxDetails?.gstNumber || selectedVendor.taxDetails?.panNumber) && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Tax Details:</span>
                              <div className="text-gray-900 text-sm space-y-1">
                                {selectedVendor.taxDetails?.gstNumber && (
                                  <p><strong>GST:</strong> {selectedVendor.taxDetails.gstNumber}</p>
                                )}
                                {selectedVendor.taxDetails?.panNumber && (
                                  <p><strong>PAN:</strong> {selectedVendor.taxDetails.panNumber}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CNIC Photos Section */}
                    {(selectedVendor.documents?.cnicFrontPhoto || selectedVendor.documents?.cnicBackPhoto) && (
                      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">CNIC Verification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedVendor.documents?.cnicFrontPhoto && selectedVendor.documents.cnicFrontPhoto !== 'pending' && (
                            <div className="text-center">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">CNIC Front Side</h4>
                              <img
                                src={`${API_BASE_URL}/uploads/vendor-documents/${selectedVendor.documents.cnicFrontPhoto}`}
                                alt="CNIC Front"
                                className="w-full max-w-sm mx-auto rounded-lg border border-gray-300 shadow-sm"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                          {selectedVendor.documents?.cnicBackPhoto && selectedVendor.documents.cnicBackPhoto !== 'pending' && (
                            <div className="text-center">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">CNIC Back Side</h4>
                              <img
                                src={`${API_BASE_URL}/uploads/vendor-documents/${selectedVendor.documents.cnicBackPhoto}`}
                                alt="CNIC Back"
                                className="w-full max-w-sm mx-auto rounded-lg border border-gray-300 shadow-sm"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedVendor.totalProducts || 0}</div>
                        <div className="text-sm text-blue-600">Total Products</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedVendor.totalOrders || 0}</div>
                        <div className="text-sm text-green-600">Total Orders</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600">{selectedVendor.averageRating || 0}/5</div>
                        <div className="text-sm text-yellow-600">Average Rating</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedVendor.totalReviews || 0}</div>
                        <div className="text-sm text-purple-600">Total Reviews</div>
                      </div>
                    </div>

                    {/* Shop Description */}
                    {selectedVendor.shopDescription && (
                      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Shop Description</h3>
                        <p className="text-gray-700">{selectedVendor.shopDescription}</p>
                      </div>
                    )}

                    {/* Documents Status */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Document Status</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${selectedVendor.documents?.personalPhoto && selectedVendor.documents.personalPhoto !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {selectedVendor.documents?.personalPhoto && selectedVendor.documents.personalPhoto !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Personal Photo</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${selectedVendor.documents?.cnicFrontPhoto && selectedVendor.documents.cnicFrontPhoto !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {selectedVendor.documents?.cnicFrontPhoto && selectedVendor.documents.cnicFrontPhoto !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">CNIC Front</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${selectedVendor.documents?.cnicBackPhoto && selectedVendor.documents.cnicBackPhoto !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {selectedVendor.documents?.cnicBackPhoto && selectedVendor.documents.cnicBackPhoto !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">CNIC Back</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${selectedVendor.documents?.businessLicense && selectedVendor.documents.businessLicense !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {selectedVendor.documents?.businessLicense && selectedVendor.documents.businessLicense !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Business License</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${selectedVendor.documents?.taxCertificate && selectedVendor.documents.taxCertificate !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {selectedVendor.documents?.taxCertificate && selectedVendor.documents.taxCertificate !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Tax Certificate</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${selectedVendor.documents?.identityProof && selectedVendor.documents.identityProof !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {selectedVendor.documents?.identityProof && selectedVendor.documents.identityProof !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Identity Proof</p>
                        </div>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold">Vendor Products ({vendorProducts.length})</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {vendorProducts.map((product) => (
                              <tr key={product._id}>
                                <td className="px-4 py-4">
                                  <div className="flex items-center">
                                    <img
                                      src={product.image || '/images/default-product.png'}
                                      alt={product.title}
                                      className="w-12 h-12 object-cover rounded-lg mr-3"
                                    />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                      <div className="text-sm text-gray-500">{product.subtitle}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                  ${product.price || 0}
                                  {product.originalPrice && (
                                    <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">{product.stock}</td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.isApproved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {product.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium">
                                  <div className="flex gap-2">
                                    {!product.isApproved && (
                                      <button
                                        onClick={() => handleProductAction(product._id, 'approve')}
                                        className="text-green-600 hover:text-green-900"
                                        title="Approve Product"
                                      >
                                        <CheckCircle size={16} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleProductAction(product._id, 'reject')}
                                      className="text-red-600 hover:text-red-900"
                                      title="Reject Product"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleProductAction(product._id, 'delete')}
                                      className="text-red-600 hover:text-red-900"
                                      title="Delete Product"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {vendorProducts.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Package size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No products found for this vendor</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Product Management</h2>
                        <p className="text-sm text-gray-600">Review and approve product listings</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                      <button
                        onClick={fetchDashboardData}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Refresh
                      </button>
                      <button
                        onClick={handleFixMissingVendors}
                        className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                      >
                        Fix Missing Vendors
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Stats */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalProducts || 0}</div>
                      <div className="text-sm text-gray-600">Total Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.approvedProducts || 0}</div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.pendingProducts || 0}</div>
                      <div className="text-sm text-gray-600">Pending Approval</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products
                        .filter(product =>
                          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.topCategory.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .sort((a, b) => {
                          // Sort pending products first
                          if (!a.isApproved && b.isApproved) return -1;
                          if (a.isApproved && !b.isApproved) return 1;
                          return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                        .map((product) => (
                          <tr key={product._id} className={!product.isApproved ? 'bg-orange-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.image || '/images/default-product.png'}
                                  alt={product.title}
                                  className="w-12 h-12 object-cover rounded-lg mr-3"
                                  onError={(e) => {
                                    e.target.src = '/images/default-product.png';
                                  }}
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                  <div className="text-sm text-gray-500">{product.topCategory}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.vendor?.name || 'Unknown Vendor'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.vendor?.email || 'No email'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Rs {product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.isApproved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {product.isApproved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                {!product.isApproved && (
                                  <button
                                    onClick={() => handleProductAction(product._id, 'approve')}
                                    className="text-green-600 hover:text-green-900"
                                    title="Approve Product"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                {product.isApproved && (
                                  <button
                                    onClick={() => handleProductAction(product._id, 'reject')}
                                    className="text-orange-600 hover:text-orange-900"
                                    title="Reject Product"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleProductAction(product._id, 'delete')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {products.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                      <p className="text-gray-600">There are currently no products in the system.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers
                        .filter(customer =>
                          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((customer) => (
                          <tr key={customer._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {customer.blocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleCustomerBlock(customer._id, !customer.blocked)}
                                className={`${customer.blocked
                                  ? 'text-green-600 hover:text-green-900'
                                  : 'text-red-600 hover:text-red-900'
                                  }`}
                              >
                                {customer.blocked ? 'Unblock' : 'Block'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Customer & Vendor Reports</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {(reports || []).map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'open' ? 'bg-red-100 text-red-800' :
                                report.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                {report.status}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.priority === 'high' ? 'bg-red-100 text-red-800' :
                                report.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                {report.priority} priority
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{report.description}</p>
                            <p className="text-sm text-gray-500">
                              Reported by: {report.reportedBy?.name} • Type: {report.type}
                            </p>
                            {report.reportedUser && (
                              <p className="text-sm text-gray-500">
                                Against: {report.reportedUser.name} ({report.reportedUser.email})
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button className="bg-[#B88E2F] text-white px-4 py-2 rounded hover:bg-[#d4a574]">
                              View Details
                            </button>
                            {report.status === 'open' && (
                              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div className="space-y-6">
                {/* Newsletter Stats */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-[#B88E2F] to-[#d4a574] rounded-lg">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Newsletter Management</h2>
                  </div>

                  {newsletterData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600">Total Users</p>
                            <p className="text-2xl font-bold text-blue-900">{newsletterData.stats.totalUsers}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Store className="h-8 w-8 text-green-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-600">Total Vendors</p>
                            <p className="text-2xl font-bold text-green-900">{newsletterData.stats.totalVendors}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Mail className="h-8 w-8 text-purple-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-purple-600">Subscribers</p>
                            <p className="text-2xl font-bold text-purple-900">{newsletterData.stats.totalSubscribers}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <ShoppingBag className="h-8 w-8 text-orange-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-orange-600">Products</p>
                            <p className="text-2xl font-bold text-orange-900">{newsletterData.stats.totalProducts}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Newsletter Composition */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Send Newsletter Form */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Send Newsletter</h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Audience
                        </label>
                        <div className="space-y-2">
                          {['all-users', 'customers', 'vendors', 'subscribers', 'admins'].map(target => (
                            <label key={target} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedTargets.includes(target)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTargets([...selectedTargets, target]);
                                  } else {
                                    setSelectedTargets(selectedTargets.filter(t => t !== target));
                                  }
                                }}
                                className="rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {target.replace('-', ' ')}
                                {newsletterData && (
                                  <span className="text-gray-500">
                                    ({target === 'all-users' ? newsletterData.stats.totalUsers :
                                      target === 'customers' ? newsletterData.stats.totalCustomers :
                                        target === 'vendors' ? newsletterData.stats.totalVendors :
                                          target === 'subscribers' ? newsletterData.stats.totalSubscribers :
                                            target === 'admins' ? newsletterData.stats.totalAdmins : 0})
                                  </span>
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {selectedTargets.includes('vendors') && newsletterData && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vendor Categories (Optional)
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {newsletterData.categories.vendor.map(category => (
                              <label key={category} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCategories([...selectedCategories, category]);
                                    } else {
                                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                                    }
                                  }}
                                  className="rounded border-gray-300 text-[#B88E2F] focus:ring-[#B88E2F]"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  {category} ({newsletterData.vendors.byCategory[category]?.length || 0})
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Subject
                        </label>
                        <input
                          type="text"
                          value={newsletterSubject}
                          onChange={(e) => setNewsletterSubject(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                          placeholder="Enter email subject"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Content
                        </label>
                        <textarea
                          rows={8}
                          value={newsletterContent}
                          onChange={(e) => setNewsletterContent(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                          placeholder="Enter email content (HTML supported)"
                        />
                      </div>

                      <button
                        onClick={handleSendNewsletter}
                        disabled={!newsletterSubject || !newsletterContent || selectedTargets.length === 0}
                        className="w-full bg-[#B88E2F] text-white px-6 py-3 rounded-lg hover:bg-[#d4a574] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Send Newsletter to {selectedTargets.length} Target Group(s)
                      </button>
                    </div>

                    {/* Data Overview */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Data Overview</h3>

                      {newsletterData && (
                        <div className="space-y-4">
                          {/* Users Breakdown */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Users Breakdown</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Customers:</span>
                                <span className="font-medium">{newsletterData.stats.totalCustomers}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Vendors:</span>
                                <span className="font-medium">{newsletterData.stats.totalVendors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Admins:</span>
                                <span className="font-medium">{newsletterData.stats.totalAdmins}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Verified Users:</span>
                                <span className="font-medium">{newsletterData.stats.verifiedUsers}</span>
                              </div>
                            </div>
                          </div>

                          {/* Vendor Categories */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Vendor Categories</h4>
                            <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                              {Object.entries(newsletterData.vendors.byCategory).map(([category, vendors]) => (
                                <div key={category} className="flex justify-between">
                                  <span>{category}:</span>
                                  <span className="font-medium">{vendors.length}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Vendor Status */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Vendor Status</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Approved:</span>
                                <span className="font-medium text-green-600">{newsletterData.stats.approvedVendors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Pending:</span>
                                <span className="font-medium text-yellow-600">{newsletterData.stats.pendingVendors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Suspended:</span>
                                <span className="font-medium text-red-600">{newsletterData.stats.suspendedVendors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Active:</span>
                                <span className="font-medium text-blue-600">{newsletterData.stats.activeVendors}</span>
                              </div>
                            </div>
                          </div>

                          {/* Product Categories */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Product Categories</h4>
                            <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                              {Object.entries(newsletterData.products.byCategory).slice(0, 10).map(([category, products]) => (
                                <div key={category} className="flex justify-between">
                                  <span>{category}:</span>
                                  <span className="font-medium">{products.length}</span>
                                </div>
                              ))}
                              {Object.keys(newsletterData.products.byCategory).length > 10 && (
                                <div className="text-gray-500 text-xs">
                                  +{Object.keys(newsletterData.products.byCategory).length - 10} more categories
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}