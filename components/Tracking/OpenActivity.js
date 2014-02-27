
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single Bounce Activity
 */
function OpenActivity() {
	Component.call(this);
}

OpenActivity.prototype = _.create(Component.prototype, { constructor: OpenActivity });

/**
 * Factory method to create a OpenActivity object from an array
 * @param array $props - Associative array of initial properties to set
 * @return OpenActivity
 */
OpenActivity.create = function(props) {
	var instance = new OpenActivity();
	['activity_type',
	'open_date',
	'contact_id',
	'email_address',
	'campaign_id'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = OpenActivity;
