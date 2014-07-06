function JasonIterator() {
    this.trackedObjectStore = new this.TrackedObjectStore();
}
JasonIterator.prototype = {
    TrackedObjectStore: TrackedObjectStore,
    iterate: function(object, eachFunction, shouldRecurse, shouldAbort) {
        var results = [];
        if (shouldRecurse === void 0 && shouldAbort === void 0) {
            this.runFast(results, object, eachFunction || this.TRUE);
        } else {
            this.run(
                results,
                object,
                eachFunction || this.TRUE,
                typeof shouldRecurse == "number" ? this.depth(shouldRecurse) : shouldRecurse || this.TRUE,
                typeof shouldAbort == "number" ? this.count(shouldAbort) : shouldAbort || this.FALSE
            );
        }

        return results;
    },
    run: function(results, object, eachFunction, shouldRecurse, shouldAbort) {
        var nextObject,
            property,
            recurse = shouldRecurse();
        for (property in this.getEnumerableObject(object)) {
            if (!shouldAbort(results, object) && object.hasOwnProperty(property)) {
                nextObject = object[property];
                if (eachFunction.call(this, nextObject, property, object)) {
                    results[results.length] = nextObject;
                }
                if (recurse) {
                    this.run(results, nextObject, eachFunction, shouldRecurse, shouldAbort);
                }
            }
        }
        this.untrack();
    },
    runFast: function(results, object, eachFunction) {
        var nextObject,
            property;
        for (property in this.getEnumerableObject(object)) {
            if (object.hasOwnProperty(property)) {
                nextObject = object[property];
                if (eachFunction.call(this, nextObject, property, object)) {
                    results[results.length] = nextObject;
                }
                this.runFast(results, nextObject, eachFunction);
            }
        }
        this.untrack();
    },
    getEnumerableObject: function(object) {
        if (typeof object == "object") {
            if (object === null || object instanceof Number || object instanceof Boolean || object instanceof String || object instanceof RegExp) return;
            this.track(object);
            if (typeof object.length == "number" && object.constructor != Object && !(object instanceof Array)) {
                return Array.apply(null, object);
            }
            return object;
        }
    },
    TRUE: function() {
        return true;
    },
    FALSE: function() {
        return false
    },
    shouldContinue: function(object) {
        return this.shouldEnumerate(object)
    },
    track: function(obj) {
        return this.trackedObjectStore.add(obj);
    },
    untrack: function() {
        this.trackedObjectStore.clear();
    },
    depth: function(depth) {
        var current = 0;
        return function() {
            return ++current < depth;
        }
    },
    count: function(count) {
        return function(results) {
            return results.length >= count;
        }
    }
}





/*function JasonIterator(type) {
    this.iterate = this[this.type];
}
JasonIterator.prototype = {
    utilities: new JasonUtilities(),
    deep: true,
    iterate: function() {},
    object: function(object) {

    },
    collection: function(collection) {

    },
    array: function(array) {

    },
    regexp: function(regExp) {

    },
    number: function(number) {

    },
    string: function(string) {

    },
    boolean: function(boolean) {

    },
    shouldEnumerate: function(value) {

    },
    shouldAbort: function(value) {

    },
    deepFilter: function(object, filterFunction, scope) {
        var results = [];


        return results;
    },
    deepSome: function(object, someFunction, scope) {

    },
    deepEvery: function(object, everyFunction, scope) {

    },
    deepEach: function(object, eachFunction, scope) {

    },

    object_filter: function(filterFunction, scope) {
        var results = [];
        for (var property in this) {
            if (Object.hasOwnProperty(this)) {
                if (filterFunction.call(scope, this[property], index, property)) {
                    results[results.length] = this[property];
                };
            }
        }
        return results;
    },
    object_forEach: function(eachFunction, scope) {
        for (var property in this) {
            if (Object.hasOwnProperty(this)) {
                filterFunction.call(scope, this[property], property, this);
            }
        }
    },
    object_some: function(someFunction, scope) {
        for (var property in this) {
            if (Object.hasOwnProperty(this)) {
                filterFunction.call(scope, this[property], property, this);
            }
        }
    },
    object_every: function(everyFunction, scope) {
        if (var property in this) {
            if (Object.hasOwnProperty(this)) {
                if (!everyFunction.call(scope, this[property], property, this])) {
                return false;
            }
        }
    }
    return true;
}
}




JasonIterator.prototype.array_filter = JasonIterator.prototype.collection_filter = [].filter || function(filterFunction, scope) {
    var results = [];
    for (var i = 0; index != this.length; index++) {
        if (index in this) {
            if (filterFunction.call(scope, this[index], index, this)) {
                results[results.length] = this[index];
            };
        }
    }
    return results;
};
JasonIterator.prototype.array_forEach = JasonIterator.prototype.collection_forEach = [].forEach || function(eachFunction, scope) {
    for (var index = 0; index != this.length; index++) {
        if (index in this) {
            eachFunction.call(scope, this[index], index, scope);
        }
    }
};
JasonIterator.prototype.array_every = JasonIterator.prototype.collection_every = [].every || function(everyFunction, scope) {
    for (var index = 0, result; index != this.length; index++) {
        if (index in this) {
            if (!everyFunction.call(scope, this[index], index, this])) {
            return false;
        }
    }
}
return true;
};
JasonIterator.prototype.array_some = JasonIterator.prototype.collection_some = [].some || function(everyFunction, scope) {
    for (var index = 0, result; index != this.length; index++) {
        if (index in this) {
            if (!everyFunction.call(scope, this[index], index, this])) {
            return false;
        }
    }
}
return true;
};*/