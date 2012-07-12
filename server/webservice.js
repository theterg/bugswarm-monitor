var events = require('events');
var util = require('util');
var express = require('express');
var app = express.createServer()
var eventEmitter = new events.EventEmitter();

//simple k/v last value store
exports.history = {};

Webservice = function(port) {
	events.EventEmitter.call(this);
	app.listen(port);
	console.log('[webservice] listening on port '+app.address().port);
}
util.inherits(Webservice, events.EventEmitter);

app.use(express.bodyParser());

app.post('/set', function(req, res) {
	if ('host' in req.body) {
		console.log(req.body);
		res.send("OK");
		exports.history[req.body.host] = req.body;
		eventEmitter.emit('serverdata', req.body);
	} else {
		res.send("Host not specified",400);
	}
});

app.get('/get', function(req, res) {
	res.send(JSON.stringify(exports.history));
});

app.get('/get/:host', function(req, res) {
	var host = req.params.host;
	if (host in exports.history) {
		res.send(JSON.stringify(exports.history[req.params.host]));
	} else {
		res.send('{}', 404);
	}
});

app.use(express.static(__dirname+'/static'));

