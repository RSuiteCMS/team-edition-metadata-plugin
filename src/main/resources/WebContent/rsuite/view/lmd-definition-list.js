(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.createClass("RSuite.view.LmdDefinitionList", { extend: RSuite.View }, function (Self, log) {
		Self.reopen({
			classNames: 'lmd-definition-list',
			title: "Managed metadata fields",
			templateName: RSuite.url(pluginId, "rsuite/view/lmd-definition-list.hbr"),
			modelBinding: "RSuite.model.lmdConfiguration.fields",
			cancelClick: function () {
				console.log('hey');
				return false;
			}
		});
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));