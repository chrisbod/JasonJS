describe("Base Model (JsModel)", function () {
	//this will be abstracted to a helper function to be run on every Model implementation
	var object,
		model;
	beforeEach(function () {
		object = {
			string: "string",
			number: 0,
			array: [0,"one",{}],
			object: {property:"I am an object"},
			null: null,
			boolean: true,
			undefined: undefined
		}
		model = new JsModel(object);
	});
	it("returns the same value as given", function () {
		expect(model.get()).toEqual(object);
	});
	it("serializes to the same json", function () {
		expect(JSON.stringify(model)).toEqual(JSON.stringify(object));
	});
	/*it("will have the same named properties as it's value", function () {
		for (var i in object) {
			expect(i in model,i).toBe(true);
		}
	});*/
	it("will return the same toString as its value", function () {
		expect(""+model).toEqual(""+object)
	});
	it("will return the same valueOf as its value", function () {
		var valueOf = "valueOf" in object ? object.valueOf : object;
		expect(valueOf).toEqual(model.valueOf);
	});
	/*
	it("will return the true values of its members", function () {
		expect(model.string.get()).toEqual(object.string);
		expect(model.number.get()).toEqual(object.number);
		expect(model.array.get()).toEqual(object.array);
		expect(model.object.get()).toEqual(object.object);
	})*/

});