// Global error handler for API calls
export const handleApiError = (error, showError, router, context = 'general') => {
  console.error(`API Error in ${context}:`, error);

  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';

    switch (status) {
      case 400:
        showError(`Bad Request: ${message}`);
        break;
      
      case 401:
        showError('Authentication failed. Please login again.');
        // Clear any stored auth tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        break;
      
      case 403:
        showError('Access denied. You don\'t have permission to perform this action.');
        break;
      
      case 404:
        // Handle different 404 cases based on context
        switch (context) {
          case 'vendor-profile':
            showError('Vendor profile not found. Please complete your vendor application first.');
            setTimeout(() => {
              router.push('/vendor/register');
            }, 2000);
            break;
          
          case 'vendor-dashboard':
            showError('Vendor profile not found. You may need to complete your vendor application.');
            break;
          
          case 'admin-orders':
            showError('Orders not found or you don\'t have permission to view them.');
            break;
          
          case 'products':
            showError('Product not found.');
            break;
          
          default:
            showError('Resource not found.');
        }
        break;
      
      case 409:
        showError(`Conflict: ${message}`);
        break;
      
      case 422:
        showError(`Validation Error: ${message}`);
        break;
      
      case 500:
        showError('Server error. Please try again later.');
        break;
      
      default:
        showError(`Error: ${message}`);
    }
  } else if (error.request) {
    // Network error
    showError('Network error. Please check your internet connection.');
  } else {
    // Other error
    showError('An unexpected error occurred. Please try again.');
  }
};

// Specific error handlers for common scenarios
export const handleVendorProfileError = (error, showError, router) => {
  handleApiError(error, showError, router, 'vendor-profile');
};

export const handleVendorDashboardError = (error, showError, router) => {
  handleApiError(error, showError, router, 'vendor-dashboard');
};

export const handleAdminError = (error, showError, router) => {
  handleApiError(error, showError, router, 'admin');
};

export const handleProductError = (error, showError, router) => {
  handleApiError(error, showError, router, 'products');
};

export const handleOrderError = (error, showError, router) => {
  handleApiError(error, showError, router, 'orders');
};

// Wrapper for API calls with automatic error handling
export const safeApiCall = async (apiCall, showError, router, context = 'general') => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, showError, router, context);
    throw error; // Re-throw so calling code can handle it if needed
  }
};