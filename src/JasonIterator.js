function JasonIterator() {
    this.trackedObjectStore = new this.TrackedObjectStore();
}
JasonIterator.prototype = {
    TrackedObjectStore: TrackedObjectStore,
    iterate: function(object, eachFunction, shallow) {
        var results = [],
            nextObject,
            push = results.push,
            deep = shallow === true ? this.FALSE : this.TRUE;
        eachFunction = eachFunction || this.TRUE;
        if (this.shouldContinue(object)) {
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    nextObject = object[property];
                    if (eachFunction.call(this, nextObject, property, object)) {
                        results.push(nextObject);
                    }
                    if (deep(nextObject, property, object)) {
                        push.apply(results, this.iterate(nextObject, eachFunction, deep));
                    }
                }
            }
            this.untrack();
        }
        return results;
    },
    TRUE: function() {
        return true;
    },
    FALSE: function() {
        return false
    },
    shouldContinue: function(object) {
        return this.shouldEnumerate(object) && this.track(object);
    },
    track: function(obj) {
        return this.trackedObjectStore.add(obj);
    },
    untrack: function() {
        this.trackedObjectStore.clear();
    },
    shouldEnumerate: function(value) {
        if (typeof value == "object") {
            if (value === null) return false;
            if (value instanceof Number) return false;
            if (value instanceof Boolean) return false;
            if (value instanceof String) return false;
            return true;
        }
        return false;
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