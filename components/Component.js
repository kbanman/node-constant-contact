
/**
 * Super class for all components
 */
function Component() {}

/**
 * Get the requested value from an array, or return the default
 * @param object object - array to search for the provided array key
 * @param string item - array key to look for
 * @param string defaultValue - value to return if the item is not found, default is null
 * @return mixed
 */
Component.getValue = function(object, item, defaultValue) {
	return object[item] ? object[item] : defaultValue;
};

/**
 * Create json used for a POST/PUT request,
 * also handles removing attributes that will cause errors if sent
 * @return string
 */
Component.prototype.toJson = function() {
	return JSON.stringify(this);
};

module.exports = Component;
