(function (JsModel, JsNumberModel, JsNumberModelPrototype) {
	JsNumberModel.prototype = new Number(0);
	var prototype = JsNumberModel.prototype,
		member;
	prototype.BaseModel = JsModel;
	for (member in JsModel.prototype) {
		prototype[member] = JsModel.prototype[member];
	}
	for (member in JsNumberModelPrototype) {
		prototype[member] = JsNumberModelPrototype[member];
	}
	JsModel.Number = JsNumberModel;
})(
	this.JsModel,
	function JsNumberModel(value) {
		this.set(value);
	},
	{
		valueOf: function () {
			return this._$value;
		}
	}
);