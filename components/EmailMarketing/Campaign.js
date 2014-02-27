
var _ = require('lodash');

var Component = require('../Component'),
	MessageFooter = require('./MessageFooter'),
	TrackingSummary = require('../Tracking/TrackingSummary'),
	ContactList = require('../Contacts/ContactList'),
	ClickThroughDetails = require('./ClickThroughDetails');

/**
 * Represents a single Campaign in Constant Contact
 */
function Campaign() {
	Component.call(this);

	this.sent_to_contact_lists = [];
	this.click_through_details = [];
}

Campaign.prototype = _.create(Component.prototype, { constructor: Campaign });

/**
 * Factory method to create a Campaign object from an array
 * @param array $props - associative array of initial properties to set
 * @return Campaign
 */
Campaign.create = function(props) {
	var campaign = new Campaign();

	['id',
	'name',
	'subject',
	'from_name',
	'from_email',
	'reply_to_email',
	'template_type',
	'created_date',
	'modified_date',
	'last_run_date',
	'next_run_date',
	'status',
	'is_permission_reminder_enabled',
	'permission_reminder_text',
	'is_view_as_webpage_enabled',
	'view_as_web_page_text',
	'view_as_web_page_link_text',
	'greeting_salutations',
	'greeting_name',
	'greeting_string',
	'email_content',
	'email_content_format',
	'style_sheet',
	'text_content',
	'permalink_url'].forEach(function(prop) {
		campaign[prop] = Component.getValue(props, prop);
	});

	if (props.message_footer) {
		campaign.message_footer = MessageFooter.create(props.message_footer);
	}

	if (props.tracking_summary) {
		campaign.tracking_summary = TrackingSummary.create(props.tracking_summary);
	}

	if (props.sent_to_contact_lists) {
		campaign.sent_to_contact_lists = props.sent_to_contact_lists.map(ContactList.create);
	}

	if (props.click_through_details) {
		campaign.click_through_details = props.click_through_details.map(ClickThroughDetails.create);
	}

	return campaign;
};

/**
 * Factory method to create a Campaign object from an array
 * @param object props - Hasg of initial properties to set
 * @return Campaign
 */
Campaign.createSummary = function(props) {
	var campaign = new Campaign();
	['id', 'name', 'status', 'modified_date'].forEach(function(prop) {
		campaign[prop] = Component.getValue(props, prop);
	})

	_.forEach(campaign, function(value, key) {
		if (value == null) {
			delete campaign[key];
		}
	});

	return campaign;
};

/**
 * Add a contact list to set of lists associated with this email
 * @param mixed contactList - Contact list id, or ContactList object
 */
Campaign.prototype.addList = function(contactList) {
	var list;
	if (contactList instanceof ContactList) {
		list = contactList;
	} else if (!isNaN(parseInt(contactList))) {
		list = new ContactList(contactList);
	} else {
		// @todo
		//throw new IllegalArgumentException(sprintf(Config.errors.id_or_object, 'ContactList'));
		throw new Error(sprintf(Config.errors.id_or_object, 'ContactList'));
	}

	this.sent_to_contact_lists.push(list);
};

/**
 * Create json used for a POST/PUT request,
 * also handles removing attributes that will cause errors if sent
 * @return string
 */
Campaign.prototype.toJson = function() {
	var campaign = _.cloneDeep(this);
	delete campaign.id;
	delete campaign.created_date;
	delete campaign.last_run_date;
	delete campaign.next_run_date;
	delete campaign.tracking_summary;
	delete campaign.click_through_details;

	if (!campaign.message_footer) {
		delete campaign.message_footer;
	}

	if (!campaign.sent_to_contact_lists) {
		delete campaign.sent_to_contact_lists;
	} else {
		// Remove sent_to_contact_lists fields that cause errors
		campaign.sent_to_contact_lists.forEach(function(list) {
			delete list.name;
			delete list.contact_count;
			delete list.status;
		});
	}

	return JSON.stringify(campaign);
};

module.exports = Campaign;
