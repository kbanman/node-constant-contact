
/**
 * Container for a get on a collection, such as Contacts, Campaigns, or TrackingData.
 */

/**
 * Constructor to create a ResultSet from the results/meta
 * response when performing a get on a collection
 * @param array results - results array from request
 * @param array meta - meta array from request
 */
function ResultSet(results, meta) {
	/**
	 * array of result objects returned
	 * @var array
	 */
	this.results = results;

	/**
	 * next link returned from a get on a collection if one exists
	 * @var string
	 */
	this.next;

	if (meta.pagination.next_link) {
		var nextLink = meta.pagination.next_link;
		this.next = nextLink.substr(nextLink.indexOf('?') + 6);
	}
}

module.exports = ResultSet;
