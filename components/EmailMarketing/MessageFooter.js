
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a message footer
 */
function MessageFooter(listId) {
	Component.call(this);
}

MessageFooter.prototype = _.create(Component.prototype, { constructor: MessageFooter });

/**
 * Factory method to create a MessageFooter object from an array
 * @param array $props - Associative array of initial properties to set
 * @return MessageFooter
 */
MessageFooter.create = function(props) {
	var instance = new MessageFooter();
	['city',
	'state',
	'country',
	'organization_name',
	'address_line_1',
	'address_line_2',
	'address_line_3',
	'international_state',
	'postal_code',
	'include_forward_email',
	'forward_email_link_text',
	'include_subscribe_link',
	'subscribe_link_text'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = MessageFooter;
