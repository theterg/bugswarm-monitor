window.HostModel = Backbone.Model.extend({
	defaults: {
		host: '',
		time: 0,
		rate: 0,
		online: true,
		swarm: {
			latency: 0,
			total: 0,
			mps: 0
		},
		load: [-1,-1,-1],
		memory: {
			percent: -1,
			total: -1,
			free: -1
		}
	}
});

window.Hostlist = Backbone.Collection.extend({
	model: window.HostModel
});

window.HostView = Backbone.View.extend({
	tagName: 'tr',
	//events
	initialize: function() {
		console.log('New Hostview');
		//Make sure to add any other view methods here.
		_.bindAll(this, 'render');
		//Map operations on this view
		this.model.bind('change', this.render);
	},
	render: function() {
		//Temporary hello worldy
		$(this.el).html('<td>HI</td>');
		return this;
	}
});

window.HostlistView = Backbone.View.extend({
	el: $('#HostlistView'),
	tagName: 'table',
	initialize: function(){
		_.bindAll(this, 'render', 'addItem');
		this.colleciton = new window.Hostlist;
		this.collection.bind('add', this.addItem);
		this.render();
	},
	render: function() {
		var self = this;
		$(this).html(
	},
	addItem: function() {

	}
});
