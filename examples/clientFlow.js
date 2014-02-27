
var Promise = require('bluebird');
var Readline = require('readline');

var CtctOAuth2 = require('../auth/CtctOAuth2');
var ConstantContact = require('../index.js');

var clientId, clientSecret, redirectUri, accessToken, cc;

/**
 * Helper for posing a question on stdout, returning a promise
 * with user input as the resolved value
 */
function ask(question) {
	var r = Readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise(function(resolve) {
		r.question(question, function(answer) {
			r.close();
			resolve(answer);
		});
	});
}

/**
 * Ask a series of questions to populate the app credentials
 */
function gatherCredentials() {
	return ask('Client ID: ')
		.then(function(answer) {
			clientId = answer;
			return ask('Client Secret: ');
		}).then(function(answer) {
			clientSecret = answer;
			return ask('Redirect Uri: ');
		}).then(function(answer) {
			redirectUri = answer;
			var auth = new CtctOAuth2(clientId, clientSecret, redirectUri);
			return ask('Visit '+auth.getAuthorizationUrl()+' and enter token: ');
		}).then(function(answer) {
			accessToken = answer;
		});
}


gatherCredentials().then(function() {
	// Instantiate the api
	cc = new ConstantContact(clientId);

	// Example of fetching all contacts for the user account
	cc.getContacts(accessToken).then(function(contacts) {
		console.log('Results', contacts);
	}, function(error) {
		console.log('Error', error);
	});
	
	/*// Example of API call using callbacks instead of promises
	cc.getContacts(accessToken, {}, function(error, contacts) {
		if (error) {
			console.log('Error', error);
			return;
		}
		console.log('Results', contacts);
	});
	*/
});