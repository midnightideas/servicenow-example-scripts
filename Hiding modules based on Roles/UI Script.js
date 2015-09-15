/**
 * UI Script
 *
 * Name: HideModulesForRole
 * Application: Global
 * Global: True
 * Active: True
 */

document.observe('dom:loaded', function() {
	// Find the navigator windows
	var nav_window = parent.document.getElementById("gsft_nav").contentWindow;
	var roles = nav_window.NOW.user.roles;

	// Remove the module if roles is admin
	if ('admin' == roles) {
		// module.14641d70c611228501114133b3cc88a1 is the Create Now menu item of the Incident module.
		// You will need to inspect the DOM to find out the menu item ID to remove.
		var menu_item = nav_window.document.getElementById("module.14641d70c611228501114133b3cc88a1");
		if (menu_item) menu_item.parentNode.removeChild(menu_item);
	}
});