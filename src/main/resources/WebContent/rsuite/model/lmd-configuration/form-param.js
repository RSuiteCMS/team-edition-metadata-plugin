(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.model.LmdConfiguration.FormParam = Ember.Object.extend({
		fromElement: function (param) {
			this.setProperties(Object.camelizeKeys($(param).attr(false)));
			return this;
		},
		toElement: function (param) {
			return $('<lmd-param>')
				.attr({
					'allow-multiple': this.get('allowMultiple'),
					'control-type': this.get('controlType'),
					ref: this.get('field.name')
				});
		},
		field: Ember.computed(function () {
			var ref = this.get('ref');
			if (!ref) { return null; }
			return RSuite.model.lmdConfiguration.get('fields').find(function (field) {
				return field.get('name') === ref;
			});
		}).property('ref', 'RSuite.model.lmdConfiguration.field.@each.name'),
		ref: null,
		allowMultiple: false,
		controlType: false
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));