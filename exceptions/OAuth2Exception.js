
function OAuth2Exception(message) {
  this.name = 'OAuth2Exception';
  this.message = (message || '');
}

OAuth2Exception.prototype = new Error();
OAuth2Exception.prototype.constructor = OAuth2Exception;

module.exports = OAuth2Exception;
