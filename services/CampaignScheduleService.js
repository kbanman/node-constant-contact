
var _ = require('lodash');
var Request = require('request');
var Promise = require('bluebird');

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	ResultSet = require('../components/ResultSet'),
	Schedule = require('../components/EmailMarketing/Schedule'),
	TestSend = require('../components/EmailMarketing/TestSend');

/**
 * Performs all actions pertaining to scheduling Constant Contact Campaigns
 */
function CampaignScheduleService() {
	BaseService.apply(this, arguments);
}

CampaignScheduleService.prototype = _.create(BaseService.prototype, { constructor: CampaignScheduleService });


/**
 * Create a new schedule for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Campaign id to be scheduled
 * @param Schedule schedule - Schedule to be created
 * @return Schedule
 */
CampaignScheduleService.prototype.addSchedule = function(accessToken, campaignId, schedule) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_schedules, campaignId)),
		headers: this.getHeaders(accessToken),
		body: schedule.toJson(),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			resolve(Schedule.create(body));
		});
	});
};

/**
 * Get a list of schedules for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Campaign id to be scheduled
 * @return array
 */
CampaignScheduleService.prototype.getSchedules = function(accessToken, campaignId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_schedules, campaignId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(body.map(Schedule.create));
		});
	});
};

/**
 * Get a specific schedule for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Campaign id to be get a schedule for
 * @param int scheduleId - Schedule id to retrieve
 * @return Schedule
 */
CampaignScheduleService.prototype.getSchedule = function(accessToken, campaignId, scheduleId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_schedule, campaignId, scheduleId)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Schedule.create(body));
		});
	});
};

/**
 * Update a specific schedule for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Campaign id to be scheduled
 * @param Schedule schedule - Schedule to retrieve
 * @return Schedule
 */
CampaignScheduleService.prototype.updateSchedule = function(accessToken, campaignId, schedule) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_schedule, campaignId, schedule.id)),
		headers: getHeaders(accessToken),
		body: schedule.toJson(),
		json: true
	};

	return new Promise(function(resolve, reject) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			if (r.statusCode != 200) return reject(body);
			resolve(Schedule.create(body));
		});
	});
};

/**
 * Get a specific schedule for a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Campaign id
 * @param int scheduleId - Schedule id to delete
 * @return Schedule
 */
CampaignScheduleService.prototype.deleteSchedule = function(accessToken, campaignId, scheduleId) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_schedule, campaignId, scheduleId)),
		headers: this.getHeaders(accessToken)
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
 * Send a test send of a campaign
 * @param string accessToken - Constant Contact OAuth2 access token
 * @param int campaignId - Id of campaign to send test of
 * @param TestSend test_send - Test send details
 * @return TestSend
 */
CampaignScheduleService.prototype.sendTest = function(accessToken, campaignId, test_send) {
	var self = this;
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.campaign_test_sends, campaignId)),
		headers: this.getHeaders(accessToken),
		body: test_send.toJson()
	};

	return new Promise(function(resolve, reject) {
		Request.post(req, function(e, r, body) {
			if (e) return reject(e);
			resolve(TestSend.create(body));
		});
	});
};

module.exports = CampaignScheduleService;
