"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

type ObjectProps = Record<string, string | string[] | (string | string[])[]>;

interface HandleSubmitProps {
  formData: ObjectProps;
  FormData: ObjectProps;
  clearFormData: () => void;
}

const useHandleSubmit = ({
  clearFormData,
  FormData,
  formData,
}: HandleSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const fetcher = useCallback(
    async (formData: ObjectProps) => {
      const newFormData = { ...FormData, ...formData };
      console.log(newFormData);
      try {
        const response = await axios.post("/api/listing", newFormData);
        console.log(response.data);
        console.log(response);
        if (response.status == 201) {
          toast.success(response.data.message);
          localStorage.removeItem("baseFormData");
          clearFormData();
          router.push("/dashboard/manage-post");
        } else {
          toast.error("Error occurred while fetching data");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [FormData, clearFormData, router]
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Fetching...");
    setIsSubmitting(true);
    // console.log(formData);
    console.log(FormData);
    fetcher(formData);
  };

  return { isSubmitting, handleSubmit };
};

export default useHandleSubmit;