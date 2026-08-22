/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Select from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: Option | null; // Ensure it's an object
  name?: string;
  onChange: any;
  onBlur?: any;
  placeholder?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  isDisabled = false,
  name,
  onBlur,
  isSearchable,
}) => {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "var(--hk-surface-2)",
      borderRadius: "10px",
      border: state.isFocused ? "1px solid var(--hk-accent)" : "1px solid var(--hk-border)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--hk-accent)" : "none",
      minHeight: "36px",
      fontSize: "14px",
      cursor: "pointer",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--hk-surface)",
      border: "1px solid var(--hk-border)",
      borderRadius: "10px",
      boxShadow: "0 20px 40px -20px rgba(var(--hk-shadow), 0.6)",
      fontSize: "14px",
      overflow: "hidden",
    }),
    menuList: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--hk-surface)",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--hk-ink)",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "var(--hk-ink)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "var(--hk-accent)" : state.isFocused ? "var(--hk-surface-sunken)" : "var(--hk-surface)",
      color: state.isSelected ? "var(--hk-on-accent)" : "var(--hk-ink)",
      padding: "10px",
      cursor: "pointer",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--hk-ink-faint)",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--hk-border)",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "var(--hk-ink-faint)",
    }),
  };

  return (
    <Select
      onBlur={onBlur}
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customStyles}
      isDisabled={isDisabled}
      isSearchable={isSearchable ?? true}
    />
  );
};

export default CustomSelect;
