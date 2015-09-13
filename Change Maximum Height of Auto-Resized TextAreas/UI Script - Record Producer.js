/**
 * UI Script
 *
 * Name: ChangeMaxHeightOfTextAreasRecordProducer
 * Description: Change Maximum Height of Auto-Resized TextAreas to 100px
 * Application: Global
 * Global: True
 * Active: True
 */
document.observe('dom:loaded', function() {
	// #item_table should be the unique ID available when you view the Record Producer in the Service Catalog
	document.styleSheets[0].insertRule("HTML[data-doctype=true] #item_table textarea { max-height: 100px !important; }", 0);
});