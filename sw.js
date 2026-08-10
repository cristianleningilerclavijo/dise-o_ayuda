/* Service worker de AyudaYa: guarda la app en el dispositivo para que funcione sin internet. */
const CACHE = 'ayudaya-v2';

const ASSETS = [
    './',
    './index.html',
    './login.html',
    './registro.html',
    './reportes.html',
    './crear-reporte.html',
    './css/styles.css',
    './js/main.js',
    './manifest.json',
    './assets/images/logo-ayudaya.svg',
    './assets/images/favicon.svg',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png',
    './assets/images/cat-bache.jpg',
    './assets/images/cat-alumbrado.jpg',
    './assets/images/cat-inseguridad.jpg',
    './assets/images/cat-convivencia.webp'
];

// Al instalar, descarga y guarda todos los archivos de la app.
// Si alguno falla, no se cae la instalación completa.
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE)
            .then(function (cache) {
                return Promise.all(ASSETS.map(function (url) {
                    return cache.add(url).catch(function () { return null; });
                }));
            })
            .then(function () { return self.skipWaiting(); })
    );
});

// Al activarse, borra cachés de versiones anteriores.
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(keys.filter(function (key) {
                    return key !== CACHE;
                }).map(function (key) {
                    return caches.delete(key);
                }));
            })
            .then(function () { return self.clients.claim(); })
    );
});

// Responde primero desde la caché (para que ande sin internet) y en paralelo
// actualiza la copia guardada cuando sí hay conexión.
self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;

    // Las peticiones a otros dominios (por ejemplo el mapa de OpenStreetMap)
    // las maneja el navegador directamente; acá solo se cachea lo propio.
    if (new URL(event.request.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(function (cached) {
            const network = fetch(event.request).then(function (response) {
                if (response && response.status === 200 && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE).then(function (cache) {
                        cache.put(event.request, copy);
                    });
                }
                return response;
            }).catch(function () {
                return cached;
            });

            return cached || network;
        })
    );
});
