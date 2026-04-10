import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { getSubscription, subscribeUser } from "../../utils/helpers/serviceWorkerHelper";
import showToast from "../../utils/helpers/toastHelper";

const NotificationPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;

  useEffect(() => {
    const checkStatus = async () => {
      // Don't show if already dismissed in this session
      const dismissed = sessionStorage.getItem("notification_prompt_dismissed");
      if (dismissed) return;

      const sub = await getSubscription();
      if (!sub) {
        setShowPrompt(true);
      } else {
        setIsSubscribed(true);
      }
    };

    if ("serviceWorker" in navigator && "PushManager" in window) {
      checkStatus();
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      if (isIOS && !isStandalone) {
        showToast("On iOS, you must add this app to your Home Screen first to enable notifications.", "info");
        return;
      }

      const sub = await subscribeUser();
      if (sub) {
        setIsSubscribed(true);
        setShowPrompt(false);
        showToast("Notifications enabled!", "success");
      }
    } catch (error) {
      console.error("Subscription failed", error);
      showToast("Could not enable notifications. Please check browser permissions.", "error");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("notification_prompt_dismissed", "true");
  };

  if (!showPrompt || isSubscribed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border border-blue-100 shadow-xl rounded-2xl p-4 flex items-center gap-4 relative">
        <div className="bg-blue-50 p-3 rounded-full">
          <Bell className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 line-height-tight">Enable Notifications</h4>
          <p className="text-xs text-gray-500 mt-0.5">Stay updated on shared expenses and group activity.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Dismiss">
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSubscribe}
            className="bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
