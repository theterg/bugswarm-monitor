var webservice = require('./webservice');
var service = new Webservice(8080);
var io = require('socket.io').listen(8081);
var timeouts = {};

service.on('serverdata', function(data) {
	var host = data.host;
	console.log('Got event about host; '+host);
	service.history[host].online = true;
	if (host in timeouts) {
		clearTimeout(timeouts[host]);
	}
	timeouts[host] = setTimeout(function() {
		service.history[host].online = false;
		console.log('Host '+host+' has fallen offline!');
		io.sockets.emit('update', service.history[host]);
	}, service.history[host].rate*3);
	io.sockets.emit('update', service.history[host]);
});

io.sockets.on('connection', function(socket) {
	console.log('new socket: '+socket.id);
	socket.emit('history', service.history);
});
