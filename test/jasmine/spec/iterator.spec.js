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
    });
    it("given a 'fake' collection it should only enumerate indices unless it is an object literal", function() {
        var fakeLiteral = {
            0: 1,
            1: 2,
            length: 2,
        };

        function Collection() {}
        var coll = new Collection()
        coll.length = 2
        coll[0] = "coll";
        coll[1] = "ection";

        expect(iterator.iterate(fakeLiteral)).toEqual([1, 2, 2]);
        expect(iterator.iterate(coll)).toEqual(["coll", "ection"])
        //console.log(iterator.iterate(document.documentElement.childNodes))
    });
    it("will ignore repeated values (objects)", function() {
        var foo = {
            a: 1,
            b: [1, 2, 3]
        }
        foo.c = foo.b
        expect(iterator.iterate(foo)).toEqual([1, [1, 2, 3], 1, 2, 3]);

    });
    it("should handle recursion", function() {
        console.log(iterator.iterate(document.createElement("div"), function(value) {
            return value !== null && typeof value == "object" && value != document && value != window;
        }))
    })
    it("should know if something is environmental", function() {
        function Foo() {}
        var f = new Foo();
        expect(iterator.isEnvironmental(document)).toBe(true);
        expect(iterator.isEnvironmental(window)).toBe(true);
        expect(iterator.isEnvironmental(null)).toBe(false);
        expect(iterator.isEnvironmental(new Number())).toBe(false);
        expect(iterator.isEnvironmental({})).toBe(false);
        expect(iterator.isEnvironmental(f)).toBe(false);
    });
    it("should not iterate environmental objects by default", function() {
        console.log(iterator.iterate(document))
    })






});