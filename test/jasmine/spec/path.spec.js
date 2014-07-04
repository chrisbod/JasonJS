describe("Path object tests", function () {


	function multidimensional() {
		return [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[
				[9],
				[10],
				[11,12,13]
			]
		];
	}
	function object(name) {
		return {name: name};
	}
	function array(vals) {
		return [].concat(vals||[]);
	}
	var count = 0;
	function nested(level,bool,str,obj,arr,coll){
		level = level || -1;
		return {//6 properties
			id: "ID"+count++,
			level: level || -1,
			boolean: bool || true,
			string: str || "some level "+level+" string",
			object: obj || object("level"+level+"object"),
			array: arr || array([0,1,2,3,4,""+level]),
			collection: coll ||[]
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
	beforeEach(function () {
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


	it("detects primitives correctly", function () {
		var path = jason();
		expect(path.isPrimitive({})).toBe(false);
		expect(path.isPrimitive([])).toBe(false);
		expect(path.isPrimitive(null)).toBe(true);
		expect(path.isPrimitive(void 0)).toBe(true);
		expect(path.isPrimitive(1)).toBe(true);
		expect(path.isPrimitive(2)).toBe(true);
		expect(path.isPrimitive(new Number(0))).toBe(false);
		expect(path.isPrimitive(new Boolean(true))).toBe(false);

	});
	it("detects literal objects correctly", function () {
		


		var path = jason();
		expect(path.isNative(1)).toBe(true);
		expect(path.isNative("foo")).toBe(true);
		expect(path.isNative(null)).toBe(true);
		expect(path.isNative(void 0)).toBe(true);
		expect(path.isNative({moo:1})).toBe(true);
		expect(path.isNative([1])).toBe(true);
		expect(path.isNative(function Zoo(){})).toBe(true)

		function Arr() {}
		Arr.prototype = [];

		function Obj() {}


		expect(path.isNative(new Arr())).toBe(false);
		expect(path.isNative(new Obj())).toBe(false);

		function HackedObject() {}
		HackedObject.prototype.constructor = Object;
		expect(path.isNative(new HackedObject())).toBe(false);
		
	})

	//all,key,keys,expression,function,property,parent
	it("the all method should return all the values in the test data" , function () {
		var simple = jason().all().execute({monkey:"monkey"});
		expect(simple.length).toBe(1);
		var simple = [1,2,3,4,5,6]
		var simples = jason().all().execute(simple);
		expect(simples+"").toEqual(simple+"")
		var all = jason().all().execute(obj6);
		expect(all.length).toEqual(21); //1 obj, 7 properties 1 empty array, 1 array with 4 items
	});
	it("the key method should return any item with a given key", function () {
		var keys = jason().key("string").execute(testData);
		expect(keys.length).toBe(6);
		keys = jason().key("id","string").execute(testData);
		expect(keys.length).toBe(11)

	});
	it("should get the parent objects of any passed objects", function () {
		//var all = jason().all().execute(ob6)
	})

	

	
});
