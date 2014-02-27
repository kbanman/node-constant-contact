
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single Bounce Activity
 */
function BounceActivity() {
	Component.call(this);
}

BounceActivity.prototype = _.create(Component.prototype, { constructor: BounceActivity });

/**
 * Factory method to create a BounceActivity object from an array
 * @param array $props - Associative array of initial properties to set
 * @return BounceActivity
 */
BounceActivity.create = function(props) {
	var instance = new BounceActivity();
	['activity_type',
	'bounce_code',
	'bounce_description',
	'bounce_message',
	'bounce_date',
	'contact_id',
	'email_address',
	'campaign_id'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = BounceActivity;
