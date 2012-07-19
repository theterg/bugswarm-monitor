var socket = io.connect('http://beast.terg.is:8081');
var listView = new window.ListView();

socket.on('connect', function() {
	socket.on('history', function(history) {
		for (var server in history) {
			var serverdata = history[server];
			listView.upsert(serverdata);
		}
	});
	socket.on('update', function(data) {
		listView.upsert(data);
	});
});

$(document).ready(function() {
	$.get('./get', function(data) {
	});
});

