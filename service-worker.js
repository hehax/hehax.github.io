const cacheVersion = 'v0.0.1';
const files = [
    // halaman utama
    '/',

    // asset css & js utama
    'assets/css/bootstrap.min.css',
    'assets/css/style.css',
    'assets/js/jquery-3.5.1.min.js',
    'assets/js/bootstrap.bundle.min.js',
    'assets/js/script.js',
    'assets/js/service-worker-controller.js',

    // asset gambar & icon
    'assets/images/logo.png',
    'assets/images/logo-large.png',
    'assets/images/hero-banner-example.jpg',
];


// saat SW diinstall, simpan seluruh file yang didefine di variabel "files" ke dalam cache sesuai version "cacheVersion"
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheVersion)
            .then((cache) => {
                return cache.addAll(files);
            })
    );
});

// saat melakukan fetch html / assets, cek dulu apakah file tersebut ada di cache atau tidak
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((res) => {
                if(res) return res; //tidak usah load http request karena file sudah ada di cache

                return fetch(event.request); //asset tidak ditemukan di cache, jadi lanjutkan fetch load http seperti biasanya
            })
    )
});

// saat mengaktifkan versi SW baru, cek apabila ada versi cache terbaru, maka cache2 yang lama dihapus
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheName) => {
            return Promise.all(
                cacheName.filter((cname) => {
                    return cname !== cacheVersion;
                }).map((cname) => {
                    caches.delete(cname);
                })
            );
        })
    );
});

// jika menerima pesan skipWaiting (ditrigger saat update version), artinya service worker yang pending dapat langsung digunakan
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
