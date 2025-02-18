/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Select from "react-select";

interface Option {
  value: string;
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
      backgroundColor: "white",
      borderRadius: "8px",
      border: state.isFocused ? "1px solid black" : "1px solid rgba(229, 231, 235, var(--tw-border-opacity))",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      minHeight: "36px",
      fontSize: "14px",
      cursor: "pointer",
      "&:hover": {
        // border: "1px solid black",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      fontSize: "16px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : "white",
      color: state.isSelected ? "white" : "black",
      padding: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#aaa",
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
