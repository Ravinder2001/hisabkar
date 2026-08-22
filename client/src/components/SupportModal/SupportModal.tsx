import React, { useEffect } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useState } from "react";
import { LifeBuoy, MessageSquare, Bug } from "lucide-react";
import { OptionType, SupportType } from "../../utils/comman/CommanTypes";
import CustomSelect from "../CustomSelect/CustomSelect";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";
import styles from "./style.module.css";

interface SupportModalProps {
  isOpen: boolean;
  setIsOpen: (e: SupportType) => void;
  supportType: SupportType;
}

function SupportModal({ isOpen, setIsOpen, supportType }: SupportModalProps) {
  const { fetchData: getOptionList, response: optionList } = useApiFetch("");
  const { fetchData: createSupportTicket, response: submitRes, isLoading } = useApiFetch("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    description: "",
    priority: supportType === "BUG" ? "2" : "",
    category: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    description: "",
    category: "",
    priority: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", description: "", category: "", priority: "" };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Description validation
    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    // Category validation for SUPPORT type
    if (supportType === "SUPPORT" && !formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    // Priority validation for BUG type
    if (supportType === "BUG" && !formData.priority) {
      newErrors.priority = "Please select a priority";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Allow letters, numbers, spaces, and @ . , ! ? - characters
    const sanitizedValue = value.replace(/[^\w\s@.,!?-]/gi, "");

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string) => (option: OptionType) => {
    setFormData((prev) => ({ ...prev, [name]: option.value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let bodyData;

    if (supportType === "SUPPORT") {
      bodyData = {
        ticketType: "SUPPORT",
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        categoryId: formData.category,
      };
    } else if (supportType === "BUG") {
      bodyData = {
        ticketType: "BUG",
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        priorityId: formData.priority,
      };
    } else {
      bodyData = {
        ticketType: "FEEDBACK",
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
      };
    }
    await createSupportTicket(CONSTANTS.API_ROUTES.CREATE_TICKET, { method: "POST", data: bodyData });
  };

  const getTitle = () => {
    switch (supportType) {
      case "SUPPORT":
        return "Get Support";
      case "FEEDBACK":
        return "Share Feedback";
      case "BUG":
        return "Report a Bug";
      default:
        return "Contact Us";
    }
  };

  const getIcon = () => {
    switch (supportType) {
      case "SUPPORT":
        return <LifeBuoy size={18} />;
      case "FEEDBACK":
        return <MessageSquare size={18} />;
      case "BUG":
        return <Bug size={18} />;
      default:
        return null;
    }
  };

  const getDescription = () => {
    switch (supportType) {
      case "SUPPORT":
        return "Our team will get back to you as soon as possible with the help you need.";
      case "FEEDBACK":
        return "We value your input! Your feedback helps us improve our services.";
      case "BUG":
        return "Please provide details about the issue you're experiencing so we can fix it quickly.";
      default:
        return "Fill out the form below and we'll be in touch.";
    }
  };

  useEffect(() => {
    if (supportType == "SUPPORT") {
      getOptionList(CONSTANTS.API_ROUTES.GET_SUPPORT_CAT_LIST);
    } else if (supportType == "BUG") {
      getOptionList(CONSTANTS.API_ROUTES.GET_BUG_PRIOR_LIST);
    }
  }, [supportType]);

  useEffect(() => {
    if (submitRes?.success == 1) {
      setIsOpen(null);
      showToast("Ticket submitted successfully", "success");
    }
  }, [submitRes]);

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>
          <div className={styles.iconBox}>{getIcon()}</div>
          <div className={styles.title}>{getTitle()}</div>
        </div>
        <p className={styles.description}>{getDescription()}</p>

        <div className={styles.fields}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={styles.input}
                placeholder="+91 123123123"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {supportType === "SUPPORT" && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">
                Support Category
              </label>
              <CustomSelect
                options={optionList?.data}
                onChange={handleSelectChange("category")}
                value={optionList?.data.find((opt: OptionType) => opt.value === formData.category) || null}
                placeholder="Select support category"
              />
              {errors.category && <p className={styles.error}>{errors.category}</p>}
            </div>
          )}

          {supportType === "BUG" && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="priority">
                Priority
              </label>
              <CustomSelect
                options={optionList?.data}
                onChange={handleSelectChange("priority")}
                value={optionList?.data.find((opt: OptionType) => opt.value === formData.priority) || null}
                placeholder="Select priority level"
              />
              {errors.priority && <p className={styles.error}>{errors.priority}</p>}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              placeholder={
                supportType === "SUPPORT"
                  ? "Describe what you need help with..."
                  : supportType === "FEEDBACK"
                    ? "Share your thoughts and suggestions..."
                    : "Describe the issue in detail..."
              }
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={500}
            />
            {errors.description && <p className={styles.error}>{errors.description}</p>}
          </div>
        </div>

        <div className={styles.submitRow}>
          <ButtonComponent text="Submit" isLoading={isLoading} />
        </div>
      </form>
    </ModalComponent>
  );
}

export default SupportModal;
