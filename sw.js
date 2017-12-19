'use strict';

const applicationServerPublicKey = 'BOSv3btIktrzFy3ZyH4UTEEp8zwJeHtEL2qRJROJzCnWDww9yeznQcSKXUGZDjpwHBwdY94ir9zB-zwGUVlN_hg';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  var jsonData = JSON.parse(event.data.text());
  console.log(jsonData.link);
  const title = 'CreditMantri';
  const options = {
    body: jsonData.message,
    icon: jsonData.image ? jsonData.image : 'images/icon.png',
    tag: jsonData.link ? jsonData.link : 'https://www.creditmantri.com/',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('display body');

  console.log(event.notification);
  console.log(event.notification.tag);
  // console.log(event.notification);
  // console.log(JSON.parse(event.notification.link));
  var notification = JSON.stringify(event.notification);
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();
  
  var link = notification.link;
  
  event.waitUntil(
    clients.openWindow(link)
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});