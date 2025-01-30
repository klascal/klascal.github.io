const CACHE = "pwabuilder-offline";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache images using StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE}-images`,
  })
);

// Cache fonts using StaleWhileRevalidate strategy
workbox.routing.registerRoute(
  ({ request }) => request.destination === "font",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE}-fonts`,
  })
);

// Cache scripts using StaleWhileRevalidate strategy, excluding "scheduleDay"
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "script" && !/scheduleDay/.test(request.url),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE}-scripts`,
  })
);

// Use NetworkFirst strategy for all other requests
workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
    networkTimeoutSeconds: 5,
  })
);
