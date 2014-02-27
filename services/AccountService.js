
var _ = require('lodash');
var Request = require('request');
var sprintf = require('sprintf-js').sprintf;

var Config = require('../config.js'),
	BaseService = require('./BaseService'),
	VerifiedEmailAddress = require('../components/Account/VerifiedEmailAddress');

/**
 * Performs all actions pertaining to scheduling Constant Contact Account's
 */

function AccountService() {
	BaseService.apply(this, arguments);
}

AccountService.prototype = _.create(BaseService.prototype, { constructor: AccountService });

/**
 * Get all verified email addresses associated with an account
 * @param string $accessToken - Constant Contact OAuth2 Access Token
 * @param array $params - array of query parameters/values to append to the request
 * @return array of VerifiedEmailAddress
 */
AccountService.prototype.getVerifiedEmailAddresses = function(accessToken, params) {
	var req = {
		url: this.buildUrl(sprintf(Config.endpoints.account_verified_addresses, params)),
		headers: this.getHeaders(accessToken),
		json: true
	};

	return new Promise(function(resolve) {
		Request.get(req, function(e, r, body) {
			if (e) return reject(e);
			resolve(body.map(VerifiedEmailAddress.create));
		});
	});
};

module.exports = AccountService;
