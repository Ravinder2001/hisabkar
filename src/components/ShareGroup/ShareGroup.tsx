import React from "react";
import { Button } from "../ui/button";
import ModalComponent from "../ModalComponent/ModalComponent";
import { ModalType } from "../../utils/comman/CommanTypes";
import { Copy } from "lucide-react";
import showToast from "../../utils/helpers/toastHelper";

function GroupSharingModal({ isOpen, setIsOpen, groupCode }: ModalType & { groupCode: string }) {
  const currentUrl = window.location.origin;
  const fullGroupLink = `${currentUrl}/join-group/${groupCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullGroupLink);
    showToast("Group link copied to clipboard!", "success");
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullGroupLink)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center mb-4 mt-4">
        <span className="truncate text-sm text-gray-700">{fullGroupLink}</span>
        <button onClick={copyToClipboard} className="text-gray-500 hover:text-black">
          <Copy size={18} />
        </button>
      </div>
      <Button onClick={shareToWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2">
        Share to WhatsApp
      </Button>
    </ModalComponent>
  );
}

export default GroupSharingModal;
