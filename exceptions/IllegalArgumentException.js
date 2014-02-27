
function IllegalArgumentException(message) {
  this.name = 'IllegalArgumentException';
  this.message = (message || '');
}

IllegalArgumentException.prototype = new Error();
IllegalArgumentException.prototype.constructor = IllegalArgumentException;

module.exports = IllegalArgumentException;
