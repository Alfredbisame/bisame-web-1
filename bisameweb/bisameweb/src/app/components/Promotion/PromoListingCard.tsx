"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MdLocationPin } from "react-icons/md";
import { usePromoContext } from "./context/PromotionContext";

export interface PromoListingProps {
  itemName: string;
  productBrand?: string;
  price: number;
  location: string;
  imageUrl: string;
  tag?: "B&S" | "SRV";
  id: string;
  description?: string;
}

export interface PromoListingMainProps extends PromoListingProps {
  countSelected: number;
  handleSelectionCount: (type: "increment" | "decrement") => void;
  disabled?: boolean;
}

const PromoListingCard: React.FC<PromoListingMainProps> = ({
  itemName,
  location,
  price,
  id,
  imageUrl,
  description,
  countSelected,
  handleSelectionCount,
  disabled = false,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const {
    handleSelectedProduct,
    selectedProduct,
    selectedPromotion,
    handleRemoveSelectedProduct,
  } = usePromoContext();

  const numberOfAdsAllowed = selectedPromotion?.adsNumber as number;

  const isCheckboxDisabled =
    disabled || (!isSelected && countSelected >= numberOfAdsAllowed);

  useEffect(() => {
    const alreadySelected = selectedProduct?.some((p) => p.id === id);
    setIsSelected(alreadySelected);
  }, [selectedProduct, id]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    if (checked && !isSelected && countSelected < numberOfAdsAllowed) {
      handleSelectedProduct({ id, imageUrl, itemName, location, price });
      handleSelectionCount("increment");
      setIsSelected(true);
    } else if (!checked && isSelected) {
      handleRemoveSelectedProduct({ id, imageUrl, itemName, location, price });
      handleSelectionCount("decrement");
      setIsSelected(false);
    }
  };

  return (
    <div className="relative">
      <label htmlFor={`check-${id}`}>
        <div
          className={`shadow-md flex flex-col max-h-1/2 h-full border border-gray-200 ${
            isSelected ? "border-orange-500" : ""
          } rounded-xl cursor-pointer pt-5 md:py-0 xl:py-5 2xl:py-0`}
        >
          <Image
            src={imageUrl}
            alt={itemName}
            width={300}
            height={300}
            priority
            className="w-full p-0 rounded-t-xl"
          />

          <div
            className={`details px-2 pt-2 pb-5 flex-1 rounded-b-xl ${
              isSelected ? "bg-orange-50" : ""
            }`}
          >
            <h2 className="font-semibold text-gray-700 text-sm md:text-base">
              {itemName}
            </h2>
            <p className="text-gray-400 text-ellipsis overflow-hidden text-sm md:text-base">
              {description}
            </p>
            <span className="text-orange-500 text-sm md:text-base font-semibold">
              GH₵ {price}
            </span>
            <span className="flex items-start md:items-center gap-2">
              <MdLocationPin color="#3b82f6" />
              <span className="text-gray-400 text-sm">{location}</span>
            </span>
          </div>
        </div>
      </label>

      <input
        type="checkbox"
        id={`check-${id}`}
        checked={isSelected}
        disabled={isCheckboxDisabled}
        className="accent-orange-500 absolute top-5 right-5 border border-gray-200 cursor-pointer"
        onChange={handleCheck}
      />
    </div>
  );
};

export default PromoListingCard;
