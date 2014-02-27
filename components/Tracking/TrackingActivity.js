
var _ = require('lodash');
var Component = require('../Component');

/**
 * Class to wrap a result set of individual activities (ie: OpensActivity, SendActivity)
 */
function TrackingActivity(results, pagination) {
	Component.call(this);

	this.results = results;

	if (pagination.next) {
		this.next = pagination.next.substr(pagination.next.indexOf('&next=') + 6);
	}
}

TrackingActivity.prototype = _.create(Component.prototype, { constructor: TrackingActivity });

module.exports = TrackingActivity;
