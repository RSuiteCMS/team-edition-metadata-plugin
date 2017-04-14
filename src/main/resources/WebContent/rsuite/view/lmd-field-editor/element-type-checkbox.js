(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	
	RSuite.view.LmdFieldEditor.ElementTypeCheckbox = RSuite.view.Checkbox.extend({
		model: null,
		elementType: null,
		value: 1,
		checked: Ember.computed(function (name, value) {
			var ok = false,
				type = this.get('elementType'),
				elements = this.get('model.elements'),
				gotIt = (elements || []).find(function (element) {
					return element['local-name'] === type.localName && (element['namespace-uri'] || '') === (type.namespaceUri || '');
				});
			if (arguments.length === 2) {
				if (!elements && value) {
					this.set('model.elements', elements = []);
				}
				if (gotIt && !value) {
					elements.removeObject(gotIt);
				}
				if (!gotIt && value) {
					elements.addObject({
						'local-name': type.localName,
						'namespace-uri': type.namespaceUri
					});
				}
				return value;
			}
			return !!gotIt;
		}).property('model', 'model.elements.@each.localName', 'model.elements.@each.namespaceUri', 'elementType.localName', 'elementType.namespaceUri')
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));
