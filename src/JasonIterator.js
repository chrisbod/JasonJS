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
                this.resolveRecurseArgument(shouldRecurse),
                typeof shouldAbort == "number" ? this.count(shouldAbort) : shouldAbort || this.FALSE
            );
        }
        this.untrack();
        return results;
    },
    resolveAbortArgument: function(shouldAbort) {
        switch (typeof shouldAbort) {
            case "function":
                return shouldAbort;
            case "number":
                return this.count(shouldAbort);
            default:
                return this.FALSE;
        }
    },
    resolveRecurseArgument: function(shouldRecurse) {
        switch (typeof shouldRecurse) {
            case "boolean":
                return shouldRecurse ? this.TRUE : this.FALSE;
            case "function":
                return shouldRecurse;
            case "number":
                return this.depth(shouldRecurse);
            default:
                return this.TRUE;
        }
    },
    run: function(results, object, eachFunction, shouldRecurse, shouldAbort) {
        var nextObject,
            property,
            recurse = shouldRecurse();
        for (property in this.getEnumerableObject(object)) {
            if (!shouldAbort(results, object) && object.hasOwnProperty(property)) {
                nextObject = object[property];
                if (!this.isTracking(nextObject)) {
                    if (eachFunction.call(this, nextObject, property, object)) {
                        results[results.length] = nextObject;
                    }
                    if (recurse) {
                        this.run(results, nextObject, eachFunction, shouldRecurse, shouldAbort);
                    }
                }
            }
        }
    },
    runFast: function(results, object, eachFunction) {
        var nextObject,
            property;
        for (property in this.getEnumerableObject(object)) {
            if (object.hasOwnProperty(property)) {
                nextObject = object[property];
                if (!this.isTracking(nextObject)) {
                    if (eachFunction.call(this, nextObject, property, object)) {
                        results[results.length] = nextObject;
                    }
                    this.runFast(results, nextObject, eachFunction);
                }
            }
        }
    },
    getEnumerableObject: function(object) { //hmmm
        if (typeof object == "object") {
            if (
                object === null ||
                object instanceof Number ||
                object instanceof Boolean ||
                object instanceof String ||
                object instanceof RegExp ||
                this.track(object);
            ) {
                return;
            }
            if (
                typeof object.length == "number" &&
                object.constructor != Object && !(object instanceof Array)
            ) {
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
    isTracking: function(obj) {
        return this.trackedObjectStore.isTracking(obj);
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
    },
    isEnvironmental: function(object) {
        if (object === null || object === undefined) {
            return false;
        }
        var constructor = (object).constructor;
        switch (constructor) {
            case Object:
            case Array:
            case String:
            case Number:
            case Boolean:
            case RegExp:
                return false;
            case undefined:
                return true; //IE
            default:
                return (/^\s*function\s*\w*\s*\([^\)]*\)\s*\{\s*\[native code\]\s*\}/.test(constructor))
        }
    },
    getExtendedTypeOf: function(object) {
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