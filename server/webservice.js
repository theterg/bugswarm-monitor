var events = require('events');
var util = require('util');
var express = require('express');
var eventEmitter = new events.EventEmitter();

//simple k/v last value store

Webservice = function(port) {
	var self = this;
	var history = self.history = {};
	self.name = "Hi";
	self.app = express.createServer()
	events.EventEmitter.call(this);
	self.app.listen(port);
	console.log('[webservice] listening on port '+self.app.address().port);

	self.app.use(express.bodyParser());

	self.app.post('/set', function(req, res) {
		if ('host' in req.body) {
			console.log(req.body);
			res.send("OK");
			history[req.body.host] = req.body;
			console.log('emitting event');
			self.emit('serverdata', req.body);
		} else {
			res.send("Host not specified",400);
		}
	});

	self.app.get('/get', function(req, res) {
		res.send(JSON.stringify(history));
	});

	self.app.get('/get/:host', function(req, res) {
		var host = req.params.host;
		if (host in history) {
			res.send(JSON.stringify(history[req.params.host]));
		} else {
			res.send('{}', 404);
		}
	});

	self.app.use(express.static(__dirname+'/static'));
}
util.inherits(Webservice, events.EventEmitter);

