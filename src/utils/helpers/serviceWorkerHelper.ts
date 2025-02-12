import ENVConfig from "../../config/config";
import CONSTANTS from "../constant/Constant";
import axiosInstance from "./axiosInstance";

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        console.log("Service Worker Registered");
      })
      .catch((error) => {
        console.error("Service Worker Registration Failed", error);
      });
  }
};

export const subscribeUser = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: ENVConfig.vapidKey,
    });
    await axiosInstance.post(CONSTANTS.API_ROUTES.SW_SUBSCRIPTION, JSON.stringify(subscription), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("User Subscribed:");
  }
};
