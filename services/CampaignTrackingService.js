
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	ResultSet = require('../components/ResultSet'),
	BounceActivity = require('../components/Tracking/BounceActivity'),
	ClickActivity = require('../components/Tracking/ClickActivity'),
	ForwardActivity = require('../components/Tracking/ForwardActivity'),
	OpenActivity = require('../components/Tracking/OpenActivity'),
	SendActivity = require('../components/Tracking/SendActivity'),
	UnsubscribeActivity = require('../components/Tracking/UnsubscribeActivity'),
	TrackingSummary = require('../components/Tracking/TrackingSummary');

/**
 * Performs all actions pertaining to Constant Contact Campaign Tracking
 */
function CampaignTrackingService() {
	BaseService.apply(this, arguments);
}

CampaignTrackingService.prototype = _.create(BaseService.prototype, { constructor: CampaignTrackingService });


/**
 * Get a result set of bounces for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string campaign_id - Campaign id
 * @param array params - query parameters to be appended to the request
 * @return ResultSet - Containing a results array of {@link BounceActivity}
 */
CampaignTrackingService.prototype.getBounces = function(accessToken, campaignId, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_bounces, campaignId), params),
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
 * Get clicks for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string campaignId - Campaign id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link ClickActivity}
 */
CampaignTrackingService.prototype.getClicks = function(accessToken, campaignId, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_clicks, campaignId), params),
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
 * Get forwards for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string campaignId - Campaign id
 * @param array params - query param to be appended to request
 * @return ResultSet - Containing a results array of {@link ForwardActivity}
 */
CampaignTrackingService.prototype.getForwards = function(accessToken, campaignId, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_forwards, campaignId), params),
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
 * Get opens for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string campaign_id - Campaign id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link OpenActivity}
 */
CampaignTrackingService.prototype.getOpens = function(accessToken, campaignId, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_opens, campaignId), params),
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
 * Get sends for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string campaignId - Campaign id
 * @param Array params - query params to be appended to request
 * @return TrackingActivity - Containing a results array of {@link SendActivity}
 */
CampaignTrackingService.prototype.getSends = function(accessToken, campaignId, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_sends, campaignId), params),
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
 * Get unsubscribes for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param string campaignId - Campaign id
 * @param array params - query params to be appended to request
 * @return ResultSet - Containing a results array of {@link UnsubscribeActivity}
 */
CampaignTrackingService.prototype.getUnsubscribes = function(accessToken, campaignId, params) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_unsubscribes, campaignId), params),
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
 * Get a summary of reporting data for a given campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaign_id - Campaign id
 * @return TrackingSummary
 */
CampaignTrackingService.prototype.getSummary = function(accessToken, campaignId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_tracking_summary, campaignId)),
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

module.exports = CampaignTrackingService;
