"use client";

import { useEffect, useState } from "react";
import { TriggerProps, useFormContext } from "../../Foods/context/FormContext";
import { ObjectProps } from "../components/SelectOptionInput";
import useFetchDynamicOptions from "./useFetchDynamicOptions";
import { MetaDataProps } from "../interfaces";

const useHandleDynamicOptions = (
  metaData: MetaDataProps,
  formData: ObjectProps,
  optionKey: string
) => {
  const [, setIsTriggered] = useState<boolean>(false);
  const { handleTriggerValue, triggerValue, handleChangeOptionData } =
    useFormContext();

  // Fetch data when trigger updates
  useFetchDynamicOptions(
    triggerValue as TriggerProps,
    metaData.dependsOn,
    formData[metaData.dependsOn] as string,
    optionKey.toLowerCase(),
    handleChangeOptionData
  );

  const handleTrigger = (value: boolean) => setIsTriggered(value);

  useEffect(() => {
    if (
      triggerValue?.triggerValue &&
      metaData.allowCustomInput &&
      metaData.dependsOn === triggerValue?.triggerAttribute
    ) {
      setIsTriggered(true);
    }
  }, [triggerValue, metaData.allowCustomInput, metaData.dependsOn]);

  return { triggerValue, handleTriggerValue, handleTrigger };
};

export default useHandleDynamicOptions;
