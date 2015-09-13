# Push Notification for Google Chrome
As of Chrome version 42, Google Chrome enables website to send push notification to client browser As of Chrome version 42, the Push API and Notification API are available to developers.

## Teach ServiceNow to Push Notifications
## Test Triggering Push Notifications

```
curl --header "Authorization: key=<YOUR_PUBLIC_API_KEY>" --header
"Content-Type: application/json" https://android.googleapis.com/gcm/send -d
"{\"registration_ids\":[\"<YOUR_REGISTRATION_ID>\"]}"
```

## Set up Business Rule to send Push Notifications from ServiceNow
## Optional - Allow User to Subscribe and Unsubscribe Push Notifications
## References
**Introduction to Push Notification in Google Chrome** [https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)

**Source Codes example of Push and Notificaiton API for Google Chrome** [https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications](https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications)
