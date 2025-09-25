import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isControlling: boolean;
  error: string | null;
  registration: ServiceWorkerRegistration | null;
}

interface ServiceWorkerActions {
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  update: () => Promise<void>;
  skipWaiting: () => void;
}

export function useServiceWorker(
  swPath: string = '/sw.js',
  options: RegistrationOptions = {}
): ServiceWorkerState & ServiceWorkerActions {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isControlling: false,
    error: null,
    registration: null,
  });

  // Register service worker
  const register = async (): Promise<void> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Service Workers not supported' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isInstalling: true, error: null }));

      const registration = await navigator.serviceWorker.register(swPath, options);
      
      setState(prev => ({
        ...prev,
        isRegistered: true,
        isInstalling: false,
        registration,
      }));

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          setState(prev => ({ ...prev, isInstalling: true }));
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              setState(prev => ({
                ...prev,
                isInstalling: false,
                isWaiting: navigator.serviceWorker.controller !== null,
              }));
            }
          });
        }
      });

      console.log('Service Worker registered successfully');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isInstalling: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      console.error('Service Worker registration failed:', error);
    }
  };

  // Unregister service worker
  const unregister = async (): Promise<void> => {
    if (!state.registration) return;

    try {
      const result = await state.registration.unregister();
      if (result) {
        setState(prev => ({
          ...prev,
          isRegistered: false,
          registration: null,
        }));
        console.log('Service Worker unregistered successfully');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unregistration failed',
      }));
      console.error('Service Worker unregistration failed:', error);
    }
  };

  // Update service worker
  const update = async (): Promise<void> => {
    if (!state.registration) return;

    try {
      await state.registration.update();
      console.log('Service Worker update check completed');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Update failed',
      }));
      console.error('Service Worker update failed:', error);
    }
  };

  // Skip waiting for new service worker
  const skipWaiting = (): void => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Check controller state
  useEffect(() => {
    if (!state.isSupported) return;

    const updateControllerState = () => {
      setState(prev => ({
        ...prev,
        isControlling: navigator.serviceWorker.controller !== null,
      }));
    };

    updateControllerState();
    navigator.serviceWorker.addEventListener('controllerchange', updateControllerState);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', updateControllerState);
    };
  }, [state.isSupported]);

  // Auto-register on mount
  useEffect(() => {
    if (state.isSupported && !state.isRegistered) {
      register();
    }
  }, [state.isSupported, state.isRegistered]);

  return {
    ...state,
    register,
    unregister,
    update,
    skipWaiting,
  };
}

// Hook for offline status
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
}

// Hook for background sync
export function useBackgroundSync() {
  const [isSupported] = useState('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype);

  const requestSync = async (tag: string): Promise<void> => {
    if (!isSupported) {
      throw new Error('Background Sync not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
  };

  return {
    isSupported,
    requestSync,
  };
}

// Hook for push notifications
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const subscribe = async (vapidPublicKey: string): Promise<PushSubscription> => {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    setSubscription(subscription);
    return subscription;
  };

  const unsubscribe = async (): Promise<void> => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
    }
  };

  // Get existing subscription on mount
  useEffect(() => {
    const getSubscription = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        setSubscription(existingSubscription);
      }
    };

    getSubscription();
  }, []);

  return {
    permission,
    subscription,
    isSupported: 'Notification' in window && 'serviceWorker' in navigator,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}
