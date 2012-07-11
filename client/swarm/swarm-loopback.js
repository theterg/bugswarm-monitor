var config = require('./config');
var SwarmConnection = require('bugswarm-prt').Swarm;

var lastToken = config.loopbackToken+'0';
var sentTime = 0;
var receivedTime = 0;
var loopbackIdx = 0;
exports.latency = 0;
exports.connected = false;

var swarm = new SwarmConnection(config.swarmOptions);

swarm.on('message', function(message) {
    var payload = JSON.parse(message.payload);
    if (('token' in payload) && (payload.token === lastToken)) {
        receivedTime = Date.now();
		exports.latency = (receivedTime - sentTime);
        console.log('[Swarm] IN - latency '+exports.latency);
    } else {
    }
});

function poll() {
    receivedTime = -1;
    loopbackIdx += 1
    lastToken = config.loopbackToken+loopbackIdx;
    swarm.send(JSON.stringify({'token':lastToken}));
    //console.log('[Swarm] out '+loopbackIdx);
    sentTime = Date.now();
    setTimeout(function() {
		if (receivedTime === -1){
			console.log('[Swarm] Warning, data not received!');
			exports.connected = false;
			exports.latency = -1;
			//TODO - attempt to reconnect to swarm after some number of failures...
		}
    }, config.swarmTimeout);

}

swarm.on('error', function(error) {
	console.log('[Swarm] Error: '+JSON.stringify(error));
});

swarm.on('connect', function() {
	console.log('[Swarm] Connected!');
	exports.connected = true;
	setInterval(poll, config.pollInterval);
});

exports.connect = function() {
	console.log('[Swarm] Connecting');
	swarm.connect();
}
