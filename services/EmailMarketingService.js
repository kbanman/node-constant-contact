
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	ResultSet = require('../components/ResultSet'),
	Campaign = require('../components/EmailMarketing/Campaign');

/**
* Performs all actions pertaining to Constant Contact Campaigns
*/
function EmailMarketingService() {
	BaseService.apply(this, arguments);
}

EmailMarketingService.prototype = _.create(BaseService.prototype, { constructor: EmailMarketingService });


/**
 * Create a new campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param Campaign campaign - Campign to be created
 * @return Campaign
 */
EmailMarketingService.prototype.addCampaign = function(accessToken, campaign) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.campaigns),
		headers: this.getHeaders(accessToken),
		body: campaign.toJson(),
		json: true
	};

	return new Promise(function(resolve) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Campaign.create(body));
		});
	});
};

/**
 * Get a set of campaigns
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param array params - query params to be appended to the request
 * @return ResultSet
 */
EmailMarketingService.prototype.getCampaigns = function(accessToken, params) {
	var self = this;
	var req = {
		url: this.buildUrl(Config.endpoints.campaigns, params),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body[0]);
			var campaigns = body.results.map(Campaign.createSummary);
			resolve(new ResultSet(campaigns, body.meta));
		});
	});
};

/**
 * Get campaign details for a specific campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaign_id - Valid campaign id
 * @return Campaign
 */
EmailMarketingService.prototype.getCampaign = function(accessToken, campaignId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign, campaignId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Campaign.create(body));
		});
	});
};

/**
 * Delete an email campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaign_id - Valid campaign id
 * @return boolean
 */
EmailMarketingService.prototype.deleteCampaign = function(accessToken, campaignId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign, campaignId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.del(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 204) return reject(body);
			resolve();
		});
	});
};

/**
 * Update a specific email campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param Campaign campaign - Campaign to be updated
 * @return Campaign
 */
EmailMarketingService.prototype.updateCampaign = function(accessToken, campaign) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign, campaign.id)),
		headers: this.getHeaders(accessToken),
		body: campaign.toJson(),
		json: true
	};

	return new Promise(function(resolve) {
		Request.put(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Campaign.create(body));
		});
	});
};

module.exports = EmailMarketingService;
