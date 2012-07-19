var request = require('request');
var os = require('os');
var config = require('./config');

console.log('Server monitor started, pushing to '+config.pushHostname);


function statLoop() {
	var data = {
		host: os.hostname(),
		time: Date.now(),
		rate: config.pollInterval,
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

