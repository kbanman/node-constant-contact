
var Promise = require('bluebird');
var sprintf = require('sprintf-js').sprintf;

var Util = require('./util.js'),
  parse_str = Util.parse_str,
  success = Util.handleResult,
  error = Util.handleError;

var AccountService = require('./services/AccountService'),
	ContactService = require('./services/ContactService'),
	ListService = require('./services/ListService'),
	EmailMarketingService = require('./services/EmailMarketingService'),
	CampaignScheduleService = require('./services/CampaignScheduleService'),
	CampaignTrackingService = require('./services/CampaignTrackingService'),
	ContactTrackingService = require('./services/ContactTrackingService'),
	ActivityService = require('./services/ActivityService'),
	ResultSet = require('./components/ResultSet'),
	Activity = require('./components/Activities/Activity'),
	Contact = require('./components/Contacts/Contact'),
	ContactList = require('./components/Contacts/ContactList'),
	Campaign = require('./components/EmailMarketing/Campaign'),
	Schedule = require('./components/EmailMarketing/Schedule'),
	TestSend = require('./components/EmailMarketing/TestSend'),
	TrackingSummary = require('./components/Tracking/TrackingSummary'),
	AddContacts = require('./components/Activities/AddContacts'),
	ExportContacts = require('./components/Activities/ExportContacts'),
	IllegalArgumentException = require('./exceptions/IllegalArgumentException'),
	CtctOAuth2 = require('./auth/CtctOAuth2');


/**
 * Exposes all implemented Constant Contact API functionality
 * @version 0.0.1
 */

 /**
 * Class constructor
 * Registers the API key with the ConstantContact class that will be used for all API calls.
 * @param string apiKey - Constant Contact API Key
 */
function ConstantContact(apiKey) {
	this._apiKey = apiKey;
	this.contactService = new ContactService(apiKey);
	this.emailMarketingService = new EmailMarketingService(apiKey);
	this.activityService = new ActivityService(apiKey);
	this.campaignTrackingService = new CampaignTrackingService(apiKey);
	this.contactTrackingService = new ContactTrackingService(apiKey);
	this.campaignScheduleService = new CampaignScheduleService(apiKey);
	this.listService = new ListService(apiKey);
	this.accountService = new AccountService(apiKey);
}

/**
 * Get a set of campaigns
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      modified_since - ISO-8601 formatted timestamp.
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 *      email - the contact by email address to retrieve information for.
 *      status - a contact status to filter results by. Must be one of ACTIVE, OPTOUT, REMOVED, UNCONFIRMED.
 * @return ResultSet containing a results array of {@link Ctct\Components\Contacts\Contact}
 */
ConstantContact.prototype.getContacts = function(accessToken, params, callback) {
	return this.contactService.getContacts(accessToken, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get an individual contact
 * @param string accessToken - Valid access token
 * @param int contactId - Id of the contact to retrieve
 * @return Contact
 */
ConstantContact.prototype.getContact = function(accessToken, contactId, callback) {
	return this.contactService.getContact(accessToken, contactId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get contacts with a specified email address
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string email - contact email address to search for
 * @return array
 */
ConstantContact.prototype.getContactByEmail = function(accessToken, email, callback) {
	return this.contactService.getContacts(accessToken, { email: email })
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Add a new contact to an account
 * @param string accessToken - Valid access token
 * @param Contact contact - Contact to add
 * @param boolean actionByVisitor - is the action being taken by the visitor
 * @return Contact
 */
ConstantContact.prototype.addContact = function(accessToken, contact, actionByVisitor, callback) {
	var params = {};
	if (actionByVisitor) {
		params.action_by = 'ACTION_BY_VISITOR';
	}
	return this.contactService.addContact(accessToken, contact, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Sets an individual contact to 'REMOVED' status
 * @param string accessToken - Valid access token
 * @param mixed contact - Either a Contact id or the Contact itself
 * @throws IllegalArgumentException - if an int or Contact object is not provided
 * @return boolean
 */
ConstantContact.prototype.deleteContact = function(accessToken, contact, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactService.deleteContact(accessToken, contactId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Delete a contact from all contact lists
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact - Contact id or the Contact object itself
 * @throws IllegalArgumentException - if an int or Contact object is not provided
 * @return boolean
 */
ConstantContact.prototype.deleteContactFromLists = function(accessToken, contact, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactService.deleteContactFromLists(accessToken, contactId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Delete a contact from all contact lists
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact - Contact id or a Contact object
 * @param mixed list - ContactList id or a ContactList object
 * @throws IllegalArgumentException - if an int or Contact object is not provided,
 * as well as an int or ContactList object
 * @return boolean
 */
ConstantContact.prototype.deleteContactFromList = function(accessToken, contact, list, callback) {
	var contactId = this._getArgumentId(contact, Contact),
		listId = this._getArgumentId(list, ContactList);

	return this.contactService.deleteContactFromList(accessToken, contactId, listId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Update an individual contact
 * @param string accessToken - Valid access token
 * @param Contact contact - Contact to update
 * @param boolean actionByVisitor - is the action being taken by the visitor, default is false
 * @return Contact
 */
ConstantContact.prototype.updateContact = function(accessToken, contact, actionByVisitor, callback) {
	var params = {};
	if (actionByVisitor) {
		params.action_by = 'ACTION_BY_VISITOR';
	}
	return this.contactService.updateContact(accessToken, contact, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get lists
 * @param string accessToken - Valid access token
 * @param array params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      modified_since - ISO-8601 formatted timestamp.
 * @return array of ContactList
 */
ConstantContact.prototype.getLists = function(accessToken, params, callback) {
	return this.listService.getLists(accessToken, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get an individual list
 * @param string accessToken - Valid access token
 * @param int listId - Id of the list to retrieve
 * @return ContactList
 */
ConstantContact.prototype.getList = function(accessToken, listId, callback) {
	return this.listService.getList(accessToken, listId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Add a new contact list to an account
 * @param string accessToken - Valid access token
 * @param ContactList list - List to add
 * @return ContactList
 */
ConstantContact.prototype.addList = function(accessToken, list, callback) {
	return this.listService.addList(accessToken, list)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Update a contact list
 * @param string accessToken - Valid access token
 * @param ContactList list - ContactList to update
 * @return ContactList
 */
ConstantContact.prototype.updateList = function(accessToken, list, callback) {
	return this.listService.updateList(accessToken, list)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get contact that belong to a specific list
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed list - Id of the list or a ContactList object
 * @param mixed param - denotes the number of results per set, limited to 50, or a next parameter provided
 * from a previous getContactsFromList call
 * @return array
 * @throws IllegalArgumentException - if a ContactList object or id is not passed
 */
ConstantContact.prototype.getContactsFromList = function(accessToken, list, param, callback) {
	var listId = this._getArgumentId(list, ContactList),
		param = this.determineParam(param);
	return this.listService.getContactsFromList(accessToken, listId, param)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get a set of campaigns
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      modified_since - ISO-8601 formatted timestamp.
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 *      email - the contact by email address to retrieve information for
 * @return ResultSet containing a results array of {@link Ctct\Components\EmailMarketing\Campaign}
 */
ConstantContact.prototype.getEmailCampaigns = function(accessToken, params, callback) {
	return this.emailMarketingService.getCampaigns(accessToken, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get an individual campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Valid campaign id
 * @return \Ctct\Components\EmailMarketing\Campaign
 */
ConstantContact.prototype.getEmailCampaign = function(accessToken, campaignId, callback) {
	return this.emailMarketingService.getCampaign(accessToken, campaignId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Delete an individual campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Id of a campaign or a Campaign object itself
 * @throws IllegalArgumentException - if a Campaign object or campaign id is not passed
 * @return boolean
 */
ConstantContact.prototype.deleteEmailCampaign = function(accessToken, campaign, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.emailMarketingService.deleteCampaign(accessToken, campaignId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Create a new campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param Campaign campaign - Campaign to be created
 * @return Campaign - created campaign
 */
ConstantContact.prototype.addEmailCampaign = function(accessToken, campaign, callback) {
	return this.emailMarketingService.addCampaign(accessToken, campaign)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Update a specific campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param Campaign campaign - Campaign to be updated
 * @return Campaign - updated campaign
 */
ConstantContact.prototype.updateEmailCampaign = function(accessToken, campaign, callback) {
	return this.emailMarketingService.updateCampaign(accessToken, campaign)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Schedule a campaign to be sent
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Campaign to be updated
 * @param Schedule schedule - Schedule to be associated with the provided campaign
 * @return Schedule schedule created
 */
ConstantContact.prototype.addEmailCampaignSchedule = function(accessToken, campaign, schedule, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignScheduleService.addSchedule(accessToken, campaignId, schedule)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get an array of schedules associated with a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Campaign id  or Campaign object itself
 * @return array
 */
ConstantContact.prototype.getEmailCampaignSchedules = function(accessToken, campaign, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignScheduleService.getSchedules(accessToken, campaignId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get a specific schedule associated with a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Campaign id or Campaign object itself
 * @param mixed schedule - Schedule id or Schedule object itself
 * @throws IllegalArgumentException
 * @return array
 */
ConstantContact.prototype.getEmailCampaignSchedule = function(accessToken, campaign, schedule, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign),
		scheduleId = null;

	if (schedule instanceof Schedule) {
		scheduleId = schedule.id;
	} else if (!isNaN(parseInt(schedule))) {
		scheduleId = schedule;
	} else {
		var error = new IllegalArgumentException(sprintf(Config.errors.id_or_object, 'Schedule'));
		if (typeof callback === 'function') {
			callback(error);
		}
		return Promise.reject(error);
	}

	return this.campaignScheduleService.getSchedule(accessToken, campaignId, scheduleId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Update a specific schedule associated with a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Campaign id or Campaign object itself
 * @param Schedule schedule - Schedule to be updated
 * @return array
 */
ConstantContact.prototype.updateEmailCampaignSchedule = function(accessToken, campaign, schedule, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignScheduleService.updateSchedule(accessToken, campaignId, schedule)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Delete a specific schedule associated with a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Campaign id or Campaign object itself
 * @param mixed schedule - Schedule id or Schedule object itself
 * @throws IllegalArgumentException
 * @return array
 */
ConstantContact.prototype.deleteEmailCampaignSchedule = function(accessToken, campaign, schedule, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign),
		scheduleId = null;

	if (schedule instanceof Schedule) {
		scheduleId = schedule.id;
	} else if (!isNaN(parseInt(schedule))) {
		scheduleId = schedule;
	} else {
		var error = new IllegalArgumentException(sprintf(Config.errors.id_or_object, 'Schedule'));
		if (typeof callback === 'function') {
			callback(error);
		}
		return Promise.reject(error);
	}

	return this.campaignScheduleService.deleteSchedule(accessToken, campaignId, scheduleId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Send a test send of a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @param TestSend testSend - test send details
 * @return TestSend
 */
ConstantContact.prototype.sendEmailCampaignTest = function(accessToken, campaign, testSend, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignScheduleService.sendTest(accessToken, campaignId, testSend)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get sends for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign - Campaign id or Campaign object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\SendActivity}
 */
ConstantContact.prototype.getEmailCampaignSends = function(accessToken, campaign, params, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getSends(accessToken, campaignId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get bounces for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\BounceActivity}
 */
ConstantContact.prototype.getEmailCampaignBounces = function(accessToken, campaign, params, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getBounces(accessToken, campaignId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get clicks for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @param array params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\ClickActivity}
 */
ConstantContact.prototype.getEmailCampaignClicks = function(accessToken, campaign, params, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getClicks(accessToken, campaignId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get opens for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\OpenActivity}
 */
ConstantContact.prototype.getEmailCampaignOpens = function(accessToken, campaign, params, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getOpens(accessToken, campaignId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get forwards for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\ForwardActivity}
 */
ConstantContact.prototype.getEmailCampaignForwards = function(accessToken, campaign, params, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getForwards(accessToken, campaignId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get unsubscribes for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\UnsubscribeActivity}
 */
ConstantContact.prototype.getEmailCampaignUnsubscribes = function(accessToken, campaign, params, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getUnsubscribes(accessToken, campaignId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get a reporting summary for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed campaign  - Campaign id or Campaign object itself
 * @return TrackingSummary
 */
ConstantContact.prototype.getEmailCampaignSummaryReport = function(accessToken, campaign, callback) {
	var campaignId = this._getArgumentId(campaign, Campaign);
	return this.campaignTrackingService.getSummary(accessToken, campaignId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get sends for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\SendActivity}
 */
ConstantContact.prototype.getContactSends = function(accessToken, contact, params, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getSends(accessToken, contactId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get bounces for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\BounceActivity}
 */
ConstantContact.prototype.getContactBounces = function(accessToken, contact, params, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getBounces(accessToken, contactId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get clicks for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\ClickActivity}
 */
ConstantContact.prototype.getContactClicks = function(accessToken, contact, params, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getClicks(accessToken, contactId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get opens for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\OpenActivity}
 */
ConstantContact.prototype.getContactOpens = function(accessToken, contact, params, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getOpens(accessToken, contactId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get forwards for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\ForwardActivity}
 */
ConstantContact.prototype.getContactForwards = function(accessToken, contact, params, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getForwards(accessToken, contactId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get opt outs for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @param mixed params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      limit - Specifies the number of results displayed per page of output, from 1 - 500, default = 50.
 *      created_since - Used to retrieve a list of events since the date and time specified (in ISO-8601 format).
 *      next - the next link returned from a previous paginated call. May only be used by itself.
 * @return ResultSet - Containing a results array of {@link Ctct\Components\Tracking\UnsubscribeActivity}
 */
ConstantContact.prototype.getContactUnsubscribes = function(accessToken, contact, params, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getUnsubscribes(accessToken, contactId, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get verified addresses for the account
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string status - Status to filter query results by
 * @return array of VerifiedEmailAddress objects
 */
ConstantContact.prototype.getVerifiedEmailAddresses = function(accessToken, status, callback) {
	var params = array();
	if (status) {
		params.status = status;
	}
	return this.accountService.getVerifiedEmailAddresses(accessToken, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get a reporting summary for a Contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param mixed contact  - Contact id or Contact object itself
 * @return TrackingSummary
 */
ConstantContact.prototype.getContactSummaryReport = function(accessToken, contact, callback) {
	var contactId = this._getArgumentId(contact, Contact);
	return this.contactTrackingService.getSummary(accessToken, contactId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get an array of activities
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array params - associative array of query parameters and values to append to the request.
 *      Allowed parameters include:
 *      status - Status of the activity, must be one of UNCONFIRMED, PENDING, QUEUED, RUNNING, COMPLETE, ERROR
 *      type - Type of activity, must be one of ADD_CONTACTS, REMOVE_CONTACTS_FROM_LISTS, CLEAR_CONTACTS_FROM_LISTS,
 *             EXPORT_CONTACTS
 * @return Activity
 */
ConstantContact.prototype.getActivities = function(accessToken, params, callback, callback) {
	return this.activityService.getActivities(accessToken, params)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get a single activity by id
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string activityId - Activity id
 * @return Activity
 */
ConstantContact.prototype.getActivity = function(accessToken, activityId, callback) {
	return this.activityService.getActivity(accessToken, activityId)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Add an AddContacts Activity to add contacts in bulk
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param AddContacts addContactsActivity - Add Contacts Activity
 * @return Activity
 */
ConstantContact.prototype.addCreateContactsActivity = function(accessToken, addContactsActivity, callback) {
	return this.activityService.createAddContactsActivity(accessToken, addContactsActivity)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Create an Add Contacts Activity from a file. Valid file types are txt, csv, xls, xlsx
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string fileName - The name of the file (ie: contacts.csv)
 * @param string contents - The contents of the file
 * @param string lists - Comma separated list of ContactList id's to add the contacts to
 * @return Activity
 */
ConstantContact.prototype.addCreateContactsActivityFromFile = function(accessToken, fileName, contents, lists, callback) {
	return this.activityService.createAddContactsActivityFromFile(accessToken, fileName, contents, lists)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Add an ClearLists Activity to remove all contacts from the provided lists
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array lists - Array of list id's to be cleared
 * @return Activity
 */
ConstantContact.prototype.addClearListsActivity = function(accessToken, lists, callback) {
	return this.activityService.addClearListsActivity(accessToken, lists)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Add a Remove Contacts From Lists Activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array emailAddresses - email addresses to be removed
 * @param array lists - lists to remove the provided email addresses from
 * @return Activity
 */
ConstantContact.prototype.addRemoveContactsFromListsActivity = function(accessToken, emailAddresses, lists, callback) {
	return this.activityService.addRemoveContactsFromListsActivity(accessToken, emailAddresses, lists)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Add a Remove Contacts From Lists Activity from a file. Valid file types are txt, csv, xls, xlsx
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string fileName - The name of the file (ie: contacts.csv)
 * @param string contents - The contents of the file
 * @param string lists - Comma separated list of ContactList id' to add the contacts too
 * @return Activity
 */
ConstantContact.prototype.addRemoveContactsFromListsActivityFromFile = function(accessToken, fileName, contents, lists, callback) {
	return this.activityService.addRemoveContactsFromListsActivityFromFile(
		accessToken,
		fileName,
		contents,
		lists
	).then(success.bind(callback), error.bind(callback));
};

/**
 * Create an Export Contacts Activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param ExportContacts exportContacts
 * @return array - Array of all ActivitySummaryReports
 */
ConstantContact.prototype.addExportContactsActivity = function(accessToken, exportContacts, callback) {
	return this.activityService.addExportContactsActivity(accessToken, exportContacts)
    .then(success.bind(callback), error.bind(callback));
};

/**
 * Get the id of object, or attempt to convert the argument to an int
 * @param mixed item - object or a numeric value
 * @param string className - class name to test the given object against
 * @throws IllegalArgumentException - if the item is not an instance of the class name given, or cannot be
 * converted to a numeric value
 * @return int
 */
ConstantContact.prototype._getArgumentId = function(item, Class) {
	var id = null;

	if (!isNaN(parseInt(item))) {
		id = item;
	} else if (item instanceof Class) {
		id = item.id;
	} else {
		throw new IllegalArgumentException(sprintf(Config.errors.id_or_object, 'an'));
	}

	return id;
};

/**
 * Builds an array of query parameters to be added to the request
 * @param string param
 * @return array
 */
ConstantContact.prototype._determineParam = function(param) {
	var params = {};
	if (param.substr(0, 1) === '?') {
		param = param.substr(1);
		parse_str(param, params);
	} else {
		params.limit = param;
	}
	return params;
}

/**
 * Attach CtctOAuth2 to the module
 */
ConstantContact.CtctOAuth2 = CtctOAuth2;


module.exports = ConstantContact;