(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.createClass("RSuite.model.ElementTypes", { extend: Ember.ArrayProxy }, function (Self, log) {
		Self.reopen(RSuite.model.LmdBaseModel);
		Self.reopen({
			request: function () {
				return RSuite.services({
					version: 1,
					service: 'api/' + pluginId + '.ElementTypes'
				});
			},
			fromResponse: function (response) {
				this.set('content', response.map(function (element) {
					return RSuite.model.ElementType.create(element);
				}));
			}
		});
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));