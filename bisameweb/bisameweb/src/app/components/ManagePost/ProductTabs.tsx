"use client";
import { useState } from "react";
import { TabType } from "./types";
import ActiveProducts from "./ActiveProducts";
import ReviewProducts from "./ReviewProducts";
import DeclinedProducts from "./DeclinedProducts";
import ClosedProducts from "./ClosedProducts";
import UpdateProducts from "./UpdateProducts";
import PostContextProvider from "./context/PostContext";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ACTIVE");

  const tabs: TabType[] = ["ACTIVE", "REVIEW", "DECLINED", "UPDATE", "CLOSED"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "ACTIVE":
        return <ActiveProducts />;
      case "REVIEW":
        return <ReviewProducts />;
      case "DECLINED":
        return <DeclinedProducts />;
      case "UPDATE":
        return <UpdateProducts />;
      case "CLOSED":
        return <ClosedProducts />;
      default:
        return <ActiveProducts />;
    }
  };

  return (
    <div className="mt-2 md:mt-0 p-1 rounded-xl min-h-96 shadow-sm border border-gray-200">
      <div className="p-1 md:p-4 rounded-sm">
        <div className="border-b border-gray-200">
          <ul className="flex">
            {tabs.map((tab) => (
              <li key={tab} className="mr-6">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs ${
                    activeTab === tab
                      ? "text-orange-500 font-semibold border-b-2 border-orange-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Render the appropriate tab content */}
        <PostContextProvider>{renderTabContent()}</PostContextProvider>
      </div>
    </div>
  );
};

export default ProductTabs;
