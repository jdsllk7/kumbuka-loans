const staticCacheName = 'site-static-v4';
const assets = [
    '/public/images/logos/favicon.ico',
    '/public/images/logos/logo.jpg',
    '/public/manifest.json',
    '/public/js/app.js',
    '/offline'
];

// cache size limit function 
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

// install event 
self.addEventListener('install', evt => {
    console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            cache.addAll(assets);
            console.log('caching shell assets...');
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        // Try the cache
        caches.match(event.request).then(function (response) {
            // Fall back to network
            return response || fetch(event.request);
        }).catch(function () {
            //fallback
            return caches.match('/offline');
        })
    );
});