
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a Forward Activity
 */
function ForwardActivity() {
	Component.call(this);
}

ForwardActivity.prototype = _.create(Component.prototype, { constructor: ForwardActivity });

/**
 * Factory method to create a ForwardActivity object from an array
 * @param array $props - Associative array of initial properties to set
 * @return ForwardActivity
 */
ForwardActivity.create = function(props) {
	var instance = new ForwardActivity();
	['activity_type',
	'campaign_id',
	'contact_id',
	'email_address',
	'forward_date'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = ForwardActivity;
