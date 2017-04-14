(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.model.LmdConfiguration.Form = Ember.Object.extend({
		fromElement: function (form) {
			this.setProperties($(form).attr(false));
			this.set('params', $(form).children('lmd-param').map(function () {
				return RSuite.model.LmdConfiguration.FormParam.create().fromElement(this);
			}).toArray());
			return this;
		},
		toElement: function () {
			var ret = $('<' + this.get('type') + '>')
				.attr({
					name: this.get('name'),
					label: this.get('label') || '',
					description: this.get('description') || '',
					instructions: this.get('instructions') || '',
					roles: this.get('roles') || '',
					icon: this.get('icon') || ''
				});
			ret.append(this.get('params').map(function (param) {
				return param.toElement();
			}));
			return ret.get(0);
		},
		type: 'form',
		name: null,
		label: '',
		description: '',
		instructions: '',
		roles: null,
		icon: null,
		params: null
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));