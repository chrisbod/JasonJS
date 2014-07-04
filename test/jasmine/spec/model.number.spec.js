describe("NumberModel tests", function () {
	baseModelTest(1, new JsModel.Number(1));
	var num = new JsModel.Number(2),
		zero = new JsModel.Number(0)
	it("can be added and subtracted", function () {
		expect(num + 1).toEqual(3);
	})
	it("can be compared", function () {
		expect(num==2).toBe(true);
	});
	zero.valueOf = function () {
		console.log("valueOf")
	}
	console.log(!zero)

});