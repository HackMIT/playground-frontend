import socket from '../socket';

class NotificationsManager {
  constructor() {
    this.isPushEnabled = false;
  }

  urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };

  start = () => {
    // If no service workers, notifications aren't supported
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/service-worker.js').then(() => {
      // Are Notifications supported in the service worker?
      if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.log("Notifications aren't supported.");
        return;
      }

      // Check the current Notification permission.
      // If its denied, it's a permanent block until the
      // user changes the permission
      if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.');
        return;
      }

      // Check if push messaging is supported
      if (!('PushManager' in window)) {
        console.log("Push messaging isn't supported.");
        return;
      }

      // We need the service worker registration to check for a subscription
      navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager
          .getSubscription()
          .then((subscription) => {
            if (!subscription) {
              // We aren’t subscribed to push, so set UI
              // to allow the user to enable push
              this.subscribe();
              return;
            }

            // Keep your server in sync with the latest subscription
            this.sendSubscriptionToServer(subscription);

            // Set your UI to show they have subscribed for
            // push messages
            this.isPushEnabled = true;
          })
          .catch((err) => {
            console.error('Error during getSubscription()', err);
          });
      });
    });
  };

  subscribe = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlB64ToUint8Array(
            'BB584OYloNsGGb3p4lIv4hb0J4ZPgd3WlqhEVA_e9DuZsJ2XMaBOplUlnPIAXSna8gDchIHtF9_MNzMfd9jTEtQ'
          ),
        })
        .then((subscription) => {
          // The subscription was successful
          this.isPushEnabled = true;

          const json = JSON.stringify(subscription.toJSON(), null, 2);
          // success: send json to server
          console.log(json);
        })
        .catch((e) => {
          if (Notification.permission === 'denied') {
            // The user denied the notification permission which
            // means we failed to subscribe and the user will need
            // to manually change the notification permission to
            // subscribe to push messages
            console.error('Permission for Notifications was denied');
          } else {
            // A problem occurred with the subscription, this can
            // often be down to an issue or lack of the gcm_sender_id
            // and / or gcm_user_visible_only
            console.error('Unable to subscribe to push.', e);
          }
        });
    });
  };

  // This method handles the removal of subscriptionId
  // in Chrome 44 by concatenating the subscription Id
  // to the subscription endpoint
  endpointWorkaround = (pushSubscription) => {
    // Make sure we only mess with GCM
    if (
      pushSubscription.endpoint.indexOf(
        'https://android.googleapis.com/gcm/send'
      ) !== 0
    ) {
      return pushSubscription.endpoint;
    }

    let mergedEndpoint = pushSubscription.endpoint;
    // Chrome 42 + 43 will not have the subscriptionId attached
    // to the endpoint.
    if (
      pushSubscription.subscriptionId &&
      pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1
    ) {
      // Handle version 42 where you have separate subId and Endpoint
      mergedEndpoint = `${pushSubscription.endpoint}/${pushSubscription.subscriptionId}`;
    }
    return mergedEndpoint;
  };

  sendSubscriptionToServer = (subscription) => {
    socket.send({
      type: 'register',
      browserSubscription: subscription,
    });

    console.log(JSON.stringify(subscription));
  };
}

const manager = new NotificationsManager();
export default manager;
