// use a staticCacheName for cache versioning
const staticCacheName = "v1.1:static";
const dynamicCacheName = "v1.0:dynamic";
const assets = [
  "/",
  "/index.html",
  "/js/index.js",
  "/js/backgroundReq_newAd.js",
  "/js/automation.js",
  "/js/testTool.js",
  "/js/setSDKversion.js",
  "/js/custom.js",
  "/js/sdk.js",
  "/js/backgroundReq.js",
  "/js/backgroundReq2.js",
  "/js/responsive.js",
  "/js/ui_test.js",
  "/js/browser.js",
  "/js/nav.js",
  "/js/app.js",
  "/js/fullscreen.js",
  "/sdk/sdk-loader_v4.js",
  "/sdk/sdk-v2.0.0.js",
  "/sdk/sdk-v1.4.1.js",
  "/sdk/sdk-v1.3.1.js",
  "/sdk/sdk-v1.3.4.js",
  "/sdk/sdk-v1.3.0.js",
  "/sdk/sdk-v1.3.3.js",
  "/sdk/sdk-v1.3.2.js",
  "/sdk/sdk-v1.4.2.js",
  "/sdk/sdk-loader_v3.js",
  "/sdk/sdk-v1.4.3.js",
  "/css/app.css",
  "/css/form.css",
  "/css/orientation.css",
  "/index.html",
  "/pages/browser.html",
  "/pages/automation.html",
  "/pages/screen size.html",
  "/pages/custom.html",
  "/pages/ui_test.html",
  "/pages/backgroundReq.html",
  "/pages/font.html",
  "/pages/testTool.html",
  "/pages/backgroundReq2.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// during the install phase you usually want to cache static assets
self.addEventListener("install", (evt) => {
  // once the SW is installed, go ahead and fetch the resources to make this work offline
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("Caching shell assets");
      return cache.addAll(assets).then(() => {
        self.skipWaiting();
        console.log("Skipped Waiting");
      });
    })
  );
});

// // install event
// self.addEventListener("install", (evt) => {
//   //console.log('service worker installed');
//   evt.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       console.log("caching shell assets");
//       cache.addAll(assets);
//     })
//   );
// });

//Activate event and del old caches
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// when the browser fetches a url
self.addEventListener("fetch", (event) => {
  // either respond with the cached object or go ahead and fetch the actual url
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          // retrieve from cache
          return response;
        }
        // fetch as normal
        return fetch(event.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            cache.put(event.request.url, fetchRes.clone());
            //check cache size
            limitCacheSize(dynamicCacheName, 5);
            return fetchRes;
          });
        });
      })
      .catch(() => {
        if (event.request.url.indexOf(".html") > -1)
          caches.match("/pages/fallback.html");
      })
  );
});
