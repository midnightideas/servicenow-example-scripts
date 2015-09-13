/**
 * Script Include
 *
 * Name: LocalNotificationsAjax (must match the Class Name)
 * Application: Global
 * Client callable: True
 * Active: True
 * Accessible from: All application scopes
 */
var LocalNotificationsAjax = Class.create();
LocalNotificationsAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	getMessages: function() {
		var gr = new GlideRecord('incident');

		// Return all active incidents created after a specific date time
		gr.addQuery('active', true);
		gr.addQuery('sys_created_on', ">", this.getParameter('sysparm_last_poll_datetime'));
		gr.query();
		while (gr.next()) {
			var message = this.newItem("message");
			message.setAttribute("title", "New Incident");
			message.setAttribute("body", "Incident " + gr.number + " has been created.");
			message.setAttribute("url", "https://dev12001.service-now.com/nav_to.do?uri=incident.do?sys_id=" + gr.sys_id)
		}
	}
});