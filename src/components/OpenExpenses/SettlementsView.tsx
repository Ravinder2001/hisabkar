import React, { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import type { Group } from "../../pages/OpenExpenses/OpenExpenses";
import { calculateSettlements } from "../../pages/OpenExpenses/OpenExpenses";
import Modal from "react-modal";

export default function SettlementsView({ group, getMemberName }: { group: Group; getMemberName: (memberId: string) => string }) {
  const settlements = calculateSettlements(group);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Keep isMobile logic for styling and now for URL construction
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Helper to generate WhatsApp message for each member
  const getWhatsAppMessage = (memberId: string) => {
    const member = group.members.find((m) => m.id === memberId);
    if (!member) return "";

    const owes = settlements.filter((s) => s.from === memberId);
    const receives = settlements.filter((s) => s.to === memberId);

    const messageLines: string[] = [];
    messageLines.push(`Hi ${member.name},`);

    if (owes.length > 0) {
      messageLines.push(`You need to pay:`);
      owes.forEach((s) => {
        messageLines.push(`• ₹${s.amount.toFixed(2)} to ${getMemberName(s.to)}`);
      });
    }

    if (receives.length > 0) {
      messageLines.push(`You will receive:`);
      receives.forEach((s) => {
        messageLines.push(`• ₹${s.amount.toFixed(2)} from ${getMemberName(s.from)}`);
      });
    }

    // Add group context
    messageLines.push(`\n(Settlements for group: ${group.name})`);

    return messageLines.join("\n");
  };

  // NEW: Helper to generate WhatsApp URL based on device type
  const getWhatsAppUrl = (memberId: string) => {
    const message = encodeURIComponent(getWhatsAppMessage(memberId));

    if (isMobile) {
      // Standard wa.me link for mobile devices
      // This often prompts the native app to open
      return `whatsapp://send?text=${message}`;
    } else {
      // For desktop, use the web client URL structure
      // Modern desktop apps often intercept this or the browser will open web.whatsapp.com
      // Note: A phone number is technically required for web.whatsapp.com,
      // but to share a message directly without a specific recipient,
      // the `wa.me` structure is still the standard, which opens a new chat
      // or the web app. The best chance for opening the *native desktop app* // without a phone number is often the `whatsapp://send` scheme,
      // which many desktop apps are configured to handle.

      // Let's use the most aggressive scheme for the desktop app first:
      const desktopAppScheme = `whatsapp://send?text=${message}`;

      // The standard wa.me link as a fallback if the custom scheme doesn't work
      // or to open the web client:
      // return `https://wa.me/?text=${message}`;

      // We will rely on the browser to handle the custom scheme for a better desktop experience.
      return desktopAppScheme;
    }
  };

  return (
    <div className="space-y-6 relative">
      {settlements.length > 0 && (
        <button
          onClick={openModal}
          className="absolute top-4 right-2 flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </button>
      )}
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Settlement Summary</h3>

        {/* ... (Settlement display logic remains the same) ... */}
        {settlements.length === 0 ? (
          <div className="text-center py-8">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h4>
            <p className="text-gray-600">No payments needed between group members.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">To settle all expenses, the following payments need to be made:</p>
            {settlements.map((settlement: { from: string; to: string; amount: number }, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between space-x-2 sm:space-x-4">
                  {/* From person */}
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getMemberName(settlement.from)}</p>
                      <p className="text-xs sm:text-sm text-gray-600">owes</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-center flex-shrink-0 px-2">
                    <p className="text-lg sm:text-2xl font-bold text-green-500">₹{settlement.amount.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-gray-500">to pay</p>
                  </div>

                  {/* To person */}
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 justify-end">
                    <div className="text-right min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getMemberName(settlement.to)}</p>
                      <p className="text-xs sm:text-sm text-gray-600">receives</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Share via WhatsApp"
        className={`bg-white rounded-lg shadow-lg p-6 outline-none ${isMobile ? "mx-4 w-full mt-20" : "w-[500px] mx-auto mt-20"}`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
        ariaHideApp={false}
      >
        <h3 className="text-lg font-semibold mb-4">Share via WhatsApp</h3>

        {group.members.map((member) => {
          // Use the new helper function
          const whatsappUrl = getWhatsAppUrl(member.id);
          return (
            <div key={member.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-3 border">
              <p className="font-medium text-gray-900">{member.name}</p>
              <a
                // The key change is the whatsappUrl
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1 text-xs"
              >
                <Share2 className="w-3 h-3" />
                {/* <span>WhatsApp</span> */}
              </a>
            </div>
          );
        })}

        <div className="mt-4 text-right">
          <button onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
