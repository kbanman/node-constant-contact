
var _ = require('lodash');
var QueryString = require('querystring');

var Config = require('../config.js');

/**
 * Super class for all services
 */

/**
 * Constructor
 * @param string apiKey - Constant Contact API Key
 */
function BaseService(apiKey) {
	/**
	 * ApiKey for the application
	 * @var string
	 */
	this.apiKey = apiKey;
}

/**
 * Build a URL from a base url and optional array of query parameters
 * to append to the url. URL query parameters should not be URL encoded.
 * This method will handle that.
 * @param string url
 * @param hash   queryParams
 * @return string
 */
BaseService.prototype.buildUrl = function(url, queryParams) {
	var params = {
		api_key: this.apiKey
	};

	if (queryParams) {
		_.assign(params, queryParams);
	}

	return Config.endpoints.base_url + url + '?' + QueryString.stringify(params);
};

/**
 * Helper function to return required headers for making an http request with constant contact
 * @param accessToken - OAuth2 access token to be placed into the Authorization header
 * @return hash - authorization headers
 */
BaseService.prototype.getHeaders = function(accessToken) {
	return {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': 'Bearer ' + accessToken
	};
};

// @todo comment
BaseService.prototype.handleError = function(callback, err) {
	if (typeof callback === 'function') {
		return callback(err);
	}
	throw err;
};

BaseService.prototype.handleCallback = function(resolve, callback, result) {
	if (typeof callback === 'function') {
		return callback(null, result);
	}
	resolve(result);
};

module.exports = BaseService;
