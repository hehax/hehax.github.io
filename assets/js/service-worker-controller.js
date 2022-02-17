function SW() {
  this.button = $('#notification-wrapper .refresh-btn');
  this.toast = $('#notification-wrapper');

  this.registerSW();
};

SW.prototype.registerSW = function() {

    if (!navigator.serviceWorker) return;

    const that = this;
    navigator.serviceWorker.register('/service-worker.js') //PASTIKAN NAMA FILE SERVICE-WORKER UTAMANYA SAMA DENGAN YG INGIN DIREGISTER
        .then(function(reg) {
            console.info('Service Worker berhasil didaftarkan.');

            if (!navigator.serviceWorker.controller) return;

            if (reg.waiting) {
                console.log('Waiting')
                that.updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                console.log('Installing')
                that.trackInstall(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', function() {
                that.trackInstall(reg.installing);
            });
            
            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', function() {
                if (refreshing) return;

                window.location.reload();
                refreshing = true;
            });
        })
        .catch(function() {
            console.error('Tidak dapat menginstall service worker. Pastikan Anda menjalankan ini di protokol HTTPS dan tidak sedang dalam sub direktori');
        });
}

SW.prototype.trackInstall = function(worker) {
    const that = this;

    worker.addEventListener('statechange', function() {
        if (worker.state === 'installed') {
            that.updateReady(worker)
        }
    })
}

SW.prototype.updateReady = function(worker) {
    this.toast.addClass('show');

    this.button.on('click', function(event) {
        event.preventDefault();
        worker.postMessage({ action: 'skipWaiting' })      
    })
}