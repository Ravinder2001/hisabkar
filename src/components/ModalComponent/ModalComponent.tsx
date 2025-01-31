/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { ModalType } from "../../utils/comman/CommanTypes";
import React, { ReactNode } from "react";
import Modal from "react-modal";

const customStyles: any = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "90%", // Responsive width
    maxWidth: "500px", // Maximum width for larger screens
    maxHeight: "90vh", // Prevents overflowing on small screens
    overflowY: "auto", // Enables scrolling for long content
    borderRadius: "10px",
    padding: "20px",
    backgroundColor: "#fff",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background effect
    zIndex: 1000, // Ensures modal is on top
  },
};

type PropsType = ModalType & {
  children: ReactNode;
};

function ModalComponent(props: PropsType) {
  return (
    <Modal
      isOpen={props.isOpen}
      // onRequestClose={() => props.setIsOpen(false)}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false} // Prevents accessibility warning
    >
      {/* Close Button */}
      <button
        onClick={() => props.setIsOpen(false)}
        style={{
          position: "absolute",
          top: "8px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        <X size={18}/>
      </button>

      {props.children}
    </Modal>
  );
}

export default ModalComponent;
