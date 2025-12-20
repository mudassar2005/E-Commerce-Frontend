'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Clock, Mail, CheckCircle, AlertCircle, Home, LogOut } from 'lucide-react';

export default function VendorPendingPage() {
  const { user, logout, refreshUserData } = useAuth();
  const router = useRouter();

  // Debug function to check current status
  const checkStatus = async () => {
    console.log('🔍 Current user data:', user);
    const refreshedUser = await refreshUserData();
    console.log('🔍 Refreshed user data:', refreshedUser);
    if (refreshedUser && refreshedUser.isApproved) {
      router.push('/vendor/dashboard');
    }
  };

  // Redirect if not a vendor or if approved
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'vendor') {
      router.push('/');
    } else if (user.isApproved) {
      router.push('/vendor/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B88E2F] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Welcome, {user.name}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={checkStatus}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <CheckCircle size={20} />
                Check Status
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home size={20} />
                Home
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Under Review</h1>
            <p className="text-lg text-gray-600">
              Your vendor application is currently being reviewed by our team
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Application Submitted</h3>
              </div>
              <p className="text-green-700 text-sm">
                Your vendor application has been successfully submitted and received.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Under Review</h3>
              </div>
              <p className="text-orange-700 text-sm">
                Our team is currently reviewing your application and documents.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Email Notification</h3>
              </div>
              <p className="text-blue-700 text-sm">
                You'll receive an email once the review is complete.
              </p>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Document Verification</h4>
                  <p className="text-gray-600 text-sm">Our team will verify all submitted documents and business information.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Background Check</h4>
                  <p className="text-gray-600 text-sm">We'll conduct a background check to ensure compliance with our policies.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#B88E2F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Final Decision</h4>
                  <p className="text-gray-600 text-sm">You'll receive an email with the final decision within 2-3 business days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-3">
                  If you have any questions about your application status or need to update your information, please contact our support team.
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-700">
                    <strong>Email:</strong> vendor-support@stylehub.com
                  </p>
                  <p className="text-blue-700">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p className="text-blue-700">
                    <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-[#B88E2F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d4a574] transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Continue Shopping
            </button>
            <button
              onClick={() => window.location.href = 'mailto:vendor-support@stylehub.com'}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}