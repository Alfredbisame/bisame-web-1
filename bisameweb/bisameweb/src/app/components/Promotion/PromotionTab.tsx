import React from "react";
import { TabType } from "./Promotion";
import { PromoNav } from "./interfaces";

interface PromotionTabProps {
  tabs: TabType[];
  changeTabs: (data: TabType) => void;
  activeTab: TabType;
  promoNav: PromoNav;
}

const PromotionTab: React.FC<PromotionTabProps> = ({
  tabs,
  changeTabs,
  activeTab,
  promoNav,
}) => {
  return (
    <div
      className={`${
        promoNav === "main" ? "block" : "hidden"
      } border-b space-x-10 grid grid-cols-${tabs.length} text-center `}
    >
      {tabs.map((tab) => (
        <span
          key={tab}
          onClick={() => changeTabs(tab)}
          className={`cursor-pointer  text-xs md:text-sm ${
            activeTab == tab
              ? "border-b-2 text-orange-500 border-orange-500"
              : "text-gray-500"
          } font-semibold p-2 md:p-3`}
        >
          {tab.toUpperCase()}
        </span>
      ))}
    </div>
  );
};

export default PromotionTab;
