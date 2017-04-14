(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.createClass("RSuite.model.ElementType", {}, function (Self, log) {
		Self.reopen({
			localName: null,
			namespaceUri: null,
			prefix: null,
			label: Ember.computed(function () {
				var ln = this.get('localName'),
					ns = this.get('namespaceUri'),
					pr = this.get('prefix');
				if (pr) {
					return pr + ':' + ln;
				}
				if (ns) {
					return '{' + ns + '}:' + ln;
				}
				return ln;
			}).property('localName', 'namespaceUri', 'prefix'),
			id: Ember.computed(function () {
				return 'elementType-' + (this.get('namespaceUri') || '').replace(/\W+/g, '_') + '-' + this.get('localName');
			}).property('localName', 'namespaceUri')
		});
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));