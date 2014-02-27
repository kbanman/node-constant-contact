
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single EmailAddress of a Contact
 */
function EmailAddress(emailAddress) {
	Component.call(this);

	if (emailAddress !== null) {
		this.email_address = emailAddress;
	}
}

EmailAddress.prototype = _.create(Component.prototype, { constructor: EmailAddress });

/**
 * Factory method to create a EmailAddress object from an array
 * @param array $props - Associative array of initial properties to set
 * @return EmailAddress
 */
EmailAddress.create = function(props) {
	var instance = new EmailAddress();
	['id',
	'status',
	'confirm_status',
	'opt_in_source',
	'opt_in_date',
	'opt_out_date',
	'email_address'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = EmailAddress;
