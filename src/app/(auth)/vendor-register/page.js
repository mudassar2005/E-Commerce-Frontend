'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';
import { 
  Upload, 
  User, 
  Building, 
  MapPin, 
  CreditCard, 
  FileText, 
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function VendorRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showError, showSuccess } = useAlert();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    alternatePhone: '',
    cnicNumber: '',
    dateOfBirth: '',
    
    // Business Information
    shopName: '',
    businessName: '',
    businessType: 'Individual',
    businessCategory: '',
    businessDescription: '',
    establishedYear: new Date().getFullYear(),
    
    // Address Information
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
      country: 'Pakistan',
      sameAsBusiness: true
    },
    
    // Financial Information
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
    },
    
    // Documents and Photos
    personalPhoto: null,
    cnicFrontPhoto: null,
    cnicBackPhoto: null,
    businessLicense: null,
    taxCertificate: null,
    
    // Agreement
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Business Info', icon: Building },
    { id: 3, title: 'Address Info', icon: MapPin },
    { id: 4, title: 'Financial Info', icon: CreditCard },
    { id: 5, title: 'Documents', icon: FileText },
    { id: 6, title: 'Review', icon: CheckCircle }
  ];

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

  const businessTypes = [
    'Individual',
    'Partnership',
    'Private Limited Company',
    'Public Limited Company',
    'Sole Proprietorship'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
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
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showError('Only JPEG, PNG, and PDF files are allowed');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleSameAddressChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      pickupAddress: {
        ...prev.pickupAddress,
        sameAsBusiness: checked,
        ...(checked ? {
          street: prev.businessAddress.street,
          city: prev.businessAddress.city,
          state: prev.businessAddress.state,
          zipCode: prev.businessAddress.zipCode,
          country: prev.businessAddress.country
        } : {})
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber || !formData.cnicNumber) {
          showError('Please fill all required personal information fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          showError('Passwords do not match');
          return false;
        }
        if (formData.cnicNumber.length !== 13) {
          showError('CNIC number must be 13 digits');
          return false;
        }
        break;
      case 2:
        if (!formData.shopName || !formData.businessName || !formData.businessCategory || !formData.businessDescription) {
          showError('Please fill all required business information fields');
          return false;
        }
        break;
      case 3:
        if (!formData.businessAddress.street || !formData.businessAddress.city || !formData.businessAddress.state || !formData.businessAddress.zipCode) {
          showError('Please fill all required address fields');
          return false;
        }
        break;
      case 4:
        if (!formData.bankDetails.accountHolderName || !formData.bankDetails.accountNumber || !formData.bankDetails.bankName) {
          showError('Please fill all required bank details');
          return false;
        }
        break;
      case 5:
        if (!formData.personalPhoto || !formData.cnicFrontPhoto || !formData.cnicBackPhoto) {
          showError('Please upload your personal photo and both sides of CNIC');
          return false;
        }
        break;
      case 6:
        if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
          showError('Please agree to terms and privacy policy');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(6)) return;
    
    setLoading(true);
    
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('confirmPassword', formData.confirmPassword);
      submitData.append('role', 'vendor');
      
      // Add vendor details as JSON
      const vendorDetails = {
        phoneNumber: formData.phoneNumber,
        alternatePhone: formData.alternatePhone,
        cnicNumber: formData.cnicNumber,
        dateOfBirth: formData.dateOfBirth,
        shopName: formData.shopName,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessCategory: formData.businessCategory,
        businessDescription: formData.businessDescription,
        establishedYear: formData.establishedYear,
        businessAddress: formData.businessAddress,
        pickupAddress: formData.pickupAddress,
        bankDetails: formData.bankDetails,
        taxDetails: formData.taxDetails
      };
      
      submitData.append('vendorDetails', JSON.stringify(vendorDetails));
      
      // Add files
      if (formData.personalPhoto) submitData.append('personalPhoto', formData.personalPhoto);
      if (formData.cnicFrontPhoto) submitData.append('cnicFrontPhoto', formData.cnicFrontPhoto);
      if (formData.cnicBackPhoto) submitData.append('cnicBackPhoto', formData.cnicBackPhoto);
      if (formData.businessLicense) submitData.append('businessLicense', formData.businessLicense);
      if (formData.taxCertificate) submitData.append('taxCertificate', formData.taxCertificate);
      
      // Submit to backend
      const response = await fetch('http://localhost:3001/auth/vendor-register', {
        method: 'POST',
        body: submitData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showSuccess('Vendor registration successful! Please verify your email.');
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        showError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Create a strong password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Your shop display name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  placeholder="Legal business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                >
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                  required
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                placeholder="Describe your business, products, and services..."
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h3>
            
            {/* Business Address */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Business Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessAddress.street"
                    value={formData.businessAddress.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessAddress.city"
                    value={formData.businessAddress.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessAddress.state"
                    value={formData.businessAddress.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="State/Province"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessAddress.zipCode"
                    value={formData.businessAddress.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="ZIP Code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessAddress.country"
                    value={formData.businessAddress.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Pickup Address */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Pickup Address</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.pickupAddress.sameAsBusiness}
                    onChange={handleSameAddressChange}
                    className="w-4 h-4 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Same as business address</span>
                </label>
              </div>
              
              {!formData.pickupAddress.sameAsBusiness && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupAddress.street"
                      value={formData.pickupAddress.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupAddress.city"
                      value={formData.pickupAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupAddress.state"
                      value={formData.pickupAddress.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                      placeholder="State/Province"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupAddress.zipCode"
                      value={formData.pickupAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                      placeholder="ZIP Code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupAddress.country"
                      value={formData.pickupAddress.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Information</h3>
            
            {/* Bank Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountHolderName"
                    value={formData.bankDetails.accountHolderName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="Account holder name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="Account number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={formData.bankDetails.bankName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="Bank name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC/Routing Code
                  </label>
                  <input
                    type="text"
                    name="bankDetails.ifscCode"
                    value={formData.bankDetails.ifscCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="IFSC/Routing code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.branchName"
                    value={formData.bankDetails.branchName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="Branch name"
                  />
                </div>
              </div>
            </div>
            
            {/* Tax Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Tax Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="taxDetails.gstNumber"
                    value={formData.taxDetails.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="GST registration number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="taxDetails.panNumber"
                    value={formData.taxDetails.panNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="PAN number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NTN Number
                  </label>
                  <input
                    type="text"
                    name="taxDetails.ntnNumber"
                    value={formData.taxDetails.ntnNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B88E2F] focus:border-transparent"
                    placeholder="NTN number"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Documents & Photos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Photo */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Photo <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.personalPhoto ? (
                      <div>
                        <img 
                          src={URL.createObjectURL(formData.personalPhoto)} 
                          alt="Personal" 
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600 mt-2">{formData.personalPhoto.name}</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574] focus-within:outline-none">
                            <span>Upload a photo</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'personalPhoto')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* CNIC Front */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Front Side <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.cnicFrontPhoto ? (
                      <div>
                        <img 
                          src={URL.createObjectURL(formData.cnicFrontPhoto)} 
                          alt="CNIC Front" 
                          className="mx-auto h-32 w-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600 mt-2">{formData.cnicFrontPhoto.name}</p>
                      </div>
                    ) : (
                      <>
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574] focus-within:outline-none">
                            <span>Upload CNIC front</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'cnicFrontPhoto')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* CNIC Back */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Back Side <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.cnicBackPhoto ? (
                      <div>
                        <img 
                          src={URL.createObjectURL(formData.cnicBackPhoto)} 
                          alt="CNIC Back" 
                          className="mx-auto h-32 w-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600 mt-2">{formData.cnicBackPhoto.name}</p>
                      </div>
                    ) : (
                      <>
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574] focus-within:outline-none">
                            <span>Upload CNIC back</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'cnicBackPhoto')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Business License */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License (Optional)
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.businessLicense ? (
                      <div>
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm text-gray-600 mt-2">{formData.businessLicense.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574] focus-within:outline-none">
                            <span>Upload license</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, 'businessLicense')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tax Certificate */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Certificate (Optional)
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#B88E2F] transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.taxCertificate ? (
                      <div>
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm text-gray-600 mt-2">{formData.taxCertificate.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#B88E2F] hover:text-[#d4a574] focus-within:outline-none">
                            <span>Upload certificate</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, 'taxCertificate')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Review & Submit</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Personal Information</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                    <p><strong>CNIC:</strong> {formData.cnicNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Business Information</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Shop Name:</strong> {formData.shopName}</p>
                    <p><strong>Business Name:</strong> {formData.businessName}</p>
                    <p><strong>Category:</strong> {formData.businessCategory}</p>
                    <p><strong>Type:</strong> {formData.businessType}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Documents Uploaded</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className={formData.personalPhoto ? 'text-green-600' : 'text-red-600'}>
                      <strong>Personal Photo:</strong> {formData.personalPhoto ? '✓ Uploaded' : '✗ Missing'}
                    </p>
                    <p className={formData.cnicFrontPhoto ? 'text-green-600' : 'text-red-600'}>
                      <strong>CNIC Front:</strong> {formData.cnicFrontPhoto ? '✓ Uploaded' : '✗ Missing'}
                    </p>
                    <p className={formData.cnicBackPhoto ? 'text-green-600' : 'text-red-600'}>
                      <strong>CNIC Back:</strong> {formData.cnicBackPhoto ? '✓ Uploaded' : '✗ Missing'}
                    </p>
                    <p className={formData.businessLicense ? 'text-green-600' : 'text-gray-500'}>
                      <strong>Business License:</strong> {formData.businessLicense ? '✓ Uploaded' : 'Not provided'}
                    </p>
                    <p className={formData.taxCertificate ? 'text-green-600' : 'text-gray-500'}>
                      <strong>Tax Certificate:</strong> {formData.taxCertificate ? '✓ Uploaded' : 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Bank Details</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Account Holder:</strong> {formData.bankDetails.accountHolderName}</p>
                    <p><strong>Bank:</strong> {formData.bankDetails.bankName}</p>
                    <p><strong>Account:</strong> {formData.bankDetails.accountNumber}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 mt-1 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F]"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#B88E2F] hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and confirm that all information provided is accurate.
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 mt-1 text-[#B88E2F] border-gray-300 rounded focus:ring-[#B88E2F]"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/privacy" className="text-[#B88E2F] hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  and consent to the processing of my personal data.
                </span>
              </label>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your application will be reviewed by our team</li>
                    <li>We'll verify your documents and information</li>
                    <li>You'll receive an email notification about the status</li>
                    <li>Once approved, you can start selling on our platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Vendor</h1>
          <p className="text-lg text-gray-600">Join our marketplace and start selling your products</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-[#B88E2F] border-[#B88E2F] text-white' 
                      : isActive 
                        ? 'border-[#B88E2F] text-[#B88E2F] bg-white' 
                        : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-[#B88E2F]' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-[#B88E2F]' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    Previous
                  </button>
                )}
              </div>
              
              <div>
                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#B88E2F] text-white px-6 py-3 rounded-lg hover:bg-[#d4a574] transition-colors"
                  >
                    Next
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#B88E2F] text-white px-8 py-3 rounded-lg hover:bg-[#d4a574] transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#B88E2F] hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}