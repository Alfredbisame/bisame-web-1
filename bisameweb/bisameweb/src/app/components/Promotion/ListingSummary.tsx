"use client";
import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineInsertChart } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import Button from "../ui/Button";
import SummaryListCard from "./SummaryListCard";
import { usePromoContext } from "./context/PromotionContext";
import useCheckout from "./hooks/use-checkout";
import { PromoPlanRoot } from "./interfaces";

interface ListingSummaryProps {
  handleChangeModalStatus: () => void;
}

const ListingSummary: React.FC<ListingSummaryProps> = ({
  handleChangeModalStatus,
}) => {
  const {
    selectedProduct,
    promotionSelected,
    promoPlan,
    selectedPromotion,
    sectionItems,
  } = usePromoContext();

  const noPromoProduct = selectedProduct.filter(
    (promo) => !promotionSelected.includes(promo.itemName)
  );

  const extractNoPromoProductId: string[] = noPromoProduct.reduce<string[]>(
    (acc, current) => [...acc, current.id],
    []
  );

  const extractNoPromoProduct: string[] = noPromoProduct.reduce<string[]>(
    (acc, current) => [...acc, current.itemName],
    []
  );

  const postData = {
    pricingOption: {
      label: selectedPromotion?.label,
      value: selectedPromotion?.value,
      discountedPrice: selectedPromotion?.discount,
      price: selectedPromotion?.price,
    },
    sectionItems,
    promotionPlanId: promoPlan?.id,
    otherPromotedItems: extractNoPromoProductId,
  };

  const { trigger, isMutating } = useCheckout(postData as PromoPlanRoot);

  const handleCheckout = async () => {
    await trigger();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-96 h-[470px] rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="text-sm md:text-base font-semibold flex flex-col items-center h-full gap-3">
          {/* Icon */}
          <span className="bg-blue-500 rounded-full p-2 shadow-md">
            <IoIosCheckmarkCircleOutline size={26} color="white" />
          </span>

          {/* Header */}
          <h2 className="text-lg tracking-wide text-gray-700">
            Promotion Summary
          </h2>

          {/* Stats */}
          <div className="border border-blue-300 bg-blue-50 w-full rounded-lg text-blue-600 p-3 flex gap-2 items-center justify-center shadow-sm">
            <MdOutlineInsertChart size={20} />
            <span className="text-sm flex items-center">
              {selectedProduct.length} listings <BsDot size={22} />{" "}
              {promotionSelected.length} promotions
            </span>
          </div>

          {/* Scroll List */}
          <div className="list flex-1 w-full overflow-y-auto space-y-2 pr-1 scrollbar-hide mt-1">
            {promotionSelected.map((item, index: number) => (
              <SummaryListCard
                key={index}
                product={item}
                promo={`Promotion selected`}
              />
            ))}

            {extractNoPromoProduct.map((item, index: number) => (
              <SummaryListCard
                key={index}
                product={item}
                styles="bg-gray-200"
                promo={`No Promotion selected`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="btn w-full flex gap-3 mt-3">
            <Button
              label="Cancel"
              styles="text-sm flex-1 border border-orange-500 text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-50 transition"
              action={handleChangeModalStatus}
            />

            <Button
              label={isMutating ? `Proceeding...` : `Continue`}
              styles={`text-sm flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition ${
                isMutating ? "opacity-90" : ""
              }`}
              action={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingSummary;
