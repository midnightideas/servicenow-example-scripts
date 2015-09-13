/**
 * UI Script
 *
 * Name: ChangeMaxHeightOfTextAreas
 * Description: Change Maximum Height of Auto-Resized TextAreas to 100px
 * Application: Global
 * Global: True
 * Active: True
 */
document.observe('dom:loaded', function() {
	if ((typeof g_form != 'undefined') && ('GlideForm' == g_form.type)) {
		document.styleSheets[0].insertRule("HTML[data-doctype=true] textarea { max-height: 100px !important; }", 0);
	}
});