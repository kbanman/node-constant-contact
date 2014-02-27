
function CtctException(message) {
  this.name = 'CtctException';
  this.message = (message || '');
}

CtctException.prototype = new Error();
CtctException.prototype.constructor = CtctException;

module.exports = CtctException;
