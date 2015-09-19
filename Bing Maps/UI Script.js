/**
 * UI Script
 *
 * Name: BingMaps
 * Application: Global
 * Global: True
 * Active: True
 */

// Switch to use our own version of Map Renderer
if ("/map_page.do" == window.location.pathname) {
	window.location.href = 'bing_map_page_primary.do' + window.location.search;
}