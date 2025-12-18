"use client";

import { PostServiceForm } from "@/app/components/PostAd/ServiceCategorySelector/PostServiceForm";
import { useServiceForm } from "../hooks/useServiceForm";
import { useSearchParams } from "next/navigation";
import { Group } from "../utils/categories";

/**
 * Container component for the service form
 * Handles the integration between the form and business logic
 */
const ServiceFormContainer = () => {
  const { onClear, onServiceSelect, onLocationSelect, onBack, onSubmit } =
    useServiceForm();
  const SearchParams = useSearchParams();
  const group = SearchParams.get("group") as Group;

  return (
    <div className="service-form-container">
      <PostServiceForm
        onClear={onClear}
        onServiceSelect={onServiceSelect}
        onLocationSelect={onLocationSelect}
        onBack={onBack}
        onSubmit={onSubmit}
        group={group}
      />
    </div>
  );
};

export default ServiceFormContainer;
