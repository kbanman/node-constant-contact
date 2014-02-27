
var _ = require('lodash');

var Component = require('../Component'),
	ActivityError = require('./ActivityError');

/**
 * Represents a single Activity in Constant Contact
 */
function Activity() {
	Component.call(this);
}

Activity.prototype = _.create(Component.prototype, { constructor: Activity });

/**
 * Factory method to create an Activity object from an array
 * @param object props - associative array of initial properties to set
 * @return Activity
 */
Activity.create = function(props) {
	var instance = new Activity();
	['id',
	'type',
	'status',
	'start_date',
	'finish_date',
	'created_date',
	'error_count',
	'contact_count'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});

	// Set any errors that exist
	if (props.errors) {
		instance.errors = props.errors.map(ActivityError.create);
	}

	// Set any warnings that exist
	if (props.warnings) {
		instance.warnings = props.warnings.map(ActivityError.create);
	}

	// Set the file name if exists
	if (props.file_name) {
		instance.file_name = props.file_name;
	}

	return instance;
};

module.exports = Activity;
