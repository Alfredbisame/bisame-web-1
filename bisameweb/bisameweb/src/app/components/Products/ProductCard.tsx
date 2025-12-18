'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { getImageUrl } from '@/app/components/ProductDetails/utils/imageUtils';
import { useState } from 'react';

//Product interface
interface ProductImage {
  imageUrl: string;
  id: string;
  originalUrl?: string;
  updatedAt?: string;
}

interface Product {
  _id: string;
  id: string;
  title: string;
  description?: string;
  price: number;
  location?: string;
  images: ProductImage[];
  city?: string;
  region?: string;
  badge?: {
    text: string;
    color: string;
  };
  originalPrice?: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleProductClick = () => {
    if (product.id) {
      router.push(`/ProductDetails?id=${product.id}`);
    }
  };

  // Get the first image URL and process it with imageUtils
  const getProcessedImageUrl = () => {
    if (!product.images || product.images.length === 0) return '/f4.png';
    const imageUrl = product.images[0].imageUrl || product.images[0].originalUrl || '/f4.png';
    return getImageUrl(imageUrl, 500, 500);
  };

  const imageUrl = getProcessedImageUrl();
  const fallbackImage = '/f4.png';

  // Construct location string
  const locationText = product.location || (product.city && product.region ? `${product.city}, ${product.region}` : '');

  // Format price
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact for Price';
    return `₵${price.toLocaleString()}`;
  };

  return (
    <div className="shadow-md p-3 relative transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:scale-105 cursor-pointer rounded-md"
         onClick={handleProductClick}
         >
      <div className="relative">
        {product.badge && (
          <span className={`absolute top-0 left-0 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-md z-10`}>
            {product.badge.text}
          </span>
        )}
        <div className="aspect-square w-full h-52 2xl:h-60 relative overflow-hidden mb-2 rounded-md">
          <Image
            src={imageError ? fallbackImage : imageUrl}
            alt={product.title || 'Product image'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      
      <h2 className="text-sm font-semibold mb-1 line-clamp-2">{product.title}</h2>
      
      {product.description && (
        <p className="text-gray-500 text-xs line-clamp-2 overflow-hidden text-ellipsis mb-2">
          {product.description}
        </p>
      )}
      
      <div className="mt-3">
        {locationText && (
          <p className="text-gray-500 text-xs mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-1 text-orange-500" size={12} />
            {locationText}
          </p>
        )}
        
        <div className="flex items-center space-x-2">
          {product.originalPrice && product.price !== 0 && (
            <span className="text-gray-500 line-through text-xs">
              ₵{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-orange-500 font-bold">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;