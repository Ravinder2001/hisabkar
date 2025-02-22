self.addEventListener("push", function (event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [200, 100, 200],
    actions: [{ action: "open_url", title: "Open App" }],
    data: { group_id: data.group_id },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Get the base URL from the service worker's location
  const baseUrl = self.location.origin;
  const dynamicUrl = `${baseUrl}/group/${event.notification.data.group_id}`;

  if (event.action === "open_url") {
    event.waitUntil(clients.openWindow(dynamicUrl));
  }
});
