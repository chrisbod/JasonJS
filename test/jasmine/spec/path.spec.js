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
	function nested(level,bool,str,obj,arr,coll){
		level = level || -1;
		return {//6 properties 
			level: level || -1,
			boolean: bool || true,
			string: str || "some level "+level+" string",
			object: obj || object("level"+level+"object"),
			array: arr || array([0,1,2,""+level]),
			collection: coll ||[]
		}
	}
	var obj1 = nested(1),
	obj2 = nested(2),
	obj3 = nested(2),
	obj4 = nested(3),
	obj5 = nested(3),
	obj6 = nested(4)
	obj1.collection = [
		obj2,
		obj3
	]
	obj1.collection[0].collection = [
		obj4,
		obj5
	]
	obj1.collection[0].collection[0] = obj6;


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
		var all = jason().all().execute(obj6);
		console.log(all)
			expect(all.length).toEqual(11); //6 properties 1 empty array, 1 array with 4 items
	});
	it("the key method should return any item with a given key", function () {
		

	})
	

	
});