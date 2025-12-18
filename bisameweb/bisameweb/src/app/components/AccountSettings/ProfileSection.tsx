'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { TbUserEdit } from 'react-icons/tb';
import BlobRing from './BlobRing';
import ProfileImagePreviewModal from './ProfileImagePreviewModal';
import { useChangeProfileImage } from './useChangeProfileImage';
import toast from 'react-hot-toast';
import { useAccountData } from './useAccountData';

interface ProfileData {
  userName: string;
  phoneNumber: string;
  profileImage: string;
}

interface ProfileSectionProps {
  profileData: ProfileData;
  onEdit?: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  profileData}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { changeProfileImage, loading } = useChangeProfileImage();
  const { mutate } = useAccountData();
  
  // const handleEditClick = () => {
  //   if (onEdit) {
  //     onEdit();
  //   }
  // };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No file selected.');
      return;
    }
    try {
      await changeProfileImage(selectedFile);
      toast.success('Profile image updated successfully!');
      setShowModal(false);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      mutate(); // Refresh profile data after upload
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || 'Failed to update profile image.');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <ProfileImagePreviewModal
        isOpen={showModal}
        imageUrl={preview || ''}
        onUpload={handleUpload}
        onCancel={handleCancel}
        loading={loading}
      />
      {/* Account Setting Header */}
      <div className="border-b border-gray-200 px-6 py-3">
        <h2 className="text-base font-bold uppercase text-gray-700">
          Account Setting
        </h2>
      </div>
      
      {/* Account Setting Content */}
      <div className="flex gap-6 px-6 py-8 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <BlobRing>
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                className="rounded-full w-28 h-28 object-cover"
                height={120}
                width={120}
              />
            ) : (
              <Image
                alt="Profile picture"
                className="rounded-full w-28 h-28 object-cover"
                height={120}
                src={profileData.profileImage}
                width={120}
              />
            )}
          </BlobRing>
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <button
            className="mt-3 text-sm font-semibold text-blue-500 border border-blue-300 rounded px-3 py-1 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center space-x-2"
            type="button"
            onClick={() => document.getElementById('profile-photo-input')?.click()}
          >
            <TbUserEdit className="text-sm" />
            <span>Edit</span>
          </button>
        </div>
        
        <div className="flex flex-col justify-center text-sm text-gray-800 space-y-4">
          <div>
            <p className="font-semibold text-base mb-1">
              User name
            </p>
            <p>{profileData.userName}</p>
          </div>
          
          <div>
            <p className="font-semibold text-base mb-1">
              Phone Number
            </p>
            <p>{profileData.phoneNumber}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
