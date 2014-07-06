describe("Iterator object tests", function() {
    var iterator = new JasonIterator()
    it("should iterate through an array giving back a new array", function() {
        var array = [1, 2, 3, 4, 5, 6];
        expect(iterator.iterate(array) === array).toBe(false);
        expect(iterator.iterate(array)).toEqual(array);
    });
    it("should iterate through an simple object giving back an array of it's properties", function() {
        var obj = {
            a: 1,
            b: 2,
            c: 3
        },
            arr = [1, 2, 3];
        expect(iterator.iterate(obj)).toEqual(arr);
    });
    it("should iterate through a complex object giving back an array of it's properties and it's properties properties", function() {
        var obj = {
            a: 1,
            b: 2,
            c: 3,
            d: [0, 1],
            e: {}
        },
            arr = [1, 2, 3, [0, 1], 0, 1, {}];
        expect(iterator.iterate(obj)).toEqual(arr);
    });
    it("should be able to iterate to a specified level", function() {
        var obj = {
            a: 1,
            b: 2,
            c: 3,
            d: [0, 1],
            e: {
                foo: true
            }
        },
            arr = [1, 2, 3, [0, 1], {
                foo: true
            }];
        expect(iterator.iterate(obj, function() {
            return true
        }, 1)).toEqual(arr);
        expect(iterator.iterate(obj, null, 4)).toEqual(iterator.iterate(obj))
    })
    it("should be able to iterate to a specified number of results", function() {
        var obj = {
            a: 1,
            b: 2,
            c: 3,
            d: [0, 1],
            e: {
                foo: true
            }
        },
            arr = [1, 2, 3, [0, 1], {
                foo: true
            }];
        expect(iterator.iterate(obj, function() {
            return true
        }, 1)).toEqual(arr);
        expect(iterator.iterate(obj, null, 4, 2)).toEqual([1, 2])
    })







});