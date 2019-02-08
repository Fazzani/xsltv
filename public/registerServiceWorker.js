// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const showUpdateBar = () => {
  const snackBar = document.getElementById("snackbar");
  snackBar.className = "show";
};
// $(function() {
//   // The click event on the pop up notification
//   document.getElementById('reload').addEventListener('click', function() {
//     newWorker.postMessage({
//       action: 'skipWaiting',
//     })
//   })
// })

export default function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener("load", async () => {
      registerValidSW();
    });
  }
}

function registerValidSW() {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              showUpdateBar();
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              //console.log('Content is cached for offline use.')
            }
          }
        };
      };
    })
    .catch(error => {
      //console.error('Error during service worker registration:', error)
      throw error;
    });
}

// function checkValidServiceWorker(swUrl) {
//   // Check if the service worker can be found. If it can't reload the page.
//   swUrl = require('./service-worker.js')
//   fetch(swUrl)
//     .then(response => {
//       // Ensure service worker exists, and that we really are getting a JS file.
//       if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
//         // No service worker found. Probably a different app. Reload the page.
//         navigator.serviceWorker.ready.then(registration => {
//           registration.unregister().then(() => {
//             window.location.reload()
//           })
//         })
//       } else {
//         // Service worker found. Proceed as normal.
//         registerValidSW(swUrl)
//       }
//     })
//     .catch(err => {
//       // console.log(
//       //   'No internet connection found. App is running in offline mode.'
//       // )
//       throw err
//     })
// }

// export function unregister() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.unregister()
//     })
//   }
// }
