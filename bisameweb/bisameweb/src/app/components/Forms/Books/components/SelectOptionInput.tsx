"use client";
import React, { useEffect } from "react";
import { MetaDataProps } from "../interfaces";
import useHandleDynamicOptions from "../hooks/useHandleDynamicOptions";
import { useFormContext } from "../../Foods/context/FormContext";

export type ObjectProps = Record<
  string,
  string | string[] | (string | string[])[]
>;

interface SelectOptionProps {
  name: string;
  attribute?: string;
  inputName?: string;
  options: string[];
  metaData?: MetaDataProps;
  formData: ObjectProps;
  placeholder?: string;
  handleNameChange: (name: string, value: string) => void;
}

const SelectOptionInput: React.FC<SelectOptionProps> = ({
  name,
  options,
  inputName,
  metaData,
  formData,
  attribute,
  placeholder,
  handleNameChange,
}) => {
  const hasCustomInput = metaData?.allowCustomInput;
  const dynamicOptions = metaData?.dynamicOptions;
  const optionKey = inputName as string;

  const { optionData, newOptions, handleUpdateOptions } = useFormContext();
  const { triggerValue, handleTriggerValue, handleTrigger } =
    useHandleDynamicOptions(metaData as MetaDataProps, formData, optionKey);

  useEffect(() => {
    if (
      dynamicOptions &&
      metaData?.dependsOn === triggerValue?.triggerAttribute
    ) {
      handleUpdateOptions({ [inputName as string]: optionData.options });
    }
  }, [
    optionData,
    triggerValue,
    dynamicOptions,
    metaData?.dependsOn,
    inputName,
    handleUpdateOptions,
  ]);

  const availableOptions = newOptions?.[inputName as string] ?? options;

  // KEY FIX: Get the current value from formData or use empty string
  const getSelectValue = (): string => {
    const formValue = formData[optionKey];
    if (formValue !== undefined && formValue !== null && formValue !== "") {
      return String(formValue);
    }
    if (attribute !== undefined && attribute !== null && attribute !== "") {
      return attribute;
    }
    return ""; // Always return string
  };

  return (
    <div className="relative md:space-y-2">
      <label htmlFor={name} className="text-gray-500 text-sm lg:text-base">
        {name[0].toUpperCase() + name.slice(1)}
      </label>
      <select
        name={inputName}
        required
        value={getSelectValue()}
        className="w-full border border-blue-300 rounded-lg p-2 text-[#7a9ebd] placeholder-[#7a9ebd] focus:outline-none focus:ring-1 focus:ring-blue-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-xs md:text-sm lg:text-base"
        aria-required="true"
        onChange={(e) => {
          handleNameChange(e.target.name, e.target.value);
          if (dynamicOptions || hasCustomInput) {
            handleTriggerValue({
              triggerAttribute: e.target.name,
              triggerValue: e.target.value,
            });
            handleTrigger(true);
          }
        }}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {availableOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOptionInput;
