'use client';

import ProfileSection from './ProfileSection';
import PasswordSection from './PasswordSection';
import DeleteAccountButton from './DeleteAccountButton';
import StoreDataComponent from './StoreDataComponent';
import { useAccountData } from './useAccountData';
import { getImageUrl } from '@/app/components/ProductDetails/utils/imageUtils';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AccountSettingsProps {
  onProfileEdit?: () => void;
  onPasswordChange?: (data: PasswordFormData) => void;
  onDeleteAccount?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  onProfileEdit,
  onPasswordChange,
  onDeleteAccount
}) => {
  const { data, loading, error } = useAccountData();

  // Default profile data as fallback
  const defaultProfileData = {
    userName: 'Alfred Bisame',
    phoneNumber: '+233 554572904',
    profileImage: '/Avatar1.png'
  };

  // Use API data if available, otherwise fall back to defaults
  const profileData = data?.info ? {
    userName: data.info.name || defaultProfileData.userName,
    phoneNumber: data.info.phone || defaultProfileData.phoneNumber,
    profileImage: data.info.profile ? getImageUrl(data.info.profile, 200, 200) : defaultProfileData.profileImage
  } : defaultProfileData;

  if (loading) {
    return (
      <div className="bg-blue-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
            <p className="text-gray-600">Loading your account information...</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
            <p className="text-red-600">Error loading account information: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, store information, and account preferences</p>
        </div>

        {/* Profile and Password Settings */}
        <div className="bg-white rounded-lg shadow-sm">
          <form className="border border-gray-200 rounded-md">
            <ProfileSection
              profileData={profileData}
              onEdit={onProfileEdit}
            />
            
            <PasswordSection
              onPasswordChange={onPasswordChange}
            />
          </form>
        </div>
        
        {/* Store Display Section - Now using separate component */}
        <StoreDataComponent />

        {/* Delete Account Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <DeleteAccountButton
            onDelete={onDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
