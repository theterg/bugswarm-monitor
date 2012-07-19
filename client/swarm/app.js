var request = require('request');
var os = require('os');
var swarmLoopback = require('./swarm-loopback');
var config = require('./config');

console.log('Server monitor started, pushing to '+config.pushHostname);

//The swarmLoopback will go on it's merry way, continually pinging swarm
//and updating it's 'latency' export.
swarmLoopback.connect();

function statLoop() {
	var data = {
		host: os.hostname(),
		time: Date.now(),
		rate: config.pollInterval,
		swarm: {
			latency: swarmLoopback.latency,
			total: swarmLoopback.totalMongo,
			mps: swarmLoopback.mps
		},
		load: os.loadavg(),
		mem: {
			free: os.freemem(),
			total: os.totalmem()
		}
	};
	upload(data);
}
setInterval(statLoop, config.pollInterval);

function upload(obj) {
    var post_options = {
        'uri': config.pushHostname+'/set', 
        'json': true,
        'body': JSON.stringify(obj),
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request.post(post_options, function(error, response, body) {
        if ((error != undefined)&&(error != null)) {
			console.log('[POST] error: '+error);
		}
    });
}

