(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.view.LmdFieldEditor.ContainerTypeLabel = Ember.View.extend({
		tagName: 'label',
		containerType: null,
		layout: Ember.Handlebars.compile('{{yield}}{{view.containerType.label}}'),
		attributeBindings: [ 'for' ],
		'for': null,
		didInsertElement: function () {
			this.set('for', ((this.get('childViews') || []).find(function (view) {
				return view.get('tagName') === 'input';
			}) || {})[Ember.GUID_KEY]);
		}
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));
