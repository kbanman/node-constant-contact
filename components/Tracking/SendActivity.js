
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a Sent Activity
 */
function SendActivity() {
	Component.call(this);
}

SendActivity.prototype = _.create(Component.prototype, { constructor: SendActivity });

/**
 * Factory method to create a SendActivity object from an array
 * @param array $props - Associative array of initial properties to set
 * @return SendActivity
 */
SendActivity.create = function(props) {
	var instance = new SendActivity();
	['activity_type',
	'send_date',
	'contact_id',
	'email_address',
	'campaign_id'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = SendActivity;
