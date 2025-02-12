self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push Event Received:", data);

  const options = {
    body: data.body,
    icon: "/logo192.png", // Change this to your app’s logo
    badge: "/logo192.png",
    vibrate: [200, 100, 200], // Vibration pattern
    actions: [{ action: "open_url", title: "Open App" }],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle Notification Click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://your-app-url.com") // Change to your app’s URL
  );
});
