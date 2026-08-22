import cogoToast from "cogo-toast";

type ToastType = "success" | "error" | "info" | "loading";

interface ToastOptions {
  hideAfter?: number;
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
  onClick?: () => void;
  bar?: { size?: string; style?: "solid" | "dashed" | "dotted"; color?: string };
}

const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    hideAfter: type === "loading" ? 0 : 3,
    // cogo-toast's default success color is green — use the app's gold
    // accent instead so it matches the dark/gold theme.
    ...(type === "success" && { bar: { color: "var(--hk-accent)" } }),
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
