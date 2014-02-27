
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a campaign Test Send in Constant Contact
 */
function TestSend(listId) {
	Component.call(this);

	this.email_addresses = [];
}

TestSend.prototype = _.create(Component.prototype, { constructor: TestSend });

/**
 * Factory method to create a TestSend object from an array
 * @param array $props - Associative array of initial properties to set
 * @return TestSend
 */
TestSend.create = function(props) {
	var instance = new TestSend();
	['format', 'personal_message'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});

	props.email_addresses.forEach(function(emailAddress) {
		instance.email_addresses.push(emailAddress);
	});

	return instance;
};

/**
 * Add an email address to the set of addresses to send the test send too
 * @param string $email_address
 */
TestSend.prototype.addEmail = function(emailAddress) {
  this.email_addresses.push(emailAddress);
};

/**
 * Create json used for a POST/PUT request, also handles removing attributes that will cause errors if sent
 * @return string
 */
TestSend.prototype.toJson = function() {
  var testsend = _.cloneDeep(this);
  if (!testsend.personal_message) {
    delete testsend.personal_message;
  }
  return JSON.stringify(testsend);
};

module.exports = TestSend;
