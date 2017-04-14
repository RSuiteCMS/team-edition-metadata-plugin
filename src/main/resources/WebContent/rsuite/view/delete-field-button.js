(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.view.DeleteFieldButton = RSuite.view.Icon.extend({
		modelBinding: 'RSuite.Icon.delete',
		field: null,
		click: function () {
			var field = this.get('field');
			RSuite.confirm(
				"Deleting an LMD field",
				"Are you absolutely sure you want to delete this field?  You can not undo this.",
				"Delete",
				"Cancel"
			).done(function () {
				RSuite.model.lmdConfiguration.fields.removeObject(field);
				RSuite.model.lmdConfiguration.save();
			});
		}
	});
	
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));