var config = {};

config.pushHostname = '';

config.swarmOptions = {
	apikey: '',
	resource: '',
	swarms: ['']
}
config.loopbackToken = 'loopback';
config.pollInterval = 30000;
config.swarmTimeout = 3000;

config.mongoOptions = {
	collection: "histories",
	databaseURL: ""	
}

module.exports = config;
