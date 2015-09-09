
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');
var sprintf = require("sprintf-js").sprintf;

var Config = require('../config.js'),
	BaseService = require('./BaseService.js'),
	ResultSet = require('../components/ResultSet'),
	Contact = require('../components/Contacts/Contact');

/**
 * Performs all actions pertaining to Constant Contact Contacts
 */
function ContactService() {
	BaseService.apply(this, arguments);
}

ContactService.prototype = _.create(BaseService.prototype, { constructor: ContactService });


/**
 * Get a ResultSet of contacts
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array params - array of query parameters to be appended to the url
 * @return ResultSet
 */
ContactService.prototype.getContacts = function(accessToken, params) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.contacts, params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var contacts = body.results.map(Contact.create);
			resolve(new ResultSet(contacts, body.meta));
		});
	});
};

/**
 * Get contact details for a specific contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Unique contact id
 * @return Contact
 */
ContactService.prototype.getContact = function(accessToken, contactId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact, contactId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Contact.create(body));
		});
	});
};

/**
 * Add a new contact to the Constant Contact account
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param Contact contact - Contact to add
 * @param array params - query params to be appended to the request
 * @return Contact
 */
ContactService.prototype.addContact = function(accessToken, contact, params) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.contacts, params),
		headers: this.getHeaders(accessToken),
		body: contact.toJson(),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Contact.create(body));
		});
	});
};

/**
 * Delete contact details for a specific contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Unique contact id
 * @return boolean
 */
ContactService.prototype.deleteContact = function(accessToken, contactId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact, contactId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.del(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 204) return reject(body);
			resolve();
		});
	});
};

/**
 * Delete a contact from all contact lists
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Contact id to be removed from lists
 * @return boolean
 */
ContactService.prototype.deleteContactFromLists = function(accessToken, contactId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_lists, contactId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.del(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 204) return reject(body);
			resolve();
		});
	});
};

/**
 * Delete a contact from a specific contact list
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Contact id to be removed
 * @param int listId - ContactList to remove the contact from
 * @return boolean
 */
ContactService.prototype.deleteContactFromList = function(accessToken, contactId, listId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_list, contactId, listId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.del(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 204) return reject(body);
			resolve();
		});
	});
};

/**
 * Update contact details for a specific contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param Contact contact - Contact to be updated
 * @param array params - query params to be appended to the request
 * @return Contact
 */
ContactService.prototype.updateContact = function(accessToken, contact, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact, contact.id), params),
		headers: this.getHeaders(accessToken),
		body: contact.toJson(),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.put(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Contact.create(body));
		});
	});
};

module.exports = ContactService;
