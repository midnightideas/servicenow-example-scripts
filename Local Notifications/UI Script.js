/**
 * UI Script
 *
 * Name: LocalNotifications
 * Application: Global
 * Global: True
 * Active: True
 */
(function() {
	if ("Notification" in window) {
		// Request permission to use the Browser Notification API
		Notification.requestPermission();

		// Return the current date time in yyyy-mm-dd hh:mm:ss format, so we can pass it back to ServiceNow for comparison
		function now() {
			return new Date().toISOString().replace("T", " ").replace(/\.\d+Z?/g, "");
		}

		function pollServiceNowForNotificaitons() {
			var last_poll_datetime = localStorage.getItem("LocalNotifications_sysparm_last_poll_datetime") || now();

			var ga = new GlideAjax('LocalNotificationsAjax');
			ga.addParam("sysparm_name", "getMessages");
			ga.addParam("sysparm_last_poll_datetime", last_poll_datetime);
			ga.getXML(function(response) {
				var messages = response.responseXML.documentElement.getElementsByTagName("message");
				for (var i = 0; i < messages.length; i++) {
					// Create local notification
					var n = new Notification(messages[i].getAttribute("title"), {
						body: messages[i].getAttribute("body")
					});

					// Chrome only - auto close the notification after 5 seconds, if nobody clicks on it.
					setTimeout(n.close.bind(n), 5000);

					// Open the ServiceNow if somebody clicks on the notification message.
					n.onclick = function() {
						window.open(messages[i].getAttribute("url"));
					};
				}

				localStorage.setItem("LocalNotifications_sysparm_last_poll_datetime", now());

				// Continue to poll from the server every 5 seconds as well as this page is active.
				setTimeout(pollServiceNowForNotificaitons, 5000);
			});
		}

		// Start polling when the page is loaded.
		setTimeout(pollServiceNowForNotificaitons, 0);
	}
})();