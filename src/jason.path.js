function jason() { //handle recursion
    return new jason.Path();
}

jason.Path = function() {
    this.functions = [];
};
jason.Path.prototype = {
    execute: function jason_path_execute(object) { //overload?
        var functions = this.functions,
            results = object;
        while (functions.length) {
            results = functions.shift().call(this, results);
        }
        return results;
    },
    push: function() {
        [].push.apply(this.functions, arguments);
    },
    results: function () {
        var res = [];
        res.push = function (o) {
            this[this.length] = o;
        }
        res.concat = function () {
            console.log("concat",arguments);
            [].concat.apply(this,arguments)
        }
        return res
    },
    filterObject: function jason_path_filterObject(object, filterFunction, filterCaller) {
            var results = this.results();
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    if (filterFunction.call(this, object[i], i, object)) {
                        results.push(object);                        
                    }
                }
            }
            return results;
    },
    each: function (object, eachFunction, filterCaller) {
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                eachFunction.call(this, object[i], i, object);
            }
        }
    },
    isEnumerable: function jason_path_isEnumerable(value) {
        if (typeof value == "object") {
            if (value instanceof Number) return false;
            if (value instanceof Boolean) return false;
            if (value instanceof String) return false;
            return true;
        }
        return false;
    },
    all: function jason_path_all() {
        this.push(function $jason_path_all(object) {
            var results = this.results();
            this.each(object, function $jason_path_all_filter(value) {             
                if (this.isEnumerable(value)) {
                    results.push(value);
                    this.each(value, $jason_path_all_filter, $jason_path_all);
                }
            },$jason_path_all);
            return results;
        });
        return this;
    },
    key: function jason_path_key(property) {
        if (!property) {
            property = "";
        }
        this.push(function $jason_path_key(object) {
            var results = [];
            this.filterObject(object, function jason_path_key_filter(value) {
                if (this.isEnumerable(value)) {
                    if (value.hasOwnProperty(property)) {
                        results.push(value[property]);
                    }
                }
            },$jason_path_key);
            return results;
        });
        return this;
    },
    keys: function json_path_keys(keys) { //improve
        this.push(function $json_path_keys(object) {
            var results = [];
            this.filterObject(object, function json_path_keys_filter(value) {
                if (this.isEnumerable(value)) {
                    for (var i = 0; i != keys.length; i++) {
                        if (value.hasOwnProperty(keys[i])) {
                            results.push(value[keys[i]]);
                        }
                    }
                }
            },$jason_path_keys);
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
        },$json_path_function);
        return this;
    },
    property: function json_path_property(property) {
        this.push(function $json_path_property(object) {
            return this.filterObject(object, function $json_path_property_filter(value) {
                return property in value;
            },$json_path_property);
        });
        return this;
    },
    parent: function json_path_parent() {
        this.push(function $json_path_parent(object) {
            return this.filterObject(object, function $json_path_property_filter(value, key, context) {
                return context;
            },$json_path_parent);
        });
        return this;
    }

};