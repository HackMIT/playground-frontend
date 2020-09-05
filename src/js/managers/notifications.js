const GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

class NotificationsManager {
  constructor() {
    this.isPushEnabled = false;
  }

  start = () => {
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
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
        })
        .then((subscription) => {
          // The subscription was successful
          this.isPushEnabled = true;

          // TODO: Send the subscription subscription.endpoint
          // to your server and save it to send a push message
          // at a later date
          return this.sendSubscriptionToServer(subscription);
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
    // TODO: Send the subscription.endpoint
    // to your server and save it to send a
    // push message at a later date
    //
    // For compatibly of Chrome 43, get the endpoint via
    // endpointWorkaround(subscription)
    console.log('TODO: Implement sendSubscriptionToServer()');

    const mergedEndpoint = this.endpointWorkaround(subscription);

    // This is just for demo purposes / an easy to test by
    // generating the appropriate cURL command
    this.showCurlCommand(mergedEndpoint);
  };

  // NOTE: This code is only suitable for GCM endpoints,
  // When another browser has a working version, alter
  // this to send a PUSH request directly to the endpoint
  showCurlCommand = (mergedEndpoint) => {
    // The curl command to trigger a push message straight from GCM
    if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0) {
      window.Demo.debug.log(
        "This browser isn't currently supported for this demo"
      );
      return;
    }

    const endpointSections = mergedEndpoint.split('/');
    const subscriptionId = endpointSections[endpointSections.length - 1];

    const curlCommand = `curl --header "Authorization: key=asdf" --header Content-Type:"application/json" ${GCM_ENDPOINT} -d "{\\"registration_ids\\":[\\"${subscriptionId}\\"]}"`;
    console.log(curlCommand);
  };
}

const manager = new NotificationsManager();
export default manager;
