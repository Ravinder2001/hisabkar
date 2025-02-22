self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push Event Received:", data);

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

  // Construct the dynamic URL
  const baseUrl = self.location.origin;
  const dynamicUrl = `${baseUrl}/${event.notification.data.group_id}`;

  // Handle the click event (both action and general click)
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's an existing client to focus
        for (const client of clientList) {
          if (client.url === dynamicUrl && "focus" in client) {
            return client.focus(); // Focus existing tab if URL matches
          }
        }

        // If no matching client found, try to open/focus any window, then navigate
        if (clientList.length > 0) {
          const client = clientList[0];
          if ("focus" in client) {
            client.focus();
            return client.navigate(dynamicUrl); // Navigate existing tab
          }
        }

        // If no clients exist, open a new window
        if (clients.openWindow) {
          return clients.openWindow(dynamicUrl);
        }
      })
      .catch((error) => {
        console.error("Error handling notification click:", error);
        // Fallback: try opening the URL anyway
        return clients.openWindow(dynamicUrl);
      })
  );
});
