/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { ModalType } from "../../utils/comman/CommanTypes";
import React, { ReactNode, useEffect, useState } from "react";
import Modal from "react-modal";

// Function to get custom styles based on screen size
const getCustomStyles = (isMobile: boolean): any => ({
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "auto", // 90% width on mobile, auto on desktop
    maxWidth: isMobile ? "100%" : "800px", // Maximum width constraint
    height: "auto", // Prevents overflowing on small screens
    overflow: "visible", // Enables scrolling for long content
    borderRadius: "16px",
    padding: isMobile ? "15px" : "20px", // Smaller padding on mobile
    backgroundColor: "var(--hk-surface)",
    color: "var(--hk-ink)",
    border: "1px solid var(--hk-border)",
    boxShadow: "0 20px 60px -20px rgba(var(--hk-shadow), 0.6)",
    margin: 0, // Reset any margin
  },
  overlay: {
    backgroundColor: "rgba(3, 4, 8, 0.72)", // Dim background effect
    zIndex: 1000, // Ensures modal is on top
  },
});

type PropsType = ModalType & {
  children: ReactNode;
  className?: string;
  hideCloseBtn?: boolean;
  customStyle?: any;
};

function ModalComponent(props: PropsType) {
  const [isMobile, setIsMobile] = useState(false);
  const [modalStyles, setModalStyles] = useState(getCustomStyles(false));

  // Check if device is mobile and update styles accordingly
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768; // Standard breakpoint for mobile
      setIsMobile(mobile);
      setModalStyles(getCustomStyles(mobile));
    };

    // Run on initial render
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <Modal
      isOpen={props.isOpen}
      // onRequestClose={() => props.setIsOpen(false)}
      style={{
        ...modalStyles,
        content: { ...modalStyles.content, ...props.customStyle },
      }}
      contentLabel="Example Modal"
      ariaHideApp={false} // Prevents accessibility warning
      className={props.className}
    >
      {!props.hideCloseBtn ? (
        <button
          onClick={() => props.setIsOpen(false)}
          style={{
            position: "absolute",
            top: isMobile ? "5px" : "8px",
            right: isMobile ? "8px" : "10px",
            background: "var(--hk-surface-sunken)",
            border: "1px solid var(--hk-border)",
            borderRadius: "10px",
            color: "var(--hk-ink-soft)",
            fontSize: isMobile ? "16px" : "18px",
            cursor: "pointer",
            padding: isMobile ? "4px" : "6px", // Larger touch target on mobile
            display: "flex",
          }}
        >
          <X size={isMobile ? 16 : 18} />
        </button>
      ) : null}

      {props.children}
    </Modal>
  );
}

export default ModalComponent;
