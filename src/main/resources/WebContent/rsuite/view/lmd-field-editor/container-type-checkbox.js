(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.view.LmdFieldEditor.ContainerTypeCheckbox = RSuite.view.Checkbox.extend({
		model: null,
		containerType: null,
		value: 1,
		checked: Ember.computed(function (name, value) {
			var types = this.get('model.containerTypes') || [],
				ctName = this.get('containerType.name');
			if (arguments.length === 2) {
				if (value) {
					types.addObject(ctName);
				} else {
					types.removeObject(ctName);
				}
			}
			return types.contains(ctName);
		}).property('model.containerTypes.@each', 'containerType.name')
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));