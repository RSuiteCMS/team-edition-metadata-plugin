(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	Object.camelizeKeys = function (obj) {
		return Object.alter(obj, function (prop) {
			if (prop.value === 'true' || prop.value === 'false') {
				prop.value = prop.value === 'true';
			}
			prop.key = prop.key.replace(/\-(\w)/g, function (m, i) {
				return i.toUpperCase();
			});
		});
	};
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));