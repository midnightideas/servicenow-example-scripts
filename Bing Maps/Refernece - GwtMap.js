/*! RESOURCE: /scripts/classes/GwtMap.js */
var GwtMap = Class.create(GwtObservable, {
	needTranslations: [],
	initialize: function(elementName, processor) {
		this.elementName = elementName;
		this.processor = processor;
		this.translations = {};
		if (this.needTranslations.length > 0)
			this.translations = new GwtMessages().getMessages(needTranslations);
		this.options = {};
		this.options["mapControl"] = "large";
		this.options["mapTypeControl"] = "buttons";
		this.options["mapOverview"] = false;
		this.options["mapType"] = "satellite";
		this.options["mapCenterLat"] = "";
		this.options["mapCenterLng"] = "";
		this.options["mapZoom"] = "4";
		this.params = {};
		this.geocoder = new google.maps.Geocoder();
		Event.observe(window, "unload", this._onUnload.bind(this));
	},
	destroy: function() {},
	setCenter: function(lat, lng) {
		this.options["mapCenterLat"] = lat;
		this.options["mapCenterLng"] = lng;
	},
	setZoom: function(zoom) {
		this.options["mapZoom"] = zoom;
	},
	draw: function(params) {
		this._draw(params, true);
	},
	redraw: function(params) {
		this._draw(params, false);
	},
	center: function(lat, lng, zoom) {
		if (lat && lng) {
			this.options["mapCenterLat"] = lat;
			this.options["mapCenterLng"] = lng;
		}
		if (zoom)
			this.options["mapZoom"] = zoom;
		if (this.options["mapCenterLat"] && this.options["mapCenterLng"]) {
			var zoom = parseInt(this.options["mapZoom"], 10);
			if (!isNaN(zoom))
				this.map.setCenter(new google.maps.LatLng(this.options["mapCenterLat"], this.options["mapCenterLng"]), zoom);
			else
				this.map.setCenter(new google.maps.LatLng(this.options["mapCenterLat"], this.options["mapCenterLng"]));
		}
	},
	setProcessor: function(processor) {
		this.processor = processor;
	},
	addParam: function(name, value) {
		this.params[name] = value;
	},
	addOverlay: function(overlay) {
		this.map.addOverlay(overlay);
	},
	_draw: function(params, drawAll) {
		if (!this.processor) {
			alert('processor must be set before calling draw or redraw');
			return;
		}
		var ajax = new GlideAjax(this.processor);
		ajax.addParam('sysparm_type', 'getMarkers');
		for (n in this.params)
			ajax.addParam(n, this.params[n]);
		ajax.getXML(this._drawResponse.bind(this, drawAll), params);
	},
	_drawResponse: function(drawAll, response) {
		if (!response || !response.responseXML)
			return;
		if (drawAll)
			this._drawMap(response);
		else
			this.map.clearOverlays();
		this._drawMarkers(response);
	},
	_drawMap: function(response) {
		this._onUnload();
		var xml = response.responseXML;
		var mapControl = google.maps.ZoomControlStyle.DEFAULT;
		var mapTypeControl = google.maps.MapTypeControlStyle.DEFAULT;
		var overviewMapControl = false;
		var mapTypeId = google.maps.MapTypeId.HYBRID;
		this._setOptions(xml);
		if (this.options.mapControl == 'large') {
			mapControl = google.maps.ZoomControlStyle.LARGE;
		} else if (this.options.mapControl == 'small') {
			mapControl = google.maps.ZoomControlStyle.SMALL;
		}
		if (this.options.mapTypeControl == 'buttons') {
			mapTypeControl = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
		} else if (this.options.mapTypeControl == 'menu') {
			mapTypeControl = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
		}
		if (this.options.mapOverview === true || this.options.mapOverview === "true") {
			overviewMapControl = true;
		}
		if (this.options.mapType == 'satellite') {
			mapTypeId = google.maps.MapTypeId.SATELLITE;
		} else if (this.options.mapType == 'terrain') {
			mapTypeId = google.maps.MapTypeId.TERRAIN;
		} else if (this.options.mapType == 'hybrid') {
			mapTypeId = google.maps.MapTypeId.HYBRID;
		} else {
			mapTypeId = google.maps.MapTypeId.ROADMAP;
		}
		var mapOptions = {
			center: new google.maps.LatLng(this.options["mapCenterLat"], this.options["mapCenterLng"]),
			zoom: parseInt(this.options["mapZoom"], 10),
			zoomControl: true,
			zoomControlOptions: {
				style: mapControl
			},
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: mapTypeControl
			},
			overviewMapControl: overviewMapControl,
			mapTypeId: mapTypeId
		};
		this.map = new google.maps.Map(gel(this.elementName),
			mapOptions);
		this.center();
	},
	_drawMarkers: function(response) {
		var xml = response.responseXML;
		var items = xml.getElementsByTagName("item");
		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			this._createMarker(item);
		}
	},
	_createMarker: function(xml) {
		var marker = new GwtMapMarker(this);
		marker.fromXML(xml);
		marker.draw();
	},
	_setOptions: function(xml) {
		var options = xml.getElementsByTagName("options");
		if (!options || options.length == 0)
			return;
		var options = options[0];
		this._setOption(options, "mapControl");
		this._setOption(options, "mapTypeControl");
		this._setOption(options, "mapOverview");
		this._setOption(options, "mapType");
		this._setOption(options, "mapCenterLat");
		this._setOption(options, "mapCenterLng");
		this._setOption(options, "mapZoom");
	},
	_setOption: function(options, name) {
		var value = this._getAttribute(options, name);
		if (value)
			this.options[name] = value;
	},
	_getAttribute: function(e, n, v) {
		if (!v)
			v = null;
		var a = e.attributes.getNamedItem(n);
		if (a)
			return a.value;
		else
			return v;
	},
	_onUnload: function() {},
	type: 'GwtMap'
});;