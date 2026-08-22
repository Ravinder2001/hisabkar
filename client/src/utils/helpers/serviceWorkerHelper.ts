import ENVConfig from "../../config/config";
import CONSTANTS from "../constant/Constant";
import axiosInstance from "./axiosInstance";

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        // console.log("Service Worker Registered");
      })
      .catch(() => {
        // console.error("Service Worker Registration Failed", error);
      });
  }
};

export const subscribeUser = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;

    // Check if subscription already exists
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: ENVConfig.vapidKey,
    });
    await axiosInstance.post(CONSTANTS.API_ROUTES.SW_SUBSCRIPTION, JSON.stringify(subscription), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return subscription;
  }
};

export const unsubscribeUser = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      // Optionally notify backend to remove subscription
      return true;
    }
  }
  return false;
};

export const getSubscription = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  }
  return null;
};
