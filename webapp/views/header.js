
require('styles/header.css');

module.exports = Backbone.View.extend({
	id: 'Header',
	template: _.template(`
		<a href="#">
			<span>Tascal</span>
			<% if (orgName) { %>
				<span>- <%= orgName %></span>
			<% } %>
		</a>
		<% if (user.isAuthed) { %>
			<span class="pull-right">
				<a href="<%= '#user/' + user.get('username') %>">
					<%= user.get('username') %>
				</a>
			</span>
		<% } %>
	`),
	initialize: function() {
		this.user =  Tascal.User,
		this.orgName = Tascal.AppConfig.OrgName,
		this.listenTo(this.user, 'update', this.render);
	},
	render: function() {
		this.$el.html(this.template(this));
		return this;
	},
});
