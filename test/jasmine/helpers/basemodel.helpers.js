function baseModelTest(value, model) {

	it("returns the same value as given", function() {
		expect(model.get()).toEqual(value);
	});
	it("serializes to the same json", function() {
		expect(JSON.stringify(model)).toEqual(JSON.stringify(value));
	});
	it("will return the same toString as its value", function() {
		expect("" + model).toEqual("" + value);
	});
	it("will return the same valueOf as its value", function() {
		var valueOf = "valueOf" in value ? value.valueOf() : value;
		expect(valueOf).toEqual(model.valueOf());
	});

}

function genericModelTest(value, model) {
	it("will have the same named properties as it's value", function() {
		for (var i in value) {
			expect(i in model, i).toBe(true);
		}
	});
	it("will return the true values of its members", function() {
		for (var i in value) {
			expect(model[i].get()).toEqual(value[i]);

		}
	});
}