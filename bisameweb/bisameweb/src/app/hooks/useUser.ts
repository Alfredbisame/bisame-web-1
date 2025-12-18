import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string | null;
  phoneNumber: string;
  countryCode: string;
  countryName: string;
  countryShortName: string;
  profilePicture: string | null;
  referralCode: string;
  userReferralCode: string;
  referralType: string;
  status: string;
  role: string;
  lastName: string;
  firstName: string;
  otherNames: string;
  authenticated: boolean;
  dateOfBirth: string | null;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('userId');
        
        if (userData) {
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);
          setUserId(parsedUser.id);
        } else if (storedUserId) {
          // Fallback to userId if user data is not available
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for storage changes
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    userId,
    loading
  };
};