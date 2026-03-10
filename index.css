import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  )

  useEffect(() => {
    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Online/offline
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const install = useCallback(async () => {
    if (!installPrompt) return false
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
    return outcome === 'accepted'
  }, [installPrompt])

  const requestNotifications = useCallback(async () => {
    if (!('Notification' in window)) return false
    const permission = await Notification.requestPermission()
    setNotifPermission(permission)
    return permission === 'granted'
  }, [])

  const sendNotification = useCallback((title: string, body: string, icon = '/icons/icon-192x192.png') => {
    if (notifPermission !== 'granted') return
    new Notification(title, { body, icon, badge: '/icons/icon-72x72.png' })
  }, [notifPermission])

  return {
    installPrompt,
    isInstalled,
    isOnline,
    notifPermission,
    install,
    requestNotifications,
    sendNotification,
    canInstall: !!installPrompt && !isInstalled
  }
}
