"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Message } from "./types";
import { useProductData } from "../components/ProductDetails/hooks/useProductData";

interface ChatHeaderProps {
  selectedMessage: Message;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedMessage }) => {
  const [showNumber, setShowNumber] = useState<string | null>(null);
  const { product, isLoading } = useProductData(
    selectedMessage.listingId as string
  );

  // Hard reset showNumber whenever listingId changes
  useEffect(() => {
    setShowNumber(null);
  }, [selectedMessage.listingId]);

  const handleShowNumber = (phoneNumber: string) => {
    setShowNumber(phoneNumber);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between bg-white px-6 py-2 border-b border-gray-200 shadow-sm h-20">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border h-16 w-16 bg-gray-200 animate-pulse border-gray-200"></div>

          <div className="min-w-0 space-y-2">
            <p className="h-5 w-40 bg-gray-200 animate-pulse"></p>
            <p className="h-5 w-20 bg-gray-200 animate-pulse"></p>
          </div>
        </div>
        <button className="h-8 w-32 bg-gray-200 animate-pulse"></button>
      </div>
    );
  }

  if (product) {
    return (
      <div className="flex items-center justify-between bg-white px-6 py-2 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            alt="Product image"
            width={64}
            height={48}
            className="object-cover rounded-lg border border-gray-200"
            src={selectedMessage.imageUrl as string | ""}
            unoptimized // Required for external URLs unless configured in next.config.js
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.title}
            </p>
            <p className="text-orange-600 font-semibold">GH₵ {product.price}</p>
          </div>
        </div>
        <button
          className="bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={() =>
            handleShowNumber(selectedMessage.phoneNumber as string)
          }
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {showNumber ? (
            <a href={`tel:${showNumber}`}>{showNumber}</a>
          ) : (
            <span>Show contact</span>
          )}
        </button>
      </div>
    );
  }
};

export default ChatHeader;
