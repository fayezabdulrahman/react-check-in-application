import { useEffect, useState } from 'react';
import useAxiosClient from '../hooks/useAxiosClient';

const usePushNotifications = () => {
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const [pushSubscription, setPushSubscription] = useState(null);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] =
    useState(null);
  const [error, setError] = useState(null);

  const client = useAxiosClient(); // Get the Axios client with interceptors

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Register service worker and request notification permission
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          setServiceWorkerRegistration(registration);
          return registration;
        })
        .catch((err) => {
          setError(`ServiceWorker registration failed: ${err}`);
          console.error('ServiceWorker registration failed: ', err);
        });
    } else {
      setError('Push notifications are not supported in this browser');
    }
  }, []);

  // Check current notification permission status
  useEffect(() => {
    if (Notification.permission) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request permission and subscribe to push notifications
  const requestPermissionAndSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        if (!serviceWorkerRegistration) {
          throw new Error('Service worker not registered');
        }

        const subscription =
          await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY
            )
          });

        console.log('subscription ', subscription);

        setPushSubscription(subscription);

        const payload = {
          subscription
        };

        // Send subscription to backend
        const response = await client.post(
          '/admin/notification/subscribe',
          payload
        );
        console.log(
          'response from subscribing to notificaiton ',
          response.data
        );

        return subscription;
      }
    } catch (err) {
      setError(`Error requesting notification permission: ${err}`);
      console.error('Error requesting notification permission:', err);
      throw err;
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async () => {
    try {
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
        setPushSubscription(null);

        // Notify backend about unsubscription
        const payload = {
          endpoint: pushSubscription.endpoint
        };

        const response = await client.post(
          '/admin/notification/unsubscribe',
          payload
        );
        console.log(
          'response from unsubscribing to notificaiton ',
          response.data
        );
      }
    } catch (err) {
      setError(`Error unsubscribing from push notifications: ${err}`);
      console.error('Error unsubscribing from push notifications:', err);
      throw err;
    }
  };

  return {
    notificationPermission,
    pushSubscription,
    serviceWorkerRegistration,
    error,
    requestPermissionAndSubscribe,
    unsubscribe
  };
};

export default usePushNotifications;
