(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.view.Input = Ember.TextField.extend({
		attributeBindings: 'name'
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));