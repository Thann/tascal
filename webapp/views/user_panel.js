// UserPanel

// require('styles/user.css');
var UserModel = require('models/user.js');

module.exports = Backbone.View.extend({
	id: 'UserPanel',
	template: `
		<div>
			<span rv-text="user:username"></span>
			<span rv-text="user:password"></span>
			<button class="btn btn-default update-user">Update</button>

			<br>
			<div rv-hide="user:admin">
				Doors:
				<div rv-each-door="doors">
					<span rv-text="door:name"></span>
					<button rv-hide="door:allowed" rv-data-id="door:id" class="btn btn-default permit">
						Permit
					</span>
					<button rv-show="door:allowed" rv-data-id="door:id" class="btn btn-default deny">
						Deny
					</span>
				</div>
			</div>

			<br>
			<button rv-hide="logs.length" class="fetch">Fetch Logs</button>
			<div rv-each-log="logs">
				<span rv-text="log:door"></span>
				<span rv-text="log:time"></span>
			</div>
		</div>
	`,
	events: {
		'click .fetch': 'fetch',
		'click .update': 'update',
		'click .permit': 'permit',
		'click .deny': 'deny',
	},
	initialize: function() {
		// console.log("UUU", Doorbot.Router.args, Doorbot.User.get('username'))
		var username = Doorbot.Router.args[0];
		if (username == Doorbot.User.get('username')) {
			this.user = Doorbot.User;
		} else {
			this.user = new UserModel({username: username});
			this.user.fetch();
		}

		this.doors = new (Backbone.Collection.extend({
			url: 'doors',
		}))();
		this.doors.fetch();

		this.logs = new (Backbone.Collection.extend({
			url: 'users/'+username+'/logs',
		}))();

		//TODO: render should not be nessicary
		this.logs.on('sync', _.bind(this.render, this));
		this.user.on('sync', _.bind(this.dingleDoors, this));
		this.doors.on('sync', _.bind(this.dingleDoors, this));
	},
	render: function(){
		this.scope = {
			user: this.user,
			logs: this.logs,
			doors: this.doors,
		};
		this.$el.html(this.template);
		//TODO: rivets throws an error because of user?
		Rivets.bind(this.$el, this.scope);
		return this;
	},
	dingleDoors: function() {
		if (!this.user.get('doors')) return this.render();
		this.doors.each(_.bind(function(d) {
			const r = new RegExp("(^|,)"+d.id+"(,|$)");
			if (this.user.get('doors').match(r))
				d.set('allowed', true);
		}, this));
		this.render();
	},
	fetch: function() {
		this.logs.fetch();
	},
	update: function() {
		//TODO:
		console.log("NOT IMPLEMENTED")
	},
	permit: function(e) {
		var door = this.doors.find({id: $(e.currentTarget).data('id')});
		door.sync(null, this, {
			method: 'POST',
			url: door.url()+'/permit/'+this.user.get('id'),
			// error: _.bind(function(e) {
			// 	console.log("success", e)
			// 	this.dingleDoors();
			// }, this)
		});
		door.attributes.allowed = true;
		this.render();
	},
	deny: function(e) {
		var door = this.doors.find({id: $(e.currentTarget).data('id')});
		door.sync(null, this, {
			method: 'DELETE',
			url: door.url()+'/permit/'+this.user.get('id'),
		});
		door.attributes.allowed = false;
		this.render();
	},
});