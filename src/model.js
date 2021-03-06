(function(scope, JsModel, jsModelPrototype) {
	var member,
		prototype = JsModel.prototype;
	for (member in jsModelPrototype) {
		prototype[member] = jsModelPrototype[member];
	}
	scope.JsModel = JsModel;
})(
	this,
	function JsModel(value) {
		this.set(value);
	}, {
		_$value: undefined,
		get: function jsModel_get() {
			return this._$value;
		},
		set: function jsModel_set(value) {
			this._$value = value;
		},
		toJSON: function jsModel_toJSON() {
			return this.get();
		},
		valueOf: function () {
			return this._$value;
		}
	}
);