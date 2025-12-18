"use client";
import Image from "next/image";
import React, { useState } from "react";

import PromoSelectType from "./PromoSelectType";
import { usePromoContext } from "./context/PromotionContext";
import { promoServicesTypes, promoTypes } from "./constants";

interface PromoListingProps {
  itemName: string;
  imageUrl: string;
  id: string;
}

const PromoListingSelectedCard: React.FC<PromoListingProps> = ({
  itemName,
  imageUrl,
  id,
}) => {
  const {
    benefitQuantity,
    selectedPromotion,
    handleIncrementCount,
    handleDecrementCount,
    handleAddPromotion,
    handleRemovePromotion,
    handleSectionItems,
    handleRemoveSectionItem,
  } = usePromoContext();

  const newPromoTypes =
    selectedPromotion?.categoryGroup === "Buy and Sell"
      ? promoTypes
      : promoServicesTypes;

  const [selected, setSelected] = useState<Record<string, boolean>>({
    featuredposts: false,
    topmarketplacedeals: false,
    trending: false,
    explorelocalservices: false,
  });

  const handleToggle = (key: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [key]: checked }));

    const sectionMap: Record<string, string> = {
      featuredposts: "Featured Posts",
      topmarketplacedeals: "Top Marketplace Deals",
      trending: "Trending",
      explorelocalservices: "Explore Local Services",
    };

    const sectionTitle = sectionMap[key];

    if (checked) {
      handleIncrementCount(key);
      handleAddPromotion(itemName);
      handleSectionItems(sectionTitle, id);
    } else {
      handleDecrementCount(key);
      handleRemovePromotion(itemName);
      handleRemoveSectionItem(sectionTitle, id);
    }
  };

  return (
    <div className="shadow-md border border-gray-200 rounded-xl cursor-pointer">
      <div className="flex items-center max-h-32 border-b">
        <Image
          src={imageUrl}
          alt={itemName}
          width={100}
          height={100}
          className="w-1/3 md:p-2 rounded-3xl max-h-28"
          priority
        />
        <div className="details rounded-b-xl p-2">
          <h2 className="font-semibold text-gray-700 text-sm md:text-base">
            {itemName}
          </h2>
        </div>
      </div>

      <div className="p-2 space-y-1">
        {newPromoTypes.map((type) => (
          <PromoSelectType
            key={type.key}
            labelName={`${itemName}-${type.key}`}
            icon={type.icon}
            promoTypeHeader={type.label}
            promoTypeDetail={type.detail}
            isChecked={selected[type.key]}
            styles={
              !selected[type.key] && (benefitQuantity?.[type.key] || 0) <= 0
                ? "hidden"
                : "block"
            }
            onChange={(checked) => handleToggle(type.key, checked)}
            name={type.key}
            value={id}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoListingSelectedCard;
