import React, { useState, useEffect } from "react";
import { Product } from "./types";
import { FaTimesCircle } from "react-icons/fa";
import { getImageUrl } from "../ProductDetails/utils/imageUtils";
import ImageUpload from "./ImageUpload";
import { usePostUpdatePost } from "./usePostUpdatePost";
import toast from "react-hot-toast";
import type { PostUpdateInfo } from "./usePostUpdateFetch";
import Image from "next/image";
import { UpdateProductProps } from "./interfaces";

// Updated interface to support multi-image upload
export interface UpdatePostRequest {
  id: string;
  uploadimage?: {
    image: string[];
  };
  image: {
    description: string;
    price: string;
    image: string[];
    status: string;
  };
}

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  postUpdateInfo?: PostUpdateInfo;
  onUpdate: (reqBody: UpdateProductProps) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: unknown;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  postUpdateInfo,
  onUpdate,
  onCancel,
  loading,
  error,
}) => {
  const [form, setForm] = useState<Product | null>(product);
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string[]>([]); // Multi-image support
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    loading: updateLoading,
    error: updateError,
    result,
  } = usePostUpdatePost();

  useEffect(() => {
    if (product) {
      setForm(product);
      // Map images correctly
      if (Array.isArray(product.image)) {
        setImages(
          product.image.map((img: string | { image_link?: string }) =>
            typeof img === "string" ? img : img.image_link || ""
          )
        );
      } else if (typeof product.image === "string") {
        setImages([product.image]);
      } else {
        setImages([]);
      }
      setNewImage([]); // Reset new images
    }
  }, [product]);

  useEffect(() => {
    if (result?.success && form) {
      setShowSuccess(true);
      toast.success(result.message || "Product updated successfully!");
      setTimeout(() => {
        setShowSuccess(false);
        onCancel(); // ✅ Close modal after success
      }, 1200);
    } else if (result?.success === false) {
      toast.error(result.message || "Failed to update product.");
    }
  }, [result, form, onCancel]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col items-center">
          <p className="text-red-600 font-semibold mb-2">
            Failed to load product
          </p>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            {String(error)}
          </p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle multiple image uploads
  const handleImageUpload = (img: string) => {
    setNewImage((prev) => [...prev, img]); // Append new image
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const id =
      (postUpdateInfo?._id as unknown as { $oid?: string })?.$oid ||
      postUpdateInfo?.id ||
      form?.id ||
      "";
    const existingImages = Array.isArray(postUpdateInfo?.images)
      ? postUpdateInfo.images
          .map((img: { imageUrl?: string }) => img?.imageUrl || "")
          .filter(Boolean)
      : images;

    const reqBody: UpdateProductProps = {
      id,
      title: form.name,
      description: form.description,
      price: Number(form.price),
      location: form.location,
      category: (form as { category?: string }).category || "",
      subCategory: (form as { subCategory?: string }).subCategory || "",
      childCategory:
        (form as { childCategory?: string | null }).childCategory || null,
      contactNumber: (form as { contactNumber?: string }).contactNumber || "",
      images: existingImages.map((url: string, index: number) => ({
        imageUrl: url,
        id: `existing-${index}`,
      })),
      isPromoted: false,
      negotiable: true,
      attributes: {},
    };

    // Only include uploadimage if new images exist
    if (newImage.length > 0) {
      (reqBody as { uploadimage?: { image: string[] } }).uploadimage = {
        image: newImage,
      };
    }

    onUpdate(reqBody);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 relative"
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-xl focus:outline-none z-20"
          onClick={onCancel}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
          Edit Product
        </h2>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded overflow-hidden shadow border border-gray-200"
                >
                  <div className="w-full h-20 relative">
                    <Image
                      src={getImageUrl(img)}
                      alt={`Product image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-white hover:bg-red-500 shadow transition-colors z-10"
                    onClick={() => handleRemoveImage(idx)}
                    aria-label="Remove image"
                  >
                    <FaTimesCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multi-image Upload Section */}
        <ImageUpload onImageUpload={handleImageUpload} />

        {/* Show upload errors */}
        {updateError && (
          <div className="text-red-500 text-xs mb-2 text-center">
            {updateError}
          </div>
        )}

        {/* Form Fields */}
        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            disabled={updateLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center"
            disabled={updateLoading}
          >
            {updateLoading ? (
              <span className="flex items-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Updating...
              </span>
            ) : showSuccess ? (
              <span className="flex items-center">
                <span className="mr-2">✅</span> Success!
              </span>
            ) : (
              "Update Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;

// import React, { useState, useEffect } from 'react';
// import { Product } from './types';
// import { FaTimesCircle } from 'react-icons/fa';
// import { getImageUrl } from '../ProductDetails/utils/imageUtils';
// import ImageUpload from '../TradeAssurance/ImageUpload';
// import { usePostUpdatePost } from './usePostUpdatePost';
// import toast from 'react-hot-toast';
// import type { PostUpdateInfo } from './usePostUpdateFetch';

// interface EditProductModalProps {
//   isOpen: boolean;
//   product: Product | null;
//   postUpdateInfo?: PostUpdateInfo;
//   onUpdate: (reqBody: any) => void;
//   onCancel: () => void;
//   loading?: boolean;
//   error?: any;
// }

// const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, product, postUpdateInfo, onUpdate, onCancel, loading, error }) => {
//   const [form, setForm] = useState<Product | null>(product);
//   const [images, setImages] = useState<string[]>([]);
//   const [newImage, setNewImage] = useState<string | null>(null); // for new image upload
//   const [showSuccess, setShowSuccess] = useState(false);
//   const { loading: updateLoading, error: updateError, result } = usePostUpdatePost();

//   useEffect(() => {
//     setForm(product);
//     // If product has images, set them; otherwise, empty array
//     if (product && Array.isArray(product.image)) {
//       // Map all image objects to their image_link or use the string directly
//       setImages(product.image.map((img: any) => typeof img === 'string' ? img : img.image_link || ''));
//     } else if (product && typeof product.image === 'string') {
//       setImages([product.image]);
//     } else {
//       setImages([]);
//     }
//     setNewImage(null);
//   }, [product]);

//   useEffect(() => {
//     if (result && result.success && form) {
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         onUpdate(result);
//       }, 1200); // Show success for 1.2s before closing
//     } else if (result && result.success === false) {
//       toast.error(result.message || 'Failed to update product.');
//     }
//   }, [result]);

//   if (!isOpen) return null;

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
//         <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col items-center">
//           <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-gray-500 text-sm">Loading product data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
//         <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col items-center">
//           <p className="text-red-600 font-semibold mb-2">Failed to load product</p>
//           <p className="text-gray-500 text-sm max-w-xs text-center">{error}</p>
//           <button
//             onClick={onCancel}
//             className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!form) return null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => prev ? { ...prev, [name]: value } : prev);
//   };

//   const handleRemoveImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Handle new image upload (stub, to be replaced with actual upload logic)
//   const handleImageUpload = (img: string) => {
//     setNewImage(img);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form) return;
//     // Use postUpdateInfo for the most accurate data
//     const id = postUpdateInfo?._id?.$oid || postUpdateInfo?.pageid || form.id;
//     // Always set status to 'reviewing' as required by the API
//     const status = 'reviewing';
//     // Extract image_link strings from postUpdateInfo.image
//     const existingImages = Array.isArray(postUpdateInfo?.image)
//       ? postUpdateInfo.image.map((img: any) => img?.image_link || '').filter(Boolean)
//       : images;
//     const reqBody: any = {
//       id,
//       image: {
//         description: form.description,
//         price: form.price,
//         image: existingImages, // array of image_link strings
//         status, // always 'reviewing'
//       },
//     };
//     if (newImage) {
//       reqBody.uploadimage = { image: newImage };
//     }
//     onUpdate(reqBody);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transform transition-all duration-300 scale-95 opacity-0 animate-bounceIn">
//       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 relative animate-scaleIn">
//         <button
//           type="button"
//           className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-xl focus:outline-none z-20"
//           onClick={onCancel}
//           aria-label="Close"
//         >
//           &times;
//         </button>
//         <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Edit Product</h2>
//         {/* Image Preview Grid */}
//         {images.length > 0 && (
//           <div className="mb-4">
//             <div className="grid grid-cols-3 gap-3">
//               {images.map((img, idx) => (
//                 <div key={idx} className="relative group rounded overflow-hidden shadow border border-gray-200">
//                   <img
//                     src={getImageUrl(img)}
//                     alt={`Product image ${idx + 1}`}
//                     className="w-full h-20 object-cover transition-transform duration-200 group-hover:scale-105"
//                   />
//                   <button
//                     type="button"
//                     className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-white hover:bg-red-500 shadow transition-colors z-10"
//                     onClick={() => handleRemoveImage(idx)}
//                     aria-label="Remove image"
//                   >
//                     <FaTimesCircle size={18} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <ImageUpload />
//         {updateError && (
//           <div className="text-red-500 text-xs mb-2 text-center">{updateError}</div>
//         )}
//         <div className="mb-3">
//           <label className="block text-xs font-semibold mb-1">Name</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm"
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-xs font-semibold mb-1">Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm"
//             rows={3}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-xs font-semibold mb-1">Location</label>
//           <input
//             name="location"
//             value={form.location}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm"
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block text-xs font-semibold mb-1">Price</label>
//           <input
//             name="price"
//             type="number"
//             value={form.price}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm"
//             required
//           />
//         </div>
//         <div className="flex gap-4 mt-6">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
//             disabled={updateLoading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center"
//             disabled={updateLoading}
//           >
//             {updateLoading ? (
//               <span className="flex items-center"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>Updating...</span>
//             ) : showSuccess ? (
//               <span className="flex items-center"><span className="mr-2">✅</span>Success!</span>
//             ) : (
//               'Post Update'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditProductModal;
