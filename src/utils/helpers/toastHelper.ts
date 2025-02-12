import cogoToast from "cogo-toast";

type ToastType = "success" | "error" | "info" | "loading";

interface ToastOptions {
  hideAfter?: number;
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
  onClick?: () => void;
}

const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    hideAfter: type === "loading" ? 0 : 3,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  switch (type) {
    case "success":
      return cogoToast.success(message, mergedOptions);
    case "error":
      return cogoToast.error(message, mergedOptions);
    case "info":
      return cogoToast.info(message, mergedOptions);
    case "loading":
      return cogoToast.loading(message, mergedOptions);
    default:
      return cogoToast.info(message, mergedOptions);
  }
};

export default showToast;
