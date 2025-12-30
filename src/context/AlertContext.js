'use client';

import React, { createContext, useContext, useState } from 'react';
import Alert from '@/components/ui/Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = ({ type = 'info', title, message, autoClose = true, duration = 5000 }) => {
    const id = typeof window !== 'undefined' ? Date.now() + Math.random() : Math.random();
    const newAlert = {
      id,
      type,
      title,
      message,
      autoClose,
      duration,
      isVisible: true
    };

    setAlerts(prev => [...prev, newAlert]);

    if (autoClose) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Convenience methods
  const showSuccess = (message, title = 'Success') => {
    return showAlert({ type: 'success', title, message });
  };

  const showError = (message, title = 'Error') => {
    return showAlert({ type: 'error', title, message });
  };

  const showWarning = (message, title = 'Warning') => {
    return showAlert({ type: 'warning', title, message });
  };

  const showInfo = (message, title = 'Info') => {
    return showAlert({ type: 'info', title, message });
  };

  const value = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {/* Render alerts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            isVisible={alert.isVisible}
            autoClose={alert.autoClose}
            duration={alert.duration}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};