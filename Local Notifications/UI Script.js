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
		Notification.requestPermission();

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
					var n = new Notification(messages[i].getAttribute("title"), {
						body: messages[i].getAttribute("body")
					});
					setTimeout(n.close.bind(n), 5000);
					n.onclick = function() {
						window.open(messages[i].getAttribute("url"));
					};
					break;
				}

				localStorage.setItem("LocalNotifications_sysparm_last_poll_datetime", now());

				setTimeout(pollServiceNowForNotificaitons, 5000);
			});
		}

		setTimeout(pollServiceNowForNotificaitons, 0);
	}
})();