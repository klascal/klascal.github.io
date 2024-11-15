const CACHE = "pwabuilder-offline";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE}-images`,
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE}-fonts`,
  })
);

workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'script' && !/scheduleDay/.test(request.url),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE}-scripts`,
  })
);

workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
    networkTimeoutSeconds: 5,
  })
);
