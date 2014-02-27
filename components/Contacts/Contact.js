
var _ = require('lodash');

var Component = require('../Component'),
	EmailAddress = require('./EmailAddress'),
	Address = require('./Address'),
	Note = require('./Note'),
	ContactList = require('./ContactList'),
	CustomField = require('./CustomField');

/**
 * Represents a single Contact in Constant Contact
 */
function Contact() {
	Component.call(this);

	this.email_addresses = [];
	this.addresses = [];
	this.notes = [];
	this.custom_fields = [];
	this.addresses = [];
}

Contact.prototype = _.create(Component.prototype, { constructor: Contact });

/**
 * Factory method to create a Contact object from an array
 * @param array $props - Associative array of initial properties to set
 * @return Contact
 */
Contact.create = function(props) {
	var contact = new Contact();

	['id',
	'status',
	'first_name',
	'middle_name',
	'last_name',
	'confirmed',
	'source',
	'prefix_name',
	'job_title',
	'company_name',
	'home_phone',
	'work_phone',
	'cell_phone',
	'fax',
	'source_details'].forEach(function(prop) {
		contact[prop] = Component.getValue(props, prop);
	});

	if (props.email_addresses) {
		contact.email_addresses = props.email_addresses.map(EmailAddress.create);
	}

	if (props.addresses) {
		contact.addresses = props.addresses.map(Address.create);
	}

	if (props.notes) {
		contact.notes = props.notes.map(Note.create);
	}

	if (props.custom_fields) {
		contact.custom_fields = props.custom_fields.map(CustomField.create);
	}

	if (props.lists) {
		contact.lists = props.lists.map(ContactList.create);
	}

	return contact;
};

/**
 * Add a ContactList
 * @param mixed $contactList - ContactList object or contact list id
 */
Contact.prototype.addList = function(contactList) {
	if (!contactList instanceof ContactList) {
		contactList = new ContactList(contactList);
	}

	this.lists.push(contactList);
};

/**
 * Add an EmailAddress
 * @param mixed $emailAddress - EmailAddress object or email address
 */
Contact.prototype.addEmail = function(emailAddress) {
	if (!emailAddress instanceof EmailAddress) {
		emailAddress = new EmailAddress(emailAddress);
	}

	this.email_addresses.push(emailAddress);
};

/**
 * Add a custom field to the contact object
 * @param CustomField $customField - custom field to add to the contact
 */
Contact.prototype.addCustomField = function(customField) {
	this.custom_fields.push(customField);
};

/**
 * Add an address
 * @param Address $address - Address to add
 */
Contact.prototype.addAddress = function(address) {
	this.addresses.push(address);
};

Contact.prototype.toJson = function() {
	delete this.last_update_date;
	return JSON.stringify(this);
};

module.exports = Contact;
