/**
 * UI Page Client Script
 *
 * UI Page Name: bing_map_page_primary
 */
(function() {
	// BING MAPS CONFIGURATIONS

	// Replace with your own Bing Maps Application Key
	// You can get one from https://www.bingmapsportal.com/
	var APPLICATION_KEY = 'AhDA2jKu4ZDlFWyh639n8S2YwUAwEMQ4lwKdMq08h-Je4KYBOmGYJcbskmRDV-bP';

	// Bing Maps does not have the abilty to scale icons like Google Maps does.
	// Therefore, you must specify an external image scaling proxy. All icon image must be
	// in absolute path with protocol (i.e. http://) specified explicity for any scaling proxy
	// to work. Comment out the the following line if you don't need to auto scale icons
	var AUTO_SCALE_HELPER = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url={url}&&container=focus&resize_w={width}&resize_h={height}";

	// END - BING MAPS CONFIGURATIONS

	// START - Codes reproduced from $map_page_primary.do
	function loadMap() {
		var match,
			pl = /\+/g, // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function(s) {
				return decodeURIComponent(s.replace(pl, " "));
			},
			query = window.location.search.substring(1);

		urlParams = {};
		while (match = search.exec(query))
			urlParams[decode(match[1])] = decode(match[2]);

		var map = new GwtMap('map', 'com.glideapp.google_maps.AJAXMapProcessor');
		var coords = newLongLat();

		// if ('' == 'true')
		// 	coords = getUserLongLat(coords);
		//
		// if (!('' == '' || '' == ''))
		// 	coords = useProvidedLatLong(coords);

		map.setCenter(coords.lat, coords["long"]);
		map.setZoom('4');
		map.addParam('sysparm_name', urlParams['sysparm_name'] || '');
		map.addParam('sysparm_sys_id', urlParams['sysparm_sys_id'] || '');
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

		var _this = this;
		Microsoft.Maps.loadModule('Microsoft.Maps.Search', {
			callback: function() {
				_this.map.addComponent('searchManager', new Microsoft.Maps.Search.SearchManager(_this.map));
				_this.geocoder = _this.map.getComponent('searchManager');
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
	GwtMapMarker.prototype._draw = function() {
		var latlng = new Microsoft.Maps.Location(this.lat, this.lng);
		var pushpinOptions = {
			icon: this.icon,
			width: parseFloat(this.iconWidth),
			height: this.iconHeight,
			text: this.markerLabel,
			visible: true,
			textOffset: new Microsoft.Maps.Point(this.labelOffsetLeft * -1, this.labelOffsetTop * -1)
		};

		if (AUTO_SCALE_HELPER) {
			pushpinOptions.icon = AUTO_SCALE_HELPER.replace('{url}', encodeURIComponent(this.icon)).replace('{width}', this.iconWidth).replace('{height}', this.iconHeight);
		}

		if (!this.lat || !this.lng) {
			return;
		}
		var pushpin = new Microsoft.Maps.Pushpin(latlng, pushpinOptions);

		if (this.html) {
			var _this = this;
			Microsoft.Maps.Events.addHandler(pushpin, 'click', function() {
				if (GwtMapMarker.infowindow && _this.autoClose == 'true') {
					_this.map.map.entities.remove(GwtMapMarker.infowindow);
				}

				infoboxOptions = {
					offset: new Microsoft.Maps.Point(0, 20),
					description: _this.html
				};
				GwtMapMarker.infowindow = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(_this.lat, _this.lng), infoboxOptions);

				_this.map.map.entities.push(GwtMapMarker.infowindow);

				// cm1011_etr is an internal/undocumented variable for Bing Maps to track the DOM structure of the marker.
				// It may be changed by Microsoft without notice. It exists only after you push the marker to the
				// entities array. Sorry, I can't find anything you may use in the documentation so I have to go with
				// undocumented API.
				var height = GwtMapMarker.infowindow.cm1011_etr.descriptionNode.getHeight();
				GwtMapMarker.infowindow.setOptions({
					height: height
				});
			});
		} else {
			Microsoft.Maps.Events.addHandler(pushpin, 'click', this._onClick.bind(this));
		}

		this.map.map.entities.push(pushpin);
	};
	GwtMapMarker.prototype._resolveAddress = function() {
		var request = {
			where: this.address,
			callback: this._onResolveAddress.bind(this)
		};
		this.map.geocoder.geocode(request);
	};
	GwtMapMarker.prototype._onResolveAddress = function(result, userData) {
		var topResult = result.results && result.results[0];
		if (topResult) {
			this.lat = topResult.latitude;
			this.lng = topResult.longitude;
			this._draw();
		}
	};

	loadMap();
})();