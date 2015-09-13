/**
 * UI Script
 *
 * Name: ChangeMaxHeightOfTextAreasProblem
 * Description: Change Maximum Height of Auto-Resized TextAreas to 100px - Problem Form only
 * Application: Global
 * Global: True
 * Active: True
 */
document.observe('dom:loaded', function() {
	// You can also change #problem\\.do to #incident\\.do if you want to apply the new max-height to the Incident Form only.
	document.styleSheets[0].insertRule("HTML[data-doctype=true] #problem\\.do textarea { max-height: 100px !important; }", 0);
});