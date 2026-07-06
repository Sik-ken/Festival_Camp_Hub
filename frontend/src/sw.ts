/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

// Ohne skipWaiting/clientsClaim bleibt eine neue Version im "waiting"-Zustand,
// bis alle Tabs/die installierte PWA komplett geschlossen werden - Deploys
// kommen sonst erst nach einem vollständigen App-Neustart an.
self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /\/api\/(gallery|challenges|friendbook|leaderboards)/,
  new StaleWhileRevalidate({ cacheName: "api-cache" }),
);

registerRoute(
  /\/(thumbnails|uploads)\//,
  new CacheFirst({
    cacheName: "media-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 500 })],
  }),
);

self.addEventListener("push", (event) => {
  let payload: { title?: string; body?: string; url?: string } = {};
  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = { body: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Helmpflicht Hub", {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data?.url as string | undefined) ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client && new URL(client.url).pathname === url) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
