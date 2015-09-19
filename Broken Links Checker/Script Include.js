/**
 * Script Include
 *
 * Name: ReportKbBrokenLinksAjax (must match the Class Name)
 * Application: Global
 * Client callable: True
 * Active: True
 * Accessible from: All application scopes
 */
var ReportKbBrokenLinksAjax = Class.create();
ReportKbBrokenLinksAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	reportBrokenLink: function() {
		var kb_url = this.getParameter("sysparm_location_href");
		var link_title = this.getParameter("sysparm_title");
		var link_url = this.getParameter("sysparm_broken_link");

		var gr = new GlideRecord('incident');
		gr.initialize();
		gr.short_description = "Broken link found at " + kb_url;
		gr.description = "KB Article URL: " + kb_url + "\nLink title: " + link_title + "\nLink URL: " + link_url;
		gr.insert();
	}
});