const CACHE_NAME = 'stock-calculator-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon-192x192.png', // 確保圖示也被快取
    '/icon-512x512.png'
];

self.addEventListener('install', event => {
    // 監聽安裝事件，並快取所有檔案
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // 監聽 fetch (網路請求) 事件，從快取中返回資源
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - 返回快取中的回應
                if (response) {
                    return response;
                }
                // Cache miss - 進行網路請求
                return fetch(event.request);
            })
    );
});
