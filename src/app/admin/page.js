'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  AlertTriangle, 
  Mail, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Ban,
  Trash2,
  X,
  Package
} from 'lucide-react';

function AdminDashboardContent() {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useAlert();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
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

  // Fetch data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendors using the API client
      const vendorsRes = await api.get('/vendors/all');
      const vendorsData = vendorsRes.data.vendors || []; // Handle pagination structure
      setVendors(vendorsData);

      // Fetch customers using the API client
      const customersRes = await api.get('/auth/users');
      const allUsers = customersRes.data;
      const customersData = allUsers.filter(user => user.role === 'user');
      setCustomers(customersData);

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

      // Calculate stats
      setStats({
        totalVendors: vendorsData.length,
        pendingVendors: vendorsData.filter(v => v.status === 'pending').length,
        approvedVendors: vendorsData.filter(v => v.status === 'approved').length,
        totalCustomers: customersData.length,
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

  const handleVendorAction = async (vendorId, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/vendors/${vendorId}/approve`);
      } else if (action === 'reject') {
        await api.put(`/vendors/${vendorId}/reject`, { reason: 'Rejected by admin' });
      } else if (action === 'suspend') {
        await api.put(`/vendors/${vendorId}/suspend`, { reason: 'Suspended by admin' });
      } else if (action === 'unsuspend') {
        await api.put(`/vendors/${vendorId}/unsuspend`);
      } else if (action === 'delete') {
        await api.delete(`/vendors/${vendorId}`);
      }
      fetchDashboardData(); // Refresh data
      showSuccess(`Vendor ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing vendor:`, error);
      showError(`Failed to ${action} vendor`);
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
        await api.put(`/products/${productId}/approve`);
      } else if (action === 'reject') {
        await api.put(`/products/${productId}/reject`);
      } else if (action === 'delete') {
        await api.delete(`/products/${productId}`);
      }
      // Refresh vendor products
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
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'pending-vendors', name: 'Pending Vendors', icon: Clock },
    { id: 'all-vendors', name: 'All Vendors', icon: Store },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'reports', name: 'Reports', icon: AlertTriangle },
    { id: 'newsletter', name: 'Newsletter', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B88E2F] to-[#d4a574] bg-clip-text text-transparent">
                StyleHub Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-6 py-3 rounded-lg hover:from-[#d4a574] hover:to-[#B88E2F] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Navigation</h2>
              <div className="h-1 w-12 bg-gradient-to-r from-[#B88E2F] to-[#d4a574] rounded-full"></div>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#B88E2F] hover:transform hover:scale-102'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.name}</span>
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
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#B88E2F] to-[#d4a574] bg-clip-text text-transparent">{stats.totalVendors}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-[#B88E2F] to-[#d4a574] rounded-full">
                        <Store className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.pendingVendors}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{stats.totalCustomers}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Reports</p>
                        <p className="text-3xl font-bold text-red-600">{stats.activeReports}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-[#B88E2F] to-[#d4a574] rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="space-y-4">
                    {(vendors || []).filter(v => v.status === 'pending').slice(0, 5).map((vendor) => (
                      <div key={vendor._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md transition-all duration-300">
                        <div>
                          <p className="font-semibold text-gray-900">{vendor.businessName}</p>
                          <p className="text-sm text-gray-600">New vendor application</p>
                          <p className="text-xs text-gray-500">{vendor.email || 'No email provided'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVendorAction(vendor._id, 'approve')}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVendorAction(vendor._id, 'reject')}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pending-vendors' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Pending Vendor Applications</h2>
                    </div>
                    <button
                      onClick={fetchDashboardData}
                      className="bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {(vendors || []).filter(v => v.status === 'pending').length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
                      <p className="text-gray-500 mb-4">There are currently no vendor applications waiting for approval.</p>
                      <button
                        onClick={fetchDashboardData}
                        className="bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-6 py-2 rounded-lg hover:from-[#d4a574] hover:to-[#B88E2F] transition-all duration-300"
                      >
                        Refresh Data
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(vendors || []).filter(v => v.status === 'pending').map((vendor) => (
                        <div key={vendor._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{vendor.businessName}</h3>
                              <p className="text-gray-600">{vendor.contactPerson || vendor.user?.name || 'No contact person'}</p>
                              <p className="text-sm text-gray-500">{vendor.email} • {vendor.phoneNumber}</p>
                              <p className="text-sm text-gray-500 mt-2">{vendor.shopDescription || 'No description available'}</p>
                              <div className="mt-2">
                                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                  {vendor.businessType}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleViewVendor(vendor)}
                                className="flex items-center gap-1 bg-gradient-to-r from-[#B88E2F] to-[#d4a574] text-white px-4 py-2 rounded-lg hover:from-[#d4a574] hover:to-[#B88E2F] transition-all duration-300 shadow-md"
                                title="View Vendor Details"
                              >
                                <Eye size={16} />
                                View
                              </button>
                              <button
                                onClick={() => handleVendorAction(vendor._id, 'approve')}
                                className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleVendorAction(vendor._id, 'reject')}
                                className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                              >
                                <XCircle size={16} />
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#B88E2F] to-[#d4a574]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">All Vendors</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search vendors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-white border-opacity-30 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-all duration-300"
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
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
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
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            selectedVendor.status === 'approved' ? 'bg-green-100 text-green-800' :
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
                                src={`http://localhost:3001/uploads/vendor-documents/${selectedVendor.documents.personalPhoto}`}
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
                                src={`http://localhost:3001/uploads/vendor-documents/${selectedVendor.documents.cnicFrontPhoto}`}
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
                                src={`http://localhost:3001/uploads/vendor-documents/${selectedVendor.documents.cnicBackPhoto}`}
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
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                            selectedVendor.documents?.personalPhoto && selectedVendor.documents.personalPhoto !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {selectedVendor.documents?.personalPhoto && selectedVendor.documents.personalPhoto !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Personal Photo</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                            selectedVendor.documents?.cnicFrontPhoto && selectedVendor.documents.cnicFrontPhoto !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {selectedVendor.documents?.cnicFrontPhoto && selectedVendor.documents.cnicFrontPhoto !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">CNIC Front</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                            selectedVendor.documents?.cnicBackPhoto && selectedVendor.documents.cnicBackPhoto !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {selectedVendor.documents?.cnicBackPhoto && selectedVendor.documents.cnicBackPhoto !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">CNIC Back</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                            selectedVendor.documents?.businessLicense && selectedVendor.documents.businessLicense !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {selectedVendor.documents?.businessLicense && selectedVendor.documents.businessLicense !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Business License</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                            selectedVendor.documents?.taxCertificate && selectedVendor.documents.taxCertificate !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {selectedVendor.documents?.taxCertificate && selectedVendor.documents.taxCertificate !== 'pending' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <p className="text-sm mt-2">Tax Certificate</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                            selectedVendor.documents?.identityProof && selectedVendor.documents.identityProof !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
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
                                  ${product.price}
                                  {product.originalPrice && (
                                    <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">{product.stock}</td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    product.isApproved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
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
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              customer.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
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
                              className={`${
                                customer.blocked 
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
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                report.status === 'open' ? 'bg-red-100 text-red-800' :
                                report.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {report.status}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                report.priority === 'high' ? 'bg-red-100 text-red-800' :
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