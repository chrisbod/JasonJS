function JasonPath() {
    this.functions = [];
    this.iterator = new JasonIterator();
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
    add: function() {
        [].push.apply(this.functions, arguments);
        return this;
    },
    iterate: function(object, eachFunction, shallow) {
        return this.iterator.iterate(object, eachFunction, shallow);
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
                    if (!(properties instanceof Array) && typeof properties.length instanceof Number) {
                        return this.key(Array.apply(null, properties));
                    }
                    return this.key(properties.valueOf());
                }
        }
        return this.add(function(object) {
            return this.iterate(object, handler);
        });
    },
    function: function jason_path_function(func, recursionFunction) {
        return this.add(function $json_path_function(object) {
            return this.iterate(object, function $json_path_expression_filter(value, key, context) {
                return func(value, key, context);
            }, recursionFunction);
        });
    },
    item: function() { //optimize?
        var keys = [];
        [].forEach.call(arguments, function(value) {
            keys[keys.length] = "" + value;
        });
        return this.add(function(object) {
            var results = [];
            keys.forEach(function(value) {
                if (value in object) {
                    results.push(object[value]);
                }
            })
            return results;
        })
    },
    all: function(level) {
        return this.

        function(function() {
            return true
        }, level);
    },
    expression: function jason_path_expression(expression) {
        return this.

        function(new Function("object", "key", "context", "return " + expression));
    },
    property: function json_path_property(propertyName) {
        var args = arguments;
        return this.add(function $json_path_property(object) {
            return this.iterate(object, function $json_path_property_filter(value) {
                if (value !== null && typeof value == "object" && propertyName in value) {
                    if (args.length == 2) {
                        if (typeof args[1] == "function") {
                            return args[1](value[propertyName]);
                        }
                        return value[propertyName] === args[1];
                    }
                    return true;
                }

            });
        });
    },

    applyTemplate: function() {
        var args = arguments;
        return this.add(function(object) {
            return [].$0.apply(object, args);
        });
    }
};
["slice", "splice", "concat", "sort", "reverse"].forEach(function(value) {
    JasonPath.prototype[value] = new Function(JasonPath.prototype.applyTemplate.toString().replace(/(^function\s*\(\s*\)\s*\{)|(\}$)/mg, "").replace(/\$0/g, value))
})