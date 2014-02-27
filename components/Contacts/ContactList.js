
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single Contact List
 */
function ContactList(listId) {
	Component.call(this);

	if (listId !== null) {
		this.id = listId;
	}
}

ContactList.prototype = _.create(Component.prototype, { constructor: ContactList });

/**
 * Factory method to create a ContactList object from an array
 * @param array $props - Associative array of initial properties to set
 * @return ContactList
 */
ContactList.create = function(props) {
	var instance = new ContactList();
	['id', 'name', 'status', 'contact_count'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = ContactList;
