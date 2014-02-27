
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single Activity Error in Constant Contact
 */
function ActivityError() {
	Component.call(this);
}

ActivityError.prototype = _.create(Component.prototype, { constructor: ActivityError });

/**
 * Factory method to create an ActivityError object from an array
 * @param object props - associative array of initial properties to set
 * @return ActivityError
 */
ActivityError.create = function(props) {
	var instance = new ActivityError();
	['message',
	'line_number',
	'email_address'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});

	return instance;
};

module.exports = ActivityError;
