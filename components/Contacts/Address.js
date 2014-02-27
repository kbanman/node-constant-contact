
var _ = require('lodash');
var Component = require('../Component');

/**
* Represents a single Address of a Contact
*/
function Address() {
	Component.call(this);
}

Address.prototype = _.create(Component.prototype, { constructor: Address });

/**
 * Factory method to create an Address object from an array
 * @param object props - Associative array of initial properties to set
 * @return Address
 */
Address.create = function(props) {
	var instance = new Address();
	['id',
	'line1',
	'line2',
	'line3',
	'city',
	'address_type',
	'state_code',
	'country_code',
	'postal_code',
	'sub_postal_code'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = Address;
