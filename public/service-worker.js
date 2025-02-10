// src/service-worker.js

// Listen for install event, typically used to cache assets
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  // Optional: You can use event.waitUntil() to ensure the service worker
  // isn't considered installed until after you've done some set up.
});

// Listen for activate event, good time to clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  // Optional: Clean up old caches here.
});

// Listen for push notifications
self.addEventListener("push", (event) => {
  console.log("Push notification received");
  let data = {};
  if (event.data) {
    data = event.data.json(); // Assuming the payload is in JSON format
  }

  const title = data.title || "Default Title";
  const body = data.body || "This is a push notification";
  const icon = data.icon || "/logo192.png"; // Path to your icon

  const options = {
    body: body,
    icon: icon,
    data: {
      url: data.url || "/", // Customize the link to open when the notification is clicked
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Optional: Handle notification clicks (e.g., open a specific URL)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url || "/"; // Default URL

  event.waitUntil(clients.openWindow(url));
});

// Listen for messages from the client (your React app)
self.addEventListener("message", (event) => {
  console.log("Message received from client", event.data);

  let notification = event.data;

  if (notification && notification.title && notification.options) {
    event.waitUntil(self.registration.showNotification(notification.title, notification.options));
  } else {
    console.warn("Invalid notification data received");
  }
});
