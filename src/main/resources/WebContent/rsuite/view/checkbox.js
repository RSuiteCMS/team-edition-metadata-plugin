(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.view.Checkbox = Ember.View.extend({
		tagName: 'input',
		type: 'checkbox',
		attributeBindings: [ "disabled", "tabindex", "type", "value", "name", "checked" ],
		change: function () {
			this.set('checked', !this.get('checked'));
		}
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));