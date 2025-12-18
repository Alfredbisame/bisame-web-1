import { useState } from "react";
import { LocationProps, usePostServiceFormContext } from "./FormContext";
import { ServiceSelection } from "../ServiceCategorySelector";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  isMain?: boolean;
}

export interface PostServiceFormData {
  service: ServiceSelection;
  location: LocationProps;
  images: UploadedImage[];
}

export interface PostServiceFormCallbacks {
  onClear?: () => Promise<boolean> | void;
  onServiceSelect?: (service: ServiceSelection) => void;
  onLocationSelect?: (city: string, region: string) => void;
  onBack?: () => void;
  onSubmit?: (data: PostServiceFormData) => void;
}

export const usePostServiceForm = (callbacks: PostServiceFormCallbacks) => {
  const {
    selectedService,
    setSelectedService,
    selectedLocation,
    setSelectedLocation,
    images,
    setImages,
    clearForm,
  } = usePostServiceFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceSelect = (service: ServiceSelection) => {
    setSelectedService(service);
    callbacks.onServiceSelect?.(service);
  };

  const handleLocationSelect = (city: string, region: string) => {
    setSelectedLocation({ city, region });
    callbacks.onLocationSelect?.(city, region);
  };

  const handleImagesChange = (
    hasImages: boolean,
    uploadedImages?: UploadedImage[]
  ) => {
    if (uploadedImages) {
      setImages(uploadedImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService && selectedLocation && images.length > 0) {
      setIsSubmitting(true);
      try {
        await callbacks.onSubmit?.({
          service: selectedService,
          location: selectedLocation,
          images,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClearForm = async () => {
    const result = await callbacks.onClear?.();
    if (result !== false) {
      clearForm();
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    }

    localStorage.removeItem("baseFormData");
  };

  const handleBack = () => {
    callbacks.onBack?.();
  };

  return {
    selectedService,
    selectedLocation,
    images,
    isSubmitting,
    handleServiceSelect,
    handleLocationSelect,
    handleImagesChange,
    handleSubmit,
    handleClearForm,
    handleBack,
  };
};
