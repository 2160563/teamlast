var request = require('request');

function Semaphore(apikey) {
	if (!(this instanceof Semaphore)) {
		return new Semaphore();
	}

	// Set the headers
	var headers = {
	    'User-Agent'	: 'Semaphore SMS/1.0.0.',
	    'Content-Type'	: 'application/x-www-form-urlencoded'
	}

	this.headers = headers;
	this.apikey = apikey;
	this.endpoint = "http://www.semaphore.co";
};

Semaphore.prototype.sendsms = function sendsms(sms, callback) {
   var data = {
   			sendername: sms.sendername,
	    	apikey: this.apikey,
	    	number: sms.number,
	    	message: sms.message
    	}

	var options = {
	    url: this.endpoint + '/api/v4/messages',
	    method: 'POST',
	    headers: this.headers,
	    form: data
	}

	sendRequest(options, callback);
};


Semaphore.prototype.account = function account(callback) {
	var options = {
	    url: this.endpoint + '/api/v4/account?apikey=' + this.apikey,
	    method: 'GET'
	}

	sendRequest(options, callback);
};

function sendRequest(options, callback) {

	function handleResponse(error, response, body) {
		if (!error && response.statusCode == 200) {
		  return callback(null, body);
		}
		return callback(error);
	}

  	request(options, handleResponse);
}

module.exports = Semaphore;
