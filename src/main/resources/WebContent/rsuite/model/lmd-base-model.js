(function (global, RSuite, Ember, $, pluginId) {
	"use strict";
	RSuite.createMixin("RSuite.model.LmdBaseModel", function (Self, log) {
		Self.reopen({
			init: function () {
				var inst = this;
				RSuite.model.session.done(function () {
					inst.load();
				});
			},
			lastFlight: RSuite.failure(),
			flight: null,
			load: function () {
				var inst = this;
				if (this.flight) {
					return this.flight;
				}
				this.flight = new $.Deferred();
				this.request().done(function (response) {
					inst.fromResponse(response);
					inst.flight.resolveWith(inst);
				}).fail(function () {
					inst.flight.rejectWith(inst);
				}).always(function () {
					inst.lastFlight = inst.flight;
					inst.flight = null;
				});
				return this.flight;
			},
			done: function (fn) {
				if (this.flight) {
					this.flight.done(fn);
				} else if (this.lastFlight) {
					this.lastFlight.done(fn);
				}
			},
			fail: function (fn) {
				if (this.flight) {
					this.flight.fail(fn);
				} else if (this.lastFlight) {
					this.lastFlight.fail(fn);
				}
			},
			always: function (fn) {
				if (this.flight) {
					this.flight.always(fn);
				} else if (this.lastFlight) {
					this.lastFlight.always(fn);
				}
			},
			fromElement: function () { 
				throw new Error("Unimplemented");
			},
			toElement: function () {
				throw new Error("Unimplemented");
			}
		});
	});

}(this, this.RSuite, this.Ember, this.jQuery, "@pluginId@"));