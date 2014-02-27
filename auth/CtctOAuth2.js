
//var OAuth2 = require('oauth').OAuth2;
var Request = require('request');
var QueryString = require('querystring');
var Promise = require('bluebird');

var Config = require('../config.js');

/**
 * Class Constructor
 */
function CtctOAuth2(clientId, clientSecret, redirectUri) {
	this.clientId = clientId;
	this.clientSecret = clientSecret;
	this.redirectUri = redirectUri;
}

/**
 * Get the URL at which the user can authenticate and authorize the requesting application
 * @param boolean server - Whether or not to use OAuth2 server flow, alternative is client flow
 * @param string state - An optional value used by the client to maintain state between the request and callback.
 * @return string url - The url to send a user to, to grant access to their account
 */
CtctOAuth2.prototype.getAuthorizationUrl = function(server, state) {
	var responseType = server ? Config.auth.response_type_code : Config.auth.response_type_token,
		params = {
			response_type: responseType,
			client_id: this.clientId,
			redirect_uri: this.redirectUri
		},
		url = Config.auth.base_url + Config.auth.authorization_endpoint;

	// Add the state param if it was provided
	if (state) {
		params.state = state;
	}

	return url + '?' + QueryString.stringify(params);
};

/**
 * Obtain an access token
 * @param string code - code returned from Constant Contact after a user has granted access to their account
 * @return promise
 * @throws Error
 */
CtctOAuth2.prototype.getAccessToken = function(code, callback) {
	var params = {
		grant_type: Config.auth.authorization_code_grant_type,
		client_id:  this.clientId,
		client_secret: this.clientSecret,
		code: code,
		redirect_uri: this.redirectUri
	};

	var url = Config.auth.base_url
		+ Config.auth.token_endpoint
		+ '?'
		+ QueryString.stringify(params);

	return new Promise(function(resolve, reject) {
		Request.post({ url: url, json: true }, function (e, r, body) {
			console.log('getAccessToken', e, r, body);
			if (e) {
				throw e;
			}
			if (typeof callback === 'function') {
				callback(body);
			}
			resolve(body);
		});
	});
};

/**
 * Get an information about an access token
 * @param string $accessToken - Constant Contact OAuth2 access token
 * @return array
 * @throws \Ctct\Exceptions\CtctException
 */
CtctOAuth2.prototype.getTokenInfo = function(accessToken, callback) {
	var url = Config.auth.base_url + Config.auth.token_info;

	return new Promise(function(resolve, reject) {
		Request.post({ url: url, body: 'access_token='+accessToken }, function (e, r, body) {
			console.log('getTokenInfo', e, r, body);
			if (e) {
				throw e;
			}
			if (typeof callback === 'function') {
				callback(body);
			}
			resolve(body);
		});
	});
};

module.exports = CtctOAuth2;
