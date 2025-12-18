import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuth } from '@/app/hooks/useAuth';

export const useLogout = () => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-lg shadow-lg',
        title: 'text-lg font-semibold',
        confirmButton: 'px-4 py-2 rounded-md',
        cancelButton: 'px-4 py-2 rounded-md',
      },
    });

    if (result.isConfirmed) {
      try {
        // Call the logout API
        const token = localStorage.getItem('authToken') || '';
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        

        // Even if the API call fails, we still want to log out locally
        // Clear local storage and update auth state
        logout();
        
        // Show success message
        await Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-lg shadow-lg',
          },
        });
        
        // Force a page reload to ensure all components update
        window.location.href = '/';
      } catch (error) {
        console.error('Error during logout:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'An error occurred during logout. Please try again.',
          icon: 'error',
          confirmButtonColor: '#f97316',
          customClass: {
            popup: 'rounded-lg shadow-lg',
          },
        });
      }
    }
  };

  return handleLogout;
};