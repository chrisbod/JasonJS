describe("Base Model (JsModel)", function() {
	//this will be abstracted to a helper function to be run on every Model implementation
	var object = {
		string: "string",
		number: 0,
		array: [0, "one", {}],
		object: {
			property: "I am an object"
		},
		null: null,
		boolean: true,
		undefined: undefined
	},
		model = new JsModel(object);
		
	baseModelTest(object, model)

});