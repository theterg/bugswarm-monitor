var webservice = require('./webservice');
var service = new Webservice(8080, this);
var io = require('socket.io').listen(8081);

//rudimentary k/v store in memory:
exports.history = {};

service.on('serverdata', function(data) {
	console.log(JSON.stringify(data));
	exports.history[data.host] = data;
	console.log(exports.history);
});

service.on('requestdata', function(host) {

});
