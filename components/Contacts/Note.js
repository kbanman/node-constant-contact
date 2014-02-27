
var _ = require('lodash');
var Component = require('../Component');

/**
 * Represents a single Contact Note
 */
function Note() {
	Component.call(this);
}

Note.prototype = _.create(Component.prototype, { constructor: Note });

/**
 * Factory method to create a Note object from an array
 * @param array $props - Associative array of initial properties to set
 * @return Note
 */
Note.create = function(props) {
	var instance = new Note();
	['id', 'note', 'created_date'].forEach(function(prop) {
		instance[prop] = Component.getValue(props, prop);
	});
	return instance;
};

module.exports = Note;
