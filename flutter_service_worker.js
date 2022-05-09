'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "b3943b9d56bae8ca8304f75f39aa57f7",
"assets/assets/documents/resume.pdf": "22fc34660138103f2addcf4286e7d4c6",
"assets/assets/fonts/Cairo-Bold.ttf": "ef55322bc2031017175022b779940cb0",
"assets/assets/fonts/Cairo-Regular.ttf": "374ef4fe60ef13426296c292bba5e237",
"assets/assets/fonts/Cairo-SemiBold.ttf": "b9eb3a03009d618aa53a0ca8eaa6ab4b",
"assets/assets/fonts/JetBrainsMono-Regular.ttf": "f556ba3718de43c9d1d1caecd70cbea2",
"assets/assets/images/arrow-icon.svg": "a11655010ff3218c2f52375060d3d774",
"assets/assets/images/ascii-converter-icon.png": "382d73470ad6c2505bbd85a54ea71f22",
"assets/assets/images/dcode-screen-1.png": "3ef9fb113be556385fb69eb07408d62f",
"assets/assets/images/dcode-screen-2.png": "17aac276a33007e13d4936fdaa1a3b3c",
"assets/assets/images/dcode-screen-3.png": "e62a2f1e2fba79e725fe53c7cc2fd57f",
"assets/assets/images/deal-hunter-icon.png": "40134dc556c896727e3114837231f3ac",
"assets/assets/images/deal-hunter-screen-1.png": "652e283ab65fbf31e7cd531a61a5bbbd",
"assets/assets/images/deal-hunter-screen-2.png": "f2843a6518b13dcf04ec93d4a5cd425d",
"assets/assets/images/deal-hunter-screen-3.png": "d1728cf51080147018f21383d4005347",
"assets/assets/images/email-icon.svg": "eafb92eb5416a6490d2aa0458ddfe51f",
"assets/assets/images/github-icon.svg": "de06c1e1b8f3f37d0765859cdc423dd6",
"assets/assets/images/heart-icon.svg": "bb2da5b6060cba50f4f2878cdae6078b",
"assets/assets/images/linkedin-icon.svg": "084aa47a94910db0337b805967a2f13d",
"assets/assets/images/menu-icon.svg": "6efb8adb83ca86a2bc1b89301114873e",
"assets/assets/images/phone-icon.svg": "1186de43150cb877e050dfdca6be5631",
"assets/assets/images/portfolio-image.jpg": "9b800245c3c6e53c9cf4cd2edae13d3a",
"assets/assets/images/twitter-icon.svg": "a1ca26a208ab9612b7e9ddb133998d1f",
"assets/FontManifest.json": "00fa4d5d1a994f1de74a9449aa00e8d5",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "07de325038e205a409c8f4374b65db4c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "94b43b46a9f36b106bfeb26abc0fee27",
"icons/Icon-192.png": "7e9765566d5dcd0009c3889cb37f7d0a",
"icons/Icon-512.png": "52b44ab9580164962172d5abd5da6ade",
"icons/Icon-maskable-192.png": "7e9765566d5dcd0009c3889cb37f7d0a",
"icons/Icon-maskable-512.png": "52b44ab9580164962172d5abd5da6ade",
"index.html": "33c86b37fb96ac804e66b40bb837f30f",
"/": "33c86b37fb96ac804e66b40bb837f30f",
"main.dart.js": "8e3a8ced9d6971b82b2f521f9dd13664",
"manifest.json": "32e428263e5af597fce6a06e8e5c00b1",
"version.json": "48e2199dea2d79eff1a1ca413df54646"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
