// add an event listener for push notifications
self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      const defaultPayload = {
        title: 'New Notification',
        body: 'You have a new notification',
        icon: '/b2b.png',
        data: { url: '/home' }
      };
      const payload = event.data?.json() || defaultPayload;
      await self.registration.showNotification(payload.title, {
        ...payload, // Spread all properties from backend
        badge: payload.badge || '/b2b.png' // Fallback badge
      });
    })()
  );
});


// add an event listener for clicking on the push notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(
    event.notification.data?.url || '/home',
    self.location.origin
  );

  console.log('url', url);

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      const targetClient = clients.find((c) => c.url.startsWith(url.origin));

      if (targetClient) {
        await targetClient.focus();
        if (new URL(targetClient.url).pathname !== url.pathname) {
          targetClient.postMessage({
            type: 'NAVIGATE',
            path: url.pathname
          });
        }
      } else {
        await self.clients.openWindow(url);
      }
    })()
  );
});
