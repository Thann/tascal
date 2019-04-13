// LoginPanel

require('styles/login_panel.css');

module.exports = Backbone.View.extend({
	id: 'LoginPanel',
	className: 'container',
	template: _.template(`
		<h2>Welcome to Tascal<% if (orgName) { %> for <%= orgName %><% } %>!</h2>
		<h4>
			An <a href="https://github.com/Thann/Tascal" target="_blank" rel="nofollow">open source</a>
			door-opening platform that respects your privacy and freedom!
		</h4>
		<p>
			It's a simple user-management platform that uses a raspberry pi for opening doors and logging entry.
		<br>
			For help getting started see the
			<a href="https://github.com/Thann/Tascal/blob/master/README.md" target="_blank">readme</a>.
		</p>

		<br>
		<% if (!user.isAuthed) { %>
			<form action="auth" class="login form-inline">
				<div class="form-group">
					<input placeholder="username" type="text" name="username"
						class="form-control" autocomplete="username">
				</div> <div class="form-group">
					<input placeholder="password" type="password" name="password"
						class="form-control" autocomplete="current-password">
				</div>
				<input type="submit" value="Login" class="btn btn-default">
			</form>
			<div class="form-group has-error">
				<span class="control-label"><%= error %></span>
			</div>
		<% } %>

		<% if (user.get('requires_reset')) { %>
			<p class="bold">
				Your password was set by an admin and requires a reset!
			</p>
			<form action="auth" class="change form-inline">
				<div class="form-group">
					<input placeholder="username" type="hidden" name="username"
						value="<%= user.get('username') %>" autocomplete="username">
				</div> <div class="form-group">
					<input placeholder="new password" type="password" name="password"
						class="form-control" autocomplete="new-password">
				</div>
				<div class="form-group has-error">
					<span class="control-label"><%= error %></span>
				</div>
				<input type="submit" value="Reset Password" class="btn btn-default">
			</form>
		<% } %>

		<% if (user.isAuthed) { %>
			<a class="btn btn-default" href="#">Doors</a>
			<a class="btn btn-default logout">Logout</a>
			<a class="btn btn-default"
				href="<%= '#user/' + user.get('username')%>">
				User Settings
			</a>
		<% } %>
	`),
	events: {
		'submit form.login': 'login',
		'submit form.change': 'changePW',
		'click .logout': 'logout',
	},
	initialize: function() {
		this.user =  Tascal.User,
		this.orgName = Tascal.AppConfig.OrgName,
		this.error = undefined;
		this.listenTo(this.user, 'update', this.render);
	},
	render: function() {
		this.$el.html(this.template(this));
		return this;
	},
	login: function(evt) {
		evt.preventDefault();
		this.error = null;
		Tascal.User.login(
			this.$('.login input[name="username"]')[0].value,
			this.$('.login input[name="password"]')[0].value,
			_.bind(function() { // on error
				this.error = 'incorrect username or password (case sensitive)';
			}, this)
		);
	},
	logout: function() {
		Tascal.User.logout();
	},
	changePW: function(evt) {
		evt.preventDefault();
		this.error = null;
		// console.log('PP',this.$('.change input[name="password"]')[0].value);
		Tascal.User.save({
			password: this.$('.change input[name="password"]')[0].value,
		}, {
			patch: true,
			success: function(m) {
				m.set({'password': undefined}, {trigger: false});
				Tascal.Router.navigate('', {trigger: true});
			}, error: (m, e) => {
				this.error = (e.responseJSON.password ||
					e.responseJSON.error);
			},
		});
	},
});
