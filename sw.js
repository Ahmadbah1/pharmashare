// sw.js — cache basique pour la PWA
const CACHE = 'pharmashare-v5';
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match('/index.html')))
  );
});
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title:'PharmaShare', body:'Nouvelle notification'};
  e.waitUntil(self.registration.showNotification(data.title, {body: data.body, icon: '/icon.png'}));
}); 
