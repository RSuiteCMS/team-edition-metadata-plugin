(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.model.session.done(function () {
		RSuite.model.lmdConfiguration = RSuite.model.LmdConfiguration.create();
		RSuite.model.elementTypes = RSuite.model.ElementTypes.create();
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));