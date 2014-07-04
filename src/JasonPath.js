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
    track: function (obj) {
        return this.trackedObjectStore.add(obj);
    },
    untrack: function () {
        this.trackedObjectStore.clear();
    },
    isTracking: function (obj) {
        return this.trackedObjectStore.isTracking(obj);
    },
    add: function() {
        [].push.apply(this.functions, arguments);
        return this;
    },
    shouldEnumerate: function (value) {
        return this.utilities.isNormallyEnumerable(value);
    },
    deepFilter: function (object, eachFunction) {
        var results = [],
            nextObject,
            push = results.push;
        if (this.shouldEnumerate(object)) {
            if (this.track(object)) {
                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        nextObject = object[property];
                        if (eachFunction.call(this, nextObject, property, object)) {
                            results.push(nextObject);
                        }
                        push.apply(results,this.deepFilter(nextObject, eachFunction));
                    }
                }
            }
            this.untrack();
        }
        return results;
    },
    all: function () {
        return this.add(
            function $jason_path_all(object) {
                return this.deepFilter(object, 
                    function $jason_path_all_filter() {
                        return true;
                    }
                );
            }
        );
    },
    key: function (properties) {
        var handler;
        if (arguments.length>1) {
            properties = Array.apply(null,arguments);//multiple arguments must (currently) all be strings
        } 
        switch (properties.constructor) {
            case String:  handler = function (value,key) {
                    return key == properties;
                }; break;
            case Array: handler = function (value,key) {
                    return properties.indexOf(key) != -1;
                }; break;
            case RegExp: handler = function (value,key) {
                    return properties.test(key);
                }; break;
            case Function: handler = properties; break;
            default: {//try and resolve what we've been given
                if (!(properties instanceof Array) && this.isCollection(properties)) {
                    return this.key(Array.apply(null,properties));
                }
                return this.key(properties.valueOf());
            }
        }
        return this.add(function (object) {
            return this.deepFilter(object,handler);
        });
    },
    expression: function jason_path_expression(expression) {
        return this.function(new Function("value", "return " + expression));
    },
    function: function jason_path_function(func) {
        this.add(function $json_path_function(object) {
            return this.deepFilter(object, function $json_path_expression_filter(value) {
                return func(value);
            });
        });
        return this;
    },
    property: function json_path_property(property) {
        this.add(function $json_path_property(object) {
            return this.deepFilter(object, function $json_path_property_filter(value) {
                return property in value;
            });
        });
        return this;
    },
    parent: function json_path_parent() {
        this.add(function $json_path_parent(object) {
        });
        return this;
    }
};






