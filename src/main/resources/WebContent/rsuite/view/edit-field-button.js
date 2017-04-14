(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.view.EditFieldButton = RSuite.view.Icon.extend({
		modelBinding: 'RSuite.Icon.edit',
		field: null,
		click: function () {
			RSuite.view.LmdFieldEditor
				.create({ model: this.get('field') })
				.dialogShow()
				.done(function () {
					RSuite.model.lmdConfiguration.save();
				});
		}
	});
	
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));