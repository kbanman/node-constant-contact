
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');
var Crypto = require('crypto');
var sprintf = require('sprintf-js').sprintf;

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	Activity = require('../components/Activities/Activity');

function md5(str) {
	return Crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Performs all actions pertaining to scheduling Constant Contact Activities
 */
function ActivityService() {
	BaseService.apply(this, arguments);
}

ActivityService.prototype = _.create(BaseService.prototype, { constructor: ActivityService });


/**
 * Get an array of activities
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param hash   params - query parameters to be appended to the url
 * @return array - Array of all ActivitySummaryReports
 */
ActivityService.prototype.getActivities = function(accessToken, params) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.activities, params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			resove(body.map(Activity.create));
		});
	});
};

/**
 * Get an activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string activityId - Activity id
 * @return object - Activity
 */
ActivityService.prototype.getActivity = function(accessToken, activityId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.activity, activityId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			resolve(Activity.create(body));
		});
	});
};

/**
 * Create an Add Contacts Activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param AddContacts addContacts
 * @return array - Array of all ActivitySummaryReports
 */
ActivityService.prototype.createAddContactsActivity = function(accessToken, addContacts) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.add_contacts_activity),
		headers: this.getHeaders(accessToken),
		json: true,
		form: addContacts.toJson()
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			activity = Activity.create(body);
			resolve(activity);
		});
	});
};

/**
 * Create an Add Contacts Activity from a file. Valid file types are txt, csv, xls, xlsx
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string fileName - The name of the file (ie: contacts.csv)
 * @param string contents - The contents of the file
 * @param string lists - Comma separated list of ContactList id's to add the contacts to
 * @return object Activity
 */
ActivityService.prototype.createAddContactsActivityFromFile = function(accessToken, fileName, contents, lists) {
	var self = this,
		eol = "\r\n",
		data = '',
		boundary = md5((new Date()).getTime()/1000);

	var data = [
		'--' + boundary + eol,
		'Content-Disposition: form-data; name="file_name"' + eol,
		'Content-Type: text/plain' + eol + eol,
		fileName + eol,

		'--' + boundary + eol,
		'Content-Disposition: form-data; name="lists"' + eol,
		'Content-Type: text/plain' + eol + eol,
		lists + eol,

		'--' + boundary + eol,
		'Content-Disposition: form-data; name="data"' + eol + eol,
		contents + eol,
		'--' + boundary + '--' + eol
	].join('');

	var req = {
		url: this.buildUrl(Config.endpoints.add_contacts_activity),
		headers: {
			'Authorization': 'Bearer '+accessToken,
			'Content-Type': 'multipart/form-data; boundary='+boundary
		},
		body: data,
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			activity = Activity.create(body);
			resolve(activity);
		});
	});
};

/**
 * Create a Clear Lists Activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array lists - Array of list id's to be cleared
 * @return array - Array of all Activity
 */
ActivityService.prototype.addClearListsActivity = function(accessToken, lists) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.clear_lists_activity),
		headers: this.getHeaders(accessToken),
		body: JSON.stringify({
			lists: lists
		}),
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			activity = Activity.create(body);
			resolve(activity);
		});
	});
};

/**
 * Create an Export Contacts Activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param ExportContacts exportContacts
 * @return array - Array of all ActivitySummaryReports
 */
ActivityService.prototype.addExportContactsActivity = function(accessToken, exportContacts, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.export_contacts_activity),
		headers: this.getHeaders(accessToken),
		body: JSON.stringify(exportContacts),
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			activity = Activity.create(body);
			resolve(activity);
		});
	});
};

/**
 * Create a Remove Contacts From Lists Activity
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array emailAddresses - array of email addresses to remove
 * @param array lists - array of lists to remove the provided email addresses from
 * @return array - Array of all ActivitySummaryReports
 */
ActivityService.prototype.addRemoveContactsFromListsActivity = function(accessToken, emailAddresses, lists, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.remove_from_lists_activity),
		body: JSON.stringify({
			import_data: emailAddresses.map(function(email) {
				return { email_addresses: [email] };
			}),
			lists: lists
		}),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			activity = Activity.create(body);
			resolve(activity);
		});
	});
};

/**
 * Create an Remove Contacts Activity from a file. Valid file types are txt, csv, xls, xlsx
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string fileName - The name of the file (ie: contacts.csv)
 * @param string contents - The contents of the file
 * @param string lists - Comma separated list of ContactList id' to add the contacts too
 * @return \Ctct\Components\Activities\Activity
 */
ActivityService.prototype.addRemoveContactsFromListsActivityFromFile = function(accessToken, fileName, contents, lists, callback) {
	var self = this,
		eol = '\r\n',
		data = '',
		boundary = md5((new Date()).getTime()/1000);

	var data = [
		'--' + boundary + eol,
		'Content-Disposition: form-data; name="file_name"' + eol,
		'Content-Type: text/plain' + eol + eol,
		fileName + eol,

		'--' + boundary + eol,
		'Content-Disposition: form-data; name="lists"' + eol,
		'Content-Type: text/plain' + eol + eol,
		lists + eol,

		'--' + boundary + eol,
		'Content-Disposition: form-data; name="data"' + eol + eol,
		contents + eol,
		'--' + boundary + '--' + eol
	].join('');

	var req = {
		url: this.buildUrl(Config.endpoints.remove_from_lists_activity),
		headers: {
			'Authorization': 'Bearer '+accessToken,
			'Content-Type': 'multipart/form-data; boundary='+boundary
		},
		body: data,
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			activity = Activity.create(body);
			resolve(activity);
		});
	});
};

module.exports = ActivityService;
