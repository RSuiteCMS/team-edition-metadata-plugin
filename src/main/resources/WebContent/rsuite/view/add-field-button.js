(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.view.AddFieldButton = RSuite.view.Icon.extend({
		modelBinding: 'RSuite.Icon.add',
		click: function () {
			var newField = {};
			
			RSuite.view.LmdFieldEditor
				.create({
					model: newField
				})
				.dialogShow()
				.done(function () {
					RSuite.model.lmdConfiguration.fields.pushObject(newField);
					RSuite.model.lmdConfiguration.save();
				});
		}
	});
	
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));