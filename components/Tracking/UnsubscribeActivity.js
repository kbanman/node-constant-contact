
var _ = require('lodash');

var Component = require('../Component');

/**
 * Represents a single Opt Out Activity
 */
function UnsubscribeActivity() {
	Component.call(this);
}

UnsubscribeActivity.prototype = _.create(Component.prototype, { constructor: UnsubscribeActivity });

/**
 * Factory method to create a UnsubscribeActivity object from an array
 * @param array $props - Associative array of initial properties to set
 * @return UnsubscribeActivity
 */
UnsubscribeActivity.create = function(props) {
	var instance = new TrackingSummary();
	['activity_type',
	'unsubscribe_date',
	'unsubscribe_source',
	'unsubscribe_reason',
	'contact_id',
	'email_address',
	'campaign_id'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = UnsubscribeActivity;
