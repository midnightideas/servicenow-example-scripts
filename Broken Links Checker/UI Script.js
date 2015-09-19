/**
 * Broken Links Checker
 *
 * Name: BrokenLinksChecker
 * Application: Global
 * Global: True
 * Active: True
 */

// Only enable the Broken Links Checker on KB Page (kb_view.do)
if ("/kb_view.do" == window.location.pathname) {
	document.observe('dom:loaded', function() {
		function checkBrokenLink(url, callback) {
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status < 400) {
						// If we are testing a ServiceNow kb_view.do page, we will still get HTTP 200,
						// even if the page does not exist. Therefore, we need different rules for checking
						if (/\/kb_view\.do/ig.test(url)) {
							if (/Undefined\(jelly\.jvar_obj\.name;\)/ig.test(xhr.responseText)) {
								return callback(false);
							}
						}
						return callback(true);
					} else {
						return callback(false);
					}
				}
			};

			// If we are testing a ServiceNow kb_view.do page, we will still get HTTP 200,
			// even if the page does not exist. Therefore, we need different rules for checking
			if (/\/kb_view\.do/ig.test(url)) {
				xhr.open("GET", url);
			} else {
				xhr.open("HEAD", url);
			}
			xhr.send();
		}
		var all_links = document.getElementsByTagName("a");
		for (var i = 0; i < all_links.length; i++) {
			//
			(function(link) {
				var href = link.getAttribute("href");
				checkBrokenLink(href, function(success) {
					if (!success) {
						// Create a small hover title to alert user that this link may be broken.
						var originalTitle = link.getAttribute("data-original-title");
						var tooltip = originalTitle + " (This link may be broken. A incidient ticket has already been raiesd.)";
						link.setAttribute("data-title", tooltip);
						link.setAttribute("data-original-title", tooltip);

						// Also, change the color a bit so I can spot the broken link easily.
						// However, eventually, it's up to you how you want to manage the end user
						// expectation on broken link.
						link.style.color = "red";

						var ga = new GlideAjax('ReportKbBrokenLinksAjax');
						ga.addParam("sysparm_name", "reportBrokenLink");
						ga.addParam("sysparm_location_href", location.href);
						ga.addParam("sysparm_title", originalTitle);
						ga.addParam("sysparm_broken_link", href);
						ga.getXML();
					}
				});
			})(all_links[i]);
		}
	});
}