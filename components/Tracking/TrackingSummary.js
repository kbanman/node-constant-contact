
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a Tracking Summary
 */
function TrackingSummary() {
	Component.call(this);
}

TrackingSummary.prototype = _.create(Component.prototype, { constructor: TrackingSummary });

/**
 * Factory method to create a TrackingSummary object from an array
 * @param array $props - Associative array of initial properties to set
 * @return TrackingSummary
 */
TrackingSummary.create = function(props) {
	var instance = new TrackingSummary();
	['sends',
	'opens',
	'clicks',
	'forwards',
	'unsubscribe',
	'bounces',
	'spam_count'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});

	// Contacts don't have spam_count, only Campaigns
	if (instance.spam_count === null) {
		delete instance.spam_count;
	}

	return instance;
};

module.exports = TrackingSummary;
