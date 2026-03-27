const CACHE_NAME = 'vi-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request).then(r => r || caches.match('/index.html'))
    )
  );
});

// Handle scheduled notifications
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_ALARMS') {
    const alarms = e.data.alarms;
    alarms.forEach(alarm => {
      const now = Date.now();
      const alarmTime = new Date();
      alarmTime.setHours(alarm.h, alarm.m, 0, 0);
      const diff = alarmTime.getTime() - now;
      if (diff > 0 && diff < 86400000) {
        setTimeout(() => {
          self.registration.showNotification(alarm.label, {
            body: alarm.msg,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: alarm.label,
            requireInteraction: false,
            vibrate: [200, 100, 200],
          });
        }, diff);
      }
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/');
    })
  );
});
