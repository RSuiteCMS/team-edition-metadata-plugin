(function (global, RSuite, Ember, $, pluginId) {
	"use strict";

	RSuite.createClass("RSuite.view.LmdFieldEditor", { extend: RSuite.View }, function (Self, log) {
		Self.reopen(RSuite.view.Dialog);
		Self.reopen({
			classNames: 'lmd-field-edit',
			title: Ember.computed(function () {
				return "Editing LMD Field: " + this.get('modelCopy.name');
			}).property('modelCopy.name'),
			templateName: RSuite.url(pluginId, "rsuite/view/lmd-field-editor.hbr"),
			model: null,
			modelCopy: Ember.computed(function () {
				return Object.resolve(this.get('model'));
			}).property('model'),
			useOptions: Ember.computed(function (name, value) {
				if (arguments.length === 2) {
					this.set('modelCopy.options', value ? (this.get('model.options') || []) : null);
				}
				return !!this.get('modelCopy.options');
			}).property('modelCopy.options'),
			allContainers: Ember.computed(function (name, value) {
				if (arguments.length === 2) {
					this.set('modelCopy.containerTypes', value ? [] : (this.get('model.containerTypes') || []));
					this.set('modelCopy.containers', value ? true : this.get('model.containerTypes.length'));
				}
				return this.get('modelCopy.containers') && !this.get('modelCopy.containerTypes.length');
			}).property('modelCopy.containers', 'modelCopy.containerTypes'),
			allContainersId: Ember.computed(function () {
				return "all-containers-" + RSuite.randomId();
			}),
			systemContainerTypesBinding: 'RSuite.model.caTypeCatalogue',
			elementTypesBinding: 'RSuite.model.elementTypes',
			deleteOption: function (e) {
				if (e.context) {
					(this.get('modelCopy.options') || []).removeObject(e.context);
				}
			},
			addOption: function () {
				if (!this.get('newOptionValue')) { return; }

				var opt = this.get('modelCopy.options');
				if (!opt) {
					this.set('modelCopy.options', opt = []);
				}
				opt.pushObject({
					value: this.get('newOptionValue'),
					label: this.get('newOptionLabel') || this.get('newOptionValue')
				});
				this.set('newOptionValue', '');
				this.set('newOptionLabel', '');
			},
			allFiles: Ember.computed(function (name, value) {
				if (arguments.length === 2) {
					this.set('modelCopy.files', value ? true : !!this.get('model.fileExtensions.length'));
					this.set('modelCopy.fileExtensions', value ? [] : this.get('model.fileExtensions'));
				}
				return this.get('modelCopy.files') && !this.get('modelCopy.fileExtensions.length');
			}).property('modelCopy.files', 'modelCopy.fileExtensions'),
			allFilesId: Ember.computed(function () {
				return "all-files-" + RSuite.randomId();
			}),
			deleteFileExtension: function (e) {

				(this.get('modelCopy.fileExtensions') || []).removeObject(e.context);
			},
			newFileExtension: null,
			addFileExtension: function () {
				var newExt = this.get('newFileExtension'),
					ext = this.get('modelCopy.fileExtensions');
				if (!newExt) { return; }
				if (!ext) {
					this.set('modelCopy.fileExtensions', ext = (this.get('model.fileExtensions') || []).slice());
					this.set('files', true);
				}
				ext.addObject(newExt);
				this.set('newFileExtension', '');
			},
			init: function () {
				this._super();
				var inst = this;
				this.done(function () {
					inst.addFileExtension();
					inst.addOption();
					Ember.setProperties(inst.get('model'), inst.get('modelCopy'));
					this.dialogClose();
				});
				this.fail(function () {
					this.dialogClose();
				});
			},
			dialogOptions: {
				modal: true,
				buttons: [
					RSuite.view.DialogButton.commit({
						action: 'commit',
						text: "Save",
					}),
					RSuite.view.DialogButton.cancel({
						action: 'cancel',
						text: "Close"
					})
				]
			},
			validate: function () {
				var name = this.get('modelCopy.name');
				if (!name) {
					this.set('validationNameError', "You must enter a name");
					return RSuite.failure;
				} else {
					var nameMap = {};
					RSuite.model.lmdConfiguration.fields.forEach(function (item) {
						nameMap[Ember.get(item, 'name')] = item;
					});
					if (nameMap[name] && nameMap[name] !== this.get('model')) {
						this.set('validationNameError', "Name must be unique");
						return RSuite.failure;
					}
					return RSuite.success;
				}
			},
			validationNameError: false

		});
	});
}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));