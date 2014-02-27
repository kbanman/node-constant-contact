
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a Schedule
 */
function Schedule(listId) {
	Component.call(this);
}

Schedule.prototype = _.create(Component.prototype, { constructor: Schedule });

/**
 * Factory method to create a Schedule object from an array
 * @param array $props - Associative array of initial properties to set
 * @return Schedule
 */
Schedule.create = function(props) {
	var instance = new Schedule();
	['id', 'scheduled_date'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

Schedule.prototype.toJson = function() {
	var schedule = _.clone(this);
	delete schedule.id;
	return JSON.stringify(schedule);
};

module.exports = Schedule;
