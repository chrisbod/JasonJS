describe("Iterator object tests", function() {
    var iterator = new JasonIterator()
    it("should iterate through an array giving back a new array", function() {
        var array = [1, 2, 3, 4, 5, 6];
        expect(iterator.iterate(array) === array).toBe(false);
        expect(iterator.iterate(array)).toEqual(array);
    });







});