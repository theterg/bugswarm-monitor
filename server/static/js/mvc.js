window.Item = Backbone.Model.extend({
	defaults: {
		host: '',
		time: 0,
		rate: 0,
		online: true,
		swarm: {
			latency: '-',
			total: '-',
			mps: '-' 
		},
		load: [-1,-1,-1],
		memory: {
			percent: -1,
			total: -1,
			free: -1
		}
	}
});

window.List = Backbone.Collection.extend({
	model: window.Item
});

window.ItemView = Backbone.View.extend({
	tagName: 'tr',
	initialize: function() {
		_.bindAll(this, 'render');

		this.model.bind('change', this.render);
	},
	render: function() {
		var load = this.model.get('load');
		var mem = this.model.get('mem');
		var swarm = this.model.get('swarm');
		var row = '<td class='+(this.model.get('online')?'good':'bad')+'>'+this.model.get('host')+'</td>';
		for (i=0;i<load.length;i++){
			row += '<td class='+((load[i] < 1.0)?'good':'bad')+'>'+load[i].toFixed(3)+'</td>';
		}
		var memratio = (mem.free/mem.total)*100.0;
		row += '<td class='+((memratio > 0.5)?'good':'bad')+'>'+memratio.toFixed(3)+'</td>'
		if (!isNaN(swarm.latency))
			row += '<td class='+((swarm.latency < 1000)?'good':'bad')+'>'+swarm.latency+'</td>';
		else
			row += '<td>'+swarm.latency+'</td>';
		if (!isNaN(swarm.total))
			row += '<td class=good>'+swarm.total+'</td>';
		else
			row += '<td>'+swarm.total+'</td>';
		if (!isNaN(swarm.mps))
			row += '<td class='+((swarm.mps < 100.0)?'good':'bad')+'>'+swarm.mps.toFixed(3)+'</td>';
		else
			row += '<td>'+swarm.mps+'</td>';
		$(this.el).html(row);
		if (!this.model.get('online')){
			$(this.el).children().each(function() {
				$(this).removeClass('good');
				$(this).addClass('bad');
			});
		}
		return this;
	}
});

window.ListView = Backbone.View.extend({
	el: $('div#serverdata'),
	initialize: function() {
		_.bindAll(this, 'render', 'upsert', 'appendItem');
		this.collection = new window.List;
		this.collection.bind('add', this.appendItem);
		this.counter = 0;
		this.render();
		//Add an item, for funzies.
	},
	render: function() {
		var self = this;
		$(this.el).append('<table class="table table-bordered"><tr><th>Hostname</th><th>Load 1m</th><th>Load 5m</th><th>Load 15m</th><th>Mem % Free</th><th>Swarm Delay</th><th>Total History</th><th>msg/sec</th></tr></table>');
		_(this.collection.models).each(function(item) { 
			self.appendItem(item);
		}, this);
	},
	upsert: function(data) {
		var existing = this.collection.get(data.host);
		if (existing != undefined){
			existing.set(data);
		} else {
			var item = new window.Item();
			item.set(data);
			item.set({id: data.host});
			this.collection.add(item);
		}
	},
	appendItem: function(item) {
		var itemView = new window.ItemView({
			model: item
		});
		$('table', this.el).append(itemView.render().el);
	}
});

