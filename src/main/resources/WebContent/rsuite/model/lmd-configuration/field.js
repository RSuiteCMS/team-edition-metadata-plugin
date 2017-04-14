(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.model.LmdConfiguration.Field = Ember.Object.extend({
		fromElement: function (lmdField) {
			lmdField = $(lmdField);
			this.setProperties(Object.camelizeKeys(lmdField.attr(false)));
			if (lmdField.find('options').length) {
				this.set('options', lmdField.find('options>option').map(function () {
					return $(this).attr(false);
				}).toArray());
			} else {
				this.set('options', null);
			}
			var appliesTo = lmdField.find('applies-to'),
				containers = appliesTo.find('containers'),
				files = appliesTo.find('files');
			this.set('elements', appliesTo.find('elements').map(function () {
				return $(this).attr(false);
			}).toArray());
			this.set('containers', !!containers.length);
			if (containers.length) {
				containers = containers.map(function () {
					return $(this).attr('type');
				}).toArray();
				if (containers.length) {
					this.set('containerTypes', containers);
				}
			}
			this.set('files', !!files.length);
			if (files.length) {
				files = files.map(function () {
					return $(this).attr('extension');
				}).toArray();
				if (files.length) {
					this.set('fileExtensions', files);
				}
			}
			return this;
		},
		toElement: function () {
			var ret = $('<lmd-field>')
				.attr({
					name: this.get('name'),
					label: this.get('label') || '',
					description: this.get('description') || '',
					contextual: this.get('contextual') ? 'true' : 'false',
					versioned: this.get('versioned') ? 'true' : 'false',
					'allow-multiple': this.get('allowMultiple') ? 'true' : 'false',
					'control-type': this.get('controlType')
				})
				.get(0),
				options, applies;
			if (this.get('options')) {
				options = $('<options>').appendTo(ret);
				this.get('options').forEach(function (option) {
					options.append($('<option />').attr(option));
				});
			}
			if (this.get('files') || this.get('elements.length') || this.get('containers')) {
				applies = $('<applies-to>').appendTo(ret);
				if (this.get('files') || this.get('fileExtensions.length')) {
					if (this.get('fileExtensions.length')) {
						this.get('fileExtensions').forEach(function (item) {
							applies.append($('<files />').attr('extension', item));
						});
					} else {
						applies.append($('<files />'));
					}
				}
				this.get('elements').forEach(function (elem) {
					applies.append($('<elements />').attr(elem));
				});
				if (this.get('containers') || this.get('containerTypes.length')) {
					if (this.get('containerTypes.length')) {
						this.get('containerTypes').forEach(function (container) {
							applies.append($('<containers />').attr('type', container));
						});
					} else {
						applies.append($('<containers />'));
					}
				}
			}
			return ret;
		},
		toXml: function () {
			return $('<div>').append(this.toElement()).html();
		},
		files: false,
		fileExtensions: null,
		containers: false,
		containerTypes: null,
		elements: null,
		options: null,
		name: null,
		label: '',
		description: '',
		contextual: true,
		versioned: false,
		allowMultiple: false,
		controlType: 'text'
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));