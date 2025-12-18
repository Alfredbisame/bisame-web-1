"use client";
import Image from "next/image";
import { FaMapMarkerAlt, FaEdit, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Product } from "./types";
import { useMyPostData } from "./useMyPostData";
import { getImageUrl } from "../ProductDetails/utils/imageUtils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMyPostDataStatus } from "./useMyPostDataStatus";
import EditProductModal from "./EditProductModal";
import { usePostUpdateFetch } from "./usePostUpdateFetch";
import { usePostUpdatePost } from "./usePostUpdatePost";
import { UpdateProductProps } from "./interfaces";
import { getFirstImageUrl } from "./utils/imageHelper";

const ActiveProducts = () => {
  // Use the new hook with status filter
  const { data, loading, error } = useMyPostData("Active");
  const activeProducts: Product[] = data?.results || [];

  // Use a single state object to track image sources for all products
  const [imgSrcMap, setImgSrcMap] = useState<Record<string, string>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const {
    data: editingProductData,
    loading: editingProductLoading,
    error: editingProductError,
  } = usePostUpdateFetch(editingProductId || undefined);
  const { updatePost, result: updateResult } = usePostUpdatePost();

  const {
    changeStatus,
    loading: statusLoading,
    error: statusError,
  } = useMyPostDataStatus();

  useEffect(() => {
    if (updateResult && updateResult.message) {
      if (updateResult.success) {
        toast.success(updateResult.message);
        setEditModalOpen(false);
        setEditingProductId(null);
      } else {
        toast.error(updateResult.message);
      }
    }
  }, [updateResult]);

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setEditModalOpen(true);
  };

  const handleUpdateProduct = (reqBody: UpdateProductProps) => {
    updatePost(reqBody);
    // Do not close modal here; wait for updateResult.success
    // setEditModalOpen(false);
    // setEditingProductId(null);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingProductId(null);
  };

  const handleClose = async (productId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to close this product listing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0634ba",
      confirmButtonText: "Yes, close it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      changeStatus(productId, "Closed");
    }
  };

  const handleImageError = (productId: string) => {
    setImgSrcMap((prev) => ({ ...prev, [productId]: "/f4.png" }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Loading your active products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
          <FaTimes className="text-red-500" size={28} />
        </div>
        <p className="text-red-600 font-semibold mb-2">
          Failed to load products
        </p>
        <p className="text-gray-500 text-sm max-w-xs text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!activeProducts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Image
          src="/empty-box.svg"
          alt="No products"
          width={120}
          height={120}
          className="mb-4"
        />
        <p className="text-gray-600 font-semibold mb-2">No Active Products</p>
        <p className="text-gray-500 text-sm max-w-xs text-center">
          You have no active products at the moment. Start posting to see your
          products here!
        </p>
      </div>
    );
  }

  return (
    <>
      <EditProductModal
        isOpen={editModalOpen}
        product={
          editingProductData
            ? ({
                id: editingProductData.id || editingProductData._id || "",
                name: editingProductData.title || "",
                // Product expects `image`, not `images`
                // and EditProductModal can handle string | string[]
                image:
                  editingProductData.images &&
                  Array.isArray(editingProductData.images)
                    ? editingProductData.images
                        .map((img: { imageUrl?: string }) => img.imageUrl || "")
                        .filter(Boolean) // remove empty strings
                    : typeof editingProductData.images === "string"
                    ? editingProductData.images
                    : "",
                description: editingProductData.description || "",
                location: editingProductData.location || "",
                price: editingProductData.price?.toString() || "",
              } as Product)
            : null
        }
        postUpdateInfo={editingProductData}
        loading={editingProductLoading}
        error={editingProductError}
        onUpdate={handleUpdateProduct}
        onCancel={handleCancelEdit}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6 ">
        {activeProducts.map((product) => {
          const imgSrc =
            imgSrcMap[product.id] ||
            getImageUrl(getFirstImageUrl(product.images as string));
          return (
            <div
              key={product.id}
              className="border p-2 relative transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:scale-105 cursor-pointer rounded-md"
            >
              {/* Status badge */}
              <div className="absolute top-6 right-4 z-10">
                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                  Active
                </span>
              </div>
              <Image
                src={imgSrc}
                alt={product.name}
                width={150}
                height={150}
                className="w-full h-40 object-cover mt-2 rounded-md transition-transform duration-300 transform"
                onError={() => handleImageError(product.id)}
              />
              <div className="mt-4">
                <h2 className="text-sm text-gray-700 font-semibold mt-2">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-xs line-clamp-2 overflow-hidden text-ellipsis mb-2">
                  {product.description}
                </p>
                <p className="text-gray-500 text-xs mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-orange-500" size={12} />
                  {product.location}
                </p>
                <p className="text-orange-500 font-semibold mt-2">
                  {product.price == 0
                    ? "Contact for price"
                    : `₵${product?.price}`}
                </p>
                {/* Edit and Close buttons */}
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors duration-200"
                  >
                    <FaEdit className="mr-1" size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleClose(product.id)}
                    className="flex items-center text-red-600 hover:text-red-800 text-xs font-medium transition-colors duration-200"
                    disabled={statusLoading}
                  >
                    <FaTimes className="mr-1" size={12} />
                    {statusLoading ? "Closing..." : "Close"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Optionally show error below the grid */}
      {statusError && (
        <div className="text-red-500 text-xs mt-2 text-center">
          {statusError}
        </div>
      )}
    </>
  );
};

export default ActiveProducts;
