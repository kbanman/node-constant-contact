
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a Click Activity
 */
function ClickActivity() {
	Component.call(this);
}

ClickActivity.prototype = _.create(Component.prototype, { constructor: ClickActivity });

/**
 * Factory method to create a ClickActivity object from an array
 * @param array $props - Associative array of initial properties to set
 * @return ClickActivity
 */
ClickActivity.create = function(props) {
	var instance = new ClickActivity();
	['activity_type',
	'campaign_id',
	'contact_id',
	'email_address',
	'link_id',
	'click_date'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = ClickActivity;
