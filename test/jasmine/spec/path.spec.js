describe("Path object tests", function() {


    function multidimensional() {
        return [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [
                [9],
                [10],
                [11, 12, 13]
            ]
        ];
    }

    function object(name) {
        return {
            name: name
        };
    }

    function array(vals) {
        return [].concat(vals || []);
    }
    var count = 0;

    function nested(level, bool, str, obj, arr, coll) {
        level = level || -1;
        return { //6 properties
            id: "ID" + count++,
            level: level || -1,
            boolean: bool || true,
            string: str || "some level " + level + " string",
            object: obj || object("level" + level + "object"),
            array: arr || array([0, 1, 2, 3, 4, "" + level]),
            collection: coll || []
        }
    }
    var obj1 = nested(1),
        obj2 = nested(2),
        obj3 = nested(2),
        obj4 = nested(3),
        obj5 = nested(3),
        obj6 = nested(4)
        obj6.foo = obj6.array; //adding duplicate
    obj1.collection = [
        obj2,
        obj3
    ]
    obj1.collection[0].collection = [
        obj4,
        obj5
    ]
    obj1.collection[0].collection[0] = obj6;

    //obj6.obj6 = obj6;
    beforeEach(function() {
        testData = {
            number: 1,
            string: "a string",
            boolean: true,
            object: object("a literal object"),
            array: array(),
            true: true,
            false: false,
            multimensional: multidimensional(),
            objects: obj1
        }
    });

    //all,key,keys,expression,function,property,parent
    it("the all method should return all the values in the test data", function() {
        var simple = jason().all().execute({
            monkey: "monkey"
        });
        expect(simple.length).toBe(1);
        var simple = [1, 2, 3, 4, 5, 6]
        var simples = jason().all().execute(simple);
        expect(simples + "").toEqual(simple + "")
        var all = jason().all().execute(obj6);
        expect(all.length).toEqual(14); //1 obj, 7 properties 1 empty array, 1 array with 4 items
    });
    it("the key method should return any item with a given key", function() {
        var keys = jason().key("string").execute(testData);
        expect(keys.length).toBe(6);
        keys = jason().key("id", "string").execute(testData);
        expect(keys.length).toBe(11)

    });
    it("the item method should return only the specified indices", function() {
        var keys = jason().key("id", "string").item(2, 0).execute(testData)
        expect(keys[0]).toBe("some level 1 string")
    });
    it("the slice method works", function() {
        var keys = jason().key("id", "string").slice(0, 3).execute(testData);
        expect(keys.toString()).toEqual(["a string", "ID0", "some level 1 string"].toString());
        // console.log(keys.slice(0, 3))

    });
    it("the splice method works", function() {
        var first = jason().key("id", "string").execute(testData).slice(0, 3),
            keys = jason().key("id", "string").splice(0, 3).execute(testData);
        expect(keys.toString()).toEqual(first.toString());
        // console.log(keys.slice(0, 3))
    });
    it("the concat method works", function() {
        var first = jason().key("id", "string").execute(testData).concat(0, 3, [4]),
            keys = jason().key("id", "string").concat(0, 3, [4]).execute(testData);
        expect(keys.toString()).toEqual(first.toString());
        // console.log(keys.slice(0, 3))
    });
    it("the sort method works", function() {
        var first = jason().key("id", "string").execute(testData).sort(),
            keys = jason().key("id", "string").sort().execute(testData);
        expect(keys.toString()).toEqual(first.toString());
        // console.log(keys.slice(0, 3))
    });
    it("the reverse method works", function() {
        var first = jason().key("id", "string").execute(testData).reverse(),
            keys = jason().key("id", "string").reverse().execute(testData);
        expect(keys.toString()).toEqual(first.toString());
        // console.log(keys.slice(0, 3))
    });
    it("the all method should support a specified number of levels", function() {
        var test = ["a", "b", "c", 3, 4, [5, 6, [7, 8]]];
        // console.log(jason().all(1).execute(test));
    });
    it("can return objects with specified properties", function() {
        var test = [{
            foo: true
        }, {
            foo: []
        }, {
            child: {
                foo: {}
            }
        }, {
            nofoo: true,
            anotherFoo: {
                foo: true
            }

        }];
        expect(jason().property("foo").execute(test).length).toBe(4);


    })





});