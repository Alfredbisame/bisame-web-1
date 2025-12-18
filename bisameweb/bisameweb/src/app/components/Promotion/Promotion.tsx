"use client";
import React, { useState } from "react";
import PromotionTab from "./PromotionTab";
import PromotionDetails from "./PromotionDetails";
import PromoListingPage from "./PromoListingPage";
import { usePromoContext } from "./context/PromotionContext";

export type TabType = "Buy and Sell" | "Services";

const Promotion = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Buy and Sell");
  const tabs: TabType[] = ["Buy and Sell", "Services"];

  const { promoNav } = usePromoContext();

  const handleChangeTab = (data: TabType) => {
    setActiveTab(data);
  };

  return (
    <div className=" h-full rounded-lg border">
      {/* Tab section of promotion page */}
      <PromotionTab
        tabs={tabs}
        changeTabs={handleChangeTab}
        activeTab={activeTab}
        promoNav={promoNav}
      />
      <div className="promotion-card">
        {promoNav === "main" ? (
          <PromotionDetails activeTab={activeTab} />
        ) : (
          <PromoListingPage />
        )}
      </div>
    </div>
  );
};

export default Promotion;
