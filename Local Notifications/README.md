# Implementing Browser Notifications for ServiceNow
Most [modern browsers](http://caniuse.com/#feat=notifications) nowadays implemented the HTML5 Notification API to allow any website to send notification to its users without any user interaction (i.e. not in focus).

To enable Browser Notifications for ServiceNow, you need:
1. an UI Script that regularly polls ServiceNow for any update in the background (via AJAX)
2. a Script Include (Server Script) that responds to the AJAX poll

You can copy and paste the script in this folder into your ServiceNow instance to try. It should work for Fuji release. (I only have the Fuji Dev Instance for testing.)

If you need more information, you may want to review [this page](https://developer.mozilla.org/en-US/docs/Web/API/notification).

If you want **real** Push Notification (i.e. receiving notifications when your website has not even been loaded), you may need to implement both Push API and Notification API. The Push API is a bit unstable (or non-standardized) in my opinion, as compared to the Notification API. You are required to write codes specific to each browser to make it work. So it's up to you if you think it worths the effort.

FYI, you can learn more about the Push API at
- [https://developer.mozilla.org/en-US/docs/Web/API/Push_API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)
