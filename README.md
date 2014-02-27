
# Constant Contact NodeJS Client

This module is very alpha; I guarantee there are many bugs. Pull requests are very welcome.


## Installation
```
npm install constant-contact
```


## Usage
```
var ConstantContact = require('constant-contact');

var auth = new ConstantContact.CtctOAuth2(API_KEY, API_SECRET, REDIRECT_URL);

// Generate a url for users to give permission to your app
auth.getAuthorizationUrl();

// Once you get an access token, start doing awesome things:
var cc = new ConstantContact(API_KEY);
cc.getContacts(accessToken).then(function(contacts) {
	console.log('Results', contacts);
}, function(error) {
	console.log('Error', error);
});

// Or, if you prefer to work with callbacks instead of promises:
cc.getContacts(accessToken, {}, function(error, contacts) {
	if (error) {
		console.log('Error', error);
		return;
	}
	console.log('Results', contacts);
});
```

The easiest way to get started is to run `npm install` and `node clientFlow.js` in the examples directory. The only prerequisite is to have a redirect uri set, so you can receive the access token from Constant Contact.

This library diverges very little from the [php-sdk](https://github.com/constantcontact/php-sdk), and aims to maintain the same API.


## Opportunity for improvement
------
- *VERY LITTLE TESTING HAS BEEN DONE* There are probably a ton of bugs all over the place!
- Unit tests need to be written
