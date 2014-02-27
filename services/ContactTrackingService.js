
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	ResultSet = require('../components/ResultSet'),
	ClickActivity = require('../components/Tracking/ClickActivity'),
	BounceActivity = require('../components/Tracking/BounceActivity'),
	ForwardActivity = require('../components/Tracking/ForwardActivity'),
	OpenActivity = require('../components/Tracking/OpenActivity'),
	SendActivity = require('../components/Tracking/SendActivity'),
	UnsubscribeActivity = require('../components/Tracking/UnsubscribeActivity'),
	TrackingSummary = require('../components/Tracking/TrackingSummary');

/**
* Performs all actions pertaining to Contact Tracking
*/
function ContactTrackingService() {
	BaseService.apply(this, arguments);
}

ContactTrackingService.prototype = _.create(BaseService.prototype, { constructor: ContactTrackingService });


/**
 * Get bounces for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Contact id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link BounceActivity}
 */
ContactTrackingService.prototype.getBounces = function(accessToken, contactId, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_bounces, contactId), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var bounces = body.results.map(BounceActivity.create);
			resolve(new ResultSet(bounces, body.meta));
		});
	});
};

/**
 * Get clicks for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Contact id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link ClickActivity}
 */
ContactTrackingService.prototype.getClicks = function(accessToken, contactId, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_clicks, contactId), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var clicks = body.results.map(ClickActivity.create);
			resolve(new ResultSet(clicks, body.meta));
		});
	});
};

/**
 * Get forwards for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Contact id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link ForwardActivity}
 */
ContactTrackingService.prototype.getForwards = function(accessToken, contactId, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_forwards, contactId), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var forwards = body.results.map(ForwardActivity.create);
			resolve(new ResultSet(forwards, body.meta));
		});
	});
};

/**
 * Get opens for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contactId - Contact id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link OpenActivity}
 */
ContactTrackingService.prototype.getOpens = function(accessToken, contactId, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_opens, contactId), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var opens = body.results.map(OpenActivity.create);
			resolve(new ResultSet(opens, body.meta));
		});
	});
};

/**
 * Get sends for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contact_id - Contact id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link SendActivity}
 */
ContactTrackingService.prototype.getSends = function(accessToken, contactId, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_sends, contactId), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var sends = body.results.map(SendActivity.create);
			resolve(new ResultSet(sends, body.meta));
		});
	});
};

/**
 * Get unsubscribes for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contact_id - Contact id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link UnsubscribeActivity}
 */
ContactTrackingService.prototype.getUnsubscribes = function(accessToken, contact_id, params, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_unsubscribes, contact_id), params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var optOuts = body.results.map(UnsubscribeActivity.create);
			resolve(new ResultSet(optOuts, body.meta));
		});
	});
};

/**
 * Get a summary of reporting data for a given contact
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int contact_id - Contact id
 * @return TrackingSummary
 */
ContactTrackingService.prototype.getSummary = function(accessToken, contactId, callback) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.contact_tracking_summary, contact_id)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(TrackingSummary.create(body));
		});
	});
};

module.exports = ContactTrackingService;
