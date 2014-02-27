
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	ResultSet = require('../components/ResultSet'),
	Contact = require('../components/Contacts/Contact'),
	ContactList = require('../components/Contacts/ContactList');

/**
* Performs all actions pertaining to Constant Contact Lists
*/
function ListService() {
	BaseService.apply(this, arguments);
}

ListService.prototype = _.create(BaseService.prototype, { constructor: ListService });


/**
 * Get lists within an account
 * @param accessToken - Constant Contact OAuth2 access token
 * @param array params - array of query parameters to be appened to the request
 * @return Array - ContactLists
 */
ListService.prototype.getLists = function(accessToken, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.lists, params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			resolve(body.map(ContactList.create));
		});
	});
};

/**
 * Create a new Contact List
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param ContactList list
 * @return ContactList
 */
ListService.prototype.addList = function(accessToken, list, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.lists),
		headers: this.getHeaders(accessToken),
		body: list.toJson(),
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(ContactList.create(body));
		});
	});
};

/**
 * Update a Contact List
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param ContactList list - ContactList to be updated
 * @return ContactList
 */
ListService.prototype.updateList = function(accessToken, list, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.list, list.id)),
		headers: this.getHeaders(accessToken),
		body: list.toJson(),
		json: true
	};

	return new Promise(function(resolve) {
		Request.put(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(ContactList.create(body));
		});
	});
};

/**
 * Get an individual contact list
 * @param accessToken - Constant Contact OAuth2 access token
 * @param list_id - list id
 * @return ContactList
 */
ListService.prototype.getList = function(accessToken, listId, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.list, listId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(ContactList.create(body));
		});
	});
};

/**
 * Get all contacts from an individual list
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string list_id - list id to retrieve contacts for
 * @param array params - query params to attach to request
 * @return ResultSet
 */
ListService.prototype.getContactsFromList = function(accessToken, listId, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.list_contacts, listId), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			resolve(new ResultSet(body.results.map(Contact.create), body.meta));
		});
	});
};

module.exports = ListService;
