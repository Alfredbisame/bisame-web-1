import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = () => {
    // Check for multiple possible token keys to ensure compatibility
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!token || !!userId);
    setIsLoading(false);
  };

  useEffect(() => {
    // Check initial login status
    checkLoginStatus();

    // Listen for storage changes (when login happens in another tab)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // Listen for custom login event
    const handleLoginSuccess = () => {
      checkLoginStatus();
    };

    // Listen for logout event
    const handleLogout = () => {
      setIsLoggedIn(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const logout = () => {
    // Remove all possible auth-related items from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('resetPhone');
    setIsLoggedIn(false);
    
    // Dispatch logout event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('logout'));
    }
  };

  return {
    isLoggedIn,
    isLoading,
    logout,
    checkLoginStatus
  };
};