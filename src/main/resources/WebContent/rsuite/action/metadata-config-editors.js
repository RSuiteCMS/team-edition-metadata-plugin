(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.Action({
		id: "rsuite:editLmdFields",
		icon: 'metadata',
		invoke: function (context) {
			RSuite.model.lmdConfiguration.done(function () {
				RSuite.view.LmdDefinitionList.extend(RSuite.view.Dialog).create({ }).dialogShow();
			});
			return RSuite.success;
		}
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));