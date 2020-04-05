"use strict";

var cacheVersion = "2020032909";
var staticCacheName = "assets" + cacheVersion;

var staticCacheFile = [
    "//stats.mcstaralliance.com/favicon.ico",
    "//stats.mcstaralliance.com/index.html",
    "//stats.mcstaralliance.com/player-list.js"
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(staticCacheFile);
        })
    );
});

self.addEventListener('activate', event => {
    var cacheWhitelist = [
        staticCacheName
    ];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
