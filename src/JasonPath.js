function JasonPath() {
    this.functions = [];
    this.trackedObjectStore = new this.TrackedObjectStore();
}
JasonPath.prototype = {
    execute: function jason_path_execute(object) { //overload?
        var functions = this.functions,
            results = object;
          /*  collectionized = false;
        if (!this.isCollection(object)) {
            results = [object];
            collectionized = true;
        }*/
        while (functions.length) {
            results = functions.shift().call(this, results);
        }
        return results;
    },
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
    push: function() {
        [].push.apply(this.functions, arguments);
    },
    filterObject: function jason_path_filterObject(object, filterFunction, filterCaller) {
            var results = [];
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    if (filterFunction.call(this, object[i], i, object)) {
                        results.push(object);                        
                    }
                }
            }
            return results;
    },
    each: function (object, eachFunction, track) {
        var property;
        if (object === null || object === void 0) {
            return;
        }
        if (track) {
            if (this.track(object)) {
                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        eachFunction.call(this,object[property], property, true)
                    }
                }
            }
        }
        else {
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    eachFunction.call(this, object[property], property, object, false);
                }
            }
        }
    },
    deepEach: function (object,eachFunction, track) {
        var property;
        if (object === null || object === void 0) {
            return;
        }
        if (track) {
            if (this.track(object)) {
                for (property in object) {

                    if (object.hasOwnProperty(property)) {
                        eachFunction.call(this,object[property], property, true);
                        this.deepEach(object[property], eachFunction, true);
                    }
                }
            }
        }
        else {
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    eachFunction.call(this, object[property], property, object, false);
                    this.deepEach(object[property], eachFunction, false);
                }
            }
        }
    },
    isIn: function (property,value) {//safer in (doesn't error if we get passed nulls and undefined)
        try {
            return property in value;
        }
        catch (e) {
            return false;
        }
        
    },
    isInstanceOf: function (value,type) {//safer instanceof (IE stuff really..)
        return value instanceof type;
    },
    isPrimitive: function (value) {
        return !(value instanceof Object);
    },
    isNative: function (value) {
        if (typeof value == "function") {
            return !(/^function\s+anonymous/.test(value));
        }
        if (this.isPrimitive(value)) {
            return true;
        }
        if (value instanceof Array) {
            return Object.prototype.toString.apply(value) == "[object Array]";
        }
        if (value.constructor == Object) {//in IE this can be hacked by setting the constructor of an object to Object manually...
            console.warn("if youre supporting older versions of IE you cannot rely on this test...")
            if (Object.getPrototypeOf && Object.getPrototypeOf(value) !== Object.prototype) {
                return false;
            }
            return true;
        }
        return false;
    },
    isEnvironmental: function (value) {
        if (this.isLiteral(value)) return false;
        return /^function[^\{]+{\s*[native code]\s*}/mi.test(Function.prototype.toString.apply(value.constructor))
    },
    shouldEnumerate: function jason_path_isEnumerable(value) {
        if (typeof value == "object") {
            if (value instanceof Number) return false;
            if (value instanceof Boolean) return false;
            if (value instanceof String) return false;
            return true;
        }
        return false;
    },
    isCollection: function(value) {
        return "length" in value && typeof value.length == "number"
    },
    all: function jason_path_all() {
        this.push(function $jason_path_all(object) {
            var results = [];
            this.each(object, function $jason_path_all_filter(value) {    
                if (!this.isTracking(value)) {
                    results.push(value);
                }
                if (this.shouldEnumerate(value)) {
                    this.each(value, $jason_path_all_filter, true);
                }
            }, true);
            this.untrack();
            return results;
        });
        return this;
    },
    key: function jason_path_key(property) {
        this.push(function $jason_path_key(object) {
            var results = [];
            this.deepEach([object], function jason_path_key_filter(value) {
                if (this.shouldEnumerate(value)) {
                    if (value.hasOwnProperty(property)) {
                        results.push(value[property]);
                    }
                }
            }, true);
            return results;
        });
        return this;
    },
    keys: function json_path_keys(keys) { //improve
        this.push(function $json_path_keys(object) {
            var results = [];
            this.deepEach(object, function json_path_keys_filter(value) {
                if (this.shouldEnumerate(value)) {
                    for (var i = 0; i != keys.length; i++) {
                        if (value.hasOwnProperty(keys[i])) {
                            results.push(value[keys[i]]);
                        }
                    }
                }
            });
            return results;
        });
        return this;
    },
    expression: function jason_path_expression(expression) {
        return this.

        function(new Function("value", "return " + expression));
    },
    function: function jason_path_function(func) {
        this.push(function $json_path_function(object) {
            return this.filterObject(object, function $json_path_expression_filter(value) {
                var result;
                try {
                    return !!func(value);
                } catch (e) {
                    return false;
                }
            });
        });
        return this;
    },
    property: function json_path_property(property) {
        this.push(function $json_path_property(object) {
            return this.filterObject(object, function $json_path_property_filter(value) {
                return property in value;
            });
        });
        return this;
    },
    parent: function json_path_parent() {
        this.push(function $json_path_parent(object) {
            var results = [];
            this.each(object, function $json_path_property_filter(value, key, context) {
                if (this.tracking.indexOf(value) == -1) {
                    results.push(context);
                }
            });
            return results;
        });
        return this;
    }
};
if (!this instanceof Object) {//IE no doubt
    JasonPath.prototype.isPrimitive = function (value) {
        return !(this.instanceOf(Object)) && typeof value != "object" && typeof value != "unknown";
    };
    JasonPath.prototype.isInstanceOf = function (value,type) {//safer instanceof (IE stuff really..)
       try {
            return value instanceof type
       }
       catch (e) {
            if (value == null || value == void 0) {
                return false;
            }
            if (type == Object && typeof value == "object" || typeof value == "unknown") {
                return true;
            }
       }
        return false;
    };
}





