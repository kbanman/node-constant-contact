
var _ = require('lodash');
var Component = require('../Component');

/**
* Represents a single "Add Contact Import Data" Activity in Constant Contact
*/
function AddContactsImportData(props) {
	Component.call(this);
	var self = this;

	['first_name',
	'middle_name',
	'last_name',
	'job_title',
	'company_name',
	'work_phone',
	'home_phone'].forEach(function(prop) {
		self[prop] = Component.getValue(props, prop);
	});

	this.email_addresses = [];
	this.addresses = [];
	this.custom_fields = [];
}

AddContactsImportData.prototype = _.create(Component.prototype, { constructor: AddContactsImportData });

AddContactsImportData.prototype.addCustomField = function(customField) {
	this.custom_fields.push(customField);
};

AddContactsImportData.prototype.addAddress = function(address) {
	address.state_code = address.state;
	delete address.state;

	_.forEach(function(value, key) {
		if (value == null) {
			delete address[key];
		}
	});

	this.addresses.push(address);
};

AddContactsImportData.prototype.addEmail = function(emailAddress) {
	this.email_addresses.push(emailAddress);
};

module.exports = AddContactsImportData;
