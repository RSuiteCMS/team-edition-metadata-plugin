(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.createClass("RSuite.model.LmdConfiguration", {}, function (Self, log) {
		Self.reopen(RSuite.model.LmdBaseModel);
		Self.reopen({
			request: function () {
				return RSuite.services({
					version: 1,
					service: 'api/' + pluginId + '.LmdConfig'
				});
			},
			fromResponse: function (response) {
				this.fromElement($(response.documentElement));
			},
			fromElement: function (lmdConf) {
				this.set('fields', lmdConf.find('lmd-field').map(function () {
					return RSuite.model.LmdConfiguration.Field.create().fromElement(this);
				}).toArray());
				this.set('editForms', lmdConf.find('lmd-edit').map(function () {
					return RSuite.model.LmdConfiguration.EditForm.create().fromElement(this);
				}).toArray());
				this.set('searchForms', lmdConf.find('lmd-search').map(function () {
					return RSuite.model.LmdConfiguration.SearchForm.create().fromElement(this);
				}).toArray());
			},
			toElement: function () {
				return $('<lmd-configuration />').append(
					(this.get('fields') || [])
						.map(function (field) {
							return field.toElement();
						}),
					(this.get('editForms') || [])
						.map(function (form) {
							return form.toElement();
						}),
					(this.get('searchForms') || [])
						.map(function (form) {
							return form.toElement();
						})
				);
			},
			save: function () {
				return RSuite.services({
					version: 1,
					type: 'post',
					service: 'api/' + pluginId + '.LmdConfig',
					data: [
						{ name: 'config', value: $('<div>').append(this.toElement()).html() }
					]
				});
			}
		});
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));