export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);

      // Listen for updates to the service worker
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify the user or auto-refresh
              console.log('New Service Worker found. Refresh for updates.');
            }
          };
        }
      };
    })
    .catch((error) => console.error('Service Worker registration failed:', error));
  }
}
