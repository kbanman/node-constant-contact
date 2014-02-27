
var _ = require('lodash');

var Component = require('../Component');

/**
 * Represents a single Verified Email Address in Constant Contact
 */
function VerifiedEmailAddress() {
	Component.call(this);
}

VerifiedEmailAddress.prototype = _.create(Component.prototype, { constructor: VerifiedEmailAddress });

/**
 * Factory method to create an VerifiedEmail object from an array
 * @param array $props - associative array of initial properties to set
 * @return VerifiedEmailAddress
 */
VerifiedEmailAddress.create = function(props) {
	var instance = new VerifiedEmailAddress();
	['email_address', 'status'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = VerifiedEmailAddress;
