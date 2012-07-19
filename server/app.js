var webservice = require('./webservice');
var service = new Webservice(8080);
var io = require('socket.io').listen(8081);

service.on('serverdata', function(data) {
	var host = data.host;
	console.log('Got event about host; '+host);
	service.history[host].online = true;
	if ('timeout' in service.history[host]) {
		clearTimeout(service.history[host].timeout);
	}
	//service.history[host].timeout = setTimeout(function() {
	//	service.history[host].online = false;
	//	console.log('Host '+host+' has fallen offline!');
	//}, service.history[host].rate*3);
	io.sockets.emit('update', service.history[host]);
});

io.sockets.on('connection', function(socket) {
	console.log('new socket: '+socket.id);
	socket.emit('history', service.history);
});
