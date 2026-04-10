self.addEventListener("push", function (event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Invalid JSON in push event", e);
  }
  console.log("Push Event Received:", data);

  const options = {
    body: data.body || "New notification from Hisabkar",
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [200, 100, 200],
    actions: [{ action: "open_url", title: "Open App" }],
    data: { ...data, group_id: data.group_id },
  };

  event.waitUntil(self.registration.showNotification(data.title || "Hisabkar", options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Construct the dynamic URL
  const baseUrl = self.location.origin;
  const groupId = event.notification.data ? event.notification.data.group_id : null;
  const targetUrl = event.notification.data?.url || (groupId ? `/group/${groupId}` : "");
  const dynamicUrl = targetUrl.startsWith("http") ? targetUrl : `${baseUrl}${targetUrl}`;

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
