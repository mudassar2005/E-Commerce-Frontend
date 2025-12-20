'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  User, 
  Building, 
  MapPin, 
  CreditCard, 
  FileText, 
  Camera,
  Save,
  Upload,
  ArrowLeft
} from 'lucide-react';

function VendorProfileContent() {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    alternatePhone: '',
    cnicNumber: '',
    dateOfBirth: '',
    businessCategory: '',
    businessDescription: '',
    establishedYear: new Date().getFullYear(),
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    },
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
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
      panNumber: '',
      ntnNumber: ''
    }
  });

  const [files, setFiles] = useState({
    personalPhoto: null,
    cnicFrontPhoto: null,
    cnicBackPhoto: null,
    businessLicense: null,
    taxCertificate: null
  });

  const [previews, setPreviews] = useState({
    personalPhoto: null,
    cnicFrontPhoto: null,
    cnicBackPhoto: null
  });

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get('/vendors/my-profile');
      const vendor = response.data;
      setVendorData(vendor);

      // Populate form with existing data
      setFormData({
        phoneNumber: vendor.phoneNumber || '',
        alternatePhone: vendor.alternatePhone || '',
        cnicNumber: vendor.cnicNumber || '',
        dateOfBirth: vendor.dateOfBirth || '',
        businessCategory: vendor.businessCategory || '',
        businessDescription: vendor.businessDescription || '',
        establishedYear: vendor.establishedYear || new Date().getFullYear(),
        businessAddress: vendor.businessAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Pakistan'
        },
        pickupAddress: vendor.pickupAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Pakistan'
        },
        bankDetails: vendor.bankDetails || {
          accountHolderName: '',
          accountNumber: '',
          bankName: '',
          ifscCode: '',
          branchName: ''
        },
        taxDetails: vendor.taxDetails || {
          gstNumber: '',
          panNumber: '',
          ntnNumber: ''
        }
      });

      // Set existing document previews
      if (vendor.documents) {
        const baseUrl = 'http://localhost:3001';
        setPreviews({
          personalPhoto: vendor.documents.personalPhoto !== 'pending' 
            ? `${baseUrl}/uploads/vendor-documents/${vendor.documents.personalPhoto}` 
            : null,
          cnicFrontPhoto: vendor.documents.cnicFrontPhoto !== 'pending' 
            ? `${baseUrl}/uploads/vendor-documents/${vendor.documents.cnicFrontPhoto}` 
            : null,
          cnicBackPhoto: vendor.documents.cnicBackPhoto !== 'pending' 
            ? `${baseUrl}/uploads/vendor-documents/${vendor.documents.cnicBackPhoto}` 
            : null
        });
      }
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      showError('Failed to load vendor profile');
    }
  };

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

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }
      
      // Enhanced file type validation with more image formats
      const allowedImageTypes = [
        'image/jpeg', 
        'image/jpg', 
        'image/png', 
        'image/gif', 
        'image/webp', 
        'image/bmp', 
        'image/tiff',
        'image/svg+xml'
      ];
      const allowedDocumentTypes = ['application/pdf'];
      const allAllowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];
      
      if (!allAllowedTypes.includes(file.type)) {
        showError('Supported formats: JPEG, PNG, GIF, WebP, BMP, TIFF, SVG, PDF');
        return;
      }
      
      // Additional validation for photo fields (only images)
      const photoFields = ['personalPhoto', 'cnicFrontPhoto', 'cnicBackPhoto'];
      if (photoFields.includes(fieldName) && !allowedImageTypes.includes(file.type)) {
        showError('Photos must be in image format (JPEG, PNG, GIF, WebP, BMP, TIFF, SVG)');
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({
            ...prev,
            [fieldName]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('alternatePhone', formData.alternatePhone);
      submitData.append('cnicNumber', formData.cnicNumber);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('businessCategory', formData.businessCategory);
      submitData.append('businessDescription', formData.businessDescription);
      submitData.append('establishedYear', formData.establishedYear);
      
      // Add nested objects as JSON
      submitData.append('businessAddress', JSON.stringify(formData.businessAddress));
      submitData.append('pickupAddress', JSON.stringify(formData.pickupAddress));
      submitData.append('bankDetails', JSON.stringify(formData.bankDetails));
      submitData.append('taxDetails', JSON.stringify(formData.taxDetails));
      
      // Add files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      await api.put('/vendors/my-profile', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Profile updated successfully!');
      fetchVendorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const businessCategories = [
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Kids\' Clothing',
    'Footwear',
    'Accessories',
    'Traditional Wear',
    'Sports Wear',
    'Formal Wear',
    'Casual Wear',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/vendor/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
          <p className="text-gray-600 mt-2">Update your business information and documents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#B88E2F] rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cnicNumber"
                  value={formData.cnicNumber}
                  onChange={handleInputChange}
                  required
                  maxLength="13"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="1234567890123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#B88E2F] rounded-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Category
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {businessCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Describe your business..."
                />
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#B88E2F] rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Documents & Photos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Photo
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {previews.personalPhoto ? (
                      <div>
                        <img 
                          src={previews.personalPhoto} 
                          alt="Personal" 
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-2">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574]">
                            <span>Upload photo</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                              onChange={(e) => handleFileChange(e, 'personalPhoto')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP, BMP, TIFF, SVG up to 5MB</p>
                      </>
                    )}
                    {previews.personalPhoto && (
                      <label className="cursor-pointer text-sm text-[#B88E2F] hover:text-[#d4a574]">
                        <span>Change photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                          onChange={(e) => handleFileChange(e, 'personalPhoto')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* CNIC Front */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Front Side
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {previews.cnicFrontPhoto ? (
                      <div>
                        <img 
                          src={previews.cnicFrontPhoto} 
                          alt="CNIC Front" 
                          className="mx-auto h-32 w-48 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-2">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574]">
                            <span>Upload CNIC front</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                              onChange={(e) => handleFileChange(e, 'cnicFrontPhoto')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP, BMP, TIFF, SVG up to 5MB</p>
                      </>
                    )}
                    {previews.cnicFrontPhoto && (
                      <label className="cursor-pointer text-sm text-[#B88E2F] hover:text-[#d4a574]">
                        <span>Change photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                          onChange={(e) => handleFileChange(e, 'cnicFrontPhoto')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* CNIC Back */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Back Side
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {previews.cnicBackPhoto ? (
                      <div>
                        <img 
                          src={previews.cnicBackPhoto} 
                          alt="CNIC Back" 
                          className="mx-auto h-32 w-48 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-2">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574]">
                            <span>Upload CNIC back</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                              onChange={(e) => handleFileChange(e, 'cnicBackPhoto')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP, BMP, TIFF, SVG up to 5MB</p>
                      </>
                    )}
                    {previews.cnicBackPhoto && (
                      <label className="cursor-pointer text-sm text-[#B88E2F] hover:text-[#d4a574]">
                        <span>Change photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml"
                          onChange={(e) => handleFileChange(e, 'cnicBackPhoto')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Business License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {files.businessLicense ? (
                      <div>
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm text-gray-600 mt-2">{files.businessLicense.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574]">
                            <span>Upload license</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, 'businessLicense')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">Images (JPEG, PNG, GIF, WebP, BMP, TIFF, SVG) or PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tax Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Certificate
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {files.taxCertificate ? (
                      <div>
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm text-gray-600 mt-2">{files.taxCertificate.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574]">
                            <span>Upload certificate</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, 'taxCertificate')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">Images (JPEG, PNG, GIF, WebP, BMP, TIFF, SVG) or PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/vendor/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#B88E2F] text-white px-8 py-3 rounded-lg hover:bg-[#d4a574] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VendorProfile() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <VendorProfileContent />
    </ProtectedRoute>
  );
}