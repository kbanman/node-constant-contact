
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a click through detail
 */
function ClickThroughDetails(listId) {
	Component.call(this);
}

ClickThroughDetails.prototype = _.create(Component.prototype, { constructor: ClickThroughDetails });

/**
 * Factory method to create a ClickThroughDetails object from an array
 * @param array $props - Associative array of initial properties to set
 * @return ClickThroughDetails
 */
ClickThroughDetails.create = function(props) {
	var instance = new ClickThroughDetails();
	['url', 'url_uid', 'click_count'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = ClickThroughDetails;
