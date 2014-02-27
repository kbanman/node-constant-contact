
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

var Config = require('../../config.js'),
	Component = require('../Component');

/**
 * Represents an AddContacts Activity
 */
function AddContacts(contacts, lists, columnNames) {
	Component.call(this);

	this.lists = lists;

	if (!_.isEmpty(contacts)) {
		if (contacts[0] instanceof AddContactsImportData) {
			this.import_data = contacts;
		} else {
			var msg = sprintf(Config.errors.id_or_object, 'AddContactsImportData');
			// @todo: IllegalArgumentException
			throw new Error(msg);
		}
	}

	if (_.isEmpty(columnNames)) {
		var usedColumns = [Config.activities_columns.email];
		var contact = contacts[0];

		['first_name',
		'middle_name',
		'last_name',
		'job_title',
		'company_name',
		'work_phone',
		'home_phone'].forEach(function(column) {
			if (contact[column]) {
				usedColumns.push(Config.activities_columns[column]);
			}
		});

		// Addresses
		if (!_.isEmpty(contact.addresses)) {
			var address = contact.addresses[0];

			_.forEach({
				line1: 'address1',
				line2: 'address2',
				line3: 'address3',
				city: 'city',
				state_code: 'state',
				state_province: 'state_province',
				country: 'country',
				postal_code: 'postal_code',
				sub_postal_code: 'sub_postal_code'
			}, function(val, key) {
				if (address[key]) {
					usedColumns.push(Config.activities_columns[val]);
				}
			});
		}

		// Custom Fields
		if (!_.isEmpty(contact.custom_fields)) {
			contact.custom_fields.forEach(function(customField) {
				if (customField.name.indexOf('custom_field_') !== -1) {
					var customFieldNumber = customField.name.substr(13);
					usedColumns.push(Config.activities_columns['custom_field_' + customFieldNumber]);
				}
			});
		}

		this.column_names = usedColumns;
	}
}

AddContacts.prototype = _.create(Component.prototype, { constructor: AddContacts });

/**
 * Turn the object into json, removing any extra fields
 * @return string
 */
AddContacts.prototype.toJson = function() {
	this.import_data.forEach(function(contact) {
		_.forEach(contact, function(value, key) {
			if (value == null) {
				// Seems odd to mutate the object itself for serialization
				delete contact[key];
			}
		});
	});

	return JSON.stringify(this);
}

module.exports = AddContacts;
