/**
 * UI Page Client Script
 *
 * UI Page Name: bing_map_page_primary
 */
(function() {
	// Replace with your own Bing Maps Application Key
	// You can get one from https://www.bingmapsportal.com/
	var APPLICATION_KEY = 'AhDA2jKu4ZDlFWyh639n8S2YwUAwEMQ4lwKdMq08h-Je4KYBOmGYJcbskmRDV-bP';

	// START - Codes reproduced from $map_page_primary.do
	function loadMap() {
		var map = new GwtMap('map', 'com.glideapp.google_maps.AJAXMapProcessor');
		var coords = newLongLat();

		// if ('' == 'true')
		// 	coords = getUserLongLat(coords);
		//
		// if (!('' == '' || '' == ''))
		// 	coords = useProvidedLatLong(coords);

		map.setCenter(coords.lat, coords["long"]);
		map.setZoom('4');
		map.addParam('sysparm_name', 'Critical incidents'); // TODO read from query string
		map.addParam('sysparm_sys_id', '');
		map.addParam('sysparm_auto_close', 'true');
		map.draw();
	}

	function getUserLongLat(coords) {
		var user = new GlideRecord('sys_user');
		user.get('6816f79cc0a8016401c5a33be04be441');

		var loc = new GlideRecord('cmn_location');
		loc.get(user.location);

		if (loc.longitude)
			coords["long"] = loc.longitude;

		if (loc.latitude)
			coords.lat = loc.latitude;
		return coords;
	}

	function newLongLat() {
		return {
			lat: '36.008522',
			"long": '-95.221764'
		};
	}

	function useProvidedLatLong(coords) {
		return {
			lat: '',
			"long": ''
		};
	}
	// END - Codes reproduced from $map_page_primary.do

	// Bing Maps Override!
	GwtMap.prototype.initialize = function(elementName, processor) {
		this.elementName = elementName;
		this.processor = processor;
		this.translations = {};
		if (this.needTranslations.length > 0)
			this.translations = new GwtMessages().getMessages(needTranslations);
		this.options = {};
		this.options["mapType"] = "satellite";
		this.options["mapCenterLat"] = "";
		this.options["mapCenterLng"] = "";
		this.options["mapZoom"] = "4";
		this.params = {};
		this.searchManager = null;
		Event.observe(window, "unload", this._onUnload.bind(this));
	};
	GwtMap.prototype._drawMap = function(response) {
		this._onUnload();
		var xml = response.responseXML;

		var overviewMapControl = false;
		var mapTypeId = Microsoft.Maps.MapTypeId.auto;
		this._setOptions(xml);

		if (this.options.mapType == 'satellite') {
			mapTypeId = Microsoft.Maps.MapTypeId.aerial;
		} else if (this.options.mapType == 'terrain') {
			mapTypeId = Microsoft.Maps.MapTypeId.road;
		} else if (this.options.mapType == 'hybrid') {
			mapTypeId = Microsoft.Maps.MapTypeId.aerial;
		} else {
			mapTypeId = Microsoft.Maps.MapTypeId.road;
		}

		this.map = new Microsoft.Maps.Map(document.getElementById(this.elementName), {
			credentials: APPLICATION_KEY
		});
		this.map.setView({
			zoom: parseInt(this.options["mapZoom"], 10),
			center: new Microsoft.Maps.Location(this.options["mapCenterLat"], this.options["mapCenterLng"]),
			mapTypeId: mapTypeId
		})
		Microsoft.Maps.loadModule('Microsoft.Maps.Search', {
			callback: function() {
				this.map.addComponent('searchManager', new Microsoft.Maps.Search.SearchManager(this.map));
				this.geocoder = this.map.getComponent('searchManager');
			}
		});
		this.center();
	};
	GwtMap.prototype.center = function(lat, lng, zoom) {
		if (lat && lng) {
			this.options["mapCenterLat"] = lat;
			this.options["mapCenterLng"] = lng;
		}
		if (zoom)
			this.options["mapZoom"] = zoom;
		if (this.options["mapCenterLat"] && this.options["mapCenterLng"]) {
			var zoom = parseInt(this.options["mapZoom"], 10);
			if (!isNaN(zoom))
				this.map.setView({
					zoom: zoom,
					center: new Microsoft.Maps.Location(this.options["mapCenterLat"], this.options["mapCenterLng"])
				});
			else
				this.map.setView({
					center: new Microsoft.Maps.Location(this.options["mapCenterLat"], this.options["mapCenterLng"])
				});
		}
	};

	loadMap();
})();