function JasonUtilities() {

}
JasonUtilities.prototype = {
    keys: function(object) {
        var keys = [],
            property,
            hasOwnProperty = this.hasOwnProperty
        if (typeof object.keys == "function") {
            return object.keys();
        } else {
            for (var property in object) {
                if (hasOwnProperty(object, property)) {
                    keys.push(property);
                }
            }
        }
        return keys;
    },
    nonEnumurables: {
        undefined: 0,
        number: 0,
        boolean: 0,
        string: 0

    },
    hasOwnProperty: Object.hasOwnproperty || function(object, key) {
        var check = {};
        if (object === null || typeof object in this.nonEnumurables) {
            return false;
        }
        if (key in object) {
            if (key == "length" && typeof object[key] instanceof Number) {
                return true;
            }
            var proto = object.constructor.prototype;
            if (proto[key] !== object[key]) {
                return true;
            } else if (proto[key] !== proto.constructor.prototype[key]) { //evil
                value = proto[key];
                proto[key] == check;
                if (object[key] == check) {
                    proto[key] = value;
                    return false;
                }
                return true
            }
        }
        return false;
    },
    isIn: function(property, value) { //safer in (doesn't error if we get passed nulls and undefined)
        try {
            return property in value;
        } catch (e) {
            return false;
        }

    },
    isInstanceOf: function(value, type) { //safer instanceof (IE stuff really..)
        return value instanceof type;
    },
    isPrimitive: function(value) {
        return !(value instanceof Object);
    },
    isNative: function(value) {
        if (typeof value == "function") {
            return !(/^function\s+anonymous/.test(value));
        }
        if (this.isPrimitive(value)) {
            return true;
        }
        if (value instanceof Array) {
            return Object.prototype.toString.apply(value) == "[object Array]";
        }
        if (value.constructor == Object) { //in IE this can be hacked by setting the constructor of an object to Object manually...
            console.warn("if youre supporting older versions of IE you cannot rely on this test...")
            if (Object.getPrototypeOf && Object.getPrototypeOf(value) !== Object.prototype) {
                return false;
            }
            return true;
        }
        return false;
    },
    isEnvironmental: function(value) {
        if (this.isLiteral(value)) return false;
        return /^function[^\{]+{\s*[native code]\s*}/mi.test(Function.prototype.toString.apply(value.constructor))
    },
    isNormallyEnumerable: function(value) {
        if (typeof value == "object") {
            if (value === null) return false;
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
    extendedTypeOf: function(object) {
        var type = typeof object;
        if (type == "object") {
            if (object === null) {
                return "null";
            }
            if (object instanceof Array) {
                return "array";
            }
            if (object instanceof Number) {
                return "number";
            }
            if (object instanceof String) {
                return "string";
            }
            if (object instanceof Boolean) {
                return "boolean";
            }
            if (object instanceof RegExp) {
                return "regexp";
            }
            if (this.isCollection(object)) {
                return "collection";
            }
        }
        if (type == "unknown") {
            return "object";
        }
        return type;
    }

}
if (!this instanceof Object) { //IE no doubt
    JasonUtilities.prototype.isPrimitive = function(value) {
        return !(this.instanceOf(Object)) && typeof value != "object" && typeof value != "unknown";
    };
    JasonUtilities.prototype.isInstanceOf = function(value, type) { //safer instanceof (IE stuff really..)
        try {
            return value instanceof type
        } catch (e) {
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