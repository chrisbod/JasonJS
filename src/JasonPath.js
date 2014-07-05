function JasonPath() {
    this.functions = [];
    this.trackedObjectStore = new this.TrackedObjectStore();
}
JasonPath.prototype = {
    execute: function jason_path_execute(object) { //overload?
        var functions = this.functions,
            results = object;
        while (functions.length) {
            results = functions.shift().call(this, results);
        }
        return results;
    },
    utilities: new JasonUtilities(),
    TrackedObjectStore: TrackedObjectStore,
    track: function(obj) {
        return this.trackedObjectStore.add(obj);
    },
    untrack: function() {
        this.trackedObjectStore.clear();
    },
    isTracking: function(obj) {
        return this.trackedObjectStore.isTracking(obj);
    },
    add: function() {
        [].push.apply(this.functions, arguments);
        return this;
    },
    shouldEnumerate: function(value) {
        return this.utilities.isNormallyEnumerable(value);
    },
    filter: function(object, eachFunction, deep, shouldAbort) {
        var results = [],
            nextObject,
            push = results.push;
        if (!deep) {
            deep = this.false;
        }
        if (!shouldAbort) {
            shouldAbort = this.false;
        }
        if (this.shouldContinue(object)) {
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    nextObject = object[property];
                    if (shouldAbort(nextObject, property, object, results)) {
                        break;
                    }
                    if (eachFunction.call(this, nextObject, property, object)) {
                        results.push(nextObject);
                    }
                    if (deep(nextObject, property, object)) {
                        push.apply(results, this.filter(nextObject, eachFunction, deep, shouldAbort));
                    }
                }
            }
            this.untrack();
        }
        return results;
    },
    true: function() {
        return true;
    },
    false: function() {
        return false;
    },
    shouldContinue: function(object) {
        return this.shouldEnumerate(object) && this.track(object);
    },
    deepFilter: function(object, eachFunction) {
        return this.filter(object, eachFunction, this.true);
    },
    shallowFilter: function(object, eachFunction) {
        return this.filter(object, eachFunction);
    },
    key: function(properties) {
        var handler;
        if (arguments.length > 1) {
            properties = Array.apply(null, arguments); //multiple arguments must (currently) all be strings
        }
        switch (properties.constructor) {
            case String:
                handler = function(value, key) {
                    return key == properties;
                };
                break;
            case Array:
                handler = function(value, key) {
                    return properties.indexOf(key) != -1;
                };
                break;
            case RegExp:
                handler = function(value, key) {
                    return properties.test(key);
                };
                break;
            case Function:
                handler = properties;
                break;
            default:
                { //try and resolve what we've been given
                    if (!(properties instanceof Array) && this.isCollection(properties)) {
                        return this.key(Array.apply(null, properties));
                    }
                    return this.key(properties.valueOf());
                }
        }
        return this.add(function(object) {
            return this.deepFilter(object, handler);
        });
    },
    function: function jason_path_function(func) {
        this.add(function $json_path_function(object) {
            return this.deepFilter(object, function $json_path_expression_filter(value, key, context) {
                return func(value, key, context);
            });
        });
        return this;
    },
    item: function() { //very inefficient
        var keys = [];
        [].forEach.call(arguments, function(value) {
            keys[keys.length] = "" + value;
        })
        keys.sort();
        return this.

        function(function(object, key, context) {
            return keys.indexOf(key) != -1;
        });
        return this;

    },
    all: function() {
        return this.

        function(this.true);
    },
    expression: function jason_path_expression(expression) {
        return this.

        function(new Function("object", "key", "context", "return " + expression));
    },
    property: function json_path_property(propertyName) {
        this.add(function $json_path_property(object) {
            return this.deepFilter(object, function $json_path_property_filter(value) {
                var type = typeof value[propertyName];
                return type != "null" && type != "undefined" && type != "function";
            });
        });
        return this;
    },
    parent: function json_path_parent() {
        this.add(function $json_path_parent(object) {});
        return this;
    }
};

/*
    foo(..fu)
    
    jason().key("foo").query(jason().key("fu"))

    foo(.fu)
    jason().key("foo").query(jason().property("fu"))

    foos.
    {},[],{],(),$,#,/,!,0,_
    object,array,collection,string,number,regexp,boolean,null,undefined


    ..book(.appendix)
    get all books with an appendix property (that is not a function, null or undefined)
    ..book(..appendix)
    get all books with any subelements with an appendix property (that is not null or undefined)
    ..book[3]
    get the book at index 3
    ..book[1,2,3]
    get 2nd,3rd,4th books you find

    ..book{{},[]}
    get all books that are objects or arrays(but not collections)

    ..book(){value.name == "The Bible"}
    get all books that have their property name equals The Bible
    ..book(){key=="book"}
    get all books who are books (the key property is always the selector)
    ..[book,pamphlet]() {value.pages<20}
    get all books and pamphlets with less than 20 pages
    ..[book(){'foo' in context}]
    get all books whose parent object (at their first match) has the property 'foo'
    ..[book,pamplet,magazine]() {key == "magazine" ? object.pages > 100 : key == "book" ? object.pages > 500 : key == "pamphlet" && object.pages > 100 }
    get all 'large' books,pamplets and magazines

    */