/*! RESOURCE: /scripts/classes/GwtMapMarker.js */
var GwtMapMarker = Class.create(GwtObservable, {
	initialize: function(map) {
		this.map = map;
	},
	destroy: function() {
		this.map = null;
	},
	fromXML: function(xml) {
		this.name = this.map._getAttribute(xml, 'name');
		this.address = this.map._getAttribute(xml, 'address');
		this.lat = this.map._getAttribute(xml, 'latitude');
		this.lng = this.map._getAttribute(xml, 'longitude');
		this.icon = this.map._getAttribute(xml, 'icon', "https://maps.google.com/mapfiles/marker.png");
		this.table = this.map._getAttribute(xml, 'table');
		this.sysId = this.map._getAttribute(xml, 'sys_id');
		this.dialogTitle = this.map._getAttribute(xml, 'dialog_title');
		this.html = this.map._getAttribute(xml, 'html');
		this.iconWidth = this.map._getAttribute(xml, 'icon_width', "32");
		this.iconHeight = this.map._getAttribute(xml, 'icon_height', "32");
		this.markerLabel = this.map._getAttribute(xml, 'marker_label');
		this.labelOffsetLeft = parseInt(this.map._getAttribute(xml, 'label_offset_left', "0"));
		this.labelOffsetTop = parseInt(this.map._getAttribute(xml, 'label_offset_top', "0"));
		this.view = this.map._getAttribute(xml, 'view');
		this.autoClose = this.map.params['sysparm_auto_close'];
	},
	draw: function() {
		if (this.lat && this.lng)
			this._draw();
	},
	_draw: function() {
		var latlng = new google.maps.LatLng(this.lat, this.lng);
		var iconValue = {
			url: this.icon,
			origin: null,
			anchor: null,
			scaledSize: new google.maps.Size(parseFloat(this.iconWidth), parseFloat(this.iconHeight)),
			size: new google.maps.Size(parseFloat(this.iconWidth), parseFloat(this.iconHeight))
		};
		var markerOptions = {
			position: latlng,
			icon: iconValue,
			labelContent: this.markerLabel,
			labelClass: "map_label",
			labelAnchor: new google.maps.Point(this.labelOffsetLeft * -1, this.labelOffsetTop * -1),
			map: this.map.map
		};
		if (!this.lat || !this.lng) {
			return;
		}
		this.marker = new google.maps.Marker(markerOptions);
		if (this.html) {
			var _this = this;
			google.maps.event.addListener(this.marker, 'click', function() {
				if (GwtMapMarker.infowindow && _this.autoClose == 'true')
					GwtMapMarker.infowindow.close();
				GwtMapMarker.infowindow = new google.maps.InfoWindow({
					content: _this.html
				});
				GwtMapMarker.infowindow.open(this.map, this);
			});
		} else {
			google.maps.event.addListener(this.marker, 'click', this._onClick.bind(this));
		}
		this.marker.setMap(this.map.map);
	},
	_resolveAddress: function() {
		this.map.geocoder.getLatLng(this.address, this._onResolveAddress.bind(this));
	},
	_onResolveAddress: function(point) {
		if (!point) {
			return;
		}
		this.lat = point.y;
		this.lng = point.x;
		this._draw();
	},
	_onClick: function() {
		if (this.table && this.sysId) {
			var dialog = new GlideDialogForm(this.dialogTitle, this.table);
			dialog.setDialogWidth(900);
			dialog.setSysID(this.sysId);
			if (this.view && this.view != "")
				dialog.addParm('sysparm_view', this.view);
			dialog.render();
		}
	},
	type: 'GwtMapMarker'
});
GwtMapMarker.infowindow = null;;