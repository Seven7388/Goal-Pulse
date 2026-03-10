/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// ── Background Sync: queue failed API requests ────────────────────────────────
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores())
  }
})

async function syncScores() {
  const cache = await caches.open('scores-cache')
  // In production: fetch from API and cache result
  console.log('[SW] Background sync: scores updated')
}

// ── Periodic Background Sync: refresh scores every 5 min ─────────────────────
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'refresh-scores') {
    event.waitUntil(syncScores())
  }
})

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'GoalPulse ⚡'
  const options = {
    body: data.body || 'New match update!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'match-update',
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'View Match' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// ── Notification Click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/'
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        const existing = clients.find(c => c.url.includes(url))
        if (existing) return existing.focus()
        return self.clients.openWindow(url)
      })
    )
  }
})

// ── Share Target handler ──────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.pathname === '/share' && event.request.method === 'GET') {
    event.respondWith(
      (async () => {
        return Response.redirect('/', 303)
      })()
    )
  }
})
