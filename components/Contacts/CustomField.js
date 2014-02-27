
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single Custom Field for a Contact
 */
function CustomField() {
	Component.call(this);
}

CustomField.prototype = _.create(Component.prototype, { constructor: CustomField });

/**
 * Factory method to create a CustomField object from an array
 * @param array $props - Associative array of initial properties to set
 * @return CustomField
 */
CustomField.create = function(props) {
	var instance = new CustomField();
	['name', 'value'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = CustomField;
