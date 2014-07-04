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
        return this;
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
    deepFilter: function (object, eachFunction) {
        var results = [],
            result,
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
    all: function () {
        this.push(
            function $jason_path_all(object) {
                return this.deepFilter(object, 
                    function $jason_path_all_filter() {
                        return true;
                    }
                );
            }
        );
        return this;
    },
    key: function (properties) {
        if (arguments.length>1) {
            properties = Array.apply(null,arguments);//multiple arguments must (currently) all be strings
        } 
        switch (properties.constructor) {
            case String:  return this.push(function (object) {
                return this.deepFilter(object,function (value,key) {
                    return key == properties;
                });
            }); 
            case Array: return this.push(function (object) {
                return this.deepFilter(object, function (value,key) {
                    return properties.indexOf(key) != -1;
                })
            });
            case RegExp: return this.push(function (object) {
                return this.deepFilter(object, function (value,key) {
                    return properties.test(key);
                });
            });
            case Function: return this.push(function () {
                    return this.deepFilter(object,properties);
                });
            default: {//try and resolve what we've been given
                if (!(properties instanceof Array) && this.isCollection(properties)) {
                    return this.key(Array.apply(null,properties));
                }
                return this.key(properties.valueOf());
            }
        }
        return this;
    },
    expression: function jason_path_expression(expression) {
        return this.function(new Function("value", "return " + expression));
    },
    function: function jason_path_function(func) {
        this.push(function $json_path_function(object) {
            return this.deepFilter(object, function $json_path_expression_filter(value) {
                return func(value);
            });
        });
        return this;
    },
    property: function json_path_property(property) {
        this.push(function $json_path_property(object) {
            return this.deepFilter(object, function $json_path_property_filter(value) {
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





