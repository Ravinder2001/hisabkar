import cogoToast from "cogo-toast";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  hideAfter?: number;
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
}

const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
  const defaultOptions: ToastOptions = {
    position: "top-right", // Default position
    hideAfter: 3, // Default duration in seconds
  };

  const mergedOptions = { ...defaultOptions, ...options };

  switch (type) {
    case "success":
      cogoToast.success(message, mergedOptions);
      break;
    case "error":
      cogoToast.error(message, mergedOptions);
      break;
    case "info":
      cogoToast.info(message, mergedOptions);
      break;
    default:
      cogoToast.info(message, mergedOptions);
      break;
  }
};

export default showToast;
