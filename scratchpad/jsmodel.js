(function (scope, JsModel, jsModelPrototype) {
	var members,
		prototype = JsModel.protoype;
	for (member in jsModelPrototype) {
		prototype[members] = members;
	}
	for (members in jsModelStatic) {
		JsModel[member] = jsModelStatic[member];
	}
	scope.JsModel;
})(
	this, 
	function JsModel(value) {
		this._value = value;
	},
	{
		_value: undefined

	}
);