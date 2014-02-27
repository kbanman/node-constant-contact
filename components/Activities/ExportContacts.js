
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents an Export Contacts Activity in Constant Contact
 */

/**
 * Constructor
 * @param array $lists - array of list id's to export from
 * @return ExportContacts
 */
function ExportContacts(lists) {
	Component.call(this);

	this.file_type = 'CSV';
	this.sort_by = 'EMAIL_ADDRESS';
	this.export_date_added = true;
	this.export_added_by = true;
	this.lists = [];
	this.column_names = ['Email Address', 'First Name', 'Last Name'];

	if (lists != null) {
		this.lists = lists;
	}
}

ExportContacts.prototype = _.create(Component.prototype, { constructor: ExportContacts });

module.exports = ExportContacts;
