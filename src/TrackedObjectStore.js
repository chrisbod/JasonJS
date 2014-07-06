function TrackedObjectStore() {
    this.clear();
}
TrackedObjectStore.prototype = {
    constructor: TrackedObjectStore,
    lookup: null,
    getLookUpName: function(object) {
        if (typeof object == "object" && object !== null) {
            return (object.constructor || Object).toString()
        } else {
            return "" + object;
        }
    },
    add: function(object) {
        var propertyName = this.getLookUpName(object)
        trackedObjects = this.lookup[propertyName];
        if (!trackedObjects) {
            trackedObjects = this.lookup[propertyName] = [];
            trackedObjects.push(object);
            return true;
        } else {
            if (trackedObjects.indexOf(object) == -1) {
                trackedObjects.push(object);
                return true;
            } else {
                return false;
            }
        }
    },
    clear: function() {
        this.lookup = {};
        this.lookup[this.getLookUpName([])] = [];
        this.lookup[this.getLookUpName({})] = [];
    },
    isTracking: function(object) {
        var objects = this.lookup[this.getLookUpName(object)];
        return objects && objects.indexOf(object) != -1;
    }

}