"use client";
import PromotionHeader from "./PromotionHeader";
import NewPromoCard from "./NewPromoCard";
import useProfilePromotion from "./hooks/use-profile-promotion";
import LoadingPage from "../ManagePost/components/LoadingPage";

const PromotionPlan = () => {
  const { data, isLoading, error } = useProfilePromotion();
  console.log(data);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="shadow-md h-full m-1 md:m-3 rounded-lg">
      {/* Header component of promotion section */}
      <PromotionHeader
        promoHeader="Promo Plans"
        optionalHeader="Status & Price"
      />
      <div className="promotion-card p-3 md:p-5 grid md:grid-cols-2 gap-5">
        {data &&
          data.map(({ pricingOption, status, promotionPlanSnapshot, id }) => (
            <NewPromoCard
              key={id}
              price={pricingOption.price}
              promoStatus={status}
              promoName={promotionPlanSnapshot.title}
              promoSummary={promotionPlanSnapshot.description}
              primaryColor="blue"
            />
          ))}
      </div>
    </div>
  );
};

export default PromotionPlan;
